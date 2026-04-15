import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GoogleGenAI } from '@google/genai';
import { verifyProductAccess } from '@/lib/product-utils';

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
    if (!sessionId) return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });

    const { verified, businessDetails: biz } = await verifyProductAccess(sessionId, 'social_media_pack', planSessionId);
    if (!verified) return NextResponse.json({ error: 'Payment not completed. Purchase a social pack or a bundle that includes it.' }, { status: 402 });
    const businessName = biz.businessName;
    const industry = biz.industry;
    const description = biz.description;
    const targetMarket = biz.targetMarket;

    const prompt = `You are a social media marketing expert. Generate a 30-day social media content calendar for the following business.

BUSINESS DETAILS:
- Business Name: ${businessName}
- Industry: ${industry}
- Description: ${description}
- Target Market: ${targetMarket}

Generate exactly 30 posts (one per day). Each post should be for a different platform in rotation: Twitter, LinkedIn, Instagram, Facebook.

Return a JSON object with this exact structure:
{
  "businessName": "${businessName}",
  "posts": [
    {
      "day": 1,
      "platform": "twitter",
      "type": "educational|promotional|engagement|story|tip|question|behind_the_scenes|testimonial",
      "content": "The full post text ready to copy and paste",
      "hashtags": ["hashtag1", "hashtag2"],
      "imageIdea": "Brief description of an image or graphic to pair with this post",
      "bestTime": "e.g., Tuesday 9am EST"
    }
  ]
}

RULES:
- Mix post types: educational (40%), engagement/questions (25%), promotional (20%), storytelling (15%)
- Each post should be platform-appropriate (Twitter: short/punchy, LinkedIn: professional, Instagram: visual/caption, Facebook: conversational)
- Include relevant hashtags for each platform
- Suggest best posting times
- Make content specific to this business, not generic
- Never be overly salesy -- lead with value
- Include calls to action naturally
- Posts should build on each other to tell a brand story over 30 days
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
    console.error('Social pack generation error:', error);
    return NextResponse.json({ error: 'Failed to generate social pack' }, { status: 500 });
  }
}
