'use client';

import { useState, useEffect } from 'react';

export default function StickyMobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only on mobile
    if (window.innerWidth >= 640) return;
    // Don't show on success, dashboard, or tool pages
    const path = window.location.pathname;
    if (path.includes('/success') || path.includes('/dashboard') || path.includes('/tools')) return;

    const handleScroll = () => {
      setShow(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 z-50 sm:hidden">
      <div className="flex gap-2">
        <a
          href="/free-competitor-check"
          className="flex-1 py-3 text-center text-sm font-semibold text-brand-600 border-2 border-brand-600 rounded-xl"
        >
          Free Tool
        </a>
        <a
          href="/generate"
          className="flex-1 py-3 text-center text-sm font-bold text-white bg-brand-600 rounded-xl"
        >
          Get Plan - $29
        </a>
      </div>
    </div>
  );
}
