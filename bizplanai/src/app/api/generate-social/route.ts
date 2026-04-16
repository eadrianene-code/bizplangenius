import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // Simple auth check - require a secret key in the header
  const authKey = req.headers.get('x-tools-key');
  if (authKey !== process.env.TOOLS_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { input, inputType } = await req.json();

    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const contextInstruction = inputType === 'blog'
      ? `The following is a blog post from BizPlan Genius (bizplangenius.com), an AI-powered business plan generator and competitor research tool. Create social media posts that promote this content and drive traffic back to the blog.`
      : inputType === 'product'
      ? `The following is a product update or announcement from BizPlan Genius (bizplangenius.com), an AI-powered business plan generator and competitor research tool. Create social media posts that promote this update.`
      : `The following is a topic related to business planning, competitor research, or entrepreneurship. Create social media posts for BizPlan Genius (bizplangenius.com), an AI-powered business plan generator and competitor research tool.`;

    const prompt = `${contextInstruction}

INPUT:
${input}

Generate social media posts for ALL 4 platforms below. Each post should have a different angle/hook - don't just reformat the same text.

Return a JSON object with this exact structure:
{
  "twitter": {
    "text": "The tweet text (max 280 characters, include 2-3 relevant hashtags)",
    "hook": "One sentence explaining the angle used"
  },
  "linkedin": {
    "text": "LinkedIn post (300-600 characters, professional tone, storytelling angle, end with a question or CTA)",
    "hook": "One sentence explaining the angle used"
  },
  "instagram": {
    "caption": "Instagram caption (engaging, include relevant hashtags at the end, 200-400 characters)",
    "carouselIdea": "Brief description of a carousel or image idea that would go with this post",
    "hook": "One sentence explaining the angle used"
  },
  "facebook": {
    "text": "Facebook post (conversational, question-driven, 200-400 characters)",
    "hook": "One sentence explaining the angle used"
  }
}

IMPORTANT: Only return valid JSON. No markdown, no code blocks. Make posts engaging, not salesy. Lead with value, mention BizPlan Genius naturally.`;

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

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Social generation error:', error);
    return NextResponse.json({ error: 'Failed to generate posts' }, { status: 500 });
  }
}
