// Shared data for build-website page.
// Imported by both the SSR Showcase and the client-side interactive app.

export type WebsiteType = {
  key: string;
  label: string;
  price: number;
  desc: string;
  icon: string;
  features: string[];
  bestFor: string;
};

export type ColorScheme = {
  key: string;
  label: string;
  color: string;
};

export const WEBSITE_TYPES: WebsiteType[] = [
  { key: 'landing', label: 'Landing Page', price: 99, desc: 'Single-page marketing site with strong CTAs', icon: '🚀',
    features: ['Hero with headline & CTA', 'Features/services section', 'Pricing table', 'Testimonials', 'Contact form', 'FAQ section'],
    bestFor: 'New businesses, product launches, service providers' },
  { key: 'ecommerce', label: 'E-commerce Store', price: 149, desc: 'Product showcase with shopping experience', icon: '🛒',
    features: ['Product grid with cards', 'Add-to-cart buttons', 'Featured products', 'Category navigation', 'Customer reviews', 'Shipping info'],
    bestFor: 'Online stores, DTC brands, product sellers' },
  { key: 'booking', label: 'Booking / Services', price: 129, desc: 'Service booking with appointment scheduling', icon: '📅',
    features: ['Service packages & pricing', 'Booking calendar UI', 'Staff/team profiles', 'Availability display', 'Testimonials', 'Location & hours'],
    bestFor: 'Salons, consultants, clinics, coaches, repair services' },
  { key: 'restaurant', label: 'Restaurant / Food', price: 129, desc: 'Menu, hours, location, and reservations', icon: '🍽️',
    features: ['Full menu with categories', 'Pricing & descriptions', 'Photo gallery', 'Reservation CTA', 'Hours & location', 'Reviews section'],
    bestFor: 'Restaurants, cafes, bakeries, food trucks, catering' },
  { key: 'portfolio', label: 'Portfolio / Agency', price: 99, desc: 'Visual showcase of work and case studies', icon: '🎨',
    features: ['Project gallery grid', 'Case study cards', 'Client logos', 'About/team section', 'Skills & expertise', 'Contact & hire CTA'],
    bestFor: 'Designers, developers, photographers, agencies, freelancers' },
  { key: 'saas', label: 'SaaS / Tech Product', price: 199, desc: 'Feature-rich product page with pricing tiers', icon: '💻',
    features: ['Feature comparison grid', 'Pricing tiers with toggle', 'Integration logos', 'Dashboard screenshot area', 'Customer logos', 'API/docs CTA'],
    bestFor: 'Software products, apps, APIs, tech startups' },
];

export const COLOR_SCHEMES: ColorScheme[] = [
  { key: 'blue', label: 'Professional Blue', color: '#2563eb' },
  { key: 'green', label: 'Fresh Green', color: '#16a34a' },
  { key: 'purple', label: 'Creative Purple', color: '#9333ea' },
  { key: 'red', label: 'Energetic Red', color: '#dc2626' },
  { key: 'dark', label: 'Dark Luxury', color: '#111827' },
  { key: 'minimal', label: 'Minimal B&W', color: '#374151' },
];
