'use client';

import { useState } from 'react';

interface SamplePdfGateProps {
  pdfUrl: string;
  label: string;
  className?: string;
  children?: React.ReactNode;
}

export default function SamplePdfGate({ pdfUrl, label, className, children }: SamplePdfGateProps) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if already submitted in this browser
    const unlocked = localStorage.getItem('sampleUnlocked');
    if (unlocked) {
      window.open(pdfUrl, '_blank');
      return;
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch('/api/collect-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: `sample_pdf_${pdfUrl}` }),
      });
    } catch {
      // Silent fail
    }

    localStorage.setItem('sampleUnlocked', '1');
    setSubmitted(true);

    // Open PDF after short delay
    setTimeout(() => {
      window.open(pdfUrl, '_blank');
      setShowModal(false);
    }, 1500);
  };

  return (
    <>
      {children ? (
        <span onClick={handleClick} className={`cursor-pointer ${className || ''}`}>
          {children}
        </span>
      ) : (
        <a href={pdfUrl} onClick={handleClick} className={className}>
          {label}
        </a>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!submitted ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Get Your Free Sample
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Enter your email to download the {label.toLowerCase()}. See the quality before you buy.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                  />
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition shadow-lg shadow-brand-600/25"
                  >
                    Download Free Sample
                  </button>
                </form>
                <p className="text-xs text-gray-400 text-center mt-3">
                  No spam, ever. We just want to stay in touch.
                </p>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900">Opening your sample now...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
