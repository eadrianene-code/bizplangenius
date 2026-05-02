'use client';

import { useState } from 'react';

interface SocialPost {
  text?: string;
  caption?: string;
  hook: string;
  carouselIdea?: string;
}

interface Results {
  twitter: SocialPost;
  linkedin: SocialPost;
  instagram: SocialPost;
  facebook: SocialPost;
}

const PLATFORMS = [
  { key: 'twitter', label: 'Twitter / X', color: 'bg-gray-900', field: 'text' },
  { key: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700', field: 'text' },
  { key: 'instagram', label: 'Instagram', color: 'bg-pink-600', field: 'caption' },
  { key: 'facebook', label: 'Facebook', color: 'bg-blue-600', field: 'text' },
] as const;

const ONE_CLICK_TOPICS = [
  { label: 'Promote Free Competitor Check', icon: '🔍', input: 'We have a free AI tool that finds your top 3 competitors in 30 seconds. No payment, no signup. Just describe your business idea and get instant competitor analysis with strengths and weaknesses. Try it at bizplangenius.com/free-competitor-check', inputType: 'product' as const },
  { label: 'Promote Idea Validator', icon: '💡', input: 'We built a free tool that scores your business idea 1-10 using real market data. It checks market demand, competition, revenue potential, barriers to entry, and timing. Get an honest assessment at bizplangenius.com/validate-idea', inputType: 'product' as const },
  { label: 'Promote Name Generator', icon: '✨', input: 'Starting a business but stuck on the name? Our free AI generates 10 unique business name ideas with taglines and domain suggestions. Try it at bizplangenius.com/business-name-generator', inputType: 'product' as const },
  { label: 'Promote Full Business Kit', icon: '💼', input: 'BizPlan Genius lets you walk in with just an idea and leave with an entire business: plan, website, brand, pitch deck, legal pages, social content, and ad copy. All from one description. Full kit $447 at bizplangenius.com/bundles', inputType: 'product' as const },
  { label: 'Promote Website Builder', icon: '🌐', input: 'Our AI builds complete, multi-page websites from your business plan. 6 types: e-commerce, restaurant, SaaS, booking, portfolio, landing. Edit everything, add payment links, download source code. From $99 at bizplangenius.com/build-website', inputType: 'product' as const },
  { label: 'Why real data matters', icon: '📊', input: 'Most AI business plan tools give you made-up data. BizPlan Genius uses Google Search to find your REAL competitors, their REAL pricing, and REAL market data. The difference between a plan investors laugh at and one they fund.', inputType: 'topic' as const },
  { label: 'Business plan tip', icon: '📋', input: 'The #1 mistake in business plans: made-up competitor data. Banks and investors can tell. Your plan needs real company names, real pricing, real market size. That is what BizPlan Genius does differently - real data from the web, not AI hallucinations.', inputType: 'topic' as const },
  { label: 'Startup cost awareness', icon: '🧮', input: 'Most people overestimate or underestimate their startup costs. Our free calculator gives you a real breakdown: legal fees, equipment, marketing, working capital - specific to your business type and location. Try it at bizplangenius.com/startup-cost-calculator', inputType: 'product' as const },
  { label: 'Launch checklist promo', icon: '📝', input: 'Starting a business? Here are the 15 things you need to do BEFORE launch: LLC registration, EIN, permits, bank account, insurance, website, legal pages... Get your personalized checklist free at bizplangenius.com/launch-checklist', inputType: 'product' as const },
  { label: 'Pitch deck promo', icon: '🎯', input: 'Need to pitch investors? Our AI creates a 12-slide pitch deck with speaker notes from your business plan. Problem, solution, market size, financials, the ask - all with real data. $39 at bizplangenius.com/pitch-deck', inputType: 'product' as const },
  { label: 'Entrepreneur motivation', icon: '🔥', input: 'The businesses that win are not the ones with the best ideas. They are the ones that launched first. Stop perfecting your plan in your head and start building. Go from idea to launch this week with AI.', inputType: 'topic' as const },
  { label: 'Compare vs ChatGPT', icon: '🤖', input: 'ChatGPT for business plans: generic templates with hallucinated competitors and made-up numbers. BizPlan Genius: real competitor research via Google Search, real market data, real financial benchmarks. One costs $0 and wastes your time. The other costs $97 and gets you funded.', inputType: 'topic' as const },
];

export default function SocialToolPage() {
  const [authKey, setAuthKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'blog' | 'product' | 'topic'>('topic');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authKey.trim()) setAuthenticated(true);
  };

  const handleGenerate = async (customInput?: string, customType?: 'blog' | 'product' | 'topic') => {
    const useInput = customInput || input;
    const useType = customType || inputType;
    if (!useInput.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await fetch('/api/generate-social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tools-key': authKey,
        },
        body: JSON.stringify({ input: useInput, inputType: useType }),
      });

      if (res.status === 401) {
        setError('Invalid access key.');
        setAuthenticated(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form onSubmit={handleAuth} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-sm w-full">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Social Media Tool</h1>
          <p className="text-sm text-gray-500 mb-6">Enter your access key to continue.</p>
          <input type="password" required value={authKey} onChange={e => setAuthKey(e.target.value)} placeholder="Access key"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none transition mb-4" />
          <button type="submit" className="w-full px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Social Media Generator</h1>
            <p className="text-sm text-gray-500">One click to generate posts for all platforms</p>
          </div>
          <a href="/tools/admin" className="text-sm text-brand-600 hover:text-brand-700">Admin</a>
        </div>

        {/* One-click buttons */}
        <div className="bg-white rounded-2xl border p-5 mb-6">
          <h2 className="text-sm font-bold text-gray-700 mb-3">One-Click Generate (no typing needed)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ONE_CLICK_TOPICS.map((topic, i) => (
              <button key={i} onClick={() => handleGenerate(topic.input, topic.inputType)} disabled={loading}
                className="p-3 rounded-xl border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition text-left disabled:opacity-50">
                <span className="text-lg block mb-1">{topic.icon}</span>
                <span className="text-xs font-medium text-gray-900">{topic.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom input */}
        <div className="bg-white rounded-2xl border p-5 mb-6">
          <h2 className="text-sm font-bold text-gray-700 mb-3">Or write your own</h2>
          <div className="flex gap-2 mb-3">
            {(['topic', 'product', 'blog'] as const).map(type => (
              <button key={type} onClick={() => setInputType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${inputType === type ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {type === 'topic' ? 'Topic' : type === 'blog' ? 'Blog Post' : 'Product'}
              </button>
            ))}
          </div>
          <textarea rows={3} value={input} onChange={e => setInput(e.target.value)}
            placeholder="Type anything and AI will create posts for all 4 platforms..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-none mb-3" />
          <button onClick={() => handleGenerate()} disabled={loading || !input.trim()}
            className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition disabled:opacity-50 text-sm">
            {loading ? 'Generating...' : 'Generate Posts'}
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4">{error}</div>}

        {/* Results */}
        {results && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-700">Generated Posts</h2>
              <button onClick={() => setResults(null)} className="text-xs text-gray-500 underline">Clear</button>
            </div>

            {PLATFORMS.map(({ key, label, color, field }) => {
              const post = results[key as keyof Results];
              const content = field === 'caption' ? post.caption : post.text;
              if (!content) return null;

              return (
                <div key={key} className="bg-white rounded-xl border overflow-hidden">
                  <div className={`${color} px-4 py-2 flex items-center justify-between`}>
                    <span className="text-white font-semibold text-sm">{label}</span>
                    <span className="text-white/70 text-xs">{content.length} chars</span>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed mb-3">{content}</p>
                    {key === 'instagram' && post.carouselIdea && (
                      <div className="bg-pink-50 rounded-lg p-3 mb-3">
                        <p className="text-xs font-bold text-pink-700 mb-1">Carousel Idea</p>
                        <p className="text-xs text-pink-800">{post.carouselIdea}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">Angle: {post.hook}</p>
                      <button onClick={() => copyToClipboard(content, key)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${copied === key ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        {copied === key ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
