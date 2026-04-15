export interface IndustryData {
  slug: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  heroText: string;
  industry: string;
  stats: { label: string; value: string }[];
  sections: string[];
  faq: { q: string; a: string }[];
}

export const INDUSTRIES: IndustryData[] = [
  {
    slug: 'restaurant-business-plan',
    name: 'Restaurant',
    title: 'AI Restaurant Business Plan Generator',
    description: 'Generate an investor-ready restaurant business plan with real competitor data, menu pricing analysis, and 3-year financial projections.',
    icon: '🍽️',
    heroText: 'Get a professional restaurant business plan with real local competitor analysis, menu pricing benchmarks, and financial projections tailored to your concept.',
    industry: 'Food & Beverage',
    stats: [{ label: 'Average startup cost', value: '$175K-$750K' }, { label: 'Break-even timeline', value: '12-24 months' }, { label: 'Industry growth', value: '4.1% annually' }],
    sections: ['Menu concept and pricing strategy', 'Local competitor analysis (5-10 restaurants)', 'Location and foot traffic analysis', 'Staffing plan and labor costs', 'Food cost projections (28-35%)', 'Marketing and grand opening strategy', '3-year revenue and profit projections'],
    faq: [{ q: 'Will it find my local restaurant competitors?', a: 'Yes. Our AI uses Google Search with location grounding to find real restaurants in your area.' }, { q: 'Does it include menu pricing analysis?', a: 'Yes. Competitive pricing benchmarks based on your concept and location.' }],
  },
  {
    slug: 'coffee-shop-business-plan',
    name: 'Coffee Shop',
    title: 'AI Coffee Shop Business Plan Generator',
    description: 'Generate a coffee shop business plan with real competitor pricing, startup costs, and financial projections.',
    icon: '☕',
    heroText: 'Get a professional coffee shop business plan with real competitor pricing data, equipment costs, and revenue projections.',
    industry: 'Food & Beverage',
    stats: [{ label: 'Average startup cost', value: '$80K-$300K' }, { label: 'Break-even timeline', value: '9-18 months' }, { label: 'Average ticket', value: '$4.50-$7.00' }],
    sections: ['Coffee concept and menu strategy', 'Local competitor pricing analysis', 'Equipment and build-out costs', 'Supplier and bean sourcing plan', 'Staffing and training plan', 'Marketing and loyalty program strategy', '3-year financial projections'],
    faq: [{ q: 'Will it analyze coffee shops near my location?', a: 'Yes. Our AI finds real coffee shops in your area and analyzes their pricing and offerings.' }, { q: 'Does it cover equipment costs?', a: 'Yes. Espresso machines, grinders, POS systems, furniture, and build-out estimates.' }],
  },
  {
    slug: 'saas-business-plan',
    name: 'SaaS',
    title: 'AI SaaS Business Plan Generator',
    description: 'Generate a SaaS business plan with real competitor analysis, pricing strategy, MRR projections, and go-to-market plan.',
    icon: '💻',
    heroText: 'Get an investor-ready SaaS business plan with real competitor feature comparison, pricing analysis, and MRR/ARR projections.',
    industry: 'Technology / SaaS',
    stats: [{ label: 'Median seed round', value: '$2M-$4M' }, { label: 'Target gross margin', value: '70-85%' }, { label: 'Rule of 40', value: 'Growth + Margin > 40%' }],
    sections: ['Product vision and feature roadmap', 'Competitor feature and pricing comparison', 'Total addressable market (TAM/SAM/SOM)', 'Go-to-market and acquisition strategy', 'Pricing model and unit economics', 'Team and hiring plan', 'MRR/ARR projections and runway analysis'],
    faq: [{ q: 'Will it find my SaaS competitors?', a: 'Yes. Real SaaS products in your space with features, pricing tiers, and positioning.' }, { q: 'Does it include SaaS metrics?', a: 'Yes. MRR, ARR, CAC, LTV, churn rate, and runway projections.' }],
  },
  {
    slug: 'food-truck-business-plan',
    name: 'Food Truck',
    title: 'AI Food Truck Business Plan Generator',
    description: 'Generate a food truck business plan with real competitor data, permit requirements, route strategy, and financial projections.',
    icon: '🚚',
    heroText: 'Get a professional food truck business plan with local competitor analysis, permit costs, and realistic revenue projections.',
    industry: 'Food & Beverage',
    stats: [{ label: 'Average startup cost', value: '$50K-$200K' }, { label: 'Break-even timeline', value: '6-12 months' }, { label: 'Daily revenue potential', value: '$500-$2,000' }],
    sections: ['Menu concept and pricing', 'Local food truck competitor analysis', 'Truck purchase/lease costs', 'Permit and licensing requirements', 'Route and event strategy', 'Marketing and social media plan', 'Seasonal revenue projections'],
    faq: [{ q: 'Does it cover permits?', a: 'Yes. Permit costs and licensing requirements for your city/state.' }, { q: 'Will it include route strategy?', a: 'Yes. High-traffic locations, events, and commissary kitchen requirements.' }],
  },
  {
    slug: 'gym-business-plan',
    name: 'Gym',
    title: 'AI Gym Business Plan Generator',
    description: 'Generate a gym business plan with real competitor analysis, membership pricing, equipment costs, and 3-year projections.',
    icon: '🏋️',
    heroText: 'Get a professional gym business plan with local competitor membership pricing, equipment budgets, and member acquisition projections.',
    industry: 'Health & Wellness',
    stats: [{ label: 'Average startup cost', value: '$100K-$500K' }, { label: 'Break-even timeline', value: '12-24 months' }, { label: 'Member retention target', value: '70-80%' }],
    sections: ['Gym concept and class offerings', 'Local competitor membership pricing', 'Equipment and facility costs', 'Membership tiers and pricing', 'Member acquisition and retention plan', 'Staffing and trainer compensation', '3-year membership growth projections'],
    faq: [{ q: 'Will it analyze gyms in my area?', a: 'Yes. Real gyms with memberships, pricing, amenities, and reviews.' }, { q: 'What gym types?', a: 'Boutique, CrossFit, traditional, 24-hour, and specialty fitness studios.' }],
  },
  {
    slug: 'salon-business-plan',
    name: 'Salon',
    title: 'AI Salon Business Plan Generator',
    description: 'Generate a salon business plan with real competitor pricing, service menu strategy, and financial projections.',
    icon: '💇',
    heroText: 'Get a professional salon business plan with local competitor service pricing, build-out costs, and revenue projections.',
    industry: 'Health & Wellness',
    stats: [{ label: 'Average startup cost', value: '$60K-$250K' }, { label: 'Break-even timeline', value: '8-16 months' }, { label: 'Service margin', value: '50-70%' }],
    sections: ['Salon concept and service menu', 'Local competitor pricing analysis', 'Build-out and equipment costs', 'Pricing strategy and packages', 'Stylist compensation model', 'Client acquisition and retention', '3-year revenue projections'],
    faq: [{ q: 'Will it analyze salons near me?', a: 'Yes. Real salons with service pricing, reviews, and specialties.' }, { q: 'What salon types?', a: 'Hair salons, nail salons, day spas, barbershops, and full-service beauty.' }],
  },
  {
    slug: 'ecommerce-business-plan',
    name: 'E-commerce',
    title: 'AI E-commerce Business Plan Generator',
    description: 'Generate an e-commerce business plan with real competitor analysis, product sourcing strategy, and revenue projections.',
    icon: '🛒',
    heroText: 'Get a professional e-commerce business plan with competitor product analysis, pricing strategy, and customer acquisition projections.',
    industry: 'E-commerce / Retail',
    stats: [{ label: 'Average startup cost', value: '$5K-$50K' }, { label: 'Target ROAS', value: '4-6x' }, { label: 'Average margin', value: '30-50%' }],
    sections: ['Product line and sourcing strategy', 'Competitor product and pricing analysis', 'Platform selection (Shopify, Amazon, DTC)', 'Customer acquisition and CAC', 'Fulfillment and shipping', 'Brand and marketing plan', 'Revenue and profitability projections'],
    faq: [{ q: 'Which platforms?', a: 'Shopify, Amazon FBA, WooCommerce, and direct-to-consumer strategies.' }, { q: 'Will it find competitors?', a: 'Yes. Real competitors with pricing, reviews, and market positioning.' }],
  },
  {
    slug: 'cleaning-business-plan',
    name: 'Cleaning Business',
    title: 'AI Cleaning Business Plan Generator',
    description: 'Generate a cleaning business plan with real competitor pricing, service packages, and growth projections.',
    icon: '🧹',
    heroText: 'Get a professional cleaning business plan with local competitor pricing, equipment lists, and client acquisition projections.',
    industry: 'Consulting / Services',
    stats: [{ label: 'Average startup cost', value: '$2K-$30K' }, { label: 'Break-even timeline', value: '3-6 months' }, { label: 'Profit margin', value: '20-40%' }],
    sections: ['Service offerings (residential/commercial)', 'Local competitor pricing', 'Equipment and supply costs', 'Pricing packages and upsells', 'Client acquisition strategy', 'Hiring and scaling plan', 'Monthly revenue projections'],
    faq: [{ q: 'Residential or commercial?', a: 'Both. The plan adapts based on your description.' }, { q: 'Equipment costs?', a: 'Yes. Supplies, vehicle, insurance, and bonding costs.' }],
  },
];

export function getIndustryBySlug(slug: string): IndustryData | undefined {
  return INDUSTRIES.find(i => i.slug === slug);
}

export function getAllIndustrySlugs(): string[] {
  return INDUSTRIES.map(i => i.slug);
}
