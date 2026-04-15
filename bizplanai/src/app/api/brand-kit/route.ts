import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GoogleGenAI } from '@google/genai';
import { getBusinessDetailsFromSession } from '@/lib/product-utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' });
}

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { sessionId, planSessionId } = await req.json();
    if (!sessionId) return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });

    const stripe = getStripe();
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid') return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
    } catch { return NextResponse.json({ error: 'Invalid session' }, { status: 400 }); }

    const biz = await getBusinessDetailsFromSession(sessionId, planSessionId);
    const businessName = biz.businessName;
    const industry = biz.industry;
    const description = biz.description;
    const targetMarket = biz.targetMarket;

    const prompt = `You are a professional brand strategist and designer. Create a complete brand identity kit for the following business.

BUSINESS DETAILS:
- Business Name: ${businessName}
- Industry: ${industry}
- Description: ${description}
- Target Market: ${targetMarket}

Return a JSON object with this exact structure:
{
  "businessName": "${businessName}",
  "tagline": "A compelling brand tagline",
  "brandStory": "2-3 sentence brand story/mission",
  "logoConceptss": [
    {
      "name": "Concept 1 Name",
      "description": "Detailed description of the logo concept",
      "style": "minimalist|modern|classic|playful|bold|elegant",
      "symbolism": "What the design elements represent",
      "cssPreview": {
        "fontFamily": "e.g., Arial, sans-serif",
        "fontWeight": "bold",
        "fontSize": "48px",
        "color": "#hex",
        "letterSpacing": "e.g., 2px",
        "textTransform": "uppercase or none",
        "icon": "A single emoji or unicode symbol that represents the logo concept"
      }
    }
  ],
  "colorPalette": {
    "primary": { "hex": "#hex", "name": "Color Name", "usage": "When to use this color" },
    "secondary": { "hex": "#hex", "name": "Color Name", "usage": "When to use this color" },
    "accent": { "hex": "#hex", "name": "Color Name", "usage": "When to use this color" },
    "dark": { "hex": "#hex", "name": "Color Name", "usage": "Headings, text" },
    "light": { "hex": "#hex", "name": "Color Name", "usage": "Backgrounds" },
    "rationale": "Why these colors work for this brand"
  },
  "typography": {
    "headingFont": "Font name (Google Fonts compatible)",
    "bodyFont": "Font name (Google Fonts compatible)",
    "rationale": "Why these fonts work for this brand"
  },
  "brandVoice": {
    "tone": ["adjective1", "adjective2", "adjective3"],
    "doSay": ["Example phrase 1", "Example phrase 2", "Example phrase 3"],
    "dontSay": ["Avoid phrase 1", "Avoid phrase 2", "Avoid phrase 3"],
    "elevator_pitch": "30-second elevator pitch for the business"
  },
  "socialMediaGuidelines": {
    "profileBio": "Ready-to-use social media bio (160 chars)",
    "postingTone": "How to write social posts for this brand",
    "visualStyle": "What imagery style to use"
  }
}

Generate 3 logo concepts with different styles. Make the color palette specific to the industry and target market. Return ONLY valid JSON.`;

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

    return NextResponse.json({ kit: result, businessName });
  } catch (error: any) {
    console.error('Brand kit generation error:', error);
    return NextResponse.json({ error: 'Failed to generate brand kit' }, { status: 500 });
  }
}
