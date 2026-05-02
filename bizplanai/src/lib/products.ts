/**
 * Universal Product Configuration for BizPlan Genius
 * This file defines all products, bundles, and subscriptions with their pricing and metadata.
 * Serves as the single source of truth for all product data across the platform.
 */

export type ProductCategory = 'individual' | 'bundle' | 'subscription';
export type FulfillmentType = 'instant' | 'email' | 'dashboard' | 'hosted';

export interface ProductConfig {
  id: string;
  name: string;
  price: number; // in cents
  description: string;
  category: ProductCategory;
  pageUrl: string;
  successUrl: string;
  fulfillmentType: FulfillmentType;
  bundleIncludes?: string[]; // product IDs included in bundle
  monthlyPrice?: number; // in cents, for subscriptions
  yearlyPrice?: number; // in cents, for subscriptions
}

/**
 * INDIVIDUAL PRODUCTS (15)
 */
const COMPETITOR_SPY: ProductConfig = {
  id: 'competitor_spy',
  name: 'Competitor Spy Report',
  price: 9700,
  description:
    'Competitive analysis with real competitor data, pricing, SWOT, and 90-day roadmap',
  category: 'individual',
  pageUrl: '/spy',
  successUrl: '/success',
  fulfillmentType: 'email',
};

const BUSINESS_PLAN_STARTER: ProductConfig = {
  id: 'business_plan_starter',
  name: 'Business Plan Starter',
  price: 9700,
  description:
    '7-section business plan with real competitor research and financial projections',
  category: 'individual',
  pageUrl: '/generate?tier=starter',
  successUrl: '/success',
  fulfillmentType: 'email',
};

const BUSINESS_PLAN_PRO: ProductConfig = {
  id: 'business_plan_pro',
  name: 'Business Plan Pro',
  price: 14700,
  description:
    'Complete business plan with operations, risk analysis, and money-back guarantee',
  category: 'individual',
  pageUrl: '/generate?tier=pro',
  successUrl: '/success',
  fulfillmentType: 'email',
};

const INVESTOR_EMAILS: ProductConfig = {
  id: 'investor_emails',
  name: 'Investor Email Templates',
  price: 1900,
  description:
    '10 customized investor outreach emails with personalized pitch angles',
  category: 'individual',
  pageUrl: '/investor-emails',
  successUrl: '/success',
  fulfillmentType: 'email',
};

const LEGAL_PAGES: ProductConfig = {
  id: 'legal_pages',
  name: 'Legal Pages Generator',
  price: 1900,
  description:
    'Privacy policy, terms of service, and cookie policy customized for your business',
  category: 'individual',
  pageUrl: '/legal-pages',
  successUrl: '/success',
  fulfillmentType: 'email',
};

const AD_COPY: ProductConfig = {
  id: 'ad_copy',
  name: 'Ad Copy Generator',
  price: 1900,
  description:
    'Facebook, Google, and Instagram ad copy with multiple variations and hooks',
  category: 'individual',
  pageUrl: '/ad-copy',
  successUrl: '/success',
  fulfillmentType: 'email',
};

const SOCIAL_MEDIA: ProductConfig = {
  id: 'social_media',
  name: 'Social Media Content Pack',
  price: 2900,
  description:
    '30 days of social media posts, captions, and hashtag strategies',
  category: 'individual',
  pageUrl: '/social-media',
  successUrl: '/success',
  fulfillmentType: 'email',
};

const LOGO_BRAND: ProductConfig = {
  id: 'logo_brand',
  name: 'Logo & Brand Kit',
  price: 2900,
  description:
    'Logo concepts, color palette, typography, and brand guidelines',
  category: 'individual',
  pageUrl: '/logo-brand',
  successUrl: '/success',
  fulfillmentType: 'email',
};

const PITCH_DECK: ProductConfig = {
  id: 'pitch_deck',
  name: 'Pitch Deck',
  price: 3900,
  description:
    'Investor-ready pitch deck with market data and financial projections',
  category: 'individual',
  pageUrl: '/pitch-deck',
  successUrl: '/success',
  fulfillmentType: 'email',
};

const WEBSITE_LANDING: ProductConfig = {
  id: 'website_landing',
  name: 'Website - Landing Page',
  price: 9900,
  description:
    'Professional landing page with copy, design, and conversion optimization',
  category: 'individual',
  pageUrl: '/website-landing',
  successUrl: '/success',
  fulfillmentType: 'dashboard',
};

const WEBSITE_ECOMMERCE: ProductConfig = {
  id: 'website_ecommerce',
  name: 'Website - E-commerce',
  price: 14900,
  description: 'Full e-commerce website with product pages and checkout',
  category: 'individual',
  pageUrl: '/website-ecommerce',
  successUrl: '/success',
  fulfillmentType: 'dashboard',
};

const WEBSITE_BOOKING: ProductConfig = {
  id: 'website_booking',
  name: 'Website - Booking',
  price: 12900,
  description: 'Booking/appointment website for service businesses',
  category: 'individual',
  pageUrl: '/website-booking',
  successUrl: '/success',
  fulfillmentType: 'dashboard',
};

const WEBSITE_RESTAURANT: ProductConfig = {
  id: 'website_restaurant',
  name: 'Website - Restaurant',
  price: 12900,
  description: 'Restaurant website with menu, reservations, and gallery',
  category: 'individual',
  pageUrl: '/website-restaurant',
  successUrl: '/success',
  fulfillmentType: 'dashboard',
};

const WEBSITE_PORTFOLIO: ProductConfig = {
  id: 'website_portfolio',
  name: 'Website - Portfolio',
  price: 9900,
  description: 'Portfolio website for creatives and freelancers',
  category: 'individual',
  pageUrl: '/website-portfolio',
  successUrl: '/success',
  fulfillmentType: 'dashboard',
};

const WEBSITE_SAAS: ProductConfig = {
  id: 'website_saas',
  name: 'Website - SaaS',
  price: 19900,
  description:
    'SaaS marketing website with pricing, features, and signup',
  category: 'individual',
  pageUrl: '/website-saas',
  successUrl: '/success',
  fulfillmentType: 'dashboard',
};

/**
 * BUNDLES (3)
 */
const STARTER_BUNDLE: ProductConfig = {
  id: 'starter_bundle',
  name: 'Starter Bundle',
  price: 19700,
  description: 'Spy report + Pro business plan',
  category: 'bundle',
  pageUrl: '/starter-bundle',
  successUrl: '/success',
  fulfillmentType: 'email',
  bundleIncludes: ['competitor_spy', 'business_plan_pro'],
};

const LAUNCH_PACK: ProductConfig = {
  id: 'launch_pack',
  name: 'Launch Pack',
  price: 29700,
  description: 'Everything to launch',
  category: 'bundle',
  pageUrl: '/launch-pack',
  successUrl: '/success',
  fulfillmentType: 'email',
  bundleIncludes: [
    'competitor_spy',
    'business_plan_pro',
    'website_landing',
    'pitch_deck',
  ],
};

const FULL_KIT: ProductConfig = {
  id: 'full_kit',
  name: 'Full Business Kit',
  price: 44700,
  description: 'Complete business launch package',
  category: 'bundle',
  pageUrl: '/full-kit',
  successUrl: '/success',
  fulfillmentType: 'email',
  bundleIncludes: [
    'competitor_spy',
    'business_plan_pro',
    'website_landing',
    'pitch_deck',
    'logo_brand',
    'social_media',
    'ad_copy',
    'investor_emails',
    'legal_pages',
  ],
};

/**
 * SUBSCRIPTIONS (3)
 */
const COMPETITOR_MONITORING: ProductConfig = {
  id: 'competitor_monitoring',
  name: 'Competitor Monitoring',
  price: 1500, // monthly
  monthlyPrice: 1500,
  yearlyPrice: 10800, // $9/mo when paid yearly
  description: 'Monthly competitor tracking updates',
  category: 'subscription',
  pageUrl: '/competitor-monitoring',
  successUrl: '/success',
  fulfillmentType: 'email',
};

const SOCIAL_SUBSCRIPTION: ProductConfig = {
  id: 'social_subscription',
  name: 'Monthly Social Pack',
  price: 1900, // monthly
  monthlyPrice: 1900,
  yearlyPrice: 14400, // $12/mo when paid yearly
  description: 'Monthly social media content',
  category: 'subscription',
  pageUrl: '/social-subscription',
  successUrl: '/success',
  fulfillmentType: 'email',
};

const WEBSITE_HOSTING: ProductConfig = {
  id: 'website_hosting',
  name: 'Website Hosting',
  price: 1900, // monthly
  monthlyPrice: 1900,
  yearlyPrice: 14400, // $12/mo when paid yearly
  description: 'Website hosting and maintenance',
  category: 'subscription',
  pageUrl: '/website-hosting',
  successUrl: '/success',
  fulfillmentType: 'hosted',
};

/**
 * PRODUCTS REGISTRY - Master catalog of all 21 products
 */
export const PRODUCTS: Record<string, ProductConfig> = {
  // Individual products (15)
  competitor_spy: COMPETITOR_SPY,
  business_plan_starter: BUSINESS_PLAN_STARTER,
  business_plan_pro: BUSINESS_PLAN_PRO,
  investor_emails: INVESTOR_EMAILS,
  legal_pages: LEGAL_PAGES,
  ad_copy: AD_COPY,
  social_media: SOCIAL_MEDIA,
  logo_brand: LOGO_BRAND,
  pitch_deck: PITCH_DECK,
  website_landing: WEBSITE_LANDING,
  website_ecommerce: WEBSITE_ECOMMERCE,
  website_booking: WEBSITE_BOOKING,
  website_restaurant: WEBSITE_RESTAURANT,
  website_portfolio: WEBSITE_PORTFOLIO,
  website_saas: WEBSITE_SAAS,
  // Bundles (3)
  starter_bundle: STARTER_BUNDLE,
  launch_pack: LAUNCH_PACK,
  full_kit: FULL_KIT,
  // Subscriptions (3)
  competitor_monitoring: COMPETITOR_MONITORING,
  social_subscription: SOCIAL_SUBSCRIPTION,
  website_hosting: WEBSITE_HOSTING,
};

/**
 * Get a single product by ID
 * @param id - Product ID
 * @returns ProductConfig or undefined if not found
 */
export function getProduct(id: string): ProductConfig | undefined {
  return PRODUCTS[id];
}

/**
 * Get all individual products included in a bundle
 * @param bundleId - Bundle product ID
 * @returns Array of ProductConfig objects included in the bundle
 */
export function getBundleProducts(bundleId: string): ProductConfig[] {
  const bundle = getProduct(bundleId);
  if (!bundle || bundle.category !== 'bundle' || !bundle.bundleIncludes) {
    return [];
  }
  return bundle.bundleIncludes
    .map((id) => getProduct(id))
    .filter((p): p is ProductConfig => p !== undefined);
}

/**
 * Get all products in a specific category
 * @param category - Category filter ('individual', 'bundle', or 'subscription')
 * @returns Array of ProductConfig objects in that category
 */
export function getProductsByCategory(
  category: ProductCategory
): ProductConfig[] {
  return Object.values(PRODUCTS).filter((p) => p.category === category);
}

/**
 * Get all individual (non-bundle, non-subscription) products
 * @returns Array of individual ProductConfig objects
 */
export function getIndividualProducts(): ProductConfig[] {
  return getProductsByCategory('individual');
}

/**
 * Get all bundles
 * @returns Array of bundle ProductConfig objects
 */
export function getBundles(): ProductConfig[] {
  return getProductsByCategory('bundle');
}

/**
 * Get all subscriptions
 * @returns Array of subscription ProductConfig objects
 */
export function getSubscriptions(): ProductConfig[] {
  return getProductsByCategory('subscription');
}

/**
 * Format price in cents to USD string (e.g., 1900 -> "$19.00")
 * @param cents - Price in cents
 * @returns Formatted USD string
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Get a product by ID with error handling
 * @param id - Product ID
 * @throws Error if product not found
 * @returns ProductConfig
 */
export function getProductOrThrow(id: string): ProductConfig {
  const product = getProduct(id);
  if (!product) {
    throw new Error(`Product not found: ${id}`);
  }
  return product;
}

/**
 * Check if a product is a bundle
 * @param id - Product ID
 * @returns true if product is a bundle
 */
export function isBundle(id: string): boolean {
  const product = getProduct(id);
  return product?.category === 'bundle';
}

/**
 * Check if a product is a subscription
 * @param id - Product ID
 * @returns true if product is a subscription
 */
export function isSubscription(id: string): boolean {
  const product = getProduct(id);
  return product?.category === 'subscription';
}

/**
 * Get all product IDs in the catalog
 * @returns Array of product IDs
 */
export function getAllProductIds(): string[] {
  return Object.keys(PRODUCTS);
}

/**
 * Get total value of a bundle (sum of included product prices)
 * @param bundleId - Bundle product ID
 * @returns Total price in cents
 */
export function getBundleValue(bundleId: string): number {
  const products = getBundleProducts(bundleId);
  return products.reduce((sum, p) => sum + p.price, 0);
}

/**
 * Get discount amount for a bundle
 * @param bundleId - Bundle product ID
 * @returns Discount in cents (positive number)
 */
export function getBundleDiscount(bundleId: string): number {
  const bundle = getProduct(bundleId);
  if (!bundle) return 0;
  const value = getBundleValue(bundleId);
  return value - bundle.price;
}

/**
 * Get discount percentage for a bundle
 * @param bundleId - Bundle product ID
 * @returns Discount percentage (0-100)
 */
export function getBundleDiscountPercent(bundleId: string): number {
  const value = getBundleValue(bundleId);
  if (value === 0) return 0;
  const discount = getBundleDiscount(bundleId);
  return Math.round((discount / value) * 100);
}
