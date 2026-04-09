import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GoogleGenAI } from '@google/genai';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const maxDuration = 60;

function buildRevisionPrompt(originalPlanJson: string, revisionNotes: string, meta: Record<string, string>): string {
  return `You are a world-class business strategy consultant. A customer previously received a complete business plan and now wants specific changes made to it.

BUSINESS DETAILS:
- Business Name: ${meta.businessName || 'Unknown'}
- Industry: ${meta.industry || 'Unknown'}

ORIGINAL COMPLETE BUSINESS PLAN (JSON):
${originalPlanJson}

CUSTOMER REVISION REQUEST:
"${revisionNotes}"

INSTRUCTIONS:
1. Take the ORIGINAL BUSINESS PLAN above as your starting point
2. Apply ONLY the changes the customer requested
3. Keep ALL sections that the customer did NOT mention exactly as they are
4. If the customer asks to change financials, update them but keep all other sections intact
5. If the customer asks to add something, add it to the relevant section without removing existing content
6. The revised plan must be COMPLETE - all 7 sections, same level of detail as the original
7. Output the FULL revised plan in the exact same JSON structure

The JSON structure must include ALL of these sections with full content:
- executiveSummary (overview, mission, vision, valueProposition, keyMetrics)
- competitorAnalysis (overview, competitors array with name/description/strengths/weaknesses/estimatedRevenue/pricing, competitiveAdvantage, marketGaps)
- marketAnalysis (industryOverview, marketSize, growthRate, trends, targetCustomerProfile)
- marketingStrategy (positioning, channels array, contentStrategy, launchPlan)
- financialProjections (revenueModel, year1/year2/year3 with revenue/costs/profit/customers, keyAssumptions, breakEvenTimeline, startupCosts)
- operationsPlan (businessModel, teamStructure, technology, keyMilestones)
- riskAnalysis (risks array with risk/likelihood/impact/mitigation)

CRITICAL RULES:
1. Keep EVERYTHING the customer did not ask to change - copy it exactly from the original
2. Only modify the specific parts mentioned in the revision request
3. Maintain the same depth and quality as the original plan
4. Output ONLY the JSON - no markdown, no code blocks, no extra text
5. The revised plan should be the SAME LENGTH or LONGER than the original`;
}

function buildFallbackPrompt(revisionNotes: string, meta: Record<string, string>): string {
  return `You are a world-class business strategy consultant who creates comprehensive, investor-ready business plans. Generate a complete business plan for the following business, incorporating the customer feedback below.

BUSINESS DETAILS:
- Business Name: ${meta.businessName || 'Unknown'}
- Industry: ${meta.industry || 'Unknown'}
- Description: ${meta.description || 'Not provided'}
- Target Market: ${meta.targetMarket || 'Not provided'}
- Revenue Model: ${meta.revenueModel || 'Not provided'}
- Location: ${meta.location || 'Not specified'}
- Starting Budget: ${meta.investment || 'Not specified'}
- Known Competitors: ${meta.competitors || 'None listed'}

CUSTOMER FEEDBACK TO INCORPORATE:
"${revisionNotes}"

Generate a COMPLETE business plan incorporating the customer feedback. Use REAL industry data and specific numbers.

Output the plan in this exact JSON structure:
{
  "executiveSummary": { "overview": "2-3 paragraphs", "mission": "...", "vision": "...", "valueProposition": "...", "keyMetrics": ["metric1", "metric2", "metric3"] },
  "competitorAnalysis": { "overview": "paragraph", "competitors": [{ "name": "...", "description": "...", "strengths": [], "weaknesses": [], "estimatedRevenue": "...", "pricing": "..." }], "competitiveAdvantage": "...", "marketGaps": [] },
  "marketAnalysis": { "industryOverview": "2 paragraphs", "marketSize": "TAM SAM SOM", "growthRate": "...", "trends": [], "targetCustomerProfile": { "demographics": "...", "psychographics": "...", "painPoints": [], "buyingBehavior": "..." } },
  "marketingStrategy": { "positioning": "...", "channels": [{ "channel": "...", "strategy": "...", "estimatedCAC": "...", "priority": "..." }], "contentStrategy": "...", "launchPlan": "..." },
  "financialProjections": { "revenueModel": "...", "year1": { "revenue": "$X", "costs": "$X", "profit": "$X", "customers": "X" }, "year2": { "revenue": "$X", "costs": "$X", "profit": "$X", "customers": "X" }, "year3": { "revenue": "$X", "costs": "$X", "profit": "$X", "customers": "X" }, "keyAssumptions": [], "breakEvenTimeline": "...", "startupCosts": [{ "item": "...", "amount": "$X" }] },
  "operationsPlan": { "businessModel": "...", "teamStructure": "...", "technology": "...", "keyMilestones": [{ "timeline": "...", "milestone": "..." }] },
  "riskAnalysis": { "risks": [{ "risk": "...", "likelihood": "...", "impact": "...", "mitigation": "..." }] }
}

CRITICAL: Output ONLY valid JSON. No markdown, no code blocks. Make every section comprehensive.`;
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, revisionNotes, originalPlan } = await req.json();

    if (!sessionId || !revisionNotes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify payment
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
    }

    // Check Pro plan
    const amountPaid = session.amount_total || 0;
    if (amountPaid < 4900) {
      return NextResponse.json({ error: 'Free revision is only available for Pro plan customers.' }, { status: 403 });
    }

    // Check if revision already used
    const pi = session.payment_intent as Stripe.PaymentIntent;
    if (pi?.metadata?.revision_used === 'true') {
      return NextResponse.json({ error: 'You have already used your free revision.' }, { status: 403 });
    }

    const meta = session.metadata || {};

    // Build prompt based on whether we have the original plan
    let prompt: string;
    if (originalPlan && typeof originalPlan === 'object') {
      prompt = buildRevisionPrompt(JSON.stringify(originalPlan, null, 2), revisionNotes, meta);
    } else {
      prompt = buildFallbackPrompt(revisionNotes, meta);
    }

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 65536,
        responseMimeType: 'application/json',
      },
    });
    const text = result.text || '';

    let plan;
    const rawText = text.trim();

    try {
      plan = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
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
        console.error('Failed to parse revision response:', rawText.substring(0, 2000));
        throw new Error('Failed to parse AI response');
      }
    }

    // Mark revision as used
    if (pi?.id) {
      await getStripe().paymentIntents.update(pi.id, {
        metadata: { ...pi.metadata, revision_used: 'true' },
      });
    }

    return NextResponse.json({ plan, businessName: meta.businessName || 'Business Plan' });
  } catch (error: any) {
    console.error('Revision error:', error);
    if (error.message?.includes('parse')) {
      return NextResponse.json({ error: 'Failed to generate revised plan. Please try again.' }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
