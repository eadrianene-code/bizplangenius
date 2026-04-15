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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
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
        body: JSON.stringify({ input, inputType }),
      });

      if (res.status === 401) {
        setError('Invalid access key. Check your TOOLS_SECRET_KEY.');
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
          <input
            type="password"
            required
            value={authKey}
            onChange={e => setAuthKey(e.target.value)}
            placeholder="Access key"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition mb-4"
          />
          <button type="submit" className="w-full px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition">
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
          <span className="text-sm text-gray-500 font-medium">Social Media Generator (Private)</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Form */}
        <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Content Type</label>
            <div className="flex gap-2">
              {(['topic', 'blog', 'product'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInputType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    inputType === type
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'topic' ? 'Topic / Idea' : type === 'blog' ? 'Blog Post' : 'Product Update'}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {inputType === 'blog' ? 'Paste your blog post content' : inputType === 'product' ? 'Describe the update' : 'What topic do you want to post about?'}
            </label>
            <textarea
              required
              rows={6}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={
                inputType === 'blog'
                  ? 'Paste the full blog post text here...'
                  : inputType === 'product'
                  ? 'e.g., We just launched a free competitor check tool that finds your top 3 competitors in 30 seconds...'
                  : 'e.g., Why most business plans fail in the first year and what founders can do differently...'
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition resize-none"
            />
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm mb-4">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition disabled:opacity-60"
          >
            {loading ? 'Generating posts...' : 'Generate Social Posts'}
          </button>
        </form>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Your Posts</h2>

            {PLATFORMS.map(({ key, label, color, field }) => {
              const post = results[key as keyof Results];
              const content = field === 'caption' ? post.caption : post.text;
              if (!content) return null;

              return (
                <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className={`${color} px-4 py-2 flex items-center justify-between`}>
                    <span className="text-white font-semibold text-sm">{label}</span>
                    <span className="text-white/70 text-xs">{content.length} chars</span>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed mb-3">{content}</p>

                    {key === 'instagram' && post.carouselIdea && (
                      <div className="bg-pink-50 rounded-lg p-3 mb-3">
                        <p className="text-xs font-bold text-pink-700 uppercase mb-1">Carousel / Image Idea</p>
                        <p className="text-sm text-pink-800">{post.carouselIdea}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">Angle: {post.hook}</p>
                      <button
                        onClick={() => copyToClipboard(content, key)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                          copied === key
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {copied === key ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => { setResults(null); setInput(''); }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Generate new posts
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
