'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const WEBSITE_TYPES = [
  { key: 'landing', label: 'Landing Page', price: 99, desc: 'Single-page marketing site with strong CTAs' },
  { key: 'ecommerce', label: 'E-commerce', price: 149, desc: 'Product showcase with shopping experience' },
  { key: 'booking', label: 'Booking Site', price: 129, desc: 'Service booking with appointment scheduling UI' },
  { key: 'restaurant', label: 'Restaurant', price: 129, desc: 'Menu, hours, location, and reservations' },
  { key: 'portfolio', label: 'Portfolio', price: 99, desc: 'Visual showcase of work and case studies' },
  { key: 'saas', label: 'SaaS Product', price: 199, desc: 'Feature-rich product page with pricing tiers' },
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

  // State
  const [step, setStep] = useState<'configure' | 'generating' | 'preview'>('configure');
  const [websiteType, setWebsiteType] = useState(urlType || 'landing');
  const [colorScheme, setColorScheme] = useState(urlColor || 'blue');
  const [email, setEmail] = useState('');
  const [extraInstructions, setExtraInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [businessName, setBusinessName] = useState('');

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
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      setGeneratedHtml(data.html);
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
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(businessName || 'website').toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generatedHtml);
  };

  const selectedType = WEBSITE_TYPES.find(t => t.key === websiteType);
  const price = selectedType?.price || 99;

  // No plan session -- show error
  if (!planSessionId && !sessionId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Build Your Business Website</h1>
          <p className="text-gray-600 mb-8">
            To build a website, you need a business plan first. The AI uses your plan data to create a website tailored to your specific business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/generate" className="px-8 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition">
              Generate a Business Plan First
            </a>
            <a href="/free-competitor-check" className="px-8 py-3 border-2 border-brand-300 text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition">
              Try Free Competitor Check
            </a>
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

  // Preview state
  if (step === 'preview' && generatedHtml) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <a href="/" className="text-lg font-bold text-gradient">BizPlan Genius</a>
            <span className="text-sm text-gray-500">Website Preview: {businessName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopyHtml} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
              Copy HTML
            </button>
            <button onClick={handleDownload} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition">
              Download HTML
            </button>
            <a href={`/dashboard?session_id=${sessionId}`} className="px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-700">
              My Toolkit
            </a>
          </div>
        </header>

        {/* Device toggle */}
        <div className="bg-white border-b px-4 py-2 flex items-center justify-center gap-2 flex-shrink-0">
          <DeviceToggle iframeRef={iframeRef} />
        </div>

        {/* Preview iframe */}
        <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
          <iframe
            ref={iframeRef}
            srcDoc={generatedHtml}
            className="bg-white shadow-2xl rounded-lg border transition-all duration-300"
            style={{ width: '100%', maxWidth: '1200px', height: 'calc(100vh - 140px)' }}
            title="Website Preview"
          />
        </div>
      </div>
    );
  }

  // Configure state (pre-checkout)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Build Your Business Website</h1>
          <p className="text-gray-600 text-lg">
            Our AI will create a custom, professional website based on your business plan data. Ready in under 2 minutes.
          </p>
        </div>

        <form onSubmit={handleCheckout} className="space-y-6">
          {/* Website Type */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Choose Your Website Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {WEBSITE_TYPES.map(type => (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => setWebsiteType(type.key)}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    websiteType === type.key
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-bold text-sm">{type.label}</span>
                    <span className="text-lg font-extrabold">${type.price}</span>
                  </div>
                  <p className="text-xs text-gray-500">{type.desc}</p>
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
