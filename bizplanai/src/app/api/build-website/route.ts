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
  sessionId: string;
  planSessionId: string;
  websiteType: string;
  colorScheme: string;
  extraInstructions: string;
  paymentType?: string;
  paymentLink?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: WebsiteRequest = await req.json();
    const { sessionId, planSessionId, websiteType, colorScheme, extraInstructions, paymentType, paymentLink } = body;

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
    const investment = planData.investment || '';
    const competitors = planData.competitors || '';

    const colorInstructions = getColorInstructions(colorScheme);
    const typeInstructions = getTypeInstructions(websiteType);

    // Step 1: Research the business and its market to get rich context
    const researchPrompt = `You are a business researcher. Research the following business idea and return detailed insights for building their website.

BUSINESS: ${businessName}
INDUSTRY: ${industry}
DESCRIPTION: ${description}
TARGET MARKET: ${targetMarket}
REVENUE MODEL: ${revenueModel}
LOCATION: ${location}
BUDGET: ${investment}
KNOWN COMPETITORS: ${competitors}

Research this business using the web and return a JSON object:
{
  "uniqueSellingPoints": ["USP 1", "USP 2", "USP 3"],
  "servicesList": ["Service/product 1 with brief description", "Service 2", "Service 3", "Service 4", "Service 5", "Service 6"],
  "pricingSuggestions": [
    {"name": "Basic/Starter", "price": "$X/mo or one-time", "features": ["feature 1", "feature 2", "feature 3"]},
    {"name": "Pro/Premium", "price": "$X/mo or one-time", "features": ["feature 1", "feature 2", "feature 3"]},
    {"name": "Enterprise/Custom", "price": "Contact us", "features": ["feature 1", "feature 2", "feature 3"]}
  ],
  "competitorInsights": "What competitors are doing that this business should differentiate from",
  "heroHeadline": "A compelling hero headline for the website",
  "heroSubheadline": "A supporting subheadline",
  "aboutStory": "A 3-4 sentence brand story for the About section",
  "ctaText": "Primary call-to-action button text",
  "targetAudienceDescription": "Detailed description of the ideal customer for website copy",
  "socialProofIdeas": ["Testimonial idea 1 relevant to this business", "Testimonial idea 2", "Testimonial idea 3"],
  "faqItems": [
    {"question": "Industry-specific FAQ 1", "answer": "Answer"},
    {"question": "Industry-specific FAQ 2", "answer": "Answer"},
    {"question": "Industry-specific FAQ 3", "answer": "Answer"}
  ]
}

Use REAL market data. Make pricing realistic for the industry. Return ONLY valid JSON.`;

    const researchResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: researchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
      },
    });

    let researchData: any = {};
    try {
      researchData = JSON.parse(researchResponse.text || '{}');
    } catch {
      const match = (researchResponse.text || '').match(/\{[\s\S]*\}/);
      if (match) researchData = JSON.parse(match[0]);
    }

    // Step 2: Generate the website using the rich research data
    const prompt = `You are an expert web developer and designer. Generate a complete, production-ready, single-page website for the following business. Use ALL the research data below to make every section specific and compelling.

BUSINESS DETAILS:
- Business Name: ${businessName}
- Industry: ${industry}
- Description: ${description}
- Target Market: ${targetMarket}
- Revenue Model: ${revenueModel}
- Location: ${location}
- Known Competitors: ${competitors}

RESEARCH DATA (use this for website content):
- Hero Headline: ${researchData.heroHeadline || ''}
- Hero Subheadline: ${researchData.heroSubheadline || ''}
- Unique Selling Points: ${JSON.stringify(researchData.uniqueSellingPoints || [])}
- Services/Products: ${JSON.stringify(researchData.servicesList || [])}
- Pricing Tiers: ${JSON.stringify(researchData.pricingSuggestions || [])}
- About Story: ${researchData.aboutStory || ''}
- CTA Text: ${researchData.ctaText || 'Get Started'}
- Target Audience: ${researchData.targetAudienceDescription || ''}
- Testimonial Ideas: ${JSON.stringify(researchData.socialProofIdeas || [])}
- FAQ Items: ${JSON.stringify(researchData.faqItems || [])}
- Competitor Insights: ${researchData.competitorInsights || ''}

WEBSITE TYPE: ${typeInstructions}

DESIGN REQUIREMENTS:
- Use Tailwind CSS via CDN (include <script src="https://cdn.tailwindcss.com"></script>)
- ${colorInstructions}
- Modern, clean, professional design
- Fully responsive (mobile-first)
- Smooth scroll behavior
- Include meta tags for SEO (title, description, og tags)

${extraInstructions ? `ADDITIONAL INSTRUCTIONS: ${extraInstructions}` : ''}

${paymentType && paymentLink ? `PAYMENT INTEGRATION:
The business uses ${paymentType === 'stripe' ? 'Stripe' : paymentType === 'paypal' ? 'PayPal' : paymentType === 'square' ? 'Square' : paymentType} for payments.
Payment URL: ${paymentLink}

IMPORTANT: Make ALL pricing buttons, CTA buttons, and "Buy Now"/"Get Started"/"Book Now"/"Order Now" buttons link to this payment URL: ${paymentLink}
- Pricing section: each tier's button should link to the payment URL
- Hero CTA button should link to the payment URL
- Any "Add to Cart" or purchase buttons should link to the payment URL
- Open payment links in a new tab (target="_blank")
- Make buttons visually prominent and action-oriented` : `PAYMENT NOTE: No payment link provided. Use action="#" for all purchase/CTA buttons. Add a comment in the HTML: <!-- Replace # with your payment link (Stripe, PayPal, etc.) -->`}

SECTIONS TO INCLUDE (use the research data for content):
1. Navigation bar with business name, smooth-scroll links, and CTA button
2. Hero section with the researched headline, subheadline, and CTA
3. Features/Services section using the researched services list (use icons or emojis)
4. Social proof / stats bar (e.g., "500+ customers served", "4.9 star rating")
5. About section using the researched brand story
6. Pricing section using the researched pricing tiers with feature lists
7. Testimonials section using the researched testimonial ideas (mark as examples)
8. FAQ section using the researched FAQ items (use accordion style)
9. Contact section with form (name, email, phone, message) and business location
10. Footer with business name, quick links, social media icon placeholders, and copyright

IMPORTANT RULES:
- Return ONLY the complete HTML document, starting with <!DOCTYPE html> and ending with </html>
- Do NOT wrap in markdown code blocks
- Make ALL content specific to THIS business using the research data above
- Use the exact headlines, services, pricing, and FAQs from the research
- Include hover effects, transitions, and smooth animations
- Add gradient backgrounds, card shadows, and modern UI patterns
- The site should look like a $5,000-$10,000 custom website
- Include a sticky navigation bar
- Add a "Back to top" button
- Make the pricing section visually compelling with a highlighted "popular" tier`;

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
