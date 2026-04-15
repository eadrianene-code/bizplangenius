import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getBusinessDetailsFromSession } from '@/lib/product-utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { businessName, domainSuggestion, hostingChoice } = await req.json();

    if (!businessName) return NextResponse.json({ error: 'Business name required' }, { status: 400 });

    const prompt = `You are a tech support expert who explains things to complete beginners. Generate a step-by-step domain and hosting setup guide.

BUSINESS NAME: ${businessName}
PREFERRED DOMAIN: ${domainSuggestion || businessName.toLowerCase().replace(/[^a-z0-9]+/g, '') + '.com'}
HOSTING PREFERENCE: ${hostingChoice || 'Not decided yet'}

Return a JSON object:
{
  "businessName": "${businessName}",
  "domainSuggestions": [
    { "domain": "example.com", "available": "likely", "registrar": "Namecheap", "yearlyPrice": "$9-12" },
    { "domain": "example.io", "available": "likely", "registrar": "Namecheap", "yearlyPrice": "$25-35" },
    { "domain": "example.co", "available": "likely", "registrar": "Namecheap", "yearlyPrice": "$12-15" }
  ],
  "recommendedDomain": "example.com",
  "buyDomainSteps": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "instructions": "Detailed instruction written for a complete beginner. Use simple words. Tell them exactly what to click, what to type, what to look for on the screen.",
      "tip": "A helpful tip or warning"
    }
  ],
  "connectDomainSteps": {
    "vercel": [
      { "stepNumber": 1, "title": "Step title", "instructions": "Beginner-friendly instructions", "tip": "Tip" }
    ],
    "netlify": [
      { "stepNumber": 1, "title": "Step title", "instructions": "Beginner-friendly instructions", "tip": "Tip" }
    ],
    "cloudflarePages": [
      { "stepNumber": 1, "title": "Step title", "instructions": "Beginner-friendly instructions", "tip": "Tip" }
    ],
    "ownHosting": [
      { "stepNumber": 1, "title": "Step title", "instructions": "Beginner-friendly instructions for uploading HTML files", "tip": "Tip" }
    ]
  },
  "setupEmailSteps": [
    { "stepNumber": 1, "title": "Step title", "instructions": "How to set up name@yourdomain.com using Google Workspace or Zoho Mail free tier", "tip": "Tip" }
  ],
  "sslSteps": [
    { "stepNumber": 1, "title": "Step title", "instructions": "How to ensure your site has HTTPS (most hosts do this automatically)", "tip": "Tip" }
  ],
  "totalEstimatedCost": "$10-30/year for domain, $0-20/month for hosting",
  "cheapestOption": "Cloudflare Pages (free hosting) + Namecheap domain ($9/year) = $9/year total"
}

RULES FOR WRITING INSTRUCTIONS:
- Write like you're explaining to someone who has NEVER done this before
- Never assume they know technical terms -- explain everything
- Use exact button names: "Click the blue button that says 'Add to Cart'"
- Tell them what they should see on the screen after each step
- Include "If something goes wrong" tips
- Mention exact prices
- For buying domain: use Namecheap as primary recommendation (cheapest, easiest)
- For hosting: recommend Vercel (free), Netlify (free), or Cloudflare Pages (free)
- For email: recommend Zoho Mail free tier (1 user free) or Google Workspace ($6/mo)
- Return ONLY valid JSON`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    let result;
    try { result = JSON.parse(response.text || ''); }
    catch { const m = (response.text || '').match(/\{[\s\S]*\}/); if (m) result = JSON.parse(m[0]); else throw new Error('Parse failed'); }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Domain guide error:', error);
    return NextResponse.json({ error: 'Failed to generate guide' }, { status: 500 });
  }
}
