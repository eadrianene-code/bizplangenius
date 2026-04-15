'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: typeof window !== 'undefined' ? window.location.pathname : 'unknown' }),
      });
      if (res.ok) { setStatus('done'); setEmail(''); }
      else { setStatus('error'); }
    } catch { setStatus('error'); }
  };

  return (
    <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 sm:p-8">
      <div className="text-center max-w-md mx-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Get founder tactics by email</h3>
        <p className="text-sm text-gray-500 mb-4">Competitor research and business plan playbooks. No fluff, unsubscribe anytime.</p>
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'done'}
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none border bg-white text-gray-900 border-gray-200 focus:border-brand-400 placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'done'}
            className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition disabled:opacity-60"
          >
            {status === 'loading' ? '...' : status === 'done' ? 'Got it!' : 'Subscribe'}
          </button>
        </form>
        {status === 'error' && <p className="text-xs text-red-500 mt-2">Something went wrong. Try again.</p>}
        {status === 'done' && <p className="text-xs text-green-600 mt-2">Subscribed. Check your inbox soon.</p>}
      </div>
    </div>
  );
}
