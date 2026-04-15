import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { businessIdea, industry, email } = await req.json();

    if (!businessIdea || !industry || !email || !email.includes('@')) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save email
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'collected-emails.json');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    let emails: Array<{ email: string; source: string; timestamp: string }> = [];
    if (fs.existsSync(filePath)) {
      emails = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    const exists = emails.some(e => e.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      emails.push({
        email: email.toLowerCase().trim(),
        source: 'free_competitor_check',
        timestamp: new Date().toISOString(),
      });
      fs.writeFileSync(filePath, JSON.stringify(emails, null, 2));
    }

    // Generate mini competitor report using Gemini with web search
    const prompt = `You are a competitive intelligence analyst. Find exactly 3 real competitors for this business idea. Use real, current data from the web.

BUSINESS: ${businessIdea}
INDUSTRY: ${industry}

Return a JSON object with this exact structure:
{
  "competitors": [
    {
      "name": "Company Name",
      "website": "https://example.com",
      "description": "One sentence about what they do",
      "strength": "Their biggest competitive advantage",
      "weakness": "Their biggest vulnerability you could exploit"
    }
  ],
  "marketInsight": "One paragraph about the competitive landscape and the biggest opportunity for a new entrant"
}

IMPORTANT: Only return valid JSON. No markdown, no code blocks, just the JSON object. Find REAL companies with real websites, not made-up examples.`;

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
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Free competitor check error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze competitors. Please try again.' },
      { status: 500 }
    );
  }
}
