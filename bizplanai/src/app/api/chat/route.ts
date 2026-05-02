import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const maxDuration = 30;

const SYSTEM_CONTEXT = `You are the helpful assistant for BizPlan Genius (bizplangenius.com), an AI-powered business launch platform. Be concise (2-4 sentences max).

PRODUCTS:
- Free Competitor Check ($0): Find 3 real competitors instantly at /free-competitor-check
- Free Name Generator ($0): 10 business name ideas at /business-name-generator
- Free Cost Calculator ($0): Startup cost estimate at /startup-cost-calculator
- Competitor Spy Report ($97): 10-15 competitors analyzed with SWOT at /spy
- Investor Email Templates ($19): 10 fundraising emails at /investor-emails
- Business Plan Starter ($97): 7-section plan with real data at /generate
- Business Plan Pro ($147): Full plan + operations + risk + guarantee at /generate
- Social Media Pack ($29): 30 days of posts at /social-pack
- Logo & Brand Kit ($29): Logo, colors, voice at /brand-kit
- Pitch Deck ($39): 12 investor slides at /pitch-deck
- Website Builder ($99-$199): Custom website at /build-website
- Bundles from $197 at /bundles
- Subscriptions: Competitor Monitoring $15/mo, Social Pack $19/mo, Hosting $19/mo at /monitoring

KEY FACTS:
- All one-time products are single payment, no subscription
- Uses Google Gemini AI with live web search for real data
- Plans generated in 3-8 minutes
- Pro plan has money-back guarantee
- Real competitor data, not hallucinated

RULES:
- Always suggest the most relevant product for their question
- If unsure what they need, recommend the Free Competitor Check
- Include the page URL when recommending a product
- Be friendly, helpful, not pushy
- If asked about refunds: Pro plan has money-back guarantee, email support@bizplangenius.com
- Keep responses SHORT (2-4 sentences)`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_CONTEXT }] },
        { role: 'model', parts: [{ text: 'Understood. I\'ll be the helpful BizPlan Genius assistant.' }] },
        { role: 'user', parts: [{ text: message }] },
      ],
    });

    const reply = response.text || 'Sorry, I couldn\'t process that. Try asking about our products or pricing!';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ reply: 'Sorry, something went wrong. For help, email support@bizplangenius.com' });
  }
}
