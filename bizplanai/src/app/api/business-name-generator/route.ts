import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { description, industry, style, email } = await req.json();

    if (!description || !industry || !email || !email.includes('@')) {
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
    if (!emails.some(e => e.email.toLowerCase() === email.toLowerCase())) {
      emails.push({ email: email.toLowerCase().trim(), source: 'business_name_generator', timestamp: new Date().toISOString() });
      fs.writeFileSync(filePath, JSON.stringify(emails, null, 2));
    }

    const stylePrompt = style === 'professional' ? 'professional, corporate, trustworthy'
      : style === 'creative' ? 'creative, unique, memorable, playful'
      : style === 'modern' ? 'modern, tech-forward, sleek, minimal'
      : style === 'classic' ? 'classic, timeless, established, elegant'
      : 'varied mix of styles';

    const prompt = `You are a branding expert. Generate 10 creative business name ideas.

BUSINESS: ${description}
INDUSTRY: ${industry}
STYLE: ${stylePrompt}

Return a JSON object:
{
  "names": [
    {
      "name": "Business Name",
      "tagline": "A short tagline for this name",
      "reasoning": "Why this name works (1 sentence)",
      "domainSuggestion": "suggesteddomain.com",
      "style": "professional|creative|modern|classic"
    }
  ]
}

RULES:
- Names should be 1-3 words max
- Check that names are easy to spell and pronounce
- Domain suggestions should be realistic (.com, .io, .co)
- Each name should feel distinct from the others
- Mix styles slightly even within the chosen preference
- Return ONLY valid JSON`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
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
    console.error('Name generator error:', error);
    return NextResponse.json({ error: 'Failed to generate names' }, { status: 500 });
  }
}
