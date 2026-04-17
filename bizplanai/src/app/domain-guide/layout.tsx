import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/domain-guide',
  },
  title: 'Domain & Hosting Setup Guide - Get Your Website Live | BizPlan Genius',
  description: 'Step-by-step guide to buy a domain, set up hosting, and get your website live. Written for complete beginners. Includes free hosting options.',
  openGraph: {
    title: 'Get Your Website Live - Domain & Hosting Guide for Beginners',
    description: 'Buy a domain for $9/year, host your website for free. Step-by-step instructions anyone can follow.',
    url: 'https://www.bizplangenius.com/domain-guide',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
