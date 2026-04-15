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

    let emailSession;
    try {
      emailSession = await stripe.checkout.sessions.retrieve(sessionId);
      if (emailSession.payment_status !== 'paid') {
        return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
    }

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
    const investment = planData.investment || '';

    const prompt = `You are an expert startup fundraising advisor who has helped founders raise millions. Create investor outreach email templates for the following business.

BUSINESS DETAILS:
- Business Name: ${businessName}
- Industry: ${industry}
- Description: ${description}
- Target Market: ${targetMarket}
- Revenue Model: ${revenueModel}
- Startup Budget: ${investment}

Generate exactly 10 email templates. Return a JSON object:
{
  "businessName": "${businessName}",
  "emails": [
    {
      "id": 1,
      "type": "cold_outreach|warm_intro|follow_up|update|meeting_request",
      "name": "Template name (e.g., 'Cold Outreach - VC Partner')",
      "scenario": "When to use this email",
      "subject": "Email subject line",
      "body": "Full email body with [INVESTOR_NAME], [FUND_NAME], and [YOUR_NAME] placeholders",
      "tips": "1-2 sentence tip for using this template"
    }
  ]
}

INCLUDE THESE 10 TEMPLATES:
1. Cold outreach to a VC partner (formal)
2. Cold outreach to an angel investor (casual)
3. Warm intro request (asking a mutual connection)
4. Follow-up after no response (1 week later)
5. Follow-up after meeting/call
6. Monthly investor update email
7. Pitch deck share email
8. Meeting request with specific ask
9. Thank you after receiving investment
10. Rejection response (keep the door open)

RULES:
- Make each email specific to this business, not generic
- Keep emails concise (under 200 words each)
- Use proven fundraising email structures
- Include compelling hooks and data points
- Placeholders: [INVESTOR_NAME], [FUND_NAME], [YOUR_NAME], [COMPANY_ROLE]
- Return ONLY valid JSON`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
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

    return NextResponse.json({ pack: result, businessName });
  } catch (error: any) {
    console.error('Investor emails generation error:', error);
    return NextResponse.json({ error: 'Failed to generate emails' }, { status: 500 });
  }
}
