'use client';

import { useState, useEffect } from 'react';

interface Props {
  planSessionId: string | null;
  productKey: string; // e.g., 'pitch_deck', 'social_media_pack', 'brand_kit'
  productName: string;
  price: number;
  checkoutEndpoint: string;
  generateEndpoint: string;
  email: string;
  onGenerated: (data: any) => void;
  onError: (msg: string) => void;
  children?: React.ReactNode; // extra form fields
}

export default function BundleAwareCheckout({
  planSessionId, productKey, productName, price, checkoutEndpoint, generateEndpoint,
  email, onGenerated, onError, children,
}: Props) {
  const [hasAccess, setHasAccess] = useState(false);
  const [bundleSessionId, setBundleSessionId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!planSessionId) return;
    fetch('/api/dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: planSessionId }),
    }).then(r => r.json()).then(data => {
      if (!data.purchases) return;
      // Check for direct purchase
      const direct = data.purchases.find((p: any) => p.product === productKey);
      if (direct) { setHasAccess(true); setBundleSessionId(direct.sessionId); return; }
      // Check for bundle
      const bundle = data.purchases.find((p: any) => {
        const meta = p.metadata || {};
        if (meta.product !== 'bundle') return false;
        const contents: Record<string, string[]> = {
          starter: ['spy_report', 'business_plan_pro'],
          launch: ['spy_report', 'business_plan_pro', 'website_landing', 'pitch_deck'],
          full: ['spy_report', 'business_plan_pro', 'website_landing', 'pitch_deck', 'social_media_pack', 'brand_kit'],
        };
        const products = contents[meta.bundle] || [];
        return products.some(p => p.includes(productKey) || productKey.includes(p));
      });
      if (bundle) { setHasAccess(true); setBundleSessionId(bundle.sessionId); }
    }).catch(() => {});
  }, [planSessionId, productKey]);

  const handleSubmit = async () => {
    setLoading(true);
    onError('');

    if (hasAccess && bundleSessionId) {
      // Skip payment, generate directly
      try {
        const res = await fetch(generateEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: bundleSessionId, planSessionId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        onGenerated(data);
      } catch (err: any) {
        onError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Normal checkout
    if (!email) { onError('Email required'); setLoading(false); return; }
    try {
      const res = await fetch(checkoutEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planSessionId, email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || 'Checkout failed');
    } catch (err: any) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {hasAccess && (
        <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200 text-center">
          <p className="text-sm font-bold text-green-800">Included in your bundle, no extra charge</p>
        </div>
      )}
      {children}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full px-8 py-4 font-bold rounded-xl transition shadow-lg text-lg disabled:opacity-60 ${
          hasAccess
            ? 'bg-accent-600 text-white hover:bg-accent-700 shadow-accent-600/25'
            : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-600/25'
        }`}
      >
        {loading ? 'Processing...' : hasAccess ? `Get ${productName} (Included)` : `Get ${productName} - $${price}`}
      </button>
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
        <span>{hasAccess ? 'Already paid' : 'One-time payment'}</span>
        <span>|</span>
        <span>Powered by Stripe</span>
      </div>
    </div>
  );
}
