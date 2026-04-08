import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GoogleGenerativeAI } from '@google/generative-ai';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const maxDuration = 120;

function buildCompanyPrompt(meta: Record<string, string>): string {
  return `You are a world-class competitive intelligence analyst. A customer wants to understand the competitive landscape around "${meta.companyName}"${meta.companyUrl ? ` (${meta.companyUrl})` : ''}.

YOUR TASK: Research this company and its competitors using real, current data. This is a PAID report ($19) so it must contain specific, actionable intelligence that justifies the price. No generic filler. Every data point must be real and verifiable.

INSTRUCTIONS:
1. First, identify what "${meta.companyName}" does, their pricing, target market, and positioning
2. Find 5-8 direct competitors that serve the same market
3. Research each competitor's ACTUAL pricing (from their website), real product features, and market positioning
4. Identify gaps and opportunities in the competitive landscape

Generate the report in this exact JSON structure:

{
  "reportType": "company",
  "targetCompany": {
    "name": "${meta.companyName}",
    "url": "${meta.companyUrl || 'N/A'}",
    "description": "What this company does (2-3 sentences)",
    "industry": "Industry category",
    "founded": "Year founded if known, otherwise 'N/A'",
    "estimatedSize": "Employee count range or revenue estimate if available",
    "pricing": "Their actual pricing tiers and amounts",
    "targetCustomer": "Who they serve",
    "uniqueSellingPoint": "Their key differentiator"
  },
  "marketOverview": {
    "industryName": "The specific market/industry",
    "marketSize": "Total addressable market with real dollar figures and source",
    "growthRate": "Annual growth rate with source",
    "keyTrends": ["Trend 1 with specific data point", "Trend 2 with specific data point", "Trend 3 with specific data point", "Trend 4 with specific data point"],
    "marketDrivers": "What is driving growth in this space (2-3 sentences)",
    "threatFactors": "What could slow growth (2-3 sentences)"
  },
  "competitors": [
    {
      "name": "Real competitor name",
      "url": "Their actual website URL",
      "description": "What they do (2-3 sentences)",
      "founded": "Year if known",
      "estimatedSize": "Employee count or revenue estimate",
      "pricing": {
        "model": "Subscription/One-time/Freemium/etc",
        "tiers": [
          { "name": "Tier name", "price": "Actual price from their website", "features": "Key features included" }
        ]
      },
      "targetCustomer": "Who they primarily serve",
      "strengths": ["Specific strength with evidence", "Specific strength with evidence", "Specific strength with evidence"],
      "weaknesses": ["Specific weakness with evidence", "Specific weakness with evidence"],
      "uniqueFeatures": ["Feature that sets them apart"],
      "customerSentiment": "Summary of how customers feel based on reviews (mention specific review platforms)",
      "marketPosition": "Leader/Challenger/Niche/Emerging"
    }
  ],
  "pricingComparison": {
    "summary": "2-3 sentence overview of pricing landscape",
    "lowestPrice": "Cheapest option and who offers it",
    "highestPrice": "Most expensive and who offers it",
    "averagePrice": "Market average",
    "pricingTrends": "How pricing is evolving in this space"
  },
  "positioningMap": {
    "xAxis": "Dimension 1 (e.g., Price: Low to High)",
    "yAxis": "Dimension 2 (e.g., Features: Basic to Advanced)",
    "positions": [
      { "company": "Company name", "x": "low/medium/high", "y": "low/medium/high", "quadrant": "Description of their position" }
    ],
    "gaps": ["Market gap 1 - specific opportunity", "Market gap 2 - specific opportunity", "Market gap 3 - specific opportunity"]
  },
  "swotAnalysis": {
    "strengths": ["Industry strength 1", "Industry strength 2", "Industry strength 3"],
    "weaknesses": ["Industry weakness 1", "Industry weakness 2", "Industry weakness 3"],
    "opportunities": ["Opportunity 1 with specific reasoning", "Opportunity 2 with specific reasoning", "Opportunity 3 with specific reasoning"],
    "threats": ["Threat 1 with specific reasoning", "Threat 2 with specific reasoning", "Threat 3 with specific reasoning"]
  },
  "strategicRecommendations": {
    "differentiationOpportunities": [
      { "opportunity": "Specific opportunity", "reasoning": "Why this works based on competitive gaps", "difficulty": "Easy/Medium/Hard", "impact": "High/Medium/Low" }
    ],
    "pricingStrategy": "Recommended pricing approach based on competitive data",
    "marketingAngles": ["Marketing angle 1 that competitors are missing", "Marketing angle 2", "Marketing angle 3"],
    "quickWins": ["Something you can do this week", "Something you can do this month", "Something for next quarter"]
  }
}

CRITICAL RULES:
1. Every competitor must be REAL and currently operating. Do not invent companies.
2. All pricing must reflect ACTUAL current prices from their websites. If you cannot verify pricing, state "Pricing not publicly listed" rather than guessing.
3. Include real website URLs for every competitor.
4. Market size and growth figures should reference real industry reports or estimates.
5. Customer sentiment should reference real review platforms (G2, Trustpilot, Capterra, Yelp, Google Reviews, etc.).
6. Output ONLY the JSON. No markdown, no code blocks, no extra text.
7. If data is unavailable for a field, use "N/A" rather than making something up.
8. Find at LEAST 5 competitors but aim for 6-8.`;
}

function buildIndustryPrompt(meta: Record<string, string>): string {
  return `You are a world-class competitive intelligence analyst. A customer wants to understand the competitive landscape in this market: "${meta.industryDescription}" (Category: ${meta.industry}).

YOUR TASK: Map the competitive landscape of this specific market using real, current data. This is a PAID report ($19) so it must contain specific, actionable intelligence that justifies the price. No generic filler. Every data point must be real and verifiable.

INSTRUCTIONS:
1. Identify the 6-8 most significant players in this specific market niche
2. Research each company's ACTUAL pricing, features, and positioning
3. Find real market data (size, growth, trends)
4. Identify specific gaps and opportunities

Generate the report in this exact JSON structure:

{
  "reportType": "industry",
  "industryTarget": {
    "description": "${meta.industryDescription}",
    "category": "${meta.industry}",
    "nicheDefinition": "Precise definition of this market niche (2-3 sentences)"
  },
  "marketOverview": {
    "industryName": "The specific market/industry",
    "marketSize": "Total addressable market with real dollar figures and source",
    "growthRate": "Annual growth rate with source",
    "keyTrends": ["Trend 1 with specific data point", "Trend 2 with specific data point", "Trend 3 with specific data point", "Trend 4 with specific data point"],
    "marketDrivers": "What is driving growth in this space (2-3 sentences)",
    "threatFactors": "What could slow growth (2-3 sentences)"
  },
  "competitors": [
    {
      "name": "Real company name",
      "url": "Their actual website URL",
      "description": "What they do (2-3 sentences)",
      "founded": "Year if known",
      "estimatedSize": "Employee count or revenue estimate",
      "pricing": {
        "model": "Subscription/One-time/Freemium/etc",
        "tiers": [
          { "name": "Tier name", "price": "Actual price from their website", "features": "Key features included" }
        ]
      },
      "targetCustomer": "Who they primarily serve",
      "strengths": ["Specific strength with evidence", "Specific strength with evidence", "Specific strength with evidence"],
      "weaknesses": ["Specific weakness with evidence", "Specific weakness with evidence"],
      "uniqueFeatures": ["Feature that sets them apart"],
      "customerSentiment": "Summary of how customers feel based on reviews (mention specific review platforms)",
      "marketPosition": "Leader/Challenger/Niche/Emerging"
    }
  ],
  "pricingComparison": {
    "summary": "2-3 sentence overview of pricing landscape",
    "lowestPrice": "Cheapest option and who offers it",
    "highestPrice": "Most expensive and who offers it",
    "averagePrice": "Market average",
    "pricingTrends": "How pricing is evolving in this space"
  },
  "positioningMap": {
    "xAxis": "Dimension 1 (e.g., Price: Low to High)",
    "yAxis": "Dimension 2 (e.g., Features: Basic to Advanced)",
    "positions": [
      { "company": "Company name", "x": "low/medium/high", "y": "low/medium/high", "quadrant": "Description of their position" }
    ],
    "gaps": ["Market gap 1 - specific opportunity", "Market gap 2 - specific opportunity", "Market gap 3 - specific opportunity"]
  },
  "swotAnalysis": {
    "strengths": ["Industry strength 1", "Industry strength 2", "Industry strength 3"],
    "weaknesses": ["Industry weakness 1", "Industry weakness 2", "Industry weakness 3"],
    "opportunities": ["Opportunity 1 with specific reasoning", "Opportunity 2 with specific reasoning", "Opportunity 3 with specific reasoning"],
    "threats": ["Threat 1 with specific reasoning", "Threat 2 with specific reasoning", "Threat 3 with specific reasoning"]
  },
  "strategicRecommendations": {
    "differentiationOpportunities": [
      { "opportunity": "Specific opportunity", "reasoning": "Why this works based on competitive gaps", "difficulty": "Easy/Medium/Hard", "impact": "High/Medium/Low" }
    ],
    "pricingStrategy": "Recommended pricing approach based on competitive data",
    "marketingAngles": ["Marketing angle 1 that competitors are missing", "Marketing angle 2", "Marketing angle 3"],
    "quickWins": ["Something you can do this week", "Something you can do this month", "Something for next quarter"]
  }
}

CRITICAL RULES:
1. Every competitor must be REAL and currently operating. Do not invent companies.
2. All pricing must reflect ACTUAL current prices from their websites. If pricing is not public, state "Pricing not publicly listed".
3. Include real website URLs for every competitor.
4. Market size and growth figures should reference real industry reports or estimates.
5. Customer sentiment should reference real review platforms (G2, Trustpilot, Capterra, Yelp, Google Reviews, etc.).
6. Output ONLY the JSON. No markdown, no code blocks, no extra text.
7. If data is unavailable for a field, use "N/A" rather than making something up.
8. Find at LEAST 5 competitors but aim for 6-8.`;
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
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

    const prompt = meta.mode === 'company'
      ? buildCompanyPrompt(meta)
      : buildIndustryPrompt(meta);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log('Spy Gemini response (first 500 chars):', text.substring(0, 500));

    let report;
    const rawText = text.trim();

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
        console.error('Failed to parse spy report. Full response:', rawText.substring(0, 2000));
        throw new Error('Failed to parse AI response');
      }
    }

    const reportName = meta.mode === 'company'
      ? meta.companyName
      : meta.industry;

    return NextResponse.json({ report, reportName });
  } catch (error: any) {
    console.error('Spy fulfill error:', error);
    return NextResponse.json(
      { error: 'Failed to generate competitor report' },
      { status: 500 }
    );
  }
}
