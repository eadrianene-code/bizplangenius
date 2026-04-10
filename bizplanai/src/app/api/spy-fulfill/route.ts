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

export const maxDuration = 120;

function buildCompanyResearchPrompt(meta: Record<string, string>): string {
  const locationContext = meta.city || meta.country
    ? `\nGeographic Focus: ${[meta.city, meta.country].filter(Boolean).join(', ')}. Prioritize competitors and market data relevant to this location. Include both local/regional players and major national/international competitors operating in this area.`
    : '';

  return `You are SpyMaster, a ruthless competitive intelligence analyst who combines McKinsey-level strategic rigor with deep market research. Your reports are worth $500+ because they contain REAL data, REAL insights, and ACTIONABLE intelligence that gives businesses an unfair advantage.

Research the following company and its ENTIRE competitive battlefield using real, current data from the web.

Company: "${meta.companyName}"${meta.companyUrl ? ` (Website: ${meta.companyUrl})` : ''}${locationContext}

Produce an EXHAUSTIVE competitive intelligence dossier covering:

1. TARGET COMPANY DEEP PROFILE:
   - What they do, their exact pricing (from their actual website), target market, year founded, estimated company size/employees, funding status
   - Their unique selling proposition and core value proposition
   - Their primary marketing channels (check their social media, blog, ads)
   - Customer reviews summary (check G2, Trustpilot, Capterra, Reddit)
   - Technology stack if detectable (check job postings, BuiltWith, etc.)

2. MARKET INTELLIGENCE:
   - Precise industry/market definition and segmentation
   - Total Addressable Market (TAM) with dollar figures and source
   - Growth rate and CAGR with source
   - 5+ key trends with specific data points and what they mean for new entrants
   - Market drivers (what is accelerating growth)
   - Threat factors (what could slow growth or disrupt the market)
   - Regulatory or compliance considerations

3. COMPETITIVE BATTLEFIELD (find 10-15 competitors across THREE categories):

   A) DIRECT COMPETITORS (5-7 companies that sell essentially the same thing):
   B) INDIRECT COMPETITORS (3-4 companies solving the same problem differently):
   C) EMERGING/NICHE PLAYERS (2-4 startups or niche players that could disrupt):

   For EACH competitor, research and provide:
   - Company name and real website URL
   - What they do (2-3 detailed sentences)
   - Year founded, estimated size (employees), funding raised if applicable
   - ACTUAL pricing tiers and amounts from their website (if not publicly listed, say "Pricing not publicly listed" and estimate based on market positioning)
   - Pricing model (subscription, one-time, freemium, usage-based, etc.)
   - Primary target customer (be specific: enterprise vs SMB vs consumer, industry verticals)
   - 4-6 specific strengths with evidence (what they do WELL)
   - 5-8 specific weaknesses and vulnerabilities with evidence (be RUTHLESS - look at negative reviews, missing features, slow support, high pricing, poor UX, outdated tech, weak SEO, lack of integrations, customer complaints)
   - Unique features or differentiators
   - Customer sentiment from real review platforms with specific ratings if available
   - Market position (Leader/Challenger/Niche/Emerging)
   - Their biggest vulnerability that a new entrant could exploit

4. PRICING BATTLEFIELD:
   - Complete pricing comparison table across all competitors
   - Lowest price point and who offers it
   - Highest price point and who offers it
   - Average/median market price
   - Pricing models used (subscription vs one-time vs freemium breakdown)
   - Price gaps (ranges where nobody competes)
   - Pricing trends (are prices going up or down, and why)

5. MARKET POSITIONING MAP:
   - Two most important dimensions to differentiate on in this market
   - Where each competitor sits on those dimensions
   - 5+ specific market gaps and whitespace opportunities where nobody is competing effectively
   - Why these gaps exist (is it technically hard? not profitable enough? nobody thought of it?)

6. VULNERABILITY AUDIT (the most valuable section):
   For EACH of the top 5 competitors, provide:
   - Their #1 biggest weakness that could be exploited
   - Feature gaps (what customers are begging for that they don't have)
   - Pricing vulnerabilities (are they too expensive? confusing pricing? hidden fees?)
   - Customer friction points (from negative reviews - onboarding issues, support problems, reliability)
   - Positioning gaps (market segments they ignore or underserve)
   - Technology debt (outdated UI, slow performance, missing integrations)

7. OPPORTUNITY ENGINEERING (5-8 concrete opportunities):
   For EACH opportunity:
   - Gap description: What exactly is the opportunity
   - Evidence: Which competitors fail here and why (cite specific review complaints, missing features, or pricing issues)
   - Strategic rationale: Why this gap matters and how big it is
   - Exploitation plan: Step-by-step how to take advantage (product features to build, messaging to use, customers to target)
   - Estimated impact: Revenue potential or market share capture (Low/Medium/High with reasoning)
   - Difficulty: How hard is this to execute (Easy/Medium/Hard)
   - Timeline: How quickly can this be implemented (weeks/months)
   - Risks and how to mitigate them
   - How this differentiates from ALL existing competitors

8. 90-DAY TACTICAL ROADMAP:
   - Week 1-2: Quick wins (things to do THIS WEEK for immediate advantage)
   - Week 3-4: Foundation building (what to set up in the first month)
   - Month 2: Growth acceleration (scaling what works)
   - Month 3: Competitive moat building (creating defensible advantages)
   Each item should be specific and actionable, not generic advice.

9. SWOT ANALYSIS (entering this market):
   - 4+ strengths with detailed reasoning
   - 4+ weaknesses with detailed reasoning
   - 4+ opportunities with detailed reasoning
   - 4+ threats with detailed reasoning

10. EXECUTIVE STRATEGIC RECOMMENDATIONS:
    - Top 3 differentiation strategies ranked by ROI and ease of execution
    - Recommended pricing strategy with specific price points and reasoning
    - 5 marketing angles competitors are completely missing
    - Specific positioning statement to claim
    - What to build first vs. what to avoid
    - Go-to-market strategy for fastest customer acquisition

CRITICAL RULES:
- Only include REAL companies with REAL data. If you cannot find specific pricing, say "Pricing not publicly listed".
- Do NOT make up any data. Reference actual review platforms and sources.
- Be RUTHLESS in vulnerability analysis. Sugar-coating helps nobody.
- Every recommendation must be SPECIFIC and ACTIONABLE, not generic business advice.
- This report should feel like it was written by a $500/hour strategy consultant.`;
}

function buildIndustryResearchPrompt(meta: Record<string, string>): string {
  const locationContext = meta.city || meta.country
    ? `Geographic Focus: ${[meta.city, meta.country].filter(Boolean).join(', ')}. Prioritize competitors, market sizing, and trends relevant to this specific location. Include both local/regional players and major national/international competitors operating in this area.\n\n`
    : '';

  return `You are SpyMaster, a ruthless competitive intelligence analyst who combines McKinsey-level strategic rigor with deep market research. Your reports are worth $500+ because they contain REAL data, REAL insights, and ACTIONABLE intelligence that gives businesses an unfair advantage.

Research the complete competitive landscape in this specific market using real, current data from the web.

Market/Industry: "${meta.industryDescription}"
Category: ${meta.industry}
${locationContext}
Produce an EXHAUSTIVE competitive intelligence dossier covering:

1. MARKET DEFINITION:
   - Precise definition of this market niche and its sub-segments
   - Who buys in this market and why
   - Market maturity stage (emerging, growing, mature, declining)

2. MARKET INTELLIGENCE:
   - Total Addressable Market (TAM) with dollar figures and source
   - Growth rate and CAGR with source
   - 5+ key trends with specific data points and what they mean for new entrants
   - Market drivers (what is accelerating growth)
   - Threat factors (what could slow growth or disrupt the market)
   - Regulatory or compliance considerations

3. COMPETITIVE BATTLEFIELD (find 10-15 companies across THREE categories):

   A) MARKET LEADERS (4-6 dominant players):
   B) CHALLENGERS & MID-MARKET (3-5 growing competitors):
   C) EMERGING/NICHE DISRUPTORS (3-4 startups or niche players):

   For EACH company, research and provide:
   - Company name and real website URL
   - What they do (2-3 detailed sentences)
   - Year founded, estimated size (employees), funding raised if applicable
   - ACTUAL pricing tiers and amounts from their website (if not publicly listed, say so and estimate)
   - Pricing model (subscription, one-time, freemium, usage-based, etc.)
   - Primary target customer (be specific)
   - 4-6 specific strengths with evidence
   - 5-8 specific weaknesses and vulnerabilities with evidence (be RUTHLESS)
   - Unique features or differentiators
   - Customer sentiment from real review platforms with specific ratings
   - Market position (Leader/Challenger/Niche/Emerging)
   - Their biggest vulnerability a new entrant could exploit

4. PRICING BATTLEFIELD:
   - Complete pricing comparison across all competitors
   - Lowest and highest price points with who offers them
   - Average/median market price
   - Pricing models breakdown
   - Price gaps where nobody competes
   - Pricing trends

5. MARKET POSITIONING MAP:
   - Two most important dimensions to differentiate on
   - Where each competitor sits
   - 5+ specific market gaps and whitespace opportunities
   - Why these gaps exist

6. VULNERABILITY AUDIT:
   For EACH top 5 competitor:
   - Their #1 biggest exploitable weakness
   - Feature gaps customers want
   - Pricing vulnerabilities
   - Customer friction points (from negative reviews)
   - Positioning gaps (segments they ignore)
   - Technology debt

7. OPPORTUNITY ENGINEERING (5-8 concrete opportunities):
   For EACH opportunity:
   - Gap description
   - Evidence from competitor failures
   - Strategic rationale
   - Step-by-step exploitation plan
   - Estimated impact (Low/Medium/High with reasoning)
   - Difficulty (Easy/Medium/Hard)
   - Timeline (weeks/months)
   - Risks and mitigation
   - How this differentiates from ALL existing competitors

8. 90-DAY TACTICAL ROADMAP:
   - Week 1-2: Quick wins
   - Week 3-4: Foundation building
   - Month 2: Growth acceleration
   - Month 3: Competitive moat building
   Each item specific and actionable.

9. SWOT ANALYSIS:
   - 4+ strengths, 4+ weaknesses, 4+ opportunities, 4+ threats (each with detailed reasoning)

10. EXECUTIVE STRATEGIC RECOMMENDATIONS:
    - Top 3 differentiation strategies ranked by ROI
    - Recommended pricing with specific price points
    - 5 marketing angles competitors miss
    - Specific positioning statement
    - What to build first vs. avoid
    - Go-to-market strategy

CRITICAL RULES:
- Only REAL companies with REAL data. If pricing unavailable, say so.
- Do NOT fabricate any information.
- Be RUTHLESS in vulnerability analysis.
- Every recommendation must be SPECIFIC and ACTIONABLE.
- This report should feel like a $500/hour strategy consultant wrote it.`;
}

function buildStructurePrompt(research: string, mode: string, meta: Record<string, string>): string {
  const reportTypeBlock = mode === 'company'
    ? `"reportType": "company",
  "targetCompany": {
    "name": "${meta.companyName}",
    "url": "${meta.companyUrl || 'N/A'}",
    "description": "string",
    "industry": "string",
    "founded": "string",
    "estimatedSize": "string",
    "pricing": "string",
    "targetCustomer": "string",
    "uniqueSellingPoint": "string",
    "marketingChannels": "string",
    "customerReviewsSummary": "string",
    "techStack": "string"
  },`
    : `"reportType": "industry",
  "industryTarget": {
    "description": "${meta.industryDescription}",
    "category": "${meta.industry}",
    "nicheDefinition": "string",
    "buyerProfile": "string",
    "maturityStage": "string"
  },`;

  return `You are a data structuring expert. Below is raw competitive intelligence research. Your job is to organize ALL of this research into the exact JSON structure specified. Capture EVERY detail from the research. If data is unavailable, use "N/A".

=== RAW RESEARCH ===
${research}
=== END RESEARCH ===

Structure the above research into this exact JSON format:

{
  ${reportTypeBlock}
  "executiveSummary": "string (3-4 paragraph executive summary highlighting the top 3 opportunities and key findings)",
  "marketOverview": {
    "industryName": "string",
    "marketSize": "string",
    "growthRate": "string",
    "keyTrends": [
      { "trend": "string", "dataPoint": "string", "implication": "string" }
    ],
    "marketDrivers": "string",
    "threatFactors": "string",
    "regulatoryConsiderations": "string"
  },
  "competitors": [
    {
      "name": "string",
      "url": "string",
      "category": "Direct|Indirect|Emerging",
      "description": "string",
      "founded": "string",
      "estimatedSize": "string",
      "fundingRaised": "string",
      "pricing": {
        "model": "string",
        "tiers": [
          { "name": "string", "price": "string", "features": "string" }
        ]
      },
      "targetCustomer": "string",
      "strengths": ["string", "string", "string", "string"],
      "weaknesses": ["string", "string", "string", "string", "string"],
      "uniqueFeatures": ["string"],
      "customerSentiment": "string",
      "reviewRating": "string",
      "marketPosition": "Leader|Challenger|Niche|Emerging",
      "biggestVulnerability": "string"
    }
  ],
  "pricingComparison": {
    "summary": "string",
    "lowestPrice": "string",
    "highestPrice": "string",
    "averagePrice": "string",
    "priceGaps": "string",
    "pricingModelsBreakdown": "string",
    "pricingTrends": "string"
  },
  "positioningMap": {
    "xAxis": "string",
    "yAxis": "string",
    "positions": [
      { "company": "string", "x": "low|medium|high", "y": "low|medium|high", "quadrant": "string" }
    ],
    "gaps": [
      { "gap": "string", "whyExists": "string", "opportunity": "string" }
    ]
  },
  "vulnerabilityAudit": [
    {
      "competitorName": "string",
      "biggestWeakness": "string",
      "featureGaps": "string",
      "pricingVulnerability": "string",
      "customerFriction": "string",
      "positioningGap": "string",
      "techDebt": "string"
    }
  ],
  "opportunityEngineering": [
    {
      "title": "string",
      "gapDescription": "string",
      "evidence": "string",
      "strategicRationale": "string",
      "exploitationPlan": ["string", "string", "string"],
      "estimatedImpact": "Low|Medium|High",
      "impactReasoning": "string",
      "difficulty": "Easy|Medium|Hard",
      "timeline": "string",
      "risks": "string",
      "mitigation": "string",
      "differentiation": "string"
    }
  ],
  "tacticalRoadmap": {
    "week1to2": [
      { "action": "string", "details": "string", "expectedOutcome": "string" }
    ],
    "week3to4": [
      { "action": "string", "details": "string", "expectedOutcome": "string" }
    ],
    "month2": [
      { "action": "string", "details": "string", "expectedOutcome": "string" }
    ],
    "month3": [
      { "action": "string", "details": "string", "expectedOutcome": "string" }
    ]
  },
  "swotAnalysis": {
    "strengths": [{ "point": "string", "reasoning": "string" }],
    "weaknesses": [{ "point": "string", "reasoning": "string" }],
    "opportunities": [{ "point": "string", "reasoning": "string" }],
    "threats": [{ "point": "string", "reasoning": "string" }]
  },
  "strategicRecommendations": {
    "topDifferentiationStrategies": [
      { "strategy": "string", "reasoning": "string", "roi": "High|Medium|Low", "ease": "Easy|Medium|Hard" }
    ],
    "pricingStrategy": "string",
    "recommendedPricePoints": "string",
    "marketingAngles": ["string", "string", "string", "string", "string"],
    "positioningStatement": "string",
    "buildFirst": ["string", "string", "string"],
    "avoid": ["string", "string"],
    "goToMarketStrategy": "string"
  }
}

RULES:
1. Output ONLY valid JSON. No markdown, no code blocks, no extra text.
2. Include ALL competitors from the research (aim for 10-15).
3. Preserve ALL specific data points, URLs, pricing, sources, and evidence.
4. Do not invent or add any data not present in the research.
5. The executiveSummary should be compelling and highlight the biggest opportunities.
6. Every weakness and vulnerability must be specific, not generic.`;
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
    }

    const meta = session.metadata || {};

    // STEP 1: Research with Google Search grounding
    console.log('Spy Step 1: Starting grounded research...');
    const researchPrompt = meta.mode === 'company'
      ? buildCompanyResearchPrompt(meta)
      : buildIndustryResearchPrompt(meta);

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
            content: 'You are SpyMaster, a ruthless competitive intelligence analyst who combines McKinsey-level strategic rigor with deep market research. Your reports are worth $500+ because they contain REAL data, REAL insights, and ACTIONABLE intelligence. Be exhaustive, specific, and brutal in your analysis. Never use placeholder or generic data.',
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

    console.log('Spy Step 1 complete. Research length:', researchText.length);
    console.log('Research preview (first 500):', researchText.substring(0, 500));

    // STEP 2: Structure into JSON
    console.log('Spy Step 2: Structuring into JSON...');
    const structurePrompt = buildStructurePrompt(researchText, meta.mode || 'company', meta);

    let structureText = '';

    try {
      if (!usedFallback) {
        console.log('Attempting Gemini API call for structure...');
        const structureResult = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: structurePrompt,
          config: {
            temperature: 0.2,
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
        temperature: 0.2,
        max_tokens: 16000,
      });
      structureText = openaiResponse.choices[0].message.content || '';
    }

    console.log('Spy Step 2 complete. JSON length:', structureText.length);

    let report;
    const rawText = structureText.trim();

    // Strategy 1: Direct JSON parse
    try {
      report = JSON.parse(rawText);
    } catch {
      // Strategy 2: Extract from markdown code blocks
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          report = JSON.parse(jsonMatch[1].trim());
        } catch {}
      }

      // Strategy 3: Find the first { and last }
      if (!report) {
        const firstBrace = rawText.indexOf('{');
        const lastBrace = rawText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          try {
            report = JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
          } catch {}
        }
      }

      if (!report) {
        console.error('Failed to parse spy report. Raw:', rawText.substring(0, 2000));
        throw new Error('Failed to parse AI response');
      }
    }

    const reportName = meta.mode === 'company'
      ? meta.companyName
      : meta.industry;

    // Add metadata
    report.generatedAt = new Date().toISOString();
    report.disclaimer = 'This report reflects publicly available information gathered via real-time web research. We recommend verifying pricing and company details directly on competitor websites before making strategic decisions.';

    return NextResponse.json({ report, reportName });
  } catch (error: any) {
    console.error('Spy fulfill error:', error);
    return NextResponse.json(
      { error: 'Failed to generate competitor report' },
      { status: 500 }
    );
  }
}
