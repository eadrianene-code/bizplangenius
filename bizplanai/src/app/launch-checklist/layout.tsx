import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Business Launch Checklist - Step-by-Step Guide | BizPlan Genius',
  description: 'Get a personalized checklist to legally start your business. LLC registration, permits, licenses, bank accounts, and marketing -- specific to your state and industry. Free.',
  openGraph: {
    title: 'Free Business Launch Checklist - Every Step to Start Your Business',
    description: 'Personalized step-by-step checklist: legal registration, permits, finances, branding, and marketing. Specific to your state.',
    url: 'https://www.bizplangenius.com/launch-checklist',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
