import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { businessType, industry, state, country, email } = await req.json();

    if (!businessType || !email || !email.includes('@')) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save email
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, 'collected-emails.json');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    let emails: any[] = [];
    if (fs.existsSync(filePath)) emails = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!emails.some(e => e.email === email.toLowerCase())) {
      emails.push({ email: email.toLowerCase().trim(), source: 'launch_checklist', timestamp: new Date().toISOString() });
      fs.writeFileSync(filePath, JSON.stringify(emails, null, 2));
    }

    const location = state && country ? `${state}, ${country}` : state || country || 'United States';

    const prompt = `You are a business startup advisor. Generate a personalized launch checklist for starting a business.

BUSINESS TYPE: ${businessType}
INDUSTRY: ${industry || 'General'}
LOCATION: ${location}

Return a JSON object:
{
  "businessType": "${businessType}",
  "location": "${location}",
  "totalSteps": 15,
  "estimatedTimeline": "4-8 weeks",
  "estimatedCost": "$500-$2,000",
  "phases": [
    {
      "name": "Phase Name",
      "timeline": "Week 1-2",
      "steps": [
        {
          "title": "Step title",
          "description": "What to do and why (2-3 sentences)",
          "estimatedCost": "$0-$100",
          "timeNeeded": "1-2 hours",
          "resources": ["Resource or link description"],
          "priority": "critical|important|optional"
        }
      ]
    }
  ]
}

PHASES TO INCLUDE:
1. Legal & Registration (Week 1-2):
   - Choose business structure (LLC, Sole Prop, Corp) with recommendation for this type
   - Register business name (DBA or LLC filing) with state-specific info
   - Get EIN from IRS
   - Required licenses and permits for this specific business type in this location
   - Business insurance requirements

2. Financial Setup (Week 2-3):
   - Open business bank account
   - Set up accounting (QuickBooks, Wave)
   - Set up payment processing (Stripe, Square, PayPal)
   - Understand tax obligations for this business type

3. Brand & Online Presence (Week 3-4):
   - Register domain name
   - Build website
   - Set up Google My Business (if local)
   - Create social media accounts
   - Design logo and brand identity

4. Operations (Week 4-6):
   - Set up business tools (email, CRM, project management)
   - Create contracts/terms of service
   - Set up inventory/supply chain (if applicable)
   - Hire first team members (if applicable)

5. Launch & Marketing (Week 6-8):
   - Create launch plan
   - Set up email marketing
   - Run first ad campaigns
   - Announce on social media
   - Track metrics and adjust

RULES:
- Make steps SPECIFIC to this business type and location
- Include real cost estimates for this location
- Include state-specific requirements (e.g., food handler permits for restaurants)
- 15-20 total steps across all phases
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

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Launch checklist error:', error);
    return NextResponse.json({ error: 'Failed to generate checklist' }, { status: 500 });
  }
}
