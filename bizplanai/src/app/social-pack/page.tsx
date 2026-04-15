'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Post {
  day: number;
  platform: string;
  type: string;
  content: string;
  hashtags: string[];
  imageIdea: string;
  bestTime: string;
}

interface PackData {
  businessName: string;
  posts: Post[];
}

const PLATFORM_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  twitter: { bg: 'bg-gray-900', text: 'text-white', label: 'Twitter / X' },
  linkedin: { bg: 'bg-blue-700', text: 'text-white', label: 'LinkedIn' },
  instagram: { bg: 'bg-pink-600', text: 'text-white', label: 'Instagram' },
  facebook: { bg: 'bg-blue-600', text: 'text-white', label: 'Facebook' },
};

function SocialPackInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const planSessionId = searchParams.get('plan_session_id');

  const [step, setStep] = useState<'landing' | 'generating' | 'calendar'>('landing');
  const [pack, setPack] = useState<PackData | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<number | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  useEffect(() => {
    if (sessionId && planSessionId) generatePack();
  }, []);

  const generatePack = async () => {
    setStep('generating');
    setError('');
    try {
      const res = await fetch('/api/social-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, planSessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setPack(data.pack);
      setBusinessName(data.businessName);
      setStep('calendar');
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
      const res = await fetch('/api/social-pack-checkout', {
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

  const copyPost = (text: string, day: number) => {
    navigator.clipboard.writeText(text);
    setCopied(day);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadCSV = () => {
    if (!pack) return;
    const header = 'Day,Platform,Type,Content,Hashtags,Image Idea,Best Time\n';
    const rows = pack.posts.map(p =>
      `${p.day},"${p.platform}","${p.type}","${p.content.replace(/"/g, '""')}","${(p.hashtags || []).join(' ')}","${(p.imageIdea || '').replace(/"/g, '""')}","${p.bestTime || ''}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(businessName || 'social-pack').toLowerCase().replace(/\s+/g, '-')}-30-day-plan.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // No plan session
  if (!planSessionId && !sessionId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Social Media Starter Pack</h1>
          <p className="text-gray-600 mb-8">30 days of ready-to-post content. You need a business plan first so we can tailor the posts to your business.</p>
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
            <h1 className="text-3xl font-bold mb-2">Creating Your Social Media Pack</h1>
            <p className="text-gray-600">Writing 30 days of platform-specific posts for your business...</p>
          </div>
          <div className="bg-white rounded-2xl border p-8"><ProgressBar /></div>
        </main>
      </div>
    );
  }

  // Calendar view
  if (step === 'calendar' && pack) {
    const filteredPosts = filterPlatform === 'all'
      ? pack.posts
      : pack.posts.filter(p => p.platform === filterPlatform);

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
            <div className="flex items-center gap-3">
              <button onClick={downloadCSV} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition">
                Download CSV
              </button>
              <a href={`/dashboard?session_id=${sessionId}`} className="px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-700">My Toolkit</a>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">30-Day Social Media Plan</h1>
            <p className="text-gray-500 text-sm">{businessName} -- {pack.posts.length} posts ready to go</p>
          </div>

          {/* Platform filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button onClick={() => setFilterPlatform('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filterPlatform === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              All ({pack.posts.length})
            </button>
            {['twitter', 'linkedin', 'instagram', 'facebook'].map(p => {
              const count = pack.posts.filter(post => post.platform === p).length;
              const style = PLATFORM_STYLES[p];
              return (
                <button key={p} onClick={() => setFilterPlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filterPlatform === p ? `${style.bg} ${style.text}` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {style.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map(post => {
              const style = PLATFORM_STYLES[post.platform] || PLATFORM_STYLES.twitter;
              return (
                <div key={post.day} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className={`${style.bg} px-4 py-2 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <span className={`${style.text} font-bold text-sm`}>Day {post.day}</span>
                      <span className={`${style.text} opacity-70 text-xs`}>{style.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`${style.text} opacity-60 text-xs`}>{post.bestTime || ''}</span>
                      <span className={`${style.text} opacity-50 text-xs px-2 py-0.5 rounded border border-white/20`}>{post.type}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed mb-3">{post.content}</p>

                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.hashtags.map((h, i) => (
                          <span key={i} className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded">#{h.replace(/^#/, '')}</span>
                        ))}
                      </div>
                    )}

                    {post.imageIdea && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Image/Graphic Idea</p>
                        <p className="text-xs text-gray-600">{post.imageIdea}</p>
                      </div>
                    )}

                    <button
                      onClick={() => copyPost(post.content + (post.hashtags?.length ? '\n\n' + post.hashtags.map(h => `#${h.replace(/^#/, '')}`).join(' ') : ''), post.day)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${copied === post.day ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {copied === post.day ? 'Copied!' : 'Copy Post'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
          <h1 className="text-3xl font-bold mb-3">Social Media Starter Pack</h1>
          <p className="text-gray-600 text-lg">30 days of ready-to-post content for Twitter, LinkedIn, Instagram, and Facebook. Tailored to your business.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">What's included</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              '30 unique posts (1 per day)',
              '4 platforms covered',
              'Mix of educational, promo, engagement',
              'Hashtags for each post',
              'Image/graphic suggestions',
              'Best posting times',
              'CSV download for scheduling',
              'Copy button for each post',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-accent-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
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
            {loading ? 'Processing...' : 'Get My 30-Day Social Plan - $29'}
          </button>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>One-time payment</span><span>|</span><span>30 posts ready to use</span><span>|</span><span>CSV export included</span>
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
        <span className="text-sm text-gray-500">Social Media Pack</span>
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
        if (next < 10) setStatus('Analyzing your business and target audience...');
        else if (next < 25) setStatus('Planning content themes for 30 days...');
        else if (next < 45) setStatus('Writing Twitter and LinkedIn posts...');
        else if (next < 65) setStatus('Creating Instagram captions and Facebook posts...');
        else if (next < 80) setStatus('Adding hashtags and scheduling suggestions...');
        else setStatus('Finalizing your content calendar...');
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

export default function SocialPackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <SocialPackInner />
    </Suspense>
  );
}
