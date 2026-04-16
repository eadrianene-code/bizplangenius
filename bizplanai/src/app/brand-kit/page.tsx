'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StandaloneBusinessForm from '../components/StandaloneBusinessForm';

interface LogoConcept {
  name: string;
  description: string;
  style: string;
  symbolism: string;
  cssPreview: {
    fontFamily: string;
    fontWeight: string;
    fontSize: string;
    color: string;
    letterSpacing: string;
    textTransform: string;
    icon: string;
  };
}

interface BrandKit {
  businessName: string;
  tagline: string;
  brandStory: string;
  logoConceptss: LogoConcept[];
  colorPalette: {
    primary: { hex: string; name: string; usage: string };
    secondary: { hex: string; name: string; usage: string };
    accent: { hex: string; name: string; usage: string };
    dark: { hex: string; name: string; usage: string };
    light: { hex: string; name: string; usage: string };
    rationale: string;
  };
  typography: { headingFont: string; bodyFont: string; rationale: string };
  brandVoice: { tone: string[]; doSay: string[]; dontSay: string[]; elevator_pitch: string };
  socialMediaGuidelines: { profileBio: string; postingTone: string; visualStyle: string };
}

function BrandKitInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const planSessionId = searchParams.get('plan_session_id');

  const [step, setStep] = useState<'landing' | 'generating' | 'result'>('landing');
  const [kit, setKit] = useState<BrandKit | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionId && planSessionId) generateKit();
  }, []);

  const generateKit = async () => {
    setStep('generating');
    setError('');
    try {
      const res = await fetch('/api/brand-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, planSessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setKit(data.kit);
      setStep('result');
    } catch (err: any) {
      setError(err.message);
      setStep('landing');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planSessionId || !email) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/brand-kit-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planSessionId, email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error('Checkout failed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!planSessionId && !sessionId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">Logo & Brand Kit</h1>
            <p className="text-gray-600 text-lg">3 logo concepts, color palette, typography, and brand voice, tailored to your business.</p>
          </div>
          <StandaloneBusinessForm productName="Brand Kit" productPrice={29} checkoutEndpoint="/api/brand-kit-checkout" />
        </main>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Creating Your Brand Kit</h1>
            <p className="text-gray-600">Designing your brand identity from your business plan data...</p>
          </div>
          <div className="bg-white rounded-2xl border p-8"><ProgressBar /></div>
        </main>
      </div>
    );
  }

  if (step === 'result' && kit) {
    const palette = kit.colorPalette;
    const colors = [palette.primary, palette.secondary, palette.accent, palette.dark, palette.light];

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
            <a href={`/dashboard?session_id=${sessionId}`} className="text-sm text-brand-600 hover:text-brand-700">My Toolkit</a>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Brand Kit: {kit.businessName}</h1>
            <p className="text-gray-500 italic mt-1">"{kit.tagline}"</p>
            <p className="text-gray-600 text-sm mt-2">{kit.brandStory}</p>
          </div>

          {/* Logo Concepts */}
          <section className="bg-white rounded-2xl border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Logo Concepts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(kit.logoConceptss || []).map((logo, i) => (
                <div key={i} className="border rounded-xl p-6 text-center">
                  <div className="h-24 flex items-center justify-center mb-4" style={{ backgroundColor: palette.light?.hex || '#f8f8f8' }}>
                    <span style={{
                      fontFamily: logo.cssPreview?.fontFamily || 'Arial',
                      fontWeight: logo.cssPreview?.fontWeight || 'bold',
                      fontSize: '28px',
                      color: logo.cssPreview?.color || palette.primary?.hex || '#333',
                      letterSpacing: logo.cssPreview?.letterSpacing || '1px',
                      textTransform: (logo.cssPreview?.textTransform || 'none') as any,
                    }}>
                      {logo.cssPreview?.icon && <span className="mr-2">{logo.cssPreview.icon}</span>}
                      {kit.businessName}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">{logo.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{logo.style}</p>
                  <p className="text-xs text-gray-600">{logo.description}</p>
                  <p className="text-xs text-gray-400 mt-2 italic">{logo.symbolism}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Color Palette */}
          <section className="bg-white rounded-2xl border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Color Palette</h2>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {colors.map((c, i) => (
                <div key={i} className="text-center">
                  <div className="w-full aspect-square rounded-xl mb-2 border" style={{ backgroundColor: c?.hex || '#ccc' }} />
                  <p className="text-xs font-bold text-gray-900">{c?.name || 'Color'}</p>
                  <p className="text-xs text-gray-500 font-mono">{c?.hex || '#000'}</p>
                  <p className="text-xs text-gray-400 mt-1">{c?.usage || ''}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{palette.rationale}</p>
          </section>

          {/* Typography */}
          <section className="bg-white rounded-2xl border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Typography</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Heading Font</p>
                <p className="text-2xl font-bold text-gray-900">{kit.typography.headingFont}</p>
                <p className="text-lg font-bold mt-1" style={{ fontFamily: kit.typography.headingFont }}>The quick brown fox jumps</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Body Font</p>
                <p className="text-2xl font-bold text-gray-900">{kit.typography.bodyFont}</p>
                <p className="text-lg mt-1" style={{ fontFamily: kit.typography.bodyFont }}>The quick brown fox jumps</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-4">{kit.typography.rationale}</p>
          </section>

          {/* Brand Voice */}
          <section className="bg-white rounded-2xl border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Brand Voice</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {(kit.brandVoice.tone || []).map((t, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: palette.primary?.hex + '20', color: palette.primary?.hex }}>{t}</span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs font-bold text-green-700 uppercase mb-2">Do Say</p>
                {(kit.brandVoice.doSay || []).map((s, i) => (
                  <p key={i} className="text-sm text-green-800 mb-1">"{s}"</p>
                ))}
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-xs font-bold text-red-700 uppercase mb-2">Don't Say</p>
                {(kit.brandVoice.dontSay || []).map((s, i) => (
                  <p key={i} className="text-sm text-red-800 mb-1">"{s}"</p>
                ))}
              </div>
            </div>
            <div className="bg-brand-50 rounded-lg p-4">
              <p className="text-xs font-bold text-brand-700 uppercase mb-2">Elevator Pitch</p>
              <p className="text-sm text-brand-800">{kit.brandVoice.elevator_pitch}</p>
            </div>
          </section>

          {/* Social Media Guidelines */}
          <section className="bg-white rounded-2xl border p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Social Media Guidelines</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Profile Bio (ready to copy)</p>
                <p className="text-sm text-gray-800">{kit.socialMediaGuidelines.profileBio}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Posting Tone</p>
                  <p className="text-sm text-gray-600">{kit.socialMediaGuidelines.postingTone}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Visual Style</p>
                  <p className="text-sm text-gray-600">{kit.socialMediaGuidelines.visualStyle}</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Landing / checkout
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Logo & Brand Kit</h1>
          <p className="text-gray-600 text-lg">AI-generated brand identity tailored to your business. Logo concepts, colors, typography, and voice guidelines.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">What you'll receive</h3>
          <div className="space-y-4">
            {[
              { title: '3 Logo Concepts', desc: 'Three distinct logo designs with different styles (minimalist, modern, classic). Each shows your business name styled with colors and icons. Preview them side by side and pick your favorite.', icon: '🎨' },
              { title: '5-Color Brand Palette', desc: 'Primary, secondary, accent, dark, and light colors with hex codes. Each color includes usage guidelines (e.g., "Use for headings", "Use for CTA buttons").', icon: '🎨' },
              { title: 'Typography Pairing', desc: 'Recommended heading and body fonts (Google Fonts compatible). Includes rationale for why these fonts match your brand personality.', icon: '🔤' },
              { title: 'Brand Voice Guidelines', desc: 'Your brand\'s tone defined in 3 adjectives. Includes "Do Say" examples (phrases to use) and "Don\'t Say" examples (phrases to avoid).', icon: '🗣️' },
              { title: 'Elevator Pitch', desc: 'A ready-to-use 30-second pitch for your business. Perfect for networking, investor meetings, and social bios.', icon: '🎤' },
              { title: 'Social Media Kit', desc: 'Ready-to-paste profile bio (160 chars), posting tone guide, and visual style recommendations for consistency across platforms.', icon: '📱' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleCheckout} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
          </div>
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg disabled:opacity-60">
            {loading ? 'Processing...' : 'Get My Brand Kit - $29'}
          </button>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>One-time payment</span><span>|</span><span>Complete brand identity</span><span>|</span><span>Built from your plan</span>
          </div>
        </form>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
        <span className="text-sm text-gray-500">Logo & Brand Kit</span>
      </div>
    </header>
  );
}

function ProgressBar() {
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState('Analyzing your brand...');
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        if (next < 8) setStatus('Analyzing your business identity...');
        else if (next < 20) setStatus('Designing logo concepts...');
        else if (next < 35) setStatus('Selecting color palette...');
        else if (next < 50) setStatus('Choosing typography...');
        else if (next < 65) setStatus('Crafting brand voice...');
        else setStatus('Finalizing your brand kit...');
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const progress = Math.min(90, (elapsed / 80) * 90);
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{status}</span>
        <span className="text-gray-400">{elapsed}s</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div className="h-full rounded-full bg-brand-600 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default function BrandKitPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <BrandKitInner />
    </Suspense>
  );
}
