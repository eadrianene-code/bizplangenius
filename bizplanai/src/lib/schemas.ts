/**
 * Reusable schema.org JSON-LD generators for BizPlan Genius.
 * Keep these pure functions: input -> object. Render with <SchemaJsonLd>.
 *
 * Why: LLMO requires consistent, validated structured data on every page.
 * One source of truth -> no drift between pages, easier to update prices.
 */

const SITE_URL = 'https://www.bizplangenius.com';
const ORG_NAME = 'BizPlan Genius';

export const ORG_NODE = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: ORG_NAME,
  url: SITE_URL,
  description:
    'AI-powered business launch platform. Investor-ready business plans with real competitor research, websites, pitch decks, and brand kits.',
  email: 'support@bizplangenius.com',
  sameAs: [],
};

export const PROFESSIONAL_SERVICE_NODE = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: ORG_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/api/og`,
  description:
    'Self-serve AI platform that generates investor-ready business plans, websites, pitch decks, brand kits, and ad copy. Built for first-time founders, SBA loan applicants, and E-2 / L-1 visa applicants.',
  priceRange: '$19-$447',
  areaServed: 'Worldwide',
  serviceType: 'Business plan and launch documentation',
};

export interface ProductSchemaArgs {
  name: string;
  description: string;
  url: string;
  price: string; // string per schema.org
  currency?: string;
  availability?: string;
  brand?: string;
  category?: string;
  image?: string;
}

export function productSchema(args: ProductSchemaArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: args.name,
    description: args.description,
    url: args.url,
    image: args.image || `${SITE_URL}/api/og`,
    brand: { '@type': 'Brand', name: args.brand || ORG_NAME },
    category: args.category || 'Business software',
    sku: args.url.split('/').filter(Boolean).pop() || args.name.replace(/\s+/g, '-').toLowerCase(),
    offers: {
      '@type': 'Offer',
      price: args.price,
      priceCurrency: args.currency || 'USD',
      availability: args.availability || 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
      url: args.url,
      seller: { '@type': 'Organization', name: ORG_NAME },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

export interface HowToArgs {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration, e.g. PT15M
}

export function howToSchema(args: HowToArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: args.name,
    description: args.description,
    ...(args.totalTime ? { totalTime: args.totalTime } : {}),
    step: args.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
    })),
  };
}

/**
 * Pricing source of truth. Update in ONE place when prices change.
 * Synced with CLAUDE.md as of May 8, 2026.
 */
export const PRICING = {
  spy: '97.00',
  planStarter: '97.00',
  planPro: '147.00',
  investorEmails: '19.00',
  legalPages: '19.00',
  adCopy: '19.00',
  socialPack: '29.00',
  brandKit: '29.00',
  pitchDeck: '39.00',
  websiteBuilder: '99.00', // entry tier; tiers go up to 199
  bundleStarter: '197.00',
  bundleLaunch: '297.00',
  bundleFull: '397.00',
  subMonitoring: '15.00',
  subSocial: '19.00',
  subHosting: '19.00',
} as const;

export const SITE = {
  url: SITE_URL,
  name: ORG_NAME,
};
