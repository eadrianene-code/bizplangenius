'use client';

import { useState, useEffect } from 'react';

const NOTIFICATIONS = [
  { city: 'New York', product: 'Business Plan', time: '2 min ago' },
  { city: 'London', product: 'Competitor Spy Report', time: '5 min ago' },
  { city: 'Toronto', product: 'Launch Pack Bundle', time: '8 min ago' },
  { city: 'Sydney', product: 'Business Plan', time: '12 min ago' },
  { city: 'Berlin', product: 'Website Builder', time: '15 min ago' },
  { city: 'San Francisco', product: 'Pitch Deck', time: '18 min ago' },
  { city: 'Dubai', product: 'Full Business Kit', time: '22 min ago' },
  { city: 'Austin', product: 'Social Media Pack', time: '25 min ago' },
  { city: 'Miami', product: 'Brand Kit', time: '30 min ago' },
  { city: 'Singapore', product: 'Business Plan', time: '33 min ago' },
];

export default function SocialProofToast() {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Don't show on success, dashboard, tools, or checkout pages
    const path = window.location.pathname;
    if (path.includes('/success') || path.includes('/dashboard') || path.includes('/tools') || path.includes('/generate')) return;

    // Show first notification after 15 seconds
    const initialTimer = setTimeout(() => {
      setCurrent(Math.floor(Math.random() * NOTIFICATIONS.length));
      setShow(true);

      // Hide after 5 seconds
      setTimeout(() => setShow(false), 5000);
    }, 15000);

    // Show subsequent notifications every 30-45 seconds
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % NOTIFICATIONS.length);
      setShow(true);
      setTimeout(() => setShow(false), 5000);
    }, 30000 + Math.random() * 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!show) return null;

  const notif = NOTIFICATIONS[current];

  return (
    <div className="fixed bottom-4 left-4 z-40 animate-in sm:bottom-6 sm:left-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-3 max-w-xs">
        <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Someone in {notif.city}</p>
          <p className="text-xs text-gray-500">purchased {notif.product} {notif.time}</p>
        </div>
        <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
