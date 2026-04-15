'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface EmailTemplate {
  id: number;
  type: string;
  name: string;
  scenario: string;
  subject: string;
  body: string;
  tips: string;
}

interface PackData {
  businessName: string;
  emails: EmailTemplate[];
}

const TYPE_COLORS: Record<string, string> = {
  cold_outreach: 'bg-blue-100 text-blue-700',
  warm_intro: 'bg-green-100 text-green-700',
  follow_up: 'bg-amber-100 text-amber-700',
  update: 'bg-purple-100 text-purple-700',
  meeting_request: 'bg-pink-100 text-pink-700',
};

function InvestorEmailsInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const planSessionId = searchParams.get('plan_session_id');

  const [step, setStep] = useState<'landing' | 'generating' | 'result'>('landing');
  const [pack, setPack] = useState<PackData | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(0);

  useEffect(() => {
    if (sessionId && planSessionId) generateEmails();
  }, []);

  const generateEmails = async () => {
    setStep('generating');
    setError('');
    try {
      const res = await fetch('/api/investor-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, planSessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPack(data.pack);
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
      const res = await fetch('/api/investor-emails-checkout', {
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

  const copyEmail = (subject: string, body: string, id: number) => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!planSessionId && !sessionId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Investor Email Templates</h1>
          <p className="text-gray-600 mb-8">Personalized fundraising emails. You need a business plan first.</p>
          <a href="/generate" className="px-8 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition">Generate a Business Plan First</a>
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
            <h1 className="text-3xl font-bold mb-2">Writing Your Investor Emails</h1>
            <p className="text-gray-600">Crafting 10 personalized outreach templates...</p>
          </div>
          <div className="bg-white rounded-2xl border p-8"><ProgressBar /></div>
        </main>
      </div>
    );
  }

  if (step === 'result' && pack) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
            <a href={`/dashboard?session_id=${sessionId}`} className="text-sm text-brand-600 hover:text-brand-700">My Toolkit</a>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Investor Email Templates</h1>
            <p className="text-gray-500 text-sm">{pack.businessName} -- {pack.emails.length} templates ready</p>
          </div>

          <div className="space-y-3">
            {pack.emails.map((tmpl) => {
              const isExpanded = expanded === tmpl.id;
              const typeColor = TYPE_COLORS[tmpl.type] || 'bg-gray-100 text-gray-700';

              return (
                <div key={tmpl.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : tmpl.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-6">#{tmpl.id}</span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{tmpl.name}</p>
                        <p className="text-xs text-gray-500">{tmpl.scenario}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColor}`}>
                        {tmpl.type.replace('_', ' ')}
                      </span>
                      <svg className={`w-4 h-4 text-gray-400 transition ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <div className="mt-4 mb-3">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Subject Line</p>
                        <p className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg px-3 py-2">{tmpl.subject}</p>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Email Body</p>
                        <div className="text-sm text-gray-700 bg-gray-50 rounded-lg px-4 py-3 whitespace-pre-wrap leading-relaxed">{tmpl.body}</div>
                      </div>

                      <div className="bg-amber-50 rounded-lg p-3 mb-4">
                        <p className="text-xs font-bold text-amber-700 uppercase mb-1">Tip</p>
                        <p className="text-xs text-amber-800">{tmpl.tips}</p>
                      </div>

                      <button
                        onClick={() => copyEmail(tmpl.subject, tmpl.body, tmpl.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${copied === tmpl.id ? 'bg-green-100 text-green-700' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
                      >
                        {copied === tmpl.id ? 'Copied!' : 'Copy Subject + Body'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // Landing
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Investor Email Templates</h1>
          <p className="text-gray-600 text-lg">10 personalized fundraising emails built from your business plan. Cold outreach, follow-ups, intros, and more.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">10 Email Templates -- What You Get</h3>
          <div className="space-y-3">
            {[
              { num: '1', name: 'Cold Outreach to VCs', desc: 'Formal, data-driven email to venture capital partners. Includes your market size and traction.', tag: 'cold' },
              { num: '2', name: 'Cold Outreach to Angels', desc: 'Casual, story-driven email to angel investors. Personal and compelling.', tag: 'cold' },
              { num: '3', name: 'Warm Intro Request', desc: 'Ask a mutual connection to introduce you to an investor. Polite and easy to forward.', tag: 'warm' },
              { num: '4', name: 'Follow-up (No Response)', desc: 'Gentle nudge 1 week after initial outreach. Adds new value without being pushy.', tag: 'follow' },
              { num: '5', name: 'Post-Meeting Follow-up', desc: 'Send within 24 hours of a call/meeting. Recaps key points and next steps.', tag: 'follow' },
              { num: '6', name: 'Monthly Investor Update', desc: 'Keep investors informed with metrics, wins, and asks. Builds trust over time.', tag: 'update' },
              { num: '7', name: 'Pitch Deck Share', desc: 'Attach your pitch deck with a compelling one-paragraph summary.', tag: 'cold' },
              { num: '8', name: 'Meeting Request', desc: 'Specific ask for a 15-minute call with a clear agenda.', tag: 'cold' },
              { num: '9', name: 'Thank You (After Funding)', desc: 'Gracious thank you after receiving investment. Sets the tone for the relationship.', tag: 'update' },
              { num: '10', name: 'Rejection Response', desc: 'Professional response that keeps the door open for future rounds.', tag: 'follow' },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">{t.num}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">Every template includes: subject line, full email body, [INVESTOR_NAME] placeholders, and a usage tip</p>
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
            {loading ? 'Processing...' : 'Get Investor Email Templates - $19'}
          </button>
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
        <span className="text-sm text-gray-500">Investor Emails</span>
      </div>
    </header>
  );
}

function ProgressBar() {
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState('Analyzing your business...');
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        if (next < 8) setStatus('Analyzing your business plan data...');
        else if (next < 20) setStatus('Crafting cold outreach templates...');
        else if (next < 35) setStatus('Writing follow-up sequences...');
        else if (next < 50) setStatus('Creating warm intro templates...');
        else if (next < 65) setStatus('Adding investor update emails...');
        else setStatus('Finalizing your email pack...');
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const progress = Math.min(90, (elapsed / 75) * 90);
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

export default function InvestorEmailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <InvestorEmailsInner />
    </Suspense>
  );
}
