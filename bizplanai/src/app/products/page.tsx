'use client';

import { useState } from 'react';

const BUNDLES = [
  {
    id: 'full-kit',
    name: 'Full Business Kit',
    price: 447,
    original: 497,
    description: 'Everything to launch your business',
    items: [
      'Competitor Spy Report',
      'Business Plan Pro',
      'Pitch Deck',
      'Website Builder (1 type)',
      'Logo & Brand Kit',
      'Social Media Pack',
      'Legal Pages Generator',
      'All Ad Copy & Email Templates'
    ]
  },
  {
    id: 'launch-pack',
    name: 'Launch Pack',
    price: 297,
    original: 382,
    description: 'Get launched fast',
    items: [
      'Competitor Spy Report',
      'Business Plan Pro',
      'Website Builder (1 type)',
      'Pitch Deck'
    ]
  },
  {
    id: 'starter-bundle',
    name: 'Starter Bundle',
    price: 197,
    original: 244,
    description: 'Start lean',
    items: [
      'Competitor Spy Report',
      'Business Plan Pro'
    ]
  }
];

const PRODUCTS_BY_CATEGORY = {
  'Business Planning': [
    {
      id: 'plan-starter',
      name: 'Business Plan Starter',
      price: 97,
      description: '7-section business plan with competitor analysis, market data, and financial projections. Professional PDF download.',
      features: ['Executive Summary', 'Competitor Analysis', '3-Year Financials', 'Marketing Strategy', 'Professional PDF']
    },
    {
      id: 'plan-pro',
      name: 'Business Plan Pro',
      price: 147,
      description: 'Everything in Starter, plus operations plan, risk analysis, and our 100% money-back guarantee.',
      features: ['Everything in Starter', 'Operations Plan', 'Risk Analysis & Mitigation', 'Priority Generation', 'Money-Back Guarantee']
    }
  ],
  'Competitive Intelligence': [
    {
      id: 'spy-report',
      name: 'Competitor Spy Report',
      price: 97,
      description: 'Find 10-15 real competitors in your market. Get their pricing, strengths, weaknesses, and a 90-day action plan.',
      features: ['15+ Competitor Profiles', 'Real Pricing Data', 'SWOT Analysis', 'Vulnerability Audit', '90-Day Action Plan']
    }
  ],
  'Marketing & Email': [
    {
      id: 'ad-copy',
      name: 'Ad Copy Generator',
      price: 19,
      description: 'Professional ad copy for Facebook, Google, and social media. Pre-tested hooks and CTAs that convert.',
      features: ['5 Ad Variations', 'Social Media Ready', 'A/B Testing Tips', 'Conversion Hooks', 'Fast Setup']
    },
    {
      id: 'social-pack',
      name: 'Social Media Pack',
      price: 29,
      description: '30 days of professional social media content: captions, hashtags, posting strategy, and visual ideas.',
      features: ['30-Day Content Calendar', 'Caption Hooks', 'Hashtag Research', 'Platform Strategy', 'Engagement Tips']
    },
    {
      id: 'investor-templates',
      name: 'Investor Email Templates',
      price: 19,
      description: 'Email sequences for cold outreach to investors, VCs, and accelerators. Proven templates with personal touch.',
      features: ['5 Cold Email Sequences', 'Subject Line A/B Tests', 'Follow-Up Templates', 'Personalization Guides', 'Success Tips']
    }
  ],
  'Brand & Design': [
    {
      id: 'logo-kit',
      name: 'Logo & Brand Kit',
      price: 29,
      description: 'Professional logo design, color palette, typography guide, and brand voice guidelines. Ready to use everywhere.',
      features: ['Professional Logo', 'Color Palette', 'Typography Guide', 'Brand Voice', 'Usage Guidelines']
    },
    {
      id: 'pitch-deck',
      name: 'Pitch Deck',
      price: 39,
      description: 'Investor-ready presentation pulled directly from your business plan data. Polished, professional, persuasive.',
      features: ['10-12 Professional Slides', 'Real Financial Data', 'Competitive Landscape', 'Go-to-Market Strategy', 'Editable Design']
    }
  ],
  'Legal': [
    {
      id: 'legal-pages',
      name: 'Legal Pages Generator',
      price: 19,
      description: 'Professional legal pages for your website: Privacy Policy, Terms of Service, and Disclaimer. Customized to your business.',
      features: ['Privacy Policy', 'Terms of Service', 'Disclaimer', 'Business-Specific', 'Legally Compliant']
    }
  ],
  'Websites': [
    {
      id: 'website-landing',
      name: 'Website Builder - Landing Page',
      price: 99,
      description: 'High-converting landing page with form, testimonials, and CTA. Get visitors to take action immediately.',
      features: ['Drag & Drop Builder', 'Form Integration', 'Mobile Ready', '20 Languages', 'SEO Optimized']
    },
    {
      id: 'website-ecommerce',
      name: 'Website Builder - E-Commerce',
      price: 149,
      description: 'Full online store with product pages, shopping cart, and payment processing. Sell online instantly.',
      features: ['Product Management', 'Shopping Cart', 'Payment Processing', 'Inventory Tracking', 'Order Management']
    },
    {
      id: 'website-booking',
      name: 'Website Builder - Booking',
      price: 119,
      description: 'Scheduling and booking system for services. Calendar, appointments, and automated confirmations.',
      features: ['Calendar Integration', 'Booking Form', 'Automated Emails', 'Payment Collection', 'Client Management']
    },
    {
      id: 'website-restaurant',
      name: 'Website Builder - Restaurant',
      price: 119,
      description: 'Website for food businesses: menu, hours, location, online ordering, and reservation system.',
      features: ['Digital Menu', 'Online Ordering', 'Reservation System', 'Location Map', 'Special Offers']
    },
    {
      id: 'website-portfolio',
      name: 'Website Builder - Portfolio',
      price: 99,
      description: 'Showcase your work with a professional portfolio. Beautiful galleries, project details, and contact forms.',
      features: ['Image Galleries', 'Project Showcase', 'Case Studies', 'Contact Forms', 'Work Filtering']
    },
    {
      id: 'website-saas',
      name: 'Website Builder - SaaS',
      price: 199,
      description: 'Complete SaaS website with product pages, pricing, feature lists, and user authentication integration.',
      features: ['Product Pages', 'Pricing Tables', 'Feature Comparison', 'User Auth', 'Integration Ready']
    }
  ]
};

const SUBSCRIPTIONS = [
  {
    id: 'competitor-monitoring',
    name: 'Competitor Monitoring',
    monthlyPrice: 15,
    yearlyPrice: 9,
    description: 'Monthly spy reports on your competitors. Stay updated on their pricing, new features, and moves.',
    features: ['Monthly Reports', 'Price Change Alerts', 'New Product Tracking', 'Trend Analysis']
  },
  {
    id: 'social-pack-monthly',
    name: 'Monthly Social Pack',
    monthlyPrice: 19,
    yearlyPrice: 12,
    description: 'Fresh social media content every month. Captions, visuals, strategy, all ready to post.',
    features: ['30-Day Content', 'Weekly Themes', 'Hashtag Research', 'Posting Calendar']
  },
  {
    id: 'website-hosting',
    name: 'Website Hosting',
    monthlyPrice: 19,
    yearlyPrice: 12,
    description: 'Fast, reliable hosting for your BizPlan Genius website. SSL, backups, and 24/7 support included.',
    features: ['Fast Performance', 'SSL Certificate', 'Daily Backups', '99.9% Uptime']
  }
];

const FAQS = [
  {
    q: 'Can I use these products for my client work or agency?',
    a: 'Yes! All products are fully customizable and can be used for your own clients or projects. We have an affiliate program (20% commission) if you want to resell them.'
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes. Business Plan products come with a 100% money-back guarantee if you are not satisfied. Other products are refundable within 7 days.'
  },
  {
    q: 'Can I get a refund on a bundle?',
    a: 'Absolutely. If you are not happy with any bundle, you get a full refund within 7 days. No questions asked.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) via Stripe.'
  },
  {
    q: 'Are there discounts for multiple purchases?',
    a: 'Yes! Our bundles offer significant savings compared to buying individual products. The Full Business Kit saves you $158.'
  },
  {
    q: 'Do subscriptions auto-renew?',
    a: 'Yes, subscriptions renew automatically on your billing date. You can cancel anytime before renewal.'
  },
  {
    q: 'Can I upgrade or downgrade my subscription?',
    a: 'Yes, you can change your subscription plan at any time. Changes take effect on your next billing date.'
  },
  {
    q: 'Is there a free trial?',
    a: 'We offer free tools (Competitor Check, Idea Validator, Business Name Generator, etc.) to try our AI. Paid products have a 7-day money-back guarantee.'
  }
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="text-sm text-gray-600 hover:text-brand-600 transition">Home</a>
          <a href="/products" className="text-sm text-brand-600 font-semibold transition">Products</a>
          <a href="/spy" className="text-sm text-gray-600 hover:text-brand-600 transition">Competitor Spy</a>
          <a href="/#faq" className="text-sm text-gray-600 hover:text-brand-600 transition">FAQ</a>
          <a href="#pricing" className="px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition shadow-md shadow-brand-600/20">
            Get Started
          </a>
        </nav>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
          <a href="/" className="block text-gray-600 hover:text-brand-600 py-2">Home</a>
          <a href="/products" className="block text-brand-600 font-semibold py-2">Products</a>
          <a href="/spy" className="block text-gray-600 hover:text-brand-600 py-2">Competitor Spy</a>
          <a href="/#faq" className="block text-gray-600 hover:text-brand-600 py-2">FAQ</a>
          <a href="#pricing" className="block w-full text-center px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-lg">
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-28 pb-16 px-4 bg-hero-pattern">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Everything You Need to<span className="text-gradient"> Launch</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Handpicked tools to research your market, build your business plan, create your website, and impress investors.
          All designed to work together. Add-ons from $19, core tools from $97.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="#bundles" className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg">
            See Bundles
          </a>
          <a href="#products" className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-brand-300 hover:text-brand-600 transition text-lg">
            Browse All Products
          </a>
        </div>
      </div>
    </section>
  );
}

function BundlesSection() {
  return (
    <section id="bundles" className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-accent-500 text-sm font-semibold uppercase tracking-wider mb-2">Save Big</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Curated Bundles</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get everything you need to launch. Save up to $158 compared to buying products individually.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BUNDLES.map((bundle) => {
            const savings = bundle.original - bundle.price;
            const savingsPercent = Math.round((savings / bundle.original) * 100);
            return (
              <div key={bundle.id} className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition">
                {bundle.id === 'full-kit' && (
                  <div className="mb-4 inline-block px-4 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{bundle.name}</h3>
                <p className="text-gray-600 mb-6 text-sm">{bundle.description}</p>
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-extrabold text-gray-900">${bundle.price}</span>
                    <span className="text-lg text-gray-400 line-through">${bundle.original}</span>
                  </div>
                  <p className="text-green-600 font-semibold mt-2">Save ${savings} ({savingsPercent}%)</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {bundle.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <svg className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleBuy(bundle.id)}
                  className={`w-full py-4 font-bold rounded-xl transition text-lg ${
                    bundle.id === 'full-kit'
                      ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25'
                      : 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  Get {bundle.name.split(' ')[0]}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  return (
    <section id="products" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">All Individual Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mix and match. Buy exactly what you need. Or get a bundle to save big.
          </p>
        </div>

        {Object.entries(PRODUCTS_BY_CATEGORY).map(([category, products]) => (
          <div key={category} className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">{category}</h3>
            <div className={`grid gap-6 ${category === 'Websites' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-brand-300 hover:shadow-lg transition">
                  <h4 className="text-xl font-bold mb-2">{product.name}</h4>
                  <p className="text-3xl font-extrabold text-brand-600 mb-4">${product.price}</p>
                  <p className="text-gray-600 text-sm mb-6">{product.description}</p>
                  <ul className="space-y-2 mb-8">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleBuy(product.id)}
                    className="w-full py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition"
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SubscriptionsSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Monthly Subscriptions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Keep your competitive edge with recurring services. Get 20% off when you pay yearly.
          </p>
          <div className="inline-flex items-center bg-white rounded-full border border-gray-200 p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full font-semibold transition ${!isYearly ? 'bg-brand-600 text-white' : 'text-gray-600'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full font-semibold transition ${isYearly ? 'bg-brand-600 text-white' : 'text-gray-600'}`}
            >
              Yearly <span className="text-xs ml-1">(Save 20%)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTIONS.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl border border-gray-200 p-8">
              <h4 className="text-xl font-bold mb-2">{sub.name}</h4>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold">${isYearly ? sub.yearlyPrice : sub.monthlyPrice}</span>
                  <span className="text-gray-600 font-medium">/{isYearly ? 'mo' : 'mo'}</span>
                </div>
                {isYearly && (
                  <p className="text-sm text-gray-500 mt-2">Billed annually (${sub.yearlyPrice * 12}/year)</p>
                )}
                {!isYearly && (
                  <p className="text-sm text-gray-500 mt-2">Billed monthly</p>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-6">{sub.description}</p>
              <ul className="space-y-2 mb-8">
                {sub.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleBuy(sub.id)}
                className="w-full py-3 border-2 border-brand-600 text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition"
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Product Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between font-semibold hover:text-brand-600 transition"
              >
                {faq.q}
                <svg className={`w-5 h-5 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 px-4 bg-brand-600">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Launch?
        </h2>
        <p className="text-lg text-brand-100 mb-8 max-w-xl mx-auto">
          Start with a bundle and save big. Or mix and match individual products to build your perfect launch toolkit.
          One-time payments. No hidden fees. 100% money-back guarantee on plans.
        </p>
        <a href="#bundles" className="inline-block px-8 py-4 bg-white text-brand-600 font-bold rounded-xl hover:bg-gray-50 transition shadow-lg text-lg">
          Get Started Today
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} BizPlan Genius. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
          <a href="/terms" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</a>
          <a href="mailto:support@bizplangenius.com" className="text-sm text-gray-500 hover:text-gray-700">Contact</a>
        </div>
      </div>
    </footer>
  );
}

async function handleBuy(productId: string) {
  const email = prompt('Enter your email to get started:');
  if (!email) return;

  try {
    const res = await fetch('/api/universal-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, email }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Error: ' + (data.error || 'Could not create checkout'));
    }
  } catch (err) {
    console.error(err);
    alert('Error creating checkout session');
  }
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BundlesSection />
        <ProductsSection />
        <SubscriptionsSection />
        <FAQSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
