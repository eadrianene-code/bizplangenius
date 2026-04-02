import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BizPlan Genius — AI Business Plan Generator with Real Market Research',
  description: 'Generate investor-ready business plans with real competitor analysis and market data. Powered by AI. Get your professional business plan in minutes, not weeks.',
  keywords: 'AI business plan generator, business plan writer, competitor analysis, market research, startup business plan, business plan template',
  openGraph: {
    title: 'BizPlan Genius — Professional Business Plans in Minutes',
    description: 'AI-powered business plans with real competitor research and market analysis. Used by 1000+ entrepreneurs.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-white">
        {children}
      </body>
    </html>
  );
}
