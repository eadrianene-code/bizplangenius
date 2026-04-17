import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/investor-emails',
  },
  title: 'Investor Email Templates - 10 Fundraising Emails | BizPlan Genius',
  description: '10 personalized investor outreach emails: cold VC outreach, angel outreach, warm intros, follow-ups, investor updates, and pitch deck shares. Built from your business plan. $19.',
  openGraph: {
    title: 'Investor Email Templates - Start Fundraising Today',
    description: '10 ready-to-send investor emails with subject lines and tips. Cold outreach, follow-ups, intros, and updates tailored to your business.',
    url: 'https://www.bizplangenius.com/investor-emails',
    siteName: 'BizPlan Genius',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
