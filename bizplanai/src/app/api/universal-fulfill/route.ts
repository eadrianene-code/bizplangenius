import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GoogleGenAI } from '@google/genai';
import { getProduct, isBundle, getBundleProducts } from '@/lib/products';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  });
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const maxDuration = 300;

// Helper to parse JSON from AI response with fallback strategies
function parseJSON(rawText: string): any {
  try {
    return JSON.parse(rawText);
  } catch {
    // Try to extract from markdown code blocks
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {}
    }

    // Try to find first { and last }
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
      } catch {}
    }

    throw new Error('Failed to parse JSON response');
  }
}

// ============ INVESTOR EMAILS ============
async function generateInvestorEmails(meta: Record<string, string>): Promise<any> {
  const prompt = `You are an expert investor relations and startup pitch specialist. Generate 10 customized investor outreach emails for:

Business Name: ${meta.businessName}
Business Description: ${meta.businessDescription || 'Not provided'}

Create professional, compelling investor outreach emails that follow venture capital best practices. Each email should:
- Have a strong compelling subject line
- Include specific business context from the description
- Target different investor types (angels, early-stage VCs, family offices, etc.)
- Include clear call-to-action
- Suggest appropriate follow-up timing

Output ONLY a valid JSON object with this exact structure:
{
  "emails": [
    {
      "subject": "Email subject line",
      "body": "Full email body with professional greeting and sign-off",
      "targetType": "angel|vc|family_office|corporate",
      "followUpTiming": "When to follow up (e.g., '3 days', '1 week')"
    }
  ]
}

RULES:
- Output ONLY valid JSON, no markdown
- Create exactly 10 emails
- Each body should be 150-200 words
- Subject lines should be compelling and non-generic
- Vary the investor types across emails`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 8000,
      responseMimeType: 'application/json',
    },
  });

  return parseJSON(result.text || '{}');
}

// ============ LEGAL PAGES ============
async function generateLegalPages(meta: Record<string, string>): Promise<any> {
  const prompt = `You are a legal document specialist. Generate professional legal pages for:

Business Name: ${meta.businessName}
Business Type: ${meta.businessType || 'Online business'}
Business URL: ${meta.businessUrl || 'www.example.com'}

Create comprehensive legal pages that are:
- Professional and legally sound
- Specific to the business type
- Modern in tone while remaining formal
- Customized with the business information provided

Generate privacy policy, terms of service, and cookie policy. Each should be 500-800 words.

Output ONLY a valid JSON object with this exact structure:
{
  "pages": {
    "privacyPolicy": "Full privacy policy text",
    "termsOfService": "Full terms of service text",
    "cookiePolicy": "Full cookie policy text"
  },
  "businessName": "${meta.businessName}"
}

RULES:
- Output ONLY valid JSON
- Each policy should be comprehensive and professional
- Include all standard legal sections (data collection, user rights, liability disclaimers, etc.)
- Make each policy 500-800 words
- Policies should be specific to online businesses
- Use clear, professional language`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.3,
      topP: 0.9,
      maxOutputTokens: 16000,
      responseMimeType: 'application/json',
    },
  });

  return parseJSON(result.text || '{}');
}

// ============ AD COPY ============
async function generateAdCopy(meta: Record<string, string>): Promise<any> {
  const prompt = `You are a high-converting copywriter specializing in digital advertising. Generate high-converting ad copy for:

Business Name: ${meta.businessName}
Business Description: ${meta.businessDescription || 'Not provided'}
Target Audience: ${meta.targetAudience || 'General audience'}
Key Benefits: ${meta.keyBenefits || 'Not specified'}

Create ad copy for Facebook, Google Ads, and Instagram that converts. Each platform has different formats and best practices.

Generate 3 ad sets for each platform with multiple variations.

Output ONLY a valid JSON object with this exact structure:
{
  "platforms": {
    "facebook": [
      {
        "headline": "Attention-grabbing headline (up to 40 chars)",
        "primaryText": "Main ad copy (125 char limit)",
        "description": "Secondary text (30 char limit)",
        "cta": "Call-to-action button text (e.g., 'Learn More')"
      }
    ],
    "google": [
      {
        "headlines": ["Headline 1 (30 chars)", "Headline 2 (30 chars)", "Headline 3 (30 chars)"],
        "descriptions": ["Description 1 (90 chars)", "Description 2 (90 chars)"]
      }
    ],
    "instagram": [
      {
        "caption": "Full Instagram caption with emojis and hooks (500-800 chars)",
        "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
      }
    ]
  }
}

RULES:
- Output ONLY valid JSON
- Create 3 variations for Facebook, 3 for Google, 3 for Instagram
- Each should have different hooks and angles
- Use proven ad copy formulas (curiosity, urgency, benefit-driven)
- Facebook copy should be conversational
- Google copy should be direct and benefit-focused
- Instagram copy should be story-driven and engaging
- All copy must be specific to ${meta.businessName}`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.8,
      topP: 0.9,
      maxOutputTokens: 12000,
      responseMimeType: 'application/json',
    },
  });

  return parseJSON(result.text || '{}');
}

// ============ SOCIAL MEDIA ============
async function generateSocialMedia(meta: Record<string, string>): Promise<any> {
  const prompt = `You are a social media content strategist. Generate 30 days of high-engagement social media content for:

Business Name: ${meta.businessName}
Business Description: ${meta.businessDescription || 'Not provided'}
Target Audience: ${meta.targetAudience || 'General audience'}
Business Type: ${meta.businessType || 'Not specified'}

Create a balanced content calendar with mix of: educational (30%), promotional (30%), engagement (25%), behind-the-scenes (15%).

Each post should be specific to this business and include:
- Compelling copy
- Relevant hashtags
- Post type classification

Output ONLY a valid JSON object with this exact structure:
{
  "posts": [
    {
      "day": 1,
      "platform": "Instagram|Twitter|LinkedIn|Facebook",
      "content": "Full post content/caption",
      "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
      "postType": "educational|promotional|engagement|behind_scenes"
    }
  ]
}

RULES:
- Output ONLY valid JSON
- Generate exactly 30 posts
- Vary platforms (mix Instagram, Twitter, LinkedIn, Facebook)
- Use 3-5 relevant hashtags per post
- Ensure good mix of post types
- Posts should be specific to ${meta.businessName}
- Include engagement hooks (questions, CTAs, etc.)
- Make content actionable and valuable`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 16000,
      responseMimeType: 'application/json',
    },
  });

  return parseJSON(result.text || '{}');
}

// ============ LOGO & BRAND ============
async function generateLogoBrand(meta: Record<string, string>): Promise<any> {
  const prompt = `You are a brand strategist and creative director. Create comprehensive brand guidelines for:

Business Name: ${meta.businessName}
Business Description: ${meta.businessDescription || 'Not provided'}
Industry: ${meta.industry || 'Not specified'}
Target Audience: ${meta.targetAudience || 'General audience'}

Create a complete brand identity system including:
- Brand positioning and voice
- Color palette (with hex codes)
- Typography recommendations
- 3 logo concept descriptions (visual concepts you'd create)
- Brand guidelines summary

Output ONLY a valid JSON object with this exact structure:
{
  "brandName": "${meta.businessName}",
  "tagline": "Memorable brand tagline",
  "colorPalette": {
    "primary": "#000000 (hex with reasoning)",
    "secondary": "#ffffff (hex with reasoning)",
    "accent": "#ff6b6b (hex with reasoning)",
    "neutral": "#f0f0f0 (hex with reasoning)"
  },
  "typography": {
    "headingFont": "Font recommendation (e.g., Montserrat Bold)",
    "bodyFont": "Font recommendation (e.g., Inter Regular)"
  },
  "logoConceptDescriptions": [
    "Detailed visual description of logo concept 1",
    "Detailed visual description of logo concept 2",
    "Detailed visual description of logo concept 3"
  ],
  "brandVoice": "Brand voice personality (e.g., professional, playful, sophisticated)",
  "brandGuidelines": "1-2 paragraph summary of how to apply the brand consistently"
}

RULES:
- Output ONLY valid JSON
- Provide 3 distinct logo concepts with different visual approaches
- Color palette should align with industry and target audience
- Hex codes should be realistic and well-chosen
- Font recommendations should be modern and professional
- Brand voice should match target audience
- All recommendations should be specific to ${meta.businessName}`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 8000,
      responseMimeType: 'application/json',
    },
  });

  return parseJSON(result.text || '{}');
}

// ============ PITCH DECK ============
async function generatePitchDeck(meta: Record<string, string>): Promise<any> {
  const prompt = `You are an expert pitch deck consultant who has worked with hundreds of startups. Generate investor-ready pitch deck content for:

Business Name: ${meta.businessName}
Description: ${meta.businessDescription || 'Not provided'}
Industry: ${meta.industry || 'Not specified'}
Target Market: ${meta.targetMarket || 'Not specified'}
Revenue Model: ${meta.revenueModel || 'Not specified'}

Create content for 8 key slides that tell a compelling investor story. Use real market data and realistic financial projections based on the business model.

Output ONLY a valid JSON object with this exact structure:
{
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide title",
      "content": "Main content or bullet points",
      "speakerNotes": "Speaker talking points (100-150 words)",
      "slideType": "title|problem|solution|market|traction|team|financials|ask"
    }
  ]
}

Create these 8 slides in order:
1. Title slide
2. Problem (what problem are you solving?)
3. Solution (how do you solve it?)
4. Market (TAM, SAM, SOM with real numbers)
5. Traction (projected metrics, early signs of validation)
6. Team (roles needed, founder background)
7. Financials (Year 1-3 projections based on business model)
8. The Ask (funding needed and use of funds)

RULES:
- Output ONLY valid JSON
- Each slide must have meaningful content, not placeholder text
- Financial projections must be realistic for the industry
- Use real market research for TAM/SAM/SOM
- Speaker notes should guide delivery
- Content should be specific to ${meta.businessName}
- Numbers should be conservative and justified`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 12000,
      responseMimeType: 'application/json',
    },
  });

  return parseJSON(result.text || '{}');
}

// ============ WEBSITE GENERATOR ============
async function generateWebsite(meta: Record<string, string>, websiteType: string): Promise<any> {
  const typeDescriptions: Record<string, string> = {
    landing:
      'A high-converting landing page focused on lead capture and sales',
    ecommerce: 'A full e-commerce website with product catalog and checkout',
    booking:
      'A service business website with booking/appointment functionality',
    restaurant: 'A restaurant website with menu, reservations, and gallery',
    portfolio: 'A portfolio website for creatives and freelancers',
    saas: 'A SaaS product website with pricing, features, and signup',
  };

  const typeDescription =
    typeDescriptions[websiteType] || 'A professional business website';

  const prompt = `You are an expert web designer and copywriter. Generate website content for ${typeDescription}:

Business Name: ${meta.businessName}
Description: ${meta.businessDescription || 'Not provided'}
Target Audience: ${meta.targetAudience || 'General audience'}
Key Benefits: ${meta.keyBenefits || 'Not specified'}
Website Type: ${websiteType}

Create a complete website structure with:
- Home page with hero section
- Key value/feature sections
- Call-to-action sections
- Footer content
- SEO metadata

Output ONLY a valid JSON object with this exact structure:
{
  "websiteType": "${websiteType}",
  "pages": [
    {
      "pageName": "Page name (e.g., Home, About, Pricing)",
      "sections": [
        {
          "sectionType": "hero|features|benefits|testimonials|faq|pricing|cta|about|contact",
          "heading": "Section heading",
          "subheading": "Optional subheading",
          "content": "Main content/body text",
          "cta": "Call-to-action button text"
        }
      ]
    }
  ],
  "seoMeta": {
    "title": "Page title (50-60 chars)",
    "description": "Meta description (150-160 chars)",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
}

RULES:
- Output ONLY valid JSON
- Create 4-5 pages depending on website type
- Each page should have 2-4 meaningful sections
- Content should be specific and compelling
- CTAs should be conversion-focused
- SEO metadata should follow best practices
- Copy should match the ${websiteType} website type
- Include at least one testimonial/social proof section`;

  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: 0.6,
      topP: 0.9,
      maxOutputTokens: 10000,
      responseMimeType: 'application/json',
    },
  });

  return parseJSON(result.text || '{}');
}

// ============ MAIN HANDLER ============
export async function POST(req: NextRequest) {
  try {
    const { sessionId, productId } = await req.json();

    const stripe = getStripe();

    // Retrieve and verify Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
    }

    const meta = session.metadata || {};
    let actualProductId = productId || meta.productId;

    if (!actualProductId) {
      return NextResponse.json({ error: 'Product ID not provided' }, { status: 400 });
    }

    // Check if this is a bundle
    if (isBundle(actualProductId)) {
      const bundleProducts = getBundleProducts(actualProductId);
      return NextResponse.json({
        isBundle: true,
        bundleId: actualProductId,
        products: bundleProducts.map((p) => p.id),
        message: 'Bundle purchased. Fulfill each product individually.',
      });
    }

    // Handle products with their own dedicated fulfillment endpoints
    if (
      actualProductId === 'competitor_spy' ||
      actualProductId === 'business_plan_starter' ||
      actualProductId === 'business_plan_pro'
    ) {
      const redirectEndpoint =
        actualProductId === 'competitor_spy' ? '/api/spy-fulfill' : '/api/fulfill';
      return NextResponse.json({
        redirect: redirectEndpoint,
        sessionId,
        message: `Use dedicated fulfillment endpoint: ${redirectEndpoint}`,
      });
    }

    // Generate content based on product type
    let fulfillmentData: any;

    if (actualProductId === 'investor_emails') {
      console.log('Generating investor emails...');
      fulfillmentData = await generateInvestorEmails(meta);
    } else if (actualProductId === 'legal_pages') {
      console.log('Generating legal pages...');
      fulfillmentData = await generateLegalPages(meta);
    } else if (actualProductId === 'ad_copy') {
      console.log('Generating ad copy...');
      fulfillmentData = await generateAdCopy(meta);
    } else if (actualProductId === 'social_media') {
      console.log('Generating social media content...');
      fulfillmentData = await generateSocialMedia(meta);
    } else if (actualProductId === 'logo_brand') {
      console.log('Generating brand kit...');
      fulfillmentData = await generateLogoBrand(meta);
    } else if (actualProductId === 'pitch_deck') {
      console.log('Generating pitch deck...');
      fulfillmentData = await generatePitchDeck(meta);
    } else if (actualProductId.startsWith('website_')) {
      const websiteType = actualProductId.split('_')[1];
      console.log(`Generating ${websiteType} website...`);
      fulfillmentData = await generateWebsite(meta, websiteType);
    } else {
      return NextResponse.json(
        { error: `Unknown product type: ${actualProductId}` },
        { status: 400 }
      );
    }

    // Add metadata to response
    fulfillmentData.productId = actualProductId;
    fulfillmentData.businessName = meta.businessName || 'Business';
    fulfillmentData.generatedAt = new Date().toISOString();

    return NextResponse.json(fulfillmentData);
  } catch (error: any) {
    console.error('Universal fulfill error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate product content',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
