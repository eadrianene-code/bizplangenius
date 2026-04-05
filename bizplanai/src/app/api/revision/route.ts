import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GoogleGenerativeAI } from '@google/generative-ai';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const maxDuration = 60;

function buildRevisionPrompt(meta: Record<string, string>, revisionNotes: string): string {
  return `You are a world-class business strategy consultant. You previously generated a business plan for this client. They have requested a revision with specific changes.

ORIGINAL BUSINESS DETAILS:
- Business Name: \${meta.businessName}
- Industry: \${meta.industry}
- Description: \${meta.description}
- Target Market: \${meta.targetMarket}
- Revenue Model: \${meta.revenueModel}
- Location: \${meta.location || 'Not specified'}
- Starting Budget: \${meta.investment || 'Not specified'}
- Known Competitors: \${meta.competitors || 'None listed'}

CUSTOMER REVISION REQUEST:
\${revisionNotes}

INSTRUCTIONS:
Regenerate the complete business plan incorporating ALL customer requested changes. Keep the same professional quality and realistic data.

Generate the plan in this exact JSON structure:

{
  "executiveSummary": {
    "overview": "2-3 paragraph company overview",
    "mission": "Mission statement",
    "vision": "Vision statement",
    "valueProposition": "Clear unique value proposition",
    "keyMetrics": ["3-5 key projected metrics with numbers"]
  },
  "competitorAnalysis": {
    "overview": "Paragraph analyzing the competitive landscape",
    "competitors": [
      {
        "name": "Competitor name",
        "description": "What they do",
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "estimatedRevenue": "Revenue estimate if known",
        "pricing": "Their pricing model"
      }
    ],
    "competitiveAdvantage": "How this business differentiates",
    "marketGaps": ["Gap 1", "Gap 2", "Gap 3"]
  },
  "marketAnalysis": {
    "industryOverview": "2 paragraphs on the industry state and trends",
    "marketSize": "TAM, SAM, SOM with dollar figures",
    "growthRate": "Industry growth rate with source",
    "trends": ["Trend 1", "Trend 2", "Trend 3", "Trend 4"],
    "targetCustomerProfile": {
      "demographics": "Age, income, location, etc.",
      "psychographics": "Values, interests, behaviors",
      "painPoints": ["Pain 1", "Pain 2", "Pain 3"],
      "buyingBehavior": "How they discover and purchase"
    }
  },
  "marketingStrategy": {
    "positioning": "Brand positioning statement",
    "channels": [
      {
        "channel": "Channel name",
        "strategy": "How to use it",
        "estimatedCAC": "Cost to acquire a customer",
        "priority": "High/Medium/Low"
      }
    ],
    "contentStrategy": "Content marketing approach",
    "launchPlan": "First 90 days go-to-market plan"
  },
  "financialProjections": {
    "revenueModel": "Detailed revenue model explanation",
    "year1": { "revenue": "$X", "costs": "$X", "profit": "$X", "customers": "X" },
    "year2": { "revenue": "$X", "costs": "$X", "profit": "$X", "customers": "X" },
    "year3": { "revenue": "$X", "costs": "$X", "profit": "$X", "customers": "X" },
    "keyAssumptions": ["Assumption 1", "Assumption 2", "Assumption 3"],
    "breakEvenTimeline": "When the business breaks even",
    "startupCosts": [
      { "item": "Cost item", "amount": "$X" }
    ]
  },
  "operationsPlan": {
    "businessModel": "How the business operates day-to-day",
    "teamStructure": "Required roles and hiring plan",
    "technology": "Tech stack and tools needed",
    "keyMilestones": [
      { "timeline": "Month X", "milestone": "What happens" }
    ]
  },
  "riskAnalysis": {
    "risks": [
      {
        "risk": "Risk description",
        "likelihood": "High/Medium/Low",
        "impact": "High/Medium/Low",
        "mitigation": "How to mitigate"
      }
    ]
  }
}

CRITICAL RULES:
1. Use REALISTIC numbers based on actual industry benchmarks
2. Identify 5-10 REAL competitors that exist in this space
3. All financial projections must be conservative and achievable
4. Include specific pricing comparisons with competitors
5. Output ONLY the JSON
6. Incorporate ALL the customer revision requests
7. Make the plan specific to THIS business`;
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, revisionNotes } = await req.json();

    if (!sessionId || !revisionNotes?.trim()) {
      return NextResponse.json({ error: 'Session ID and revision notes are required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not found or not completed' }, { status: 402 });
    }

    const amountPaid = session.amount_total || 0;
    if (amountPaid < 100) {
      return NextResponse.json({ error: 'Free revision is only available with the Pro plan ($49). Upgrade to Pro for revision access.' }, { status: 403 });
    }

    const paymentIntentId = session.payment_intent as string;
    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.metadata?.revision_used === 'true') {
      return NextResponse.json({ error: 'Your free revision has already been used. Contact support@bizplangenius.com for additional revisions.' }, { status: 403 });
    }

    const meta = session.metadata || {};

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 65536,
        responseMimeType: 'application/json',
      },
    });

    const prompt = buildRevisionPrompt(meta, revisionNotes.trim());
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let plan;
    const rawText = text.trim();

    try {
      plan = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\`\`\`(?:json)?\s*([\s\S]*?)\`\`\`/);
      if (jsonMatch) {
        try { plan = JSON.parse(jsonMatch[1].trim()); } catch {}
      }
      if (!plan) {
        const firstBrace = rawText.indexOf('{');
        const lastBrace = rawText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          try { plan = JSON.parse(rawText.substring(firstBrace, lastBrace + 1)); } catch {}
        }
      }
      if (!plan) {
        throw new Error('Failed to parse AI response');
      }
    }

    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: {
        ...paymentIntent.metadata,
        revision_used: 'true',
        revision_date: new Date().toISOString(),
      },
    });

    return NextResponse.json({ plan, businessName: meta.businessName || 'Business Plan' });
  } catch (error: any) {
    console.error('Revision error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate revised plan. Please try again or contact support@bizplangenius.com' },
      { status: 500 }
    );
  }
}
