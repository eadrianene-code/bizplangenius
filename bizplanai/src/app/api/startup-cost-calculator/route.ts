import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { businessType, industry, location, email } = await req.json();

    if (!businessType || !industry || !email || !email.includes('@')) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save email
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'collected-emails.json');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    let emails: Array<{ email: string; source: string; timestamp: string }> = [];
    if (fs.existsSync(filePath)) emails = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!emails.some(e => e.email.toLowerCase() === email.toLowerCase())) {
      emails.push({ email: email.toLowerCase().trim(), source: 'startup_cost_calculator', timestamp: new Date().toISOString() });
      fs.writeFileSync(filePath, JSON.stringify(emails, null, 2));
    }

    const prompt = `You are a startup financial advisor. Estimate the startup costs for this business using real market data.

BUSINESS: ${businessType}
INDUSTRY: ${industry}
LOCATION: ${location || 'United States'}

Return a JSON object:
{
  "businessType": "${businessType}",
  "totalLow": 5000,
  "totalHigh": 15000,
  "categories": [
    {
      "name": "Category Name",
      "lowEstimate": 500,
      "highEstimate": 2000,
      "items": [
        { "name": "Item name", "low": 100, "high": 500, "note": "Brief explanation" }
      ]
    }
  ],
  "monthlyOperating": {
    "low": 2000,
    "high": 5000,
    "items": [
      { "name": "Rent", "low": 500, "high": 2000 },
      { "name": "Utilities", "low": 100, "high": 300 }
    ]
  },
  "breakEvenMonths": { "optimistic": 6, "realistic": 12, "conservative": 18 },
  "tip": "One actionable tip for reducing startup costs in this industry"
}

CATEGORIES TO INCLUDE:
- Legal & Registration (LLC, permits, licenses)
- Equipment & Supplies
- Location / Office (rent deposit, build-out)
- Technology (website, software, hardware)
- Marketing & Branding (initial)
- Insurance
- Working Capital (first 3 months operating buffer)

Use REAL market rates for the location. Return ONLY valid JSON.`;

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
    console.error('Startup cost calculator error:', error);
    return NextResponse.json({ error: 'Failed to calculate costs' }, { status: 500 });
  }
}
