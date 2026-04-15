'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Purchase {
  product: string;
  tier: string;
  date: string;
  amount: number;
  metadata: Record<string, string>;
  sessionId: string;
}

interface AvailableProduct {
  product: string;
  name: string;
  description: string;
  price: number;
  url: string;
  recommended?: boolean;
  comingSoon?: boolean;
  requiresPlan?: boolean;
  isSubscription?: boolean;
}

interface DashboardData {
  email: string;
  purchases: Purchase[];
  available: AvailableProduct[];
  stats: {
    totalSpent: number;
    productCount: number;
    hasPlan: boolean;
    hasProPlan: boolean;
    hasSpy: boolean;
  };
}

function productLabel(p: Purchase): string {
  if (p.product === 'business_plan') return p.tier === 'pro' ? 'Business Plan (Pro)' : 'Business Plan (Starter)';
  if (p.product === 'spy_report') return 'Competitor Spy Report';
  return 'Product';
}

function productBusiness(p: Purchase): string {
  return p.metadata.businessName || p.metadata.companyName || p.metadata.industryDescription || 'N/A';
}

function DashboardInner() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      loadDashboard(undefined, sessionId);
    }

    // Check for saved email
    const saved = localStorage.getItem('dashboardEmail');
    if (saved && !sessionId) {
      setEmail(saved);
      loadDashboard(saved);
    }
  }, [searchParams]);

  const loadDashboard = async (emailParam?: string, sessionId?: string) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailParam || undefined,
          sessionId: sessionId || undefined,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to load dashboard');

      setData(result);
      setEmail(result.email);
      localStorage.setItem('dashboardEmail', result.email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) loadDashboard(email);
  };

  // Email entry screen
  if (!data && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-md mx-auto px-4 py-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Business Toolkit</h1>
            <p className="text-gray-600">Enter the email you used to purchase to see your products.</p>
          </div>
          <form onSubmit={handleEmailSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition"
            >
              View My Products
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">
            Don't have an account yet? <a href="/free-competitor-check" className="text-brand-600 underline">Try our free tool</a>
          </p>
        </main>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
          </div>
        </main>
      </div>
    );
  }

  if (!data) return null;

  const recommended = data.available.filter(a => a.recommended && !a.comingSoon);
  const otherAvailable = data.available.filter(a => !a.recommended && !a.comingSoon);
  const comingSoon = data.available.filter(a => a.comingSoon);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Business Toolkit</h1>
          <p className="text-gray-500 text-sm mt-1">{data.email}</p>
        </div>

        {/* Unlock banner when no plan */}
        {!data.stats.hasPlan && data.purchases.length > 0 && (
          <div className="mb-8 p-5 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-amber-900 text-sm">Unlock all products with a business plan</p>
                <p className="text-xs text-amber-700 mt-1">Website Builder, Pitch Deck, Social Pack, Brand Kit, and Investor Emails all use your business plan data to generate personalized results.</p>
                <a href="/generate" className="inline-block mt-3 px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition">
                  Generate a Business Plan - From $29
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Purchased Products */}
        {data.purchases.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Your Products</h2>
            <div className="space-y-3">
              {data.purchases.map((p, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{productLabel(p)}</p>
                      <p className="text-sm text-gray-500">{productBusiness(p)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${p.amount}</p>
                    <p className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Next Step */}
        {recommended.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-3">Recommended Next Step</h2>
            <div className="space-y-3">
              {recommended.map((a, i) => (
                <a key={i} href={a.url} className="block bg-white rounded-xl border-2 border-brand-200 shadow-sm p-5 hover:border-brand-400 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900">{a.name}</p>
                        <span className="text-[10px] font-bold text-white bg-brand-600 px-2 py-0.5 rounded-full uppercase">Recommended</span>
                      </div>
                      <p className="text-sm text-gray-600">{a.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-2xl font-extrabold text-brand-600">${a.price}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Other Available Products */}
        {otherAvailable.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Available Products</h2>
            <div className="space-y-3">
              {otherAvailable.map((a, i) => (
                <a key={i} href={a.url} className="block bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-brand-300 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{a.name}</p>
                        {a.requiresPlan && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Needs plan first</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{a.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-xl font-extrabold text-gray-900">${a.price}{a.isSubscription ? <span className="text-sm font-semibold text-gray-400">/mo</span> : ''}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Coming Soon */}
        {comingSoon.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Coming Soon</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {comingSoon.map((a, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 opacity-70">
                  <p className="font-semibold text-gray-900 mb-1">{a.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{a.description}</p>
                  <p className="text-sm font-bold text-gray-400">${a.price} -- coming soon</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No purchases state */}
        {data.purchases.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-2">No purchases yet</h2>
            <p className="text-gray-600 mb-6">Get started with our free competitor check or purchase your first product.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/free-competitor-check" className="px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition">
                Free Competitor Check
              </a>
              <a href="/spy" className="px-6 py-3 border-2 border-brand-300 text-brand-700 font-semibold rounded-lg hover:bg-brand-50 transition">
                Spy Report -- $19
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-6 text-xs text-gray-400">
          <button onClick={() => { localStorage.removeItem('dashboardEmail'); setData(null); setEmail(''); }} className="underline hover:text-gray-600">
            Switch account
          </button>
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
        <span className="text-sm text-gray-500 font-medium">My Toolkit</span>
      </div>
    </header>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <DashboardInner />
    </Suspense>
  );
}
