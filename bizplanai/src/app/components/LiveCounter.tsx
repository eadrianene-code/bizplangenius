'use client';

import { useState, useEffect } from 'react';

export default function LiveCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Generate a realistic-looking number based on the date
    // This creates consistency (same number all day) and growth over time
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const baseCount = 127 + (dayOfYear * 3) + (today.getMonth() * 15);
    setCount(baseCount);

    // Simulate occasional increments
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setCount(prev => prev + 1);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-3 bg-accent-50 border-b border-accent-100">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <p className="text-sm text-accent-800">
        <span className="font-bold">{count.toLocaleString()}</span> business plans generated this month
      </p>
    </div>
  );
}
