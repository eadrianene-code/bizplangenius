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

    const prompt = `You are a legal document specialist. Generate Terms of Service and Privacy Policy for the following business.

BUSINESS DETAILS:
- Business Name: ${biz.businessName}
- Industry: ${biz.industry}
- Description: ${biz.description}
- Target Market: ${biz.targetMarket}
- Location: ${biz.location}

Return a JSON object:
{
  "businessName": "${biz.businessName}",
  "termsOfService": {
    "title": "Terms of Service",
    "lastUpdated": "${new Date().toISOString().split('T')[0]}",
    "sections": [
      { "heading": "Section Title", "content": "Full section text..." }
    ]
  },
  "privacyPolicy": {
    "title": "Privacy Policy",
    "lastUpdated": "${new Date().toISOString().split('T')[0]}",
    "sections": [
      { "heading": "Section Title", "content": "Full section text..." }
    ]
  },
  "cookiePolicy": {
    "title": "Cookie Policy",
    "lastUpdated": "${new Date().toISOString().split('T')[0]}",
    "sections": [
      { "heading": "Section Title", "content": "Full section text..." }
    ]
  }
}

TERMS OF SERVICE SECTIONS:
1. Agreement to Terms
2. Description of Services
3. User Accounts and Registration
4. Payment Terms (if applicable based on revenue model)
5. Intellectual Property
6. User Content and Conduct
7. Disclaimers and Limitation of Liability
8. Termination
9. Governing Law (use business location)
10. Contact Information

PRIVACY POLICY SECTIONS (GDPR + CCPA compliant):
1. Information We Collect
2. How We Use Your Information
3. How We Share Your Information
4. Data Retention
5. Your Rights (GDPR: access, deletion, portability; CCPA: know, delete, opt-out)
6. Cookies and Tracking
7. Children's Privacy
8. Security Measures
9. Changes to This Policy
10. Contact Information

COOKIE POLICY SECTIONS:
1. What Are Cookies
2. Types of Cookies We Use (necessary, analytics, marketing)
3. How to Manage Cookies
4. Third-Party Cookies
5. Contact Information

RULES:
- Use the actual business name throughout
- Make industry-specific where relevant
- Include standard legal protections
- Use clear, readable language (not excessive legalese)
- Include placeholder [YOUR_EMAIL] and [YOUR_ADDRESS] where contact info needed
- Return ONLY valid JSON`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    let result;
    try { result = JSON.parse(response.text || ''); }
    catch { const m = (response.text || '').match(/\{[\s\S]*\}/); if (m) result = JSON.parse(m[0]); else throw new Error('Parse failed'); }

    return NextResponse.json({ legal: result, businessName: biz.businessName });
  } catch (error: any) {
    console.error('Legal pages error:', error);
    return NextResponse.json({ error: 'Failed to generate legal pages' }, { status: 500 });
  }
}
