declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export function trackViewContent(plan: 'starter' | 'pro') {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_name: `BizPlan Genius ${plan === 'starter' ? 'Starter' : 'Pro'} Plan`,
      content_category: 'Business Plan Generator',
      value: plan === 'starter' ? 29 : 49,
      currency: 'USD',
    });
  }
}

export function trackInitiateCheckout(plan: 'starter' | 'pro') {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'InitiateCheckout', {
      content_name: `BizPlan Genius ${plan === 'starter' ? 'Starter' : 'Pro'} Plan`,
      value: plan === 'starter' ? 29 : 49,
      currency: 'USD',
      num_items: 1,
    });
  }
}

export function trackAddToCart(plan: 'starter' | 'pro') {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'AddToCart', {
      content_name: `BizPlan Genius ${plan === 'starter' ? 'Starter' : 'Pro'} Plan`,
      value: plan === 'starter' ? 29 : 49,
      currency: 'USD',
      num_items: 1,
    });
  }
}

export function trackPurchase(plan: 'starter' | 'pro') {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'Purchase', {
      content_name: `BizPlan Genius ${plan === 'starter' ? 'Starter' : 'Pro'} Plan`,
      value: plan === 'starter' ? 29 : 49,
      currency: 'USD',
      num_items: 1,
    });
  }
}

export function trackLead(source?: string) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: source || 'BizPlan Genius Lead',
    });
  }
}declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export function trackViewContent(plan: 'starter' | 'pro') {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', {
      content_name: `BizPlan Genius ${plan === 'starter' ? 'Starter' : 'Pro'} Plan`,
      content_category: 'Business Plan Generator',
      value: plan === 'starter' ? 29 : 49,
      currency: 'USD',
    });
  }
}

export function trackInitiateCheckout(plan: 'starter' | 'pro') {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'InitiateCheckout', {
      content_name: `BizPlan Genius ${plan === 'starter' ? 'Starter' : 'Pro'} Plan`,
      value: plan === 'starter' ? 29 : 49,
      currency: 'USD',
      num_items: 1,
    });
  }
}

export function trackAddToCart(plan: 'starter' | 'pro') {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'AddToCart', {
      content_name: `BizPlan Genius ${plan === 'starter' ? 'Starter' : 'Pro'} Plan`,
      value: plan === 'starter' ? 29 : 49,
      currency: 'USD',
      num_items: 1,
    });
  }
}
pixelEvents.ts
export function trackPurchase(plan: 'starter' | 'pro') {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'Purchase', {
      content_name: `BizPlan Genius ${plan === 'starter' ? 'Starter' : 'Pro'} Plan`,
      value: plan === 'starter' ? 29 : 49,
      currency: 'USD',
      num_items: 1,
    });
  }
}

export function trackLead(source?: string) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: source || 'BizPlan Genius Lead',
    });
  }
}
