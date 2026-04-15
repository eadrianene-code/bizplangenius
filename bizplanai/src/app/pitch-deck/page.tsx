'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Slide {
  slideNumber: number;
  title: string;
  type: string;
  content: string;
  bullets: string[];
  speakerNotes: string;
}

interface DeckData {
  title: string;
  tagline: string;
  slides: Slide[];
}

const SLIDE_COLORS: Record<string, { bg: string; accent: string }> = {
  cover: { bg: 'from-blue-900 to-blue-700', accent: 'text-blue-200' },
  problem: { bg: 'from-red-800 to-red-600', accent: 'text-red-200' },
  solution: { bg: 'from-green-800 to-green-600', accent: 'text-green-200' },
  market: { bg: 'from-purple-800 to-purple-600', accent: 'text-purple-200' },
  product: { bg: 'from-indigo-800 to-indigo-600', accent: 'text-indigo-200' },
  business_model: { bg: 'from-emerald-800 to-emerald-600', accent: 'text-emerald-200' },
  traction: { bg: 'from-amber-800 to-amber-600', accent: 'text-amber-200' },
  competition: { bg: 'from-rose-800 to-rose-600', accent: 'text-rose-200' },
  team: { bg: 'from-cyan-800 to-cyan-600', accent: 'text-cyan-200' },
  financials: { bg: 'from-violet-800 to-violet-600', accent: 'text-violet-200' },
  ask: { bg: 'from-orange-800 to-orange-600', accent: 'text-orange-200' },
  closing: { bg: 'from-blue-900 to-blue-700', accent: 'text-blue-200' },
};

function PitchDeckInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const planSessionId = searchParams.get('plan_session_id');

  const [step, setStep] = useState<'landing' | 'generating' | 'viewer'>('landing');
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionId && planSessionId) {
      generateDeck();
    }
  }, []);

  const generateDeck = async () => {
    setStep('generating');
    setError('');

    try {
      const res = await fetch('/api/pitch-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, planSessionId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      setDeck(data.deck);
      setBusinessName(data.businessName);
      setStep('viewer');
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
      const res = await fetch('/api/pitch-deck-checkout', {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!deck) return;
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      setCurrentSlide(prev => Math.min(prev + 1, deck.slides.length - 1));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setCurrentSlide(prev => Math.max(prev - 1, 0));
    }
  };

  // No plan session
  if (!planSessionId && !sessionId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">AI Pitch Deck Generator</h1>
          <p className="text-gray-600 mb-8">
            Generate an investor-ready pitch deck from your business plan. You need a business plan first.
          </p>
          <a href="/generate" className="px-8 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition">
            Generate a Business Plan First
          </a>
        </main>
      </div>
    );
  }

  // Generating
  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Creating Your Pitch Deck</h1>
            <p className="text-gray-600">Designing 12 investor-ready slides from your business plan...</p>
          </div>
          <div className="bg-white rounded-2xl border p-8">
            <ProgressBar />
          </div>
        </main>
      </div>
    );
  }

  // Slide viewer
  if (step === 'viewer' && deck) {
    const slide = deck.slides[currentSlide];
    const colors = SLIDE_COLORS[slide.type] || SLIDE_COLORS.cover;

    return (
      <div className="min-h-screen bg-gray-900 flex flex-col" onKeyDown={handleKeyDown} tabIndex={0}>
        {/* Top bar */}
        <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <a href="/" className="text-lg font-bold text-white">BizPlan Genius</a>
            <span className="text-sm text-gray-400">{deck.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!deck) return;
                const content = deck.slides.map(s =>
                  `SLIDE ${s.slideNumber}: ${s.title}\n${s.content}\n\nBullets:\n${(s.bullets || []).map(b => `- ${b}`).join('\n')}\n\nSpeaker Notes:\n${s.speakerNotes}\n\n---\n`
                ).join('\n');
                const blob = new Blob([`${deck.title}\n${businessName}\n\n${content}`], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${businessName.toLowerCase().replace(/\s+/g, '-')}-pitch-deck.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
            >
              Download Text
            </button>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${showNotes ? 'bg-brand-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Speaker Notes
            </button>
            <a href={`/dashboard?session_id=${sessionId}`} className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white">
              My Toolkit
            </a>
          </div>
        </header>

        {/* Slide area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className={`w-full max-w-4xl aspect-[16/9] rounded-2xl bg-gradient-to-br ${colors.bg} shadow-2xl p-12 flex flex-col justify-between relative overflow-hidden`}>
            {/* Slide number */}
            <div className="absolute top-6 right-8 text-white/30 text-sm font-mono">
              {slide.slideNumber} / {deck.slides.length}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
              {slide.type === 'cover' ? (
                <div className="text-center">
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">{businessName}</h1>
                  <p className={`text-xl ${colors.accent}`}>{deck.tagline}</p>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-white mb-6">{slide.title}</h2>
                  <p className={`text-lg mb-6 ${colors.accent}`}>{slide.content}</p>
                  {slide.bullets && slide.bullets.length > 0 && (
                    <ul className="space-y-3">
                      {slide.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3 text-white/90">
                          <span className="w-2 h-2 rounded-full bg-white/50 mt-2 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-white/30 text-xs">
              <span>{businessName}</span>
              <span>Confidential</span>
            </div>
          </div>

          {/* Speaker notes */}
          {showNotes && slide.speakerNotes && (
            <div className="w-full max-w-4xl mt-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Speaker Notes</p>
              <p className="text-sm text-gray-300">{slide.speakerNotes}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition disabled:opacity-30"
          >
            Previous
          </button>

          {/* Slide thumbnails */}
          <div className="flex gap-1.5">
            {deck.slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-8 h-1.5 rounded-full transition ${i === currentSlide ? 'bg-brand-500' : 'bg-gray-600 hover:bg-gray-500'}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide(prev => Math.min(prev + 1, deck.slides.length - 1))}
            disabled={currentSlide === deck.slides.length - 1}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Landing / checkout
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">AI Pitch Deck Generator</h1>
          <p className="text-gray-600 text-lg">
            Generate a 12-slide investor-ready pitch deck from your business plan. Includes speaker notes for every slide.
          </p>
        </div>

        {/* What's included */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">12 Slides Included</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {['Cover', 'Problem', 'Solution', 'Market Size', 'Product', 'Business Model',
              'Traction', 'Competition', 'Team', 'Financials', 'The Ask', 'Closing'].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-accent-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {s}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleCheckout} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
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

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/25 text-lg disabled:opacity-60"
          >
            {loading ? 'Processing...' : 'Generate My Pitch Deck - $39'}
          </button>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>One-time payment</span>
            <span>|</span>
            <span>12 slides with speaker notes</span>
            <span>|</span>
            <span>Built from your plan data</span>
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
        <span className="text-sm text-gray-500">Pitch Deck Generator</span>
      </div>
    </header>
  );
}

function ProgressBar() {
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState('Reading your business plan...');

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        if (next < 8) setStatus('Reading your business plan...');
        else if (next < 20) setStatus('Researching market data for your slides...');
        else if (next < 35) setStatus('Designing slide layouts...');
        else if (next < 50) setStatus('Writing compelling slide copy...');
        else if (next < 65) setStatus('Creating financial projections slides...');
        else if (next < 80) setStatus('Writing speaker notes...');
        else setStatus('Finalizing your pitch deck...');
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const progress = Math.min(90, (elapsed / 90) * 90);

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

export default function PitchDeckPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <PitchDeckInner />
    </Suspense>
  );
}
