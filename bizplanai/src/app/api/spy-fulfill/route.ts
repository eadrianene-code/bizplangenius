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

export const maxDuration = 60;

function buildJsonSchema(mode: string, meta: Record<string, string>): string {
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
    "uniqueSellingPoint": "string"
  },`
    : `"reportType": "industry",
  "industryTarget": {
    "description": "${meta.industryDescription}",
    "category": "${meta.industry}",
    "nicheDefinition": "string",
    "buyerProfile": "string",
    "maturityStage": "string"
  },`;

  return `{
  ${reportTypeBlock}
  "executiveSummary": "string (3-4 paragraph summary highlighting top 3 opportunities)",
  "marketOverview": {
    "industryName": "string",
    "marketSize": "string with dollar figures",
    "growthRate": "string with percentage",
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
      "url": "string (real URL)",
      "category": "Direct|Indirect|Emerging",
      "description": "string (2-3 sentences)",
      "founded": "string",
      "estimatedSize": "string",
      "fundingRaised": "string or N/A",
      "pricing": {
        "model": "string",
        "tiers": [{ "name": "string", "price": "string", "features": "string" }]
      },
      "targetCustomer": "string",
      "strengths": ["string (4-6 items, each with evidence)"],
      "weaknesses": ["string (5-8 items, be ruthless, cite reviews/evidence)"],
      "uniqueFeatures": ["string"],
      "customerSentiment": "string with specific review data",
      "reviewRating": "string or N/A",
      "marketPosition": "Leader|Challenger|Niche|Emerging",
      "biggestVulnerability": "string (the #1 exploitable weakness)"
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
      "exploitationPlan": ["step 1", "step 2", "step 3"],
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
    "week1to2": [{ "action": "string", "details": "string", "expectedOutcome": "string" }],
    "week3to4": [{ "action": "string", "details": "string", "expectedOutcome": "string" }],
    "month2": [{ "action": "string", "details": "string", "expectedOutcome": "string" }],
    "month3": [{ "action": "string", "details": "string", "expectedOutcome": "string" }]
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
}`;
}

function buildPrompt(meta: Record<string, string>): string {
  const isCompany = meta.mode === 'company';

  const locationContext = meta.city || meta.country
    ? `\nGeographic Focus: ${[meta.city, meta.country].filter(Boolean).join(', ')}. Prioritize competitors and market data relevant to this location.`
    : '';

  const targetContext = isCompany
    ? `Company: "${meta.companyName}"${meta.companyUrl ? ` (Website: ${meta.companyUrl})` : ''}`
    : `Market/Industry: "${meta.industryDescription}"\nCategory: ${meta.industry}`;

  const jsonSchema = buildJsonSchema(meta.mode || 'company', meta);

  return `You are SpyMaster, an elite competitive intelligence analyst. Research the competitive battlefield using real web data and produce an executive-grade intelligence report.

${targetContext}${locationContext}

RESEARCH MANDATE:
- Find 10-15 REAL competitors (categorize as Direct, Indirect, Emerging)
- Get ACTUAL pricing from their websites
- Check REAL reviews on G2, Trustpilot, Capterra, Reddit
- Find 5-8 SPECIFIC weaknesses per competitor (be ruthless - cite negative reviews, missing features, poor UX, slow support)
- Identify the single biggest vulnerability for each top competitor
- Engineer 5-8 concrete opportunities with step-by-step exploitation plans
- Create a 90-day tactical roadmap with specific weekly actions
- Every recommendation must be SPECIFIC and ACTIONABLE

OUTPUT: Return your findings as a single JSON object matching this exact schema. Output ONLY valid JSON, no markdown, no explanation.

${jsonSchema}

RULES:
- Only REAL companies with REAL data. Never fabricate.
- If pricing unavailable, say "Pricing not publicly listed".
- Be RUTHLESS in vulnerability analysis. Sugar-coating helps nobody.
- The executiveSummary must be compelling, highlighting the top 3 opportunities.
- Include ALL 10-15 competitors in the competitors array.
- Every weakness must cite evidence (review quotes, missing features, etc).`;
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

    // SINGLE CALL: Research + Structure combined with Google Search grounding
    console.log('Spy: Starting combined research + structure call...');
    const prompt = buildPrompt(meta);

    let reportText = '';

    try {
      console.log('Attempting Gemini API call with Google Search...');
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.3,
          topP: 0.9,
          maxOutputTokens: 65536,
        },
      });
      reportText = result.text || '';
    } catch (geminiError: any) {
      console.warn('Gemini API failed, falling back to OpenAI:', geminiError.message);

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const openaiResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are SpyMaster, an elite competitive intelligence analyst. Output ONLY valid JSON. Be exhaustive, specific, and brutal in analysis. Never use placeholder or generic data.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 16000,
      });
      reportText = openaiResponse.choices[0].message.content || '';
    }

    console.log('Spy call complete. Response length:', reportText.length);

    let report;
    const rawText = reportText.trim();

    // Parse JSON from response
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
