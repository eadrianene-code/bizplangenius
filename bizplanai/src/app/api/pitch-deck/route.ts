import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { sessionId, planSessionId } = await req.json();

    if (!sessionId || !planSessionId) {
      return NextResponse.json({ error: 'Missing required session IDs' }, { status: 400 });
    }

    const stripe = getStripe();

    // Verify payment
    let deckSession;
    try {
      deckSession = await stripe.checkout.sessions.retrieve(sessionId);
      if (deckSession.payment_status !== 'paid') {
        return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
    }

    // Get plan data
    let planData;
    try {
      const planSession = await stripe.checkout.sessions.retrieve(planSessionId);
      planData = planSession.metadata || {};
    } catch {
      return NextResponse.json({ error: 'Invalid plan session' }, { status: 400 });
    }

    const businessName = planData.businessName || 'My Business';
    const industry = planData.industry || '';
    const description = planData.description || '';
    const targetMarket = planData.targetMarket || '';
    const revenueModel = planData.revenueModel || '';
    const location = planData.location || '';
    const investment = planData.investment || '';

    const prompt = `You are an expert startup pitch deck creator who has helped raise millions in funding. Create a complete investor pitch deck for the following business.

BUSINESS DETAILS:
- Business Name: ${businessName}
- Industry: ${industry}
- Description: ${description}
- Target Market: ${targetMarket}
- Revenue Model: ${revenueModel}
- Location: ${location}
- Startup Budget: ${investment}

Generate a pitch deck with exactly 12 slides. Return a JSON object with this structure:
{
  "title": "Business Name - Pitch Deck",
  "tagline": "One compelling sentence",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide Title",
      "type": "cover|problem|solution|market|product|business_model|traction|competition|team|financials|ask|closing",
      "content": "Main text content for this slide (2-4 sentences)",
      "bullets": ["Key point 1", "Key point 2", "Key point 3"],
      "speakerNotes": "What to say when presenting this slide (2-3 sentences)"
    }
  ]
}

SLIDE ORDER:
1. Cover slide (business name, tagline, logo placeholder)
2. Problem (what pain point exists)
3. Solution (how this business solves it)
4. Market Opportunity (TAM, SAM, SOM with real numbers)
5. Product/Service (what it looks like, how it works)
6. Business Model (how it makes money, pricing)
7. Traction/Milestones (what has been achieved or planned)
8. Competition (competitive landscape, why this wins)
9. Team (founder background, key roles needed)
10. Financial Projections (3-year revenue, costs, profit)
11. The Ask (how much funding, what it will be used for)
12. Closing (contact info, call to action)

IMPORTANT:
- Use real, researched market data where possible
- Make financial projections realistic for the industry
- Each slide should have 3-5 bullet points
- Speaker notes should be conversational and persuasive
- Return ONLY valid JSON, no markdown or code blocks`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    return NextResponse.json({ deck: result, businessName });
  } catch (error: any) {
    console.error('Pitch deck generation error:', error);
    return NextResponse.json({ error: 'Failed to generate pitch deck' }, { status: 500 });
  }
}
