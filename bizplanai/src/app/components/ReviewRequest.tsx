'use client';

import { useState, useEffect } from 'react';

export default function ReviewRequest() {
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Only show on success pages after a delay
    if (!window.location.pathname.includes('/success')) return;
    const alreadyAsked = sessionStorage.getItem('reviewAsked');
    if (alreadyAsked) return;

    const timer = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem('reviewAsked', '1');
    }, 30000); // 30 seconds after plan/report is delivered

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    try {
      await fetch('/api/collect-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `review_${rating}star_${Date.now()}@feedback`,
          source: `review_${rating}_stars`,
        }),
      });
    } catch {}
    setSubmitted(true);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6 animate-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 max-w-sm w-full">
        {!submitted ? (
          <>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">How was your experience?</h3>
                <p className="text-xs text-gray-500">Your feedback helps us improve</p>
              </div>
              <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Star rating */}
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-2xl transition hover:scale-110"
                >
                  {star <= rating ? (
                    <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ) : (
                    <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  )}
                </button>
              ))}
            </div>

            {rating > 0 && (
              <>
                {rating >= 4 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Glad you liked it! Would you leave a quick review?</p>
                    <div className="flex gap-2">
                      <a href="https://www.g2.com/products/bizplan-genius/reviews/start" target="_blank" rel="noopener noreferrer"
                        className="flex-1 py-2 text-center text-xs font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition">
                        Review on G2
                      </a>
                      <a href="https://www.trustpilot.com/evaluate/bizplangenius.com" target="_blank" rel="noopener noreferrer"
                        className="flex-1 py-2 text-center text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
                        Trustpilot
                      </a>
                    </div>
                    <button onClick={handleSubmit} className="w-full text-xs text-gray-400 hover:text-gray-600 mt-1">Maybe later</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      placeholder="What could we improve?"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none resize-none"
                    />
                    <button onClick={handleSubmit}
                      className="w-full py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition">
                      Send Feedback
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm font-semibold text-gray-900">Thank you for your feedback!</p>
            <button onClick={() => setShow(false)} className="text-xs text-gray-400 mt-2 hover:text-gray-600">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
