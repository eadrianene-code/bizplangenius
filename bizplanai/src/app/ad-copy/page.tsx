'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StandaloneBusinessForm from '../components/StandaloneBusinessForm';

interface GoogleAd { campaignType: string; headline1: string; headline2: string; headline3: string; description1: string; description2: string; keywords: string[]; targetAudience: string; goal: string; }
interface FacebookAd { adType: string; headline: string; primaryText: string; description: string; cta: string; targetAudience: string; imageIdea: string; }
interface InstagramAd { adType: string; caption: string; hashtags: string[]; imageIdea: string; targetAudience: string; }
interface AdData { businessName: string; googleAds: GoogleAd[]; facebookAds: FacebookAd[]; instagramAds: InstagramAd[]; }

function AdCopyInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const planSessionId = searchParams.get('plan_session_id');

  const [step, setStep] = useState<'landing' | 'generating' | 'result'>('landing');
  const [ads, setAds] = useState<AdData | null>(null);
  const [platform, setPlatform] = useState<'google' | 'facebook' | 'instagram'>('google');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => { if (sessionId) generateAds(); }, []);

  const generateAds = async () => {
    setStep('generating'); setError('');
    try {
      const res = await fetch('/api/ad-copy', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, planSessionId }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAds(data.ads); setStep('result');
    } catch (err: any) { setError(err.message); setStep('landing'); }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000);
  };

  if (!sessionId && step === 'landing') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">Ad Copy Generator</h1>
            <p className="text-gray-600 text-lg">15 ad variations for Google, Facebook, and Instagram. Ready to launch your first campaigns.</p>
          </div>

          <div className="bg-white rounded-2xl border p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">What you'll receive -- 15 ads across 3 platforms</h3>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                { name: 'Google Ads', count: '5 ads', desc: 'Search, Display, Performance Max', color: 'bg-blue-500', icon: '🔍' },
                { name: 'Facebook Ads', count: '5 ads', desc: 'Image, Carousel, Video concepts', color: 'bg-blue-600', icon: '📘' },
                { name: 'Instagram Ads', count: '5 ads', desc: 'Feed, Stories, Reels', color: 'bg-pink-600', icon: '📸' },
              ].map((p, i) => (
                <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-2xl block mb-1">{p.icon}</span>
                  <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.count}</p>
                  <p className="text-[10px] text-gray-400">{p.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Every ad includes</p>
            <div className="grid grid-cols-2 gap-2">
              {['Headlines & copy (character-limit compliant)', 'Target audience (demographics + interests)', 'Keywords for search ads', 'CTA recommendations',
                'Image/creative ideas', 'Campaign goal (awareness/traffic/conversions)'].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <svg className="w-3.5 h-3.5 text-accent-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <StandaloneBusinessForm productName="Ad Copy Pack" productPrice={19} checkoutEndpoint="/api/ad-copy-checkout" />
        </main>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-gray-50"><Header />
        <main className="max-w-2xl mx-auto px-4 py-20">
          <div className="text-center mb-8"><h1 className="text-3xl font-bold mb-2">Generating Your Ad Copy</h1><p className="text-gray-600">Writing 15 ads for Google, Facebook, and Instagram...</p></div>
          <div className="bg-white rounded-2xl border p-8"><ProgressBar /></div>
        </main>
      </div>
    );
  }

  if (step === 'result' && ads) {
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
            <h1 className="text-2xl font-bold text-gray-900">Ad Copy: {ads.businessName}</h1>
            <p className="text-sm text-gray-500">15 ads across 3 platforms. Copy and paste into your ad manager.</p>
          </div>

          {/* Platform tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { key: 'google' as const, label: 'Google Ads', count: (ads.googleAds || []).length, color: 'bg-blue-500' },
              { key: 'facebook' as const, label: 'Facebook', count: (ads.facebookAds || []).length, color: 'bg-blue-600' },
              { key: 'instagram' as const, label: 'Instagram', count: (ads.instagramAds || []).length, color: 'bg-pink-600' },
            ].map(p => (
              <button key={p.key} onClick={() => setPlatform(p.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${platform === p.key ? `${p.color} text-white` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {p.label} ({p.count})
              </button>
            ))}
          </div>

          {/* Google Ads */}
          {platform === 'google' && (
            <div className="space-y-4">
              {(ads.googleAds || []).map((ad, i) => (
                <div key={i} className="bg-white rounded-xl border shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{ad.campaignType}</span>
                    <span className="text-xs text-gray-400">{ad.goal}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="text-blue-700 text-lg font-medium">{ad.headline1} | {ad.headline2} | {ad.headline3}</p>
                    <p className="text-sm text-gray-600 mt-1">{ad.description1}</p>
                    <p className="text-sm text-gray-500">{ad.description2}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(ad.keywords || []).map((k, j) => (
                      <span key={j} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{k}</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Target: {ad.targetAudience}</p>
                  <button onClick={() => copyText(`${ad.headline1} | ${ad.headline2} | ${ad.headline3}\n${ad.description1}\n${ad.description2}\nKeywords: ${(ad.keywords || []).join(', ')}`, `g${i}`)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${copied === `g${i}` ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {copied === `g${i}` ? 'Copied!' : 'Copy Ad'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Facebook Ads */}
          {platform === 'facebook' && (
            <div className="space-y-4">
              {(ads.facebookAds || []).map((ad, i) => (
                <div key={i} className="bg-white rounded-xl border shadow-sm p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">{ad.adType}</span>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{ad.cta}</span>
                  </div>
                  <p className="font-bold text-gray-900 mb-2">{ad.headline}</p>
                  <p className="text-sm text-gray-700 mb-2">{ad.primaryText}</p>
                  <p className="text-xs text-gray-500 mb-3">{ad.description}</p>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-bold text-gray-500 mb-1">Creative idea</p>
                    <p className="text-xs text-gray-600">{ad.imageIdea}</p>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Target: {ad.targetAudience}</p>
                  <button onClick={() => copyText(`Headline: ${ad.headline}\n\n${ad.primaryText}\n\nDescription: ${ad.description}\nCTA: ${ad.cta}`, `f${i}`)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${copied === `f${i}` ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {copied === `f${i}` ? 'Copied!' : 'Copy Ad'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Instagram Ads */}
          {platform === 'instagram' && (
            <div className="space-y-4">
              {(ads.instagramAds || []).map((ad, i) => (
                <div key={i} className="bg-white rounded-xl border shadow-sm p-5">
                  <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">{ad.adType}</span>
                  <p className="text-sm text-gray-700 mt-3 mb-2 whitespace-pre-wrap">{ad.caption}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(ad.hashtags || []).map((h, j) => (
                      <span key={j} className="text-xs text-pink-600 bg-pink-50 px-2 py-0.5 rounded">#{h.replace(/^#/, '')}</span>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-bold text-gray-500 mb-1">Visual idea</p>
                    <p className="text-xs text-gray-600">{ad.imageIdea}</p>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">Target: {ad.targetAudience}</p>
                  <button onClick={() => copyText(`${ad.caption}\n\n${(ad.hashtags || []).map(h => `#${h.replace(/^#/,'')}`).join(' ')}`, `i${i}`)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${copied === `i${i}` ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {copied === `i${i}` ? 'Copied!' : 'Copy Ad'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }
  return null;
}

function Header() {
  return (<header className="bg-white border-b border-gray-100"><div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between"><a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a><span className="text-sm text-gray-500">Ad Copy Generator</span></div></header>);
}

function ProgressBar() {
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState('Analyzing your business...');
  useEffect(() => {
    const timer = setInterval(() => { setElapsed(prev => { const n = prev+1;
      if(n<10) setStatus('Analyzing your business and target market...');
      else if(n<25) setStatus('Writing Google Ads copy...');
      else if(n<45) setStatus('Creating Facebook ad variations...');
      else if(n<60) setStatus('Crafting Instagram captions...');
      else setStatus('Finalizing your ad pack...'); return n; }); }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (<div className="space-y-4"><div className="flex justify-between text-sm"><span className="font-medium text-gray-700">{status}</span><span className="text-gray-400">{elapsed}s</span></div><div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"><div className="h-full rounded-full bg-brand-600 transition-all duration-1000 ease-out" style={{width:`${Math.min(90,(elapsed/70)*90)}%`}}/></div></div>);
}

export default function AdCopyPage() {
  return (<Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}><AdCopyInner /></Suspense>);
}
