import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const maxDuration = 300;

function buildResearchPrompt(meta: Record<string, string>): string {
  const locationContext = meta.location
    ? `\nLocation: ${meta.location}. Focus on market data, competitors, and trends relevant to this geographic area.`
    : '';

  const isPro = meta.tier === 'pro';

  const proSections = isPro ? `

6. OPERATIONS:
   - Business model mechanics (how it works day-to-day)
   - Required team/roles
   - Technology and tools needed
   - Key milestones for first 18 months

7. RISK ANALYSIS:
   - 5-7 specific risks for this type of business
   - Likelihood and impact assessment
   - Concrete mitigation strategies` : '';

  return `You are a world-class business strategy researcher. Research the following business idea and its market using real, current data from the web.

BUSINESS DETAILS:
- Business Name: ${meta.businessName}
- Industry: ${meta.industry}
- Description: ${meta.description}
- Target Market: ${meta.targetMarket}
- Revenue Model: ${meta.revenueModel}${locationContext}
- Starting Budget: ${meta.investment || 'Not specified'}
- Known Competitors: ${meta.competitors || 'None listed - find the top competitors in this space'}

Research and provide detailed findings on:

1. EXECUTIVE SUMMARY INPUTS:
   - What makes this business idea viable
   - Key value proposition and differentiation
   - 3-5 projected key metrics based on industry benchmarks (e.g., average revenue for similar businesses in year 1, typical customer count, average order value)

2. COMPETITOR ANALYSIS (find 5-10 REAL competitors):
   For EACH competitor, research and provide:
   - Company name and what they do
   - Their ACTUAL pricing from their website (if not publicly listed, say so)
   - Estimated revenue or company size
   - 2-3 specific strengths
   - 2-3 specific weaknesses
   - How this business can differentiate from them
   Identify specific market gaps these competitors are missing.

3. MARKET ANALYSIS:
   - Total Addressable Market (TAM) with dollar figures and source
   - Serviceable Addressable Market (SAM) and Serviceable Obtainable Market (SOM)
   - Industry growth rate with source
   - 4+ current market trends with specific data
   - Target customer demographics, psychographics, pain points, and buying behavior

4. MARKETING STRATEGY:
   - Recommended marketing channels with estimated Customer Acquisition Cost (CAC) for each
   - Content strategy recommendations
   - First 90-day launch plan
   - What successful competitors in this space are doing for marketing

5. FINANCIAL PROJECTIONS:
   - Realistic revenue estimates for Year 1, 2, and 3 based on industry benchmarks
   - Typical cost structure for this type of business
   - Break-even analysis
   - Startup costs breakdown
   - Key financial assumptions with reasoning${proSections}

CRITICAL RULES:
- Only cite REAL companies with REAL data. If you cannot find specific pricing, say "Pricing not publicly listed."
- Use real industry benchmarks, not made-up numbers. If exact data is unavailable, provide reasonable ranges and cite your source or reasoning.
- Be specific to THIS business, not generic advice.
- Financial projections must be conservative and grounded in comparable business performance.`;
}

function buildStructurePrompt(research: string, meta: Record<string, string>): string {
  const isPro = meta.tier === 'pro';

  const proJsonSections = isPro ? `,
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
  }` : '';

  return `You are a data structuring assistant. Below is raw business research and market analysis. Your ONLY job is to organize this research into the exact JSON structure specified. Do NOT add any information that isn't in the research. If the research does not provide a specific number, use your best professional estimate based on the research context and clearly label it as an estimate.

=== RAW RESEARCH ===
${research}
=== END RESEARCH ===

Business Name: ${meta.businessName}
Industry: ${meta.industry}

Structure the above research into this exact JSON format:

{
  "executiveSummary": {
    "overview": "2-3 paragraph company overview incorporating research findings",
    "mission": "Mission statement derived from the business description",
    "vision": "Vision statement",
    "valueProposition": "Clear unique value proposition based on competitive gaps found",
    "keyMetrics": ["3-5 key projected metrics with numbers from the research"]
  },
  "competitorAnalysis": {
    "overview": "Paragraph analyzing the competitive landscape based on research",
    "competitors": [
      {
        "name": "Competitor name",
        "description": "What they do",
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "estimatedRevenue": "Revenue estimate from research",
        "pricing": "Their actual pricing from research"
      }
    ],
    "competitiveAdvantage": "How this business differentiates based on gaps found",
    "marketGaps": ["Gap 1", "Gap 2", "Gap 3"]
  },
  "marketAnalysis": {
    "industryOverview": "2 paragraphs on the industry from research data",
    "marketSize": "TAM, SAM, SOM with dollar figures from research",
    "growthRate": "Industry growth rate from research",
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
        "estimatedCAC": "Cost to acquire a customer from research",
        "priority": "High/Medium/Low"
      }
    ],
    "contentStrategy": "Content marketing approach",
    "launchPlan": "First 90 days go-to-market plan"
  },
  "financialProjections": {
    "revenueModel": "Detailed revenue model explanation",
    "year1": { "revenue": "$X (REQUIRED - must be a dollar amount)", "costs": "$X (REQUIRED - total operating costs)", "profit": "$X (REQUIRED - revenue minus costs)", "customers": "X (REQUIRED - estimated customer count)" },
    "year2": { "revenue": "$X (REQUIRED)", "costs": "$X (REQUIRED)", "profit": "$X (REQUIRED)", "customers": "X (REQUIRED)" },
    "year3": { "revenue": "$X (REQUIRED)", "costs": "$X (REQUIRED)", "profit": "$X (REQUIRED)", "customers": "X (REQUIRED)" },
    "keyAssumptions": ["Assumption 1 with reasoning", "Assumption 2 with reasoning", "Assumption 3 with reasoning"],
    "breakEvenTimeline": "When the business breaks even",
    "startupCosts": [
      { "item": "Cost item", "amount": "$X" }
    ]
  }${proJsonSections}
}

RULES:
1. Output ONLY valid JSON. No markdown, no code blocks, no extra text.
2. Include ALL competitors from the research (aim for 5-10).
3. Preserve all specific data points, pricing, revenue figures, and sources from the research.
4. Do not invent or add any data not present in the research.
5. Make the plan specific to ${meta.businessName} - not generic advice.
6. CRITICAL: Every financial field (revenue, costs, profit, customers) for year1/year2/year3 MUST contain a specific dollar amount or number. NEVER use "N/A" for financial projections. If the research provides revenue but not costs, estimate costs based on typical industry cost structures mentioned in the research.`;
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    const stripe = getStripe();

    // Verify the payment session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
    }

    const meta = session.metadata || {};

    // STEP 1: Research with Google Search grounding
    console.log('BizPlan Step 1: Starting grounded market research...');
    const researchPrompt = buildResearchPrompt(meta);

    let researchText = '';
    let usedFallback = false;

    try {
      console.log('Attempting Gemini API call...');
      const researchResult = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: researchPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.4,
          topP: 0.9,
          maxOutputTokens: 32768,
        },
      });
      researchText = researchResult.text || '';
    } catch (geminiError: any) {
      console.warn('Gemini API failed, falling back to OpenAI:', geminiError.message);
      usedFallback = true;

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const openaiResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a world-class business research analyst. Provide extremely detailed, comprehensive research with specific data points, real market figures, actual competitor names and pricing, and thorough analysis. Your research should be worth paying for. Never use placeholder or generic data. Be as specific and data-rich as possible using your knowledge.',
          },
          {
            role: 'user',
            content: researchPrompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 16000,
      });
      researchText = openaiResponse.choices[0].message.content || '';
    }

    console.log('BizPlan Step 1 complete. Research length:', researchText.length);

    // STEP 2: Structure into clean JSON
    console.log('BizPlan Step 2: Structuring into business plan JSON...');
    const structurePrompt = buildStructurePrompt(researchText, meta);

    let structureText = '';

    try {
      if (!usedFallback) {
        console.log('Attempting Gemini API call for structure...');
        const structureResult = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: structurePrompt,
          config: {
            temperature: 0.3,
            topP: 0.9,
            maxOutputTokens: 65536,
            responseMimeType: 'application/json',
          },
        });
        structureText = structureResult.text || '';
      } else {
        throw new Error('Skipping Gemini for structure since research fallback was used');
      }
    } catch (geminiError: any) {
      console.warn('Gemini structure API failed, falling back to OpenAI:', geminiError.message);

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const openaiResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: structurePrompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 16000,
      });
      structureText = openaiResponse.choices[0].message.content || '';
    }

    console.log('BizPlan Step 2 complete. JSON length:', structureText.length);

    let plan;
    const rawText = structureText.trim();

    // Strategy 1: Direct JSON parse
    try {
      plan = JSON.parse(rawText);
    } catch {
      // Strategy 2: Extract from markdown code blocks
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          plan = JSON.parse(jsonMatch[1].trim());
        } catch {}
      }

      // Strategy 3: Find the first { and last } to extract JSON object
      if (!plan) {
        const firstBrace = rawText.indexOf('{');
        const lastBrace = rawText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          try {
            plan = JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
          } catch {}
        }
      }

      if (!plan) {
        console.error('Failed to parse. Full response:', rawText.substring(0, 2000));
        throw new Error('Failed to parse AI response');
      }
    }

    return NextResponse.json({ plan, businessName: meta.businessName || 'Business Plan' });
  } catch (error: any) {
    console.error('Fulfill error:', error);
    return NextResponse.json(
      { error: 'Failed to generate business plan' },
      { status: 500 }
    );
  }
}
