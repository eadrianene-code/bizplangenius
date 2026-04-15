import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

export const maxDuration = 120;

interface WebsiteRequest {
  sessionId: string; // The website-checkout session ID (proof of payment)
  planSessionId: string; // The original business plan session ID (for data)
  websiteType: string;
  colorScheme: string;
  extraInstructions: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: WebsiteRequest = await req.json();
    const { sessionId, planSessionId, websiteType, colorScheme, extraInstructions } = body;

    if (!sessionId || !planSessionId) {
      return NextResponse.json({ error: 'Missing required session IDs' }, { status: 400 });
    }

    const stripe = getStripe();

    // Verify website payment
    let websiteSession;
    try {
      websiteSession = await stripe.checkout.sessions.retrieve(sessionId);
      if (websiteSession.payment_status !== 'paid') {
        return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid website session' }, { status: 400 });
    }

    // Get business plan data from the original session
    let planData;
    try {
      const planSession = await stripe.checkout.sessions.retrieve(planSessionId);
      planData = planSession.metadata || {};
    } catch {
      return NextResponse.json({ error: 'Invalid plan session' }, { status: 400 });
    }

    const businessName = planData.businessName || 'My Business';
    const industry = planData.industry || '';
    const description = planData.description || '';
    const targetMarket = planData.targetMarket || '';
    const revenueModel = planData.revenueModel || '';
    const location = planData.location || '';

    const colorInstructions = getColorInstructions(colorScheme);
    const typeInstructions = getTypeInstructions(websiteType);

    const prompt = `You are an expert web developer and designer. Generate a complete, production-ready, single-page website for the following business.

BUSINESS DETAILS:
- Business Name: ${businessName}
- Industry: ${industry}
- Description: ${description}
- Target Market: ${targetMarket}
- Revenue Model: ${revenueModel}
- Location: ${location}

WEBSITE TYPE: ${typeInstructions}

DESIGN REQUIREMENTS:
- Use Tailwind CSS via CDN (include <script src="https://cdn.tailwindcss.com"></script>)
- ${colorInstructions}
- Modern, clean, professional design
- Fully responsive (mobile-first)
- Smooth scroll behavior
- Include a favicon link (use a generic one)
- Include meta tags for SEO (title, description, og tags)

${extraInstructions ? `ADDITIONAL INSTRUCTIONS: ${extraInstructions}` : ''}

SECTIONS TO INCLUDE:
1. Navigation bar with business name and smooth-scroll links
2. Hero section with compelling headline, subheadline, and CTA button
3. Features/Services section (3-6 items based on the business)
4. About section with the business story
5. Pricing section (based on the revenue model)
6. Testimonials section (generate 3 realistic but clearly marked as example testimonials)
7. Contact section with a form (name, email, message) and business location
8. Footer with links and copyright

IMPORTANT RULES:
- Return ONLY the complete HTML document, starting with <!DOCTYPE html> and ending with </html>
- Do NOT wrap in markdown code blocks
- Do NOT include any explanation text before or after the HTML
- Make all content specific to this business, not generic placeholders
- Include realistic, industry-appropriate copy
- The contact form should have action="#" (placeholder)
- Add subtle animations using Tailwind (hover effects, transitions)
- Make it look like a $5,000 custom website`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let html = response.text || '';

    // Clean up: remove markdown code fences if present
    html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '').trim();

    // Ensure it starts with DOCTYPE
    if (!html.toLowerCase().startsWith('<!doctype')) {
      const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
      if (doctypeIndex > -1) {
        html = html.substring(doctypeIndex);
      }
    }

    // Store the generated website in the session metadata for later retrieval
    try {
      await stripe.checkout.sessions.update(sessionId, {
        metadata: {
          ...websiteSession.metadata,
          websiteGenerated: 'true',
          websiteType,
          colorScheme,
          businessName,
        },
      });
    } catch {
      // Non-critical, continue
    }

    return NextResponse.json({
      html,
      businessName,
      websiteType,
      colorScheme,
    });
  } catch (error: any) {
    console.error('Website generation error:', error);
    return NextResponse.json({ error: 'Failed to generate website. Please try again.' }, { status: 500 });
  }
}

function getColorInstructions(scheme: string): string {
  const schemes: Record<string, string> = {
    blue: 'Use a professional blue color scheme (primary: #2563eb, dark: #1e40af, light: #dbeafe). Clean and trustworthy.',
    green: 'Use a natural green color scheme (primary: #16a34a, dark: #15803d, light: #dcfce7). Fresh and organic.',
    purple: 'Use a creative purple color scheme (primary: #9333ea, dark: #7e22ce, light: #f3e8ff). Bold and innovative.',
    red: 'Use an energetic red/orange scheme (primary: #dc2626, dark: #b91c1c, light: #fee2e2). Passionate and dynamic.',
    dark: 'Use a dark/luxury theme (dark backgrounds #111827, white text, gold accents #d4af37). Premium and sophisticated.',
    minimal: 'Use a minimal black and white scheme with one subtle accent color. Clean typography-focused design.',
  };
  return schemes[scheme] || schemes.blue;
}

function getTypeInstructions(type: string): string {
  const types: Record<string, string> = {
    landing: 'Single-page landing/marketing website. Focus on converting visitors into customers. Strong CTAs throughout.',
    ecommerce: 'E-commerce style website. Include product showcase grid, add-to-cart buttons (non-functional), and a featured products section.',
    booking: 'Service booking website. Include a booking/appointment section with a date picker UI (visual only), service packages, and availability info.',
    portfolio: 'Portfolio/showcase website. Visual-heavy, gallery style. Showcase work examples and case studies.',
    restaurant: 'Restaurant/food business website. Include a menu section, hours, location map placeholder, and reservation CTA.',
    saas: 'SaaS product website. Include feature comparison, integration logos placeholder, dashboard screenshot placeholder, and pricing tiers.',
  };
  return types[type] || types.landing;
}
