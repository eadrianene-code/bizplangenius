import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GoogleGenAI } from '@google/genai';
import { getBusinessDetailsFromSession } from '@/lib/product-utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' }); }

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

    const prompt = `You are an expert paid advertising copywriter. Generate ad copy for the following business across 3 platforms.

BUSINESS DETAILS:
- Business Name: ${biz.businessName}
- Industry: ${biz.industry}
- Description: ${biz.description}
- Target Market: ${biz.targetMarket}
- Revenue Model: ${biz.revenueModel}
- Location: ${biz.location}

Return a JSON object:
{
  "businessName": "${biz.businessName}",
  "googleAds": [
    {
      "campaignType": "Search|Display|Shopping",
      "headline1": "Max 30 chars",
      "headline2": "Max 30 chars",
      "headline3": "Max 30 chars",
      "description1": "Max 90 chars",
      "description2": "Max 90 chars",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "targetAudience": "Who this ad targets",
      "goal": "awareness|traffic|conversions"
    }
  ],
  "facebookAds": [
    {
      "adType": "image|carousel|video",
      "headline": "Short attention-grabbing headline",
      "primaryText": "The main ad copy (2-3 sentences, compelling, with CTA)",
      "description": "Link description text",
      "cta": "Learn More|Shop Now|Sign Up|Get Started|Book Now",
      "targetAudience": "Demographics and interests to target",
      "imageIdea": "Description of the ad image/creative"
    }
  ],
  "instagramAds": [
    {
      "adType": "feed|stories|reels",
      "caption": "Instagram ad caption with emojis and CTA",
      "hashtags": ["hashtag1", "hashtag2"],
      "imageIdea": "Description of the visual",
      "targetAudience": "Who to target"
    }
  ]
}

GENERATE:
- 5 Google Ads (3 Search, 1 Display, 1 Shopping/Performance Max)
- 5 Facebook Ads (mix of image, carousel, video concepts)
- 5 Instagram Ads (mix of feed, stories, reels)

RULES:
- Respect character limits for Google Ads
- Make copy compelling and action-oriented
- Include specific keywords for Google Ads
- Target audience should be specific (age, interests, behaviors)
- Each ad should have a different angle/hook
- Include clear CTAs
- Return ONLY valid JSON`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
      },
    });

    let result;
    try { result = JSON.parse(response.text || ''); }
    catch { const m = (response.text || '').match(/\{[\s\S]*\}/); if (m) result = JSON.parse(m[0]); else throw new Error('Parse failed'); }

    return NextResponse.json({ ads: result, businessName: biz.businessName });
  } catch (error: any) {
    console.error('Ad copy error:', error);
    return NextResponse.json({ error: 'Failed to generate ad copy' }, { status: 500 });
  }
}
