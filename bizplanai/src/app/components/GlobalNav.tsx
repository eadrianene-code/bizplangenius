'use client';

import { useState } from 'react';
import LanguageSelector from './LanguageSelector';

export default function GlobalNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="text-lg font-bold text-gradient">BizPlan Genius</a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          <a href="/products" className="text-sm text-gray-600 hover:text-brand-600 transition font-medium">Products</a>
          <a href="/pricing" className="text-sm text-gray-600 hover:text-brand-600 transition">Pricing</a>
          <a href="/free-competitor-check" className="text-sm text-gray-600 hover:text-brand-600 transition">Free Tools</a>
          <a href="/sba-loan-business-plan" className="text-sm text-gray-600 hover:text-brand-600 transition">SBA Plans</a>
          <a href="/e2-visa-business-plan" className="text-sm text-gray-600 hover:text-brand-600 transition">Visa Plans</a>
          <a href="/blog" className="text-sm text-gray-600 hover:text-brand-600 transition">Blog</a>
          <LanguageSelector />
          <a href="/generate" className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition shadow-sm">
            Get Started
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2" aria-label="Menu">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3 px-4 max-h-[70vh] overflow-y-auto">
          <a href="/products" onClick={() => setMobileOpen(false)} className="block py-2.5 text-gray-900 font-medium">All Products</a>
          <a href="/pricing" onClick={() => setMobileOpen(false)} className="block py-2.5 text-gray-700">Pricing</a>
          <a href="/bundles" onClick={() => setMobileOpen(false)} className="block py-2.5 text-gray-700">Bundles</a>
          <div className="border-t border-gray-100 my-2" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider py-1">Free Tools</p>
          <a href="/free-competitor-check" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-600">Competitor Check</a>
          <a href="/validate-idea" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-600">Idea Validator</a>
          <a href="/business-name-generator" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-600">Name Generator</a>
          <a href="/startup-cost-calculator" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-600">Cost Calculator</a>
          <a href="/launch-checklist" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-600">Launch Checklist</a>
          <div className="border-t border-gray-100 my-2" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider py-1">For Specific Situations</p>
          <a href="/sba-loan-business-plan" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-600">SBA Loan Business Plan</a>
          <a href="/e2-visa-business-plan" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-gray-600">E-2 Visa Business Plan</a>
          <div className="border-t border-gray-100 my-2" />
          <a href="/blog" onClick={() => setMobileOpen(false)} className="block py-2.5 text-gray-700">Blog</a>
          <a href="/dashboard" onClick={() => setMobileOpen(false)} className="block py-2.5 text-gray-700">My Toolkit</a>
          <a href="/generate" className="block mt-2 text-center px-4 py-2.5 bg-brand-600 text-white font-semibold rounded-lg">Get Started</a>
        </div>
      )}
    </header>
  );
}
