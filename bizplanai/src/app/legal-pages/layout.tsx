import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/legal-pages',
  },
  title: 'Legal Pages Generator - Terms of Service & Privacy Policy | BizPlan Genius',
  description: 'Generate Terms of Service, Privacy Policy, and Cookie Policy for your business website. GDPR + CCPA compliant. Tailored to your industry. $19 one-time.',
  openGraph: {
    title: 'Legal Pages Generator - Terms, Privacy Policy, Cookie Policy',
    description: 'Every website needs legal pages. Generate yours in minutes. GDPR and CCPA compliant.',
    url: 'https://www.bizplangenius.com/legal-pages',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
