import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GoogleGenAI } from '@google/genai';

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

  return `You are a competitive intelligence researcher. Research the following company and its competitive landscape using real, current data from the web.

Company: "${meta.companyName}"${meta.companyUrl ? ` (Website: ${meta.companyUrl})` : ''}${locationContext}

Research and provide detailed findings on:

1. ABOUT THE TARGET COMPANY:
   - What they do, their pricing (from their actual website), target market, year founded, estimated company size
   - Their unique selling proposition

2. MARKET OVERVIEW:
   - What industry/market they operate in
   - Market size (with dollar figures and source)
   - Growth rate (with source)
   - 4+ key trends with specific data points
   - Market drivers and threat factors

3. COMPETITORS (find 5-8 direct competitors):
   For EACH competitor, research and provide:
   - Company name and real website URL
   - What they do (2-3 sentences)
   - Year founded and estimated size
   - ACTUAL pricing tiers and amounts from their website (if not publicly listed, say so)
   - Pricing model (subscription, one-time, freemium, etc.)
   - Target customer
   - 3 specific strengths with evidence
   - 2 specific weaknesses with evidence
   - Unique features that set them apart
   - Customer sentiment from real review platforms (G2, Trustpilot, Capterra, etc.)
   - Market position (Leader/Challenger/Niche/Emerging)

4. PRICING LANDSCAPE:
   - Summary of pricing across the market
   - Lowest and highest prices with who offers them
   - Average market price
   - Pricing trends

5. MARKET POSITIONING:
   - Two key dimensions to compare competitors on
   - Where each company sits on those dimensions
   - 3 specific market gaps/opportunities

6. SWOT ANALYSIS of entering this market:
   - 3 strengths, 3 weaknesses, 3 opportunities, 3 threats (each with reasoning)

7. STRATEGIC RECOMMENDATIONS:
   - 3+ differentiation opportunities with difficulty and impact ratings
   - Recommended pricing strategy
   - 3 marketing angles competitors are missing
   - 3 quick wins (this week, this month, next quarter)

CRITICAL: Only include REAL companies with REAL data. If you cannot find specific pricing, say "Pricing not publicly listed". Do not make up any data. Reference actual review platforms and sources.`;
}

function buildIndustryResearchPrompt(meta: Record<string, string>): string {
  const locationContext = meta.city || meta.country
    ? `Geographic Focus: ${[meta.city, meta.country].filter(Boolean).join(', ')}. Prioritize competitors, market sizing, and trends relevant to this specific location. Include both local/regional players and major national/international competitors operating in this area.\n\n`
    : '';

  return `You are a competitive intelligence researcher. Research the competitive landscape in this specific market using real, current data from the web.

Market/Industry: "${meta.industryDescription}"
Category: ${meta.industry}
${locationContext}
Research and provide detailed findings on:

1. MARKET DEFINITION:
   - Precise definition of this market niche

2. MARKET OVERVIEW:
   - Market size (with dollar figures and source)
   - Growth rate (with source)
   - 4+ key trends with specific data points
   - Market drivers and threat factors

3. KEY PLAYERS (find 6-8 significant companies):
   For EACH company, research and provide:
   - Company name and real website URL
   - What they do (2-3 sentences)
   - Year founded and estimated size
   - ACTUAL pricing tiers and amounts from their website (if not publicly listed, say so)
   - Pricing model (subscription, one-time, freemium, etc.)
   - Target customer
   - 3 specific strengths with evidence
   - 2 specific weaknesses with evidence
   - Unique features
   - Customer sentiment from real review platforms (G2, Trustpilot, Capterra, etc.)
   - Market position (Leader/Challenger/Niche/Emerging)

4. PRICING LANDSCAPE:
   - Summary of pricing across the market
   - Lowest and highest prices
   - Average market price
   - Pricing trends

5. MARKET POSITIONING:
   - Two key dimensions to compare competitors
   - Where each company sits
   - 3 specific market gaps/opportunities

6. SWOT ANALYSIS:
   - 3 strengths, 3 weaknesses, 3 opportunities, 3 threats (each with reasoning)

7. STRATEGIC RECOMMENDATIONS:
   - 3+ differentiation opportunities with difficulty and impact
   - Recommended pricing strategy
   - 3 marketing angles competitors are missing
   - 3 quick wins

CRITICAL: Only include REAL companies with REAL data. If pricing is not publicly available, say so. Do not fabricate any information.`;
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
    "uniqueSellingPoint": "string"
  },`
    : `"reportType": "industry",
  "industryTarget": {
    "description": "${meta.industryDescription}",
    "category": "${meta.industry}",
    "nicheDefinition": "string"
  },`;

  return `You are a data structuring assistant. Below is raw competitive intelligence research. Your ONLY job is to organize this research into the exact JSON structure specified. Do NOT add any information that isn't in the research. If the research says data is unavailable, use "N/A".

=== RAW RESEARCH ===
${research}
=== END RESEARCH ===

Structure the above research into this exact JSON format:

{
  ${reportTypeBlock}
  "marketOverview": {
    "industryName": "string",
    "marketSize": "string",
    "growthRate": "string",
    "keyTrends": ["string", "string", "string", "string"],
    "marketDrivers": "string",
    "threatFactors": "string"
  },
  "competitors": [
    {
      "name": "string",
      "url": "string",
      "description": "string",
      "founded": "string",
      "estimatedSize": "string",
      "pricing": {
        "model": "string",
        "tiers": [
          { "name": "string", "price": "string", "features": "string" }
        ]
      },
      "targetCustomer": "string",
      "strengths": ["string", "string", "string"],
      "weaknesses": ["string", "string"],
      "uniqueFeatures": ["string"],
      "customerSentiment": "string",
      "marketPosition": "Leader|Challenger|Niche|Emerging"
    }
  ],
  "pricingComparison": {
    "summary": "string",
    "lowestPrice": "string",
    "highestPrice": "string",
    "averagePrice": "string",
    "pricingTrends": "string"
  },
  "positioningMap": {
    "xAxis": "string",
    "yAxis": "string",
    "positions": [
      { "company": "string", "x": "low|medium|high", "y": "low|medium|high", "quadrant": "string" }
    ],
    "gaps": ["string", "string", "string"]
  },
  "swotAnalysis": {
    "strengths": ["string", "string", "string"],
    "weaknesses": ["string", "string", "string"],
    "opportunities": ["string", "string", "string"],
    "threats": ["string", "string", "string"]
  },
  "strategicRecommendations": {
    "differentiationOpportunities": [
      { "opportunity": "string", "reasoning": "string", "difficulty": "Easy|Medium|Hard", "impact": "High|Medium|Low" }
    ],
    "pricingStrategy": "string",
    "marketingAngles": ["string", "string", "string"],
    "quickWins": ["string", "string", "string"]
  }
}

RULES:
1. Output ONLY valid JSON. No markdown, no code blocks, no extra text.
2. Include ALL competitors from the research (aim for 5-8).
3. Preserve all specific data points, URLs, pricing, and sources from the research.
4. Do not invent or add any data not present in the research.`;
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
    const researchText = researchResult.text || '';

    console.log('Spy Step 1 complete. Research length:', researchText.length);
    console.log('Research preview (first 500):', researchText.substring(0, 500));

    // STEP 2: Structure into JSON
    console.log('Spy Step 2: Structuring into JSON...');
    const structurePrompt = buildStructurePrompt(researchText, meta.mode || 'company', meta);

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
    const structureText = structureResult.text || '';

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
    report.disclaimer = 'This report reflects publicly available information gathered via web research. We recommend verifying pricing and company details directly on competitor websites before making strategic decisions.';

    return NextResponse.json({ report, reportName });
  } catch (error: any) {
    console.error('Spy fulfill error:', error);
    return NextResponse.json(
      { error: 'Failed to generate competitor report' },
      { status: 500 }
    );
  }
}
