'use client';

import { useState } from 'react';

export default function ReferPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [clicks, setClicks] = useState(0);
  const [signups, setSignups] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/refer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'create' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCode(data.code);
      setClicks(data.clicks);
      setSignups(data.signups);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const referralUrl = `https://www.bizplangenius.com/?ref=${code}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `I found this AI tool that creates business plans with real competitor data in minutes. Try their free competitor check: ${referralUrl}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <span className="text-sm text-gray-500">Referral Program</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Refer & Earn</h1>
          <p className="text-gray-600 text-lg">
            Share BizPlan Genius with other founders. When they sign up using your link, you both benefit.
          </p>
        </div>

        {!code ? (
          <>
            {/* How it works */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">How it works</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-600 font-bold">1</div>
                  <p className="font-semibold text-sm text-gray-900">Get your link</p>
                  <p className="text-xs text-gray-500 mt-1">Enter your email to generate a unique referral link</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-600 font-bold">2</div>
                  <p className="font-semibold text-sm text-gray-900">Share it</p>
                  <p className="text-xs text-gray-500 mt-1">Share on social media, email, or directly with founders you know</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-600 font-bold">3</div>
                  <p className="font-semibold text-sm text-gray-900">Earn rewards</p>
                  <p className="text-xs text-gray-500 mt-1">When people sign up through your link, you earn credit toward free products</p>
                </div>
              </div>
            </div>

            {/* Get your link */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition disabled:opacity-60">
                {loading ? 'Generating...' : 'Get My Referral Link'}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Referral dashboard */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Your Referral Link</h3>
              <div className="flex gap-2 mb-4">
                <input type="text" readOnly value={referralUrl}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono" />
                <button onClick={copyLink}
                  className={`px-4 py-3 rounded-lg font-semibold text-sm transition ${copied ? 'bg-green-100 text-green-700' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-gray-900">{clicks}</p>
                  <p className="text-xs text-gray-500">Link clicks</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-gray-900">{signups}</p>
                  <p className="text-xs text-gray-500">Signups</p>
                </div>
              </div>

              {/* Share buttons */}
              <h4 className="font-semibold text-sm text-gray-700 mb-3">Share on:</h4>
              <div className="flex flex-wrap gap-2">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
                  Twitter / X
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition">
                  LinkedIn
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 transition">
                  Facebook
                </a>
                <a href={`mailto:?subject=Check out BizPlan Genius&body=${encodeURIComponent(shareText)}`}
                  className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-500 transition">
                  Email
                </a>
                <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-500 transition">
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Suggested messages */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Copy-paste messages</h3>
              <div className="space-y-3">
                {[
                  `Just found an AI tool that creates business plans with real competitor data in minutes. Way better than ChatGPT for this. They have a free competitor check too: ${referralUrl}`,
                  `If you're working on a business plan, check out BizPlan Genius. It researches your actual competitors and creates an investor-ready plan. Try their free tool: ${referralUrl}`,
                  `This saved me weeks of work. BizPlan Genius generates business plans, websites, pitch decks, and more from one business description. Free competitor check: ${referralUrl}`,
                ].map((msg, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 mb-2">{msg}</p>
                    <button onClick={() => { navigator.clipboard.writeText(msg); }}
                      className="text-xs text-brand-600 font-semibold hover:text-brand-700">Copy message</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
