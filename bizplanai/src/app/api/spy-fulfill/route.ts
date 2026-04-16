import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { sendSpyDeliveryEmail } from '@/lib/email';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const maxDuration = 300;

/* ------------------------------------------------------------------ */
/*  RETRY HELPER (Gemini 503 "high demand" is common)                  */
/* ------------------------------------------------------------------ */

async function geminiWithRetry(
  params: { model: string; contents: string; config: Record<string, any> },
  maxRetries = 3,
  baseDelay = 3000,
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await ai.models.generateContent(params);
      return result.text || '';
    } catch (err: any) {
      const is503 = err?.message?.includes('503') || err?.message?.includes('UNAVAILABLE') || err?.message?.includes('high demand');
      const is429 = err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED');
      if ((is503 || is429) && attempt < maxRetries) {
        const delay = baseDelay * attempt;
        console.log(`Gemini attempt ${attempt} failed (${is503 ? '503' : '429'}), retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Gemini max retries exceeded');
}

/* ------------------------------------------------------------------ */
/*  JSON SCHEMA                                                        */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  STEP 1 PROMPT  -  Deep research (free-form text output)            */
/* ------------------------------------------------------------------ */

function buildResearchPrompt(meta: Record<string, string>): string {
  const isCompany = meta.mode === 'company';

  const locationContext = meta.city || meta.country
    ? `\nGeographic Focus: ${[meta.city, meta.country].filter(Boolean).join(', ')}. Prioritize competitors and market data relevant to this location.`
    : '';

  const targetContext = isCompany
    ? `Company: "${meta.companyName}"${meta.companyUrl ? ` (Website: ${meta.companyUrl})` : ''}`
    : `Market/Industry: "${meta.industryDescription}"\nCategory: ${meta.industry}`;

  return `You are SpyMaster, an elite competitive intelligence analyst hired by a Fortune 500 strategy team. Your reputation depends on DEPTH, ACCURACY, and RUTHLESS HONESTY.

TARGET:
${targetContext}${locationContext}

RESEARCH MANDATE (be thorough, take your time):

1. COMPETITOR IDENTIFICATION (10-15 competitors)
   - Find Direct competitors (same product/service, same customer)
   - Find Indirect competitors (different approach, same problem)
   - Find Emerging/stealth competitors (startups, new entrants, adjacent players moving in)
   - For EACH competitor, gather: official website URL, founding year, team size, funding raised, pricing tiers

2. PRICING DEEP-DIVE
   - Visit each competitor's pricing page and record EXACT prices and tier names
   - Note free tiers, trial periods, enterprise pricing
   - Identify pricing model (per seat, usage-based, flat, freemium)
   - If pricing is not public, note that explicitly

3. CUSTOMER SENTIMENT & REVIEWS (CRITICAL - DO THIS FOR EVERY SINGLE COMPETITOR)
   - THIS IS THE MOST IMPORTANT SECTION. Do NOT skip any competitor.
   - For EVERY competitor (not just the top 3), search G2, Capterra, Trustpilot, Reddit, Twitter/X, ProductHunt
   - Record specific star ratings where available (e.g., "4.2/5 on G2 from 1,200 reviews")
   - Find and quote NEGATIVE reviews for EACH competitor (exact complaints, not paraphrases)
   - If you cannot find reviews for a specific competitor, search "[competitor name] reviews" and "[competitor name] complaints" and "[competitor name] reddit"
   - NEVER write "Data not available" for customer sentiment. At minimum, describe what users say about it based on any available source
   - Identify recurring pain points across multiple review sites

4. WEAKNESS & VULNERABILITY ANALYSIS (MUST COVER ALL COMPETITORS)
   - For EVERY competitor (not just the top ones), identify 3-8 SPECIFIC weaknesses with evidence
   - Even for smaller/newer competitors, find weaknesses: limited features, small team, lack of integrations, no free tier, etc.
   - Find feature gaps (things customers ask for that don't exist)
   - Find UX complaints (onboarding friction, confusing UI, slow performance)
   - Find support complaints (slow response, unhelpful, no live chat)
   - Find pricing complaints (too expensive, confusing tiers, hidden fees)
   - Identify the SINGLE BIGGEST vulnerability for EACH competitor (not just top ones)

5. MARKET OVERVIEW
   - Total addressable market size with dollar figures and sources
   - Growth rate and trajectory
   - Key trends shaping the market in 2024-2025
   - Regulatory or compliance factors
   - Technology shifts affecting the space

6. OPPORTUNITY ENGINEERING
   - Based on all weaknesses and gaps found, identify 5-8 concrete opportunities
   - For each opportunity: what gap exists, what evidence supports it, and a 3-step exploitation plan
   - Rate each by impact (High/Medium/Low) and difficulty (Easy/Medium/Hard)

7. STRATEGIC POSITIONING
   - Map competitors on Price vs. Quality/Features axes
   - Identify underserved quadrants and positioning gaps
   - Recommend specific positioning angles

Write your complete findings as a detailed research brief. Include ALL data points, URLs, review quotes, and specific numbers. Do NOT output JSON. Write in clear sections with headers. Be EXHAUSTIVE.`;
}

/* ------------------------------------------------------------------ */
/*  STEP 2 PROMPT  -  Structure into JSON                              */
/* ------------------------------------------------------------------ */

function buildStructurePrompt(researchText: string, meta: Record<string, string>): string {
  const jsonSchema = buildJsonSchema(meta.mode || 'company', meta);

  return `You are a data structuring specialist. Below is a comprehensive competitive intelligence research brief. Your job is to convert ALL of the findings into a strictly valid JSON object matching the schema provided.

RULES:
- Output ONLY valid JSON. No markdown, no explanation, no text before or after.
- Include ALL competitors found in the research (aim for 10-15).
- Preserve SPECIFIC data: exact prices, exact URLs, exact review ratings, exact quotes from reviews.
- Do NOT summarize or water down the weaknesses. Keep them ruthless and evidence-based.
- For the executiveSummary, write 3-4 compelling paragraphs highlighting the top 3 opportunities.
- For opportunityEngineering, include 5-8 opportunities with detailed exploitation plans.
- For tacticalRoadmap, create specific weekly/monthly action items.
- For SWOT, include reasoning for every single point.
- Categorize each competitor as "Direct", "Indirect", or "Emerging".
- If any data point is missing from the research, use "Data not available" instead of making something up.

RESEARCH BRIEF:
---
${researchText}
---

OUTPUT JSON SCHEMA:
${jsonSchema}

Output the JSON now:`;
}

/* ------------------------------------------------------------------ */
/*  MAIN HANDLER                                                       */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
    }

    const meta = session.metadata || {};

    const startTime = Date.now();
    const TOTAL_BUDGET_MS = 280_000; // 280s safety margin (300s max)
    const STEP2_RESERVE_MS = 150_000; // Reserve 2.5 min for Step 2
    const MAX_RESEARCH_CHARS = 50_000; // Cap research to keep Step 2 fast

    /* ---- STEP 1: Deep research (Gemini + Google Search grounding) ---- */
    console.log('Spy Step 1: Starting deep research with Gemini + Google Search...');
    console.log('Spy meta:', JSON.stringify({ mode: meta.mode, companyName: meta.companyName, industry: meta.industry }));
    const researchPrompt = buildResearchPrompt(meta);

    let researchText = '';

    // PRIMARY: Gemini with Google Search grounding (real-time web data)
    // Cap output tokens to keep response reasonable and leave time for Step 2
    try {
      researchText = await geminiWithRetry({
        model: 'gemini-2.5-flash',
        contents: researchPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.3,
          topP: 0.95,
          maxOutputTokens: 16384,
        },
      }, 2, 5000);
      console.log('Step 1 (Gemini) complete. Research length:', researchText.length);
      if (researchText.length > 200) {
        console.log('Research first 200 chars:', researchText.substring(0, 200));
      }
    } catch (geminiError: any) {
      console.warn('Gemini Step 1 failed:', geminiError.message?.substring(0, 300));
    }

    // FALLBACK: OpenAI if Gemini fails or returns too little
    if (!researchText || researchText.length < 200) {
      console.log('Gemini produced insufficient data. Falling back to OpenAI...');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const modelsToTry = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'];

      for (const model of modelsToTry) {
        if (researchText && researchText.length > 200) break;
        try {
          console.log(`Step 1 fallback: Trying OpenAI ${model}...`);
          const openaiResponse = await openai.chat.completions.create({
            model,
            messages: [
              {
                role: 'system',
                content: 'You are SpyMaster, an elite competitive intelligence analyst. Provide real company names, real URLs, real pricing data, and real review sentiments. Be exhaustive and specific.',
              },
              { role: 'user', content: researchPrompt },
            ],
            temperature: 0.3,
            max_tokens: 16000,
          });
          researchText = openaiResponse.choices[0].message.content || '';
          console.log(`Step 1 fallback (OpenAI ${model}) complete. Length:`, researchText.length);
        } catch (modelError: any) {
          console.warn(`OpenAI ${model} failed:`, modelError.message?.substring(0, 200));
        }
      }
    }

    if (!researchText || researchText.length < 100) {
      throw new Error(`Research produced insufficient data (${researchText.length} chars)`);
    }

    // Cap research to prevent Step 2 from choking on massive input
    if (researchText.length > MAX_RESEARCH_CHARS) {
      console.log(`Trimming research from ${researchText.length} to ${MAX_RESEARCH_CHARS} chars`);
      researchText = researchText.substring(0, MAX_RESEARCH_CHARS);
    }

    const step1Elapsed = Date.now() - startTime;
    console.log(`Step 1 SUCCESS. Research: ${researchText.length} chars. Elapsed: ${Math.round(step1Elapsed / 1000)}s`);

    /* ---- STEP 2: Structure research into JSON ---- */
    const timeLeft = TOTAL_BUDGET_MS - step1Elapsed;
    console.log(`Spy Step 2: Structuring into JSON. Time remaining: ${Math.round(timeLeft / 1000)}s`);

    const structurePrompt = buildStructurePrompt(researchText, meta);
    let reportText = '';

    // Choose Step 2 strategy based on remaining time
    // If we have enough time, try Gemini first (better quality), then OpenAI fallback
    // If time is tight, go straight to OpenAI (faster)
    const useGeminiStep2 = timeLeft > STEP2_RESERVE_MS;

    if (useGeminiStep2) {
      console.log('Step 2: Using Gemini (enough time budget)');
      try {
        reportText = await geminiWithRetry({
          model: 'gemini-2.5-flash',
          contents: structurePrompt,
          config: {
            temperature: 0.1,
            topP: 0.9,
            maxOutputTokens: 32768,
          },
        }, 1, 5000); // Only 1 retry to save time
        console.log('Step 2 (Gemini) complete. JSON length:', reportText.length);
      } catch (geminiError: any) {
        console.warn('Gemini Step 2 failed:', geminiError.message?.substring(0, 300));
      }
    } else {
      console.log(`Step 2: Skipping Gemini (only ${Math.round(timeLeft / 1000)}s left), going straight to OpenAI`);
    }

    // FALLBACK: OpenAI if Gemini failed or was skipped
    if (!reportText || reportText.length < 500) {
      console.log('Step 2: Falling back to OpenAI...');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const modelsToTry = ['gpt-4o', 'gpt-4o-mini'];

      for (const model of modelsToTry) {
        if (reportText && reportText.length > 500) break;
        try {
          console.log(`Step 2 fallback: Trying OpenAI ${model}...`);
          const openaiResponse = await openai.chat.completions.create({
            model,
            messages: [
              {
                role: 'system',
                content: 'Convert the research brief into strictly valid JSON matching the provided schema. Output ONLY valid JSON with no markdown fences, no explanation, no text before or after.',
              },
              { role: 'user', content: structurePrompt },
            ],
            temperature: 0.1,
            max_tokens: 16384,
          });
          reportText = openaiResponse.choices[0].message.content || '';
          console.log(`Step 2 fallback (OpenAI ${model}) complete. Length:`, reportText.length);
        } catch (modelError: any) {
          console.warn(`OpenAI ${model} Step 2 failed:`, modelError.message?.substring(0, 200));
        }
      }
    }

    if (!reportText || reportText.length < 500) {
      throw new Error(`JSON structuring failed. Output too short (${reportText.length} chars)`);
    }

    console.log(`Step 2 SUCCESS. JSON: ${reportText.length} chars. Total elapsed: ${Math.round((Date.now() - startTime) / 1000)}s`);

    /* ---- Parse JSON ---- */
    let report;
    const rawText = reportText.trim();

    // Strategy 1: Direct parse
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
        console.error('Failed to parse spy report JSON. Raw (first 2000 chars):', rawText.substring(0, 2000));
        throw new Error('Failed to parse AI response into valid JSON');
      }
    }

    const reportName = meta.mode === 'company'
      ? meta.companyName
      : meta.industry;

    // Add metadata
    report.generatedAt = new Date().toISOString();
    report.disclaimer = 'This report reflects publicly available information gathered via real-time web research. We recommend verifying pricing and company details directly on competitor websites before making strategic decisions.';

    console.log('Spy report generated successfully for:', reportName);

    // Send delivery confirmation email (must await or Vercel kills the promise)
    const customerEmail = meta.email || session.customer_email || '';
    console.log('Attempting email delivery to:', customerEmail, 'for:', reportName);
    if (customerEmail && reportName) {
      try {
        await sendSpyDeliveryEmail({
          to: customerEmail,
          reportName,
          mode: (meta.mode === 'company' ? 'company' : 'industry') as 'company' | 'industry',
        });
        console.log('Email delivery completed for:', customerEmail);
      } catch (err) {
        console.error('Spy email send failed:', err);
      }
    } else {
      console.log('Skipping email: no email address or report name');
    }

    return NextResponse.json({ report, reportName });
  } catch (error: any) {
    console.error('Spy fulfill error:', error);
    return NextResponse.json(
      { error: 'Failed to generate competitor report' },
      { status: 500 }
    );
  }
}
