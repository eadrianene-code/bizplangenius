import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const maxDuration = 60; // Allow up to 60 seconds for generation

interface BusinessInput {
  businessName: string;
  industry: string;
  description: string;
  targetMarket: string;
  revenueModel: string;
  location: string;
  investment: string;
  competitors: string;
}

function buildPrompt(input: BusinessInput): string {
  return `You are a world-class business strategy consultant who creates comprehensive, investor-ready business plans. Generate a complete business plan for the following business.

BUSINESS DETAILS:
- Business Name: ${input.businessName}
- Industry: ${input.industry}
- Description: ${input.description}
- Target Market: ${input.targetMarket}
- Revenue Model: ${input.revenueModel}
- Location: ${input.location || 'Not specified'}
- Starting Budget: ${input.investment || 'Not specified'}
- Known Competitors: ${input.competitors || 'None listed — research and identify the top competitors'}

INSTRUCTIONS:
Create a thorough, professional business plan with the following sections. Use REAL industry data, realistic estimates, and specific numbers wherever possible. Do NOT use placeholder text or generic filler.

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
2. Identify 5-10 REAL competitors that exist in this space (research them)
3. All financial projections must be conservative and achievable
4. Include specific pricing comparisons with competitors
5. Output ONLY the JSON — no markdown, no code blocks, no extra text
6. Make the plan specific to THIS business — not generic advice`;
}

export async function POST(req: NextRequest) {
  try {
    const input: BusinessInput = await req.json();

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    });

    const prompt = buildPrompt(input);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse the JSON response
    let plan;
    try {
      plan = JSON.parse(text);
    } catch {
      // Try to extract JSON if wrapped in markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    return NextResponse.json({ plan });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate business plan. Please try again.' },
      { status: 500 }
    );
  }
}
