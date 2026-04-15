import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { idea, targetCustomer, email } = await req.json();

    if (!idea || !email || !email.includes('@')) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save email
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'collected-emails.json');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    let emails: Array<{ email: string; source: string; timestamp: string }> = [];
    if (fs.existsSync(filePath)) emails = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!emails.some(e => e.email.toLowerCase() === email.toLowerCase())) {
      emails.push({ email: email.toLowerCase().trim(), source: 'validate_idea', timestamp: new Date().toISOString() });
      fs.writeFileSync(filePath, JSON.stringify(emails, null, 2));
    }

    const prompt = `You are a startup advisor and market researcher. Validate the following business idea using real market data from the web.

BUSINESS IDEA: ${idea}
TARGET CUSTOMER: ${targetCustomer || 'Not specified'}

Research this idea thoroughly and return a JSON object with this structure:
{
  "ideaSummary": "One sentence summary of the idea",
  "overallScore": 7,
  "verdict": "Promising / Needs Work / Risky / Strong",
  "categories": [
    {
      "name": "Market Demand",
      "score": 8,
      "analysis": "2-3 sentences with real data about whether people want this",
      "evidence": "Specific data point or trend from the web"
    },
    {
      "name": "Competition Level",
      "score": 6,
      "analysis": "2-3 sentences about existing competitors",
      "evidence": "Name 2-3 real competitors found"
    },
    {
      "name": "Revenue Potential",
      "score": 7,
      "analysis": "2-3 sentences about how this could make money",
      "evidence": "Real pricing data or market size"
    },
    {
      "name": "Barrier to Entry",
      "score": 5,
      "analysis": "2-3 sentences about how hard it is to start",
      "evidence": "Specific requirements, costs, or regulations"
    },
    {
      "name": "Timing",
      "score": 8,
      "analysis": "2-3 sentences about whether the timing is right",
      "evidence": "Trends, growth data, or market shifts"
    }
  ],
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "risks": ["Risk 1", "Risk 2", "Risk 3"],
  "nextSteps": ["Actionable step 1", "Actionable step 2", "Actionable step 3"],
  "similarSuccessStory": "One sentence about a similar business that succeeded and how"
}

SCORING: 1-10 scale. Be honest and data-driven, not overly positive.
IMPORTANT: Use real market data from the web. Return ONLY valid JSON.`;

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
      if (jsonMatch) result = JSON.parse(jsonMatch[0]);
      else throw new Error('Failed to parse response');
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Validate idea error:', error);
    return NextResponse.json({ error: 'Failed to validate idea' }, { status: 500 });
  }
}
