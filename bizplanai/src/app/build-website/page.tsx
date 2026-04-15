'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const WEBSITE_TYPES = [
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

const COLOR_SCHEMES = [
  { key: 'blue', label: 'Professional Blue', color: '#2563eb' },
  { key: 'green', label: 'Fresh Green', color: '#16a34a' },
  { key: 'purple', label: 'Creative Purple', color: '#9333ea' },
  { key: 'red', label: 'Energetic Red', color: '#dc2626' },
  { key: 'dark', label: 'Dark Luxury', color: '#111827' },
  { key: 'minimal', label: 'Minimal B&W', color: '#374151' },
];

function BuildWebsiteInner() {
  const searchParams = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // URL params
  const sessionId = searchParams.get('session_id'); // website payment session
  const planSessionId = searchParams.get('plan_session_id');
  const urlType = searchParams.get('type');
  const urlColor = searchParams.get('color');

  interface SitePage { id: string; name: string; filename: string; html: string; }

  // State
  const [step, setStep] = useState<'configure' | 'generating' | 'preview'>('configure');
  const [websiteType, setWebsiteType] = useState(urlType || 'landing');
  const [colorScheme, setColorScheme] = useState(urlColor || 'blue');
  const [email, setEmail] = useState('');
  const [extraInstructions, setExtraInstructions] = useState('');
  const [paymentType, setPaymentType] = useState<'none' | 'stripe' | 'paypal' | 'square' | 'other'>('none');
  const [paymentLink, setPaymentLink] = useState('');
  const [multipleProducts, setMultipleProducts] = useState(false);
  const [productLinks, setProductLinks] = useState<Array<{ name: string; price: string; link: string }>>([
    { name: '', price: '', link: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pages, setPages] = useState<SitePage[]>([]);
  const [activePageId, setActivePageId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [planBusinessName, setPlanBusinessName] = useState('');
  const [planIndustry, setPlanIndustry] = useState('');

  // Backwards compat
  const generatedHtml = pages.find(p => p.id === activePageId)?.html || '';
  const setGeneratedHtml = (html: string) => {
    setPages(prev => prev.map(p => p.id === activePageId ? { ...p, html } : p));
  };

  // If we have a plan session, fetch business name for display
  useEffect(() => {
    if (planSessionId && !sessionId) {
      fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: planSessionId }),
      }).then(r => r.json()).then(data => {
        if (data.purchases) {
          const plan = data.purchases.find((p: any) => p.product === 'business_plan');
          if (plan) {
            setPlanBusinessName(plan.metadata?.businessName || '');
            setPlanIndustry(plan.metadata?.industry || '');
          }
        }
      }).catch(() => {});
    }
  }, [planSessionId, sessionId]);

  // If we have a session_id (paid), auto-generate
  useEffect(() => {
    if (sessionId && planSessionId && urlType) {
      generateWebsite();
    }
  }, []);

  const generateWebsite = async () => {
    if (!sessionId || !planSessionId) return;
    setStep('generating');
    setError('');

    try {
      const res = await fetch('/api/build-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          planSessionId,
          websiteType: urlType || websiteType,
          colorScheme: urlColor || colorScheme,
          extraInstructions,
          paymentType: paymentType !== 'none' ? paymentType : undefined,
          paymentLink: paymentLink || undefined,
          productLinks: multipleProducts ? productLinks.filter(p => p.name && p.link) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      const homePage: SitePage = { id: 'home', name: 'Home', filename: 'index.html', html: data.html };
      setPages([homePage]);
      setActivePageId('home');
      setBusinessName(data.businessName);
      setStep('preview');
    } catch (err: any) {
      setError(err.message);
      setStep('configure');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planSessionId || !email) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/website-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planSessionId,
          websiteType,
          colorScheme,
          email,
          extraInstructions,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Checkout failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (pages.length === 0) return;
    if (pages.length === 1) {
      // Single file download
      const blob = new Blob([pages[0].html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(businessName || 'website').toLowerCase().replace(/\s+/g, '-')}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Multi-page: download each file (zip would need a library)
      pages.forEach(page => {
        const blob = new Blob([page.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = page.filename;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generatedHtml);
  };

  const selectedType = WEBSITE_TYPES.find(t => t.key === websiteType);
  const price = selectedType?.price || 99;

  // No plan session -- show showcase page
  if (!planSessionId && !sessionId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">AI Website Builder</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-2">
              Our AI generates a complete, professional website tailored to your business.
              Choose from 6 website types, each designed for your specific industry.
            </p>
            <p className="text-sm text-gray-500">Multi-page support. Edit everything. Download the source code.</p>
          </div>

          {/* Website types showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {WEBSITE_TYPES.map(type => (
              <div key={type.key} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{type.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{type.label}</h3>
                    <p className="text-xs text-gray-500">{type.desc}</p>
                  </div>
                </div>
                <div className="space-y-1.5 mb-4">
                  {type.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-3.5 h-3.5 text-accent-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mb-3">Best for: {type.bestFor}</p>
                <p className="text-xl font-extrabold text-brand-600">${type.price}</p>
              </div>
            ))}
          </div>

          {/* What's included in every website */}
          <div className="bg-white rounded-2xl border p-8 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Every website includes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { title: 'Multi-page', desc: 'Add About, Services, Contact, and more' },
                { title: 'Fully editable', desc: 'Change text, prices, sections -- anything' },
                { title: 'Responsive', desc: 'Looks great on desktop, tablet, and mobile' },
                { title: 'Source code', desc: 'Download HTML/CSS and host anywhere' },
                { title: 'SEO ready', desc: 'Meta tags, titles, and descriptions included' },
                { title: 'Custom colors', desc: '6 color schemes or match your brand' },
                { title: 'Rename pages', desc: 'Call them whatever you want' },
                { title: 'Undo/redo', desc: 'Full edit history, never lose changes' },
              ].map((f, i) => (
                <div key={i}>
                  <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-brand-50 rounded-2xl p-8 border border-brand-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to build your website?</h2>
            <p className="text-gray-600 mb-6">You need a business plan first -- the AI uses your plan data to create a website tailored to your specific business.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/generate" className="px-8 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition shadow-lg shadow-brand-600/25">
                Generate a Business Plan - $29
              </a>
              <a href="/bundles" className="px-8 py-3 border-2 border-brand-300 text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition">
                Get Plan + Website Bundle
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Generating state
  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Building Your Website</h1>
            <p className="text-gray-600">Our AI is designing a custom website based on your business plan.</p>
          </div>
          <div className="bg-white rounded-2xl border p-8">
            <GenerationProgress />
          </div>
        </main>
      </div>
    );
  }

  // Preview state with editor
  if (step === 'preview' && pages.length > 0) {
    return <WebsiteEditor
      html={generatedHtml}
      businessName={businessName}
      sessionId={sessionId || ''}
      onUpdate={setGeneratedHtml}
      onDownload={handleDownload}
      onCopy={handleCopyHtml}
      iframeRef={iframeRef}
      pages={pages}
      activePageId={activePageId}
      onSelectPage={setActivePageId}
      onAddPage={(name: string, filename: string, html: string) => {
        const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        setPages(prev => [...prev, { id, name, filename, html }]);
        setActivePageId(id);
      }}
      onDeletePage={(id: string) => {
        if (pages.length <= 1) return;
        setPages(prev => prev.filter(p => p.id !== id));
        if (activePageId === id) setActivePageId(pages.find(p => p.id !== id)?.id || '');
      }}
      onRenamePage={(id: string, name: string, filename: string) => {
        setPages(prev => prev.map(p => p.id === id ? { ...p, name, filename } : p));
      }}
      planSessionId={planSessionId || ''}
      colorScheme={urlColor || colorScheme}
    />;
  }

  // Configure state (pre-checkout)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Build Your Business Website</h1>
          {planSessionId && planBusinessName ? (
            <div className="inline-block bg-accent-50 border border-accent-200 rounded-xl px-5 py-3 mb-2">
              <p className="text-accent-800 text-sm">Building website for <span className="font-bold">{planBusinessName}</span></p>
              <p className="text-accent-600 text-xs">All your business plan data will be used automatically</p>
            </div>
          ) : (
            <p className="text-gray-600 text-lg">
              Our AI will create a custom, professional website. Ready in under 2 minutes.
            </p>
          )}
        </div>

        <form onSubmit={handleCheckout} className="space-y-6">
          {/* Website Type */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-2">Choose Your Website Type</h2>
            <p className="text-sm text-gray-500 mb-4">Each type is specifically designed for your industry with relevant sections and layouts.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WEBSITE_TYPES.map(type => (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => setWebsiteType(type.key)}
                  className={`p-5 rounded-xl border-2 text-left transition ${
                    websiteType === type.key
                      ? 'border-brand-600 bg-brand-50 ring-1 ring-brand-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <span className="font-bold text-gray-900">{type.label}</span>
                        <p className="text-xs text-gray-500">{type.desc}</p>
                      </div>
                    </div>
                    <span className="text-lg font-extrabold text-brand-600 flex-shrink-0 ml-2">${type.price}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-3">
                    {type.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1 text-[11px] text-gray-600">
                        <svg className="w-3 h-3 text-accent-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">Best for: {type.bestFor}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color Scheme */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Choose Your Color Scheme</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {COLOR_SCHEMES.map(scheme => (
                <button
                  key={scheme.key}
                  type="button"
                  onClick={() => setColorScheme(scheme.key)}
                  className={`p-3 rounded-xl border-2 text-center transition ${
                    colorScheme === scheme.key
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: scheme.color }}
                  />
                  <p className="text-xs font-medium text-gray-700">{scheme.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Integration */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-2">Payment Integration</h2>
            <p className="text-sm text-gray-500 mb-4">How will your customers pay you? We'll add real payment buttons to your website.</p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {([
                { key: 'none', label: 'Skip for now', desc: 'Add later' },
                { key: 'stripe', label: 'Stripe', desc: 'Payment link' },
                { key: 'paypal', label: 'PayPal', desc: 'PayPal.me or button' },
                { key: 'square', label: 'Square', desc: 'Checkout link' },
                { key: 'other', label: 'Other', desc: 'Any payment URL' },
              ] as const).map(opt => (
                <button key={opt.key} type="button" onClick={() => setPaymentType(opt.key)}
                  className={`p-3 rounded-xl border-2 text-center transition ${
                    paymentType === opt.key ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <p className="text-sm font-bold text-gray-900">{opt.label}</p>
                  <p className="text-[10px] text-gray-500">{opt.desc}</p>
                </button>
              ))}
            </div>

            {paymentType !== 'none' && (
              <div className="space-y-4">
                {/* Single vs Multiple toggle */}
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setMultipleProducts(false)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${!multipleProducts ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    One link for everything
                  </button>
                  <button type="button" onClick={() => setMultipleProducts(true)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${multipleProducts ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    Different link per product/price
                  </button>
                </div>

                {!multipleProducts ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Link</label>
                    <input type="url" value={paymentLink} onChange={e => setPaymentLink(e.target.value)}
                      placeholder={paymentType === 'stripe' ? 'https://buy.stripe.com/your-link' : paymentType === 'paypal' ? 'https://paypal.me/yourname' : 'https://...'}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition" />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your products/services with payment links</label>
                    <div className="space-y-2">
                      {productLinks.map((pl, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <input type="text" value={pl.name} onChange={e => { const next = [...productLinks]; next[i].name = e.target.value; setProductLinks(next); }}
                            placeholder="Product name" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-400" />
                          <input type="text" value={pl.price} onChange={e => { const next = [...productLinks]; next[i].price = e.target.value; setProductLinks(next); }}
                            placeholder="Price" className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-400" />
                          <input type="url" value={pl.link} onChange={e => { const next = [...productLinks]; next[i].link = e.target.value; setProductLinks(next); }}
                            placeholder="Payment link" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-400" />
                          {productLinks.length > 1 && (
                            <button type="button" onClick={() => setProductLinks(productLinks.filter((_, j) => j !== i))}
                              className="p-2 text-gray-400 hover:text-red-500 transition"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => setProductLinks([...productLinks, { name: '', price: '', link: '' }])}
                      className="mt-2 text-sm text-brand-600 font-medium hover:text-brand-700">+ Add another product</button>
                  </div>
                )}

                <div className="p-3 bg-brand-50 rounded-lg border border-brand-100">
                  <p className="text-xs text-brand-800">
                    <span className="font-bold">How to get your link:</span>
                    {paymentType === 'stripe' && ' Go to dashboard.stripe.com > Payment Links > Create a link for each product/price. Copy the links.'}
                    {paymentType === 'paypal' && ' Go to paypal.me or create PayPal buttons from your dashboard for each product.'}
                    {paymentType === 'square' && ' Go to Square Dashboard > Online Checkout > Create a link per product.'}
                    {paymentType === 'other' && ' Paste payment URLs for each product.'}
                  </p>
                  <p className="text-xs text-brand-700 mt-1">Don't have links yet? Select "Skip for now" and add them later via the website editor.</p>
                </div>
              </div>
            )}
          </div>

          {/* Extra Instructions + Email */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Special Instructions <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={extraInstructions}
                onChange={e => setExtraInstructions(e.target.value)}
                placeholder="e.g., Include a section for team members, use our tagline 'Fresh food, fast delivery', emphasize sustainability..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
              />
            </div>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

          {/* Submit */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg disabled:opacity-60"
            >
              {loading ? 'Processing...' : `Build My Website - $${price}`}
            </button>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
              <span>One-time payment</span>
              <span>|</span>
              <span>Full source code included</span>
              <span>|</span>
              <span>Powered by Stripe</span>
            </div>
          </div>
        </form>

        {/* What you get */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4 text-center">What you'll get</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xl font-extrabold text-brand-600">Custom</p>
              <p className="text-xs text-gray-500">Built from your plan data</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-brand-600">Responsive</p>
              <p className="text-xs text-gray-500">Works on all devices</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-brand-600">Source</p>
              <p className="text-xs text-gray-500">Full HTML/CSS code</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-brand-600">2 min</p>
              <p className="text-xs text-gray-500">Ready to deploy</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
        <span className="text-sm text-gray-500">Website Builder</span>
      </div>
    </header>
  );
}

function GenerationProgress() {
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState('Analyzing your business plan...');

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        if (next < 10) setStatus('Analyzing your business plan...');
        else if (next < 25) setStatus('Designing layout and sections...');
        else if (next < 45) setStatus('Writing copy tailored to your business...');
        else if (next < 70) setStatus('Styling with your chosen color scheme...');
        else if (next < 90) setStatus('Making it responsive for all devices...');
        else setStatus('Finalizing your website...');
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const progress = Math.min(90, (elapsed / 100) * 90);

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{status}</span>
        <span className="text-gray-400">{elapsed}s</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full bg-brand-600 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function DeviceToggle({ iframeRef }: { iframeRef: React.RefObject<HTMLIFrameElement | null> }) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const setWidth = (d: 'desktop' | 'tablet' | 'mobile') => {
    setDevice(d);
    if (iframeRef.current) {
      const widths = { desktop: '100%', tablet: '768px', mobile: '375px' };
      iframeRef.current.style.maxWidth = widths[d];
    }
  };

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {(['desktop', 'tablet', 'mobile'] as const).map(d => (
        <button
          key={d}
          onClick={() => setWidth(d)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
            device === d ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {d.charAt(0).toUpperCase() + d.slice(1)}
        </button>
      ))}
    </div>
  );
}

interface SitePageType { id: string; name: string; filename: string; html: string; }

const QUICK_EDITS = [
  { label: 'Change prices', instruction: 'I want to update the pricing section.', icon: '💰' },
  { label: 'Edit hero text', instruction: 'I want to change the hero headline and subheadline.', icon: '✏️' },
  { label: 'Update services', instruction: 'I want to edit the services/features section.', icon: '🔧' },
  { label: 'Change about', instruction: 'I want to rewrite the about section.', icon: '📝' },
  { label: 'Edit contact', instruction: 'I want to update the contact section details.', icon: '📞' },
  { label: 'Add section', instruction: 'I want to add a new section to this page.', icon: '➕' },
];

const NEW_PAGE_TEMPLATES = [
  { name: 'About Us', filename: 'about.html', prompt: 'an About Us page with team bios, company story, mission, and values' },
  { name: 'Services', filename: 'services.html', prompt: 'a detailed Services page listing all services with descriptions and pricing' },
  { name: 'Contact', filename: 'contact.html', prompt: 'a Contact page with a form, map placeholder, business hours, and address' },
  { name: 'Blog', filename: 'blog.html', prompt: 'a Blog listing page with 3 sample article cards and sidebar' },
  { name: 'Pricing', filename: 'pricing.html', prompt: 'a dedicated Pricing page with comparison table and FAQ' },
  { name: 'FAQ', filename: 'faq.html', prompt: 'a FAQ page with 10 accordion-style questions and answers' },
  { name: 'Portfolio', filename: 'portfolio.html', prompt: 'a Portfolio/Gallery page showcasing work examples with descriptions' },
  { name: 'Testimonials', filename: 'testimonials.html', prompt: 'a Testimonials page with detailed customer reviews and case studies' },
  { name: 'Custom Page', filename: 'custom.html', prompt: '' },
];

function WebsiteEditor({
  html, businessName, sessionId, onUpdate, onDownload, onCopy, iframeRef,
  pages, activePageId, onSelectPage, onAddPage, onDeletePage, onRenamePage,
  planSessionId, colorScheme,
}: {
  html: string;
  businessName: string;
  sessionId: string;
  onUpdate: (html: string) => void;
  onDownload: () => void;
  onCopy: () => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  pages: SitePageType[];
  activePageId: string;
  onSelectPage: (id: string) => void;
  onAddPage: (name: string, filename: string, html: string) => void;
  onDeletePage: (id: string) => void;
  onRenamePage: (id: string, name: string, filename: string) => void;
  planSessionId: string;
  colorScheme: string;
}) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<'edit' | 'pages'>('edit');
  const [editInstruction, setEditInstruction] = useState('');
  const [addingPage, setAddingPage] = useState(false);
  const [newPageCustomPrompt, setNewPageCustomPrompt] = useState('');
  const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [history, setHistory] = useState<string[]>([html]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const applyEdit = async (instruction: string) => {
    if (!instruction.trim() || editLoading) return;
    setEditLoading(true);
    setEditError('');

    try {
      const res = await fetch('/api/edit-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentHtml: html,
          editInstruction: instruction,
          editType: 'section_edit',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const newHistory = [...history.slice(0, historyIndex + 1), data.html];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      onUpdate(data.html);
      setEditInstruction('');
    } catch (err: any) {
      setEditError(err.message || 'Failed to apply edit');
    } finally {
      setEditLoading(false);
    }
  };

  const handleRename = (pageId: string, newName: string) => {
    if (!newName.trim()) return;
    const newFilename = pageId === 'home' ? 'index.html' : newName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html';
    onRenamePage(pageId, newName.trim(), newFilename);
    setRenamingPageId(null);
    setRenameValue('');
  };

  const updateAllNavigation = async () => {
    // When user is ready, update nav links across all pages
    const navItems = pages.map(p => `${p.name} (${p.filename})`).join(', ');
    setEditLoading(true);
    try {
      const res = await fetch('/api/edit-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentHtml: html,
          editInstruction: `Update the navigation bar to include links to these pages in this order: ${navItems}. Use the filenames as href values. Keep the same nav design style.`,
          editType: 'section_edit',
        }),
      });
      const data = await res.json();
      if (res.ok && data.html) {
        const newHistory = [...history.slice(0, historyIndex + 1), data.html];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        onUpdate(data.html);
      }
    } catch {}
    setEditLoading(false);
  };

  const addNewPage = async (template: typeof NEW_PAGE_TEMPLATES[0]) => {
    setAddingPage(true);
    setEditError('');
    try {
      const pagePrompt = template.prompt || newPageCustomPrompt;
      if (!pagePrompt) { setEditError('Describe what the page should contain'); setAddingPage(false); return; }

      // Get nav links from existing pages
      const navLinks = pages.map(p => `<a href="${p.filename}">${p.name}</a>`).join(' | ');

      const res = await fetch('/api/edit-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentHtml: pages[0]?.html || '',
          editInstruction: `Generate a COMPLETELY NEW, separate HTML page for: ${pagePrompt}

This is for the business "${businessName}". Match the SAME design style, colors, fonts, and layout as the existing homepage HTML provided.

IMPORTANT:
- This is a NEW page, not an edit of the existing one
- Include the same navigation bar with links to: ${pages.map(p => p.name).join(', ')}, and this new page "${template.name}"
- Include the same footer as the homepage
- Use the same Tailwind CSS CDN and color scheme
- Make it a complete standalone HTML document
- Navigation links should use relative hrefs (e.g., index.html, about.html)`,
          editType: 'full_regenerate',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onAddPage(template.name, template.filename, data.html);
      setNewPageCustomPrompt('');
    } catch (err: any) {
      setEditError(err.message || 'Failed to create page');
    } finally {
      setAddingPage(false);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onUpdate(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onUpdate(history[historyIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <a href="/" className="text-lg font-bold text-gradient">BizPlan Genius</a>
          <span className="text-sm text-gray-500 hidden sm:inline">{businessName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={undo} disabled={historyIndex === 0}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition" title="Undo">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" /></svg>
          </button>
          <button onClick={redo} disabled={historyIndex === history.length - 1}
            className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition" title="Redo">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v2m15-7l-4-4m4 4l-4 4" /></svg>
          </button>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <button onClick={() => setEditorOpen(!editorOpen)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${editorOpen ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {editorOpen ? 'Close Editor' : 'Edit Website'}
          </button>
          <button onClick={onCopy} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition hidden sm:block">
            Copy HTML
          </button>
          <button onClick={onDownload} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition">
            Download
          </button>
          <a href="/domain-guide" className="px-4 py-2 text-sm font-medium text-accent-600 bg-accent-50 rounded-lg hover:bg-accent-100 transition hidden sm:block">
            Go Live
          </a>
        </div>
      </header>

      {/* Page tabs + Device toggle */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          {pages.map(page => (
            renamingPageId === page.id ? (
              <form key={page.id} onSubmit={e => { e.preventDefault(); handleRename(page.id, renameValue); }} className="flex items-center">
                <input
                  autoFocus
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onBlur={() => { if (renameValue.trim()) handleRename(page.id, renameValue); else setRenamingPageId(null); }}
                  onKeyDown={e => { if (e.key === 'Escape') setRenamingPageId(null); }}
                  className="px-2 py-1 rounded-lg text-xs font-medium border-2 border-brand-400 outline-none w-24"
                />
              </form>
            ) : (
              <button key={page.id}
                onClick={() => onSelectPage(page.id)}
                onDoubleClick={() => { setRenamingPageId(page.id); setRenameValue(page.name); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  activePageId === page.id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Double-click to rename">
                {page.name}
              </button>
            )
          ))}
          <button onClick={() => { setEditorOpen(true); setEditorTab('pages'); }}
            className="px-2 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition" title="Add page">
            +
          </button>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <DeviceToggle iframeRef={iframeRef} />
          <span className="text-xs text-gray-400 ml-2 hidden sm:inline">v{historyIndex + 1}/{history.length}</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Preview */}
        <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
          <iframe
            ref={iframeRef as any}
            srcDoc={html}
            className="bg-white shadow-2xl rounded-lg border transition-all duration-300"
            style={{ width: '100%', maxWidth: '1200px', height: 'calc(100vh - 140px)' }}
            title="Website Preview"
          />
        </div>

        {/* Editor panel */}
        {editorOpen && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
            {/* Editor tabs */}
            <div className="flex border-b border-gray-100">
              <button onClick={() => setEditorTab('edit')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${editorTab === 'edit' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:text-gray-700'}`}>
                Edit Page
              </button>
              <button onClick={() => setEditorTab('pages')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${editorTab === 'pages' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:text-gray-700'}`}>
                Pages ({pages.length})
              </button>
            </div>

            {editorTab === 'pages' ? (
              <div className="flex-1 overflow-y-auto">
                {/* Existing pages */}
                <div className="p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Your Pages</p>
                  <div className="space-y-2">
                    {pages.map(page => (
                      <div key={page.id} className={`flex items-center justify-between p-3 rounded-lg border transition ${
                        activePageId === page.id ? 'border-brand-300 bg-brand-50' : 'border-gray-100 hover:border-gray-200'
                      }`}>
                        {renamingPageId === page.id ? (
                          <form onSubmit={e => { e.preventDefault(); handleRename(page.id, renameValue); }} className="flex-1 mr-2">
                            <input autoFocus value={renameValue} onChange={e => setRenameValue(e.target.value)}
                              onBlur={() => { if (renameValue.trim()) handleRename(page.id, renameValue); else setRenamingPageId(null); }}
                              onKeyDown={e => { if (e.key === 'Escape') setRenamingPageId(null); }}
                              className="w-full px-2 py-1 text-sm border-2 border-brand-400 rounded-lg outline-none" />
                          </form>
                        ) : (
                          <button onClick={() => { onSelectPage(page.id); setEditorTab('edit'); }} className="text-left flex-1">
                            <p className="text-sm font-medium text-gray-900">{page.name}</p>
                            <p className="text-xs text-gray-400">{page.filename}</p>
                          </button>
                        )}
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setRenamingPageId(page.id); setRenameValue(page.name); }}
                            className="p-1 text-gray-400 hover:text-brand-600 transition" title="Rename page">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          {page.id !== 'home' && (
                            <button onClick={() => { if (confirm(`Delete "${page.name}"?`)) onDeletePage(page.id); }}
                              className="p-1 text-gray-400 hover:text-red-500 transition" title="Delete page">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Update nav button */}
                    {pages.length > 1 && (
                      <button onClick={updateAllNavigation} disabled={editLoading}
                        className="w-full mt-3 px-3 py-2 text-xs font-medium text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 transition disabled:opacity-50">
                        {editLoading ? 'Updating...' : 'Sync navigation across pages'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Add new page */}
                <div className="p-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Add New Page</p>
                  <div className="space-y-1.5">
                    {NEW_PAGE_TEMPLATES.filter(t => t.name !== 'Custom Page').map((tmpl, i) => {
                      const exists = pages.some(p => p.filename === tmpl.filename);
                      return (
                        <button key={i} onClick={() => !exists && !addingPage && addNewPage(tmpl)} disabled={exists || addingPage}
                          className={`w-full text-left p-2.5 rounded-lg border text-sm transition ${
                            exists ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 hover:border-brand-300 hover:bg-brand-50'
                          }`}>
                          <span className="font-medium">{tmpl.name}</span>
                          {exists && <span className="text-xs text-gray-400 ml-2">(added)</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom page */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Custom Page</p>
                    <textarea
                      value={newPageCustomPrompt}
                      onChange={e => setNewPageCustomPrompt(e.target.value)}
                      placeholder="Describe your custom page, e.g., 'A team page with 4 team members and their bios'"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none resize-none focus:border-brand-400"
                    />
                    <button
                      onClick={() => addNewPage({ name: 'Custom', filename: `custom-${Date.now()}.html`, prompt: newPageCustomPrompt })}
                      disabled={addingPage || !newPageCustomPrompt.trim()}
                      className="mt-2 w-full px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 transition disabled:opacity-50">
                      {addingPage ? 'Generating page...' : 'Create Custom Page'}
                    </button>
                  </div>

                  {editError && <p className="text-xs text-red-600 mt-2">{editError}</p>}
                </div>
              </div>
            ) : (
            <>
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Edit: {pages.find(p => p.id === activePageId)?.name || 'Page'}</h3>
              <p className="text-xs text-gray-500 mt-1">Describe what you want to change. AI will update the website.</p>
            </div>

            {/* Quick edits */}
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Edits</p>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_EDITS.map((edit, i) => (
                  <button key={i} onClick={() => setEditInstruction(edit.instruction)}
                    className="text-left p-2 rounded-lg border border-gray-100 hover:border-brand-300 hover:bg-brand-50 transition text-xs">
                    <span className="block">{edit.icon} {edit.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Edit input */}
            <div className="flex-1 p-4 flex flex-col">
              <textarea
                value={editInstruction}
                onChange={e => setEditInstruction(e.target.value)}
                placeholder="e.g., Change the pricing to: Basic $29/mo, Pro $59/mo, Enterprise $149/mo. Update the hero headline to 'Fresh Food, Fast Delivery'..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none resize-none focus:border-brand-400 flex-1"
              />

              {editError && <p className="text-xs text-red-600 mt-2">{editError}</p>}

              <button
                onClick={() => applyEdit(editInstruction)}
                disabled={editLoading || !editInstruction.trim()}
                className="mt-3 w-full px-4 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition disabled:opacity-50 text-sm"
              >
                {editLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Applying changes...
                  </span>
                ) : 'Apply Changes'}
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-2">
                {history.length > 1 ? `${history.length - 1} edit${history.length > 2 ? 's' : ''} applied. Undo available.` : 'No edits yet.'}
              </p>
            </div>

            {/* Tips */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tips</p>
              <ul className="text-[10px] text-gray-500 space-y-1">
                <li>Be specific: "Change Basic price to $29/mo"</li>
                <li>You can edit multiple things at once</li>
                <li>Use Undo if you don't like a change</li>
              </ul>
            </div>
            </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BuildWebsitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <BuildWebsiteInner />
    </Suspense>
  );
}
