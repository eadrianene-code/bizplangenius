import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import ExitIntentPopup from './components/ExitIntentPopup';
import StickyMobileCTA from './components/StickyMobileCTA';
import SocialProofToast from './components/SocialProofToast';
import ReviewRequest from './components/ReviewRequest';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bizplangenius.com'),
  alternates: {
    canonical: 'https://www.bizplangenius.com',
  },
  title: 'AI Business Plan Generator with Real Competitor Research | BizPlan Genius',
  description: 'AI business plan generator with real competitor data and market research. Investor-ready PDF in minutes. From $29, one-time payment. No subscription.',
  keywords: 'AI business plan generator, business plan writer, competitor analysis, market research, startup business plan, investor ready business plan, business plan PDF',
  openGraph: {
    title: 'AI Business Plan Generator - Real Competitor Research in Minutes',
    description: 'Generate investor-ready business plans with real competitor data and market analysis. From $29, one-time. PDF delivered in minutes.',
    url: 'https://www.bizplangenius.com',
    siteName: 'BizPlan Genius',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Business Plan Generator - Real Competitor Research | BizPlan Genius',
    description: 'Generate investor-ready business plans with real competitor data. From $29, one-time payment.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BizPlan Genius",
              "url": "https://www.bizplangenius.com",
              "description": "AI-powered business launch platform. Business plans, competitor research, websites, pitch decks, and more.",
              "email": "support@bizplangenius.com",
              "sameAs": []
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "BizPlan Genius",
              "applicationCategory": "BusinessApplication",
              "description": "AI business plan generator with real competitor research and market data. Investor-ready plans with 3-year financial projections.",
              "url": "https://www.bizplangenius.com",
              "operatingSystem": "Web",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Starter Plan",
                  "price": "29.00",
                  "priceCurrency": "USD",
                  "description": "7-section AI business plan with real competitor data and PDF download",
                  "url": "https://www.bizplangenius.com/generate"
                },
                {
                  "@type": "Offer",
                  "name": "Pro Plan",
                  "price": "49.00",
                  "priceCurrency": "USD",
                  "description": "Complete AI business plan with Operations Plan, Risk Analysis, and Money-Back Guarantee",
                  "url": "https://www.bizplangenius.com/generate"
                },
                {
                  "@type": "Offer",
                  "name": "Competitor Spy",
                  "price": "19.00",
                  "priceCurrency": "USD",
                  "description": "10-15 real competitors analyzed with pricing, SWOT, vulnerability audit, and 90-day tactical roadmap",
                  "url": "https://www.bizplangenius.com/spy"
                },
                {
                  "@type": "Offer",
                  "name": "AI Website Builder",
                  "price": "99.00",
                  "priceCurrency": "USD",
                  "description": "AI generates a custom, professional website from your business plan. Full HTML/CSS source code included.",
                  "url": "https://www.bizplangenius.com/build-website"
                }
              ],
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How is BizPlan Genius different from ChatGPT?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ChatGPT gives you generic templates with made-up data. BizPlan Genius researches your actual competitors, pulls real market data via Google Search, and generates financial projections based on real industry benchmarks. The result is a plan you can hand to a bank or investor."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How long does it take to generate a business plan?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most plans are generated in 3-8 minutes. Traditional consultants charge $2,000-$10,000 and take weeks. BizPlan Genius starts at $29."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I use BizPlan Genius for a bank loan application?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Plans include all sections banks typically require: executive summary, market analysis, financial projections, competitive landscape, and operational plan."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What products does BizPlan Genius offer?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "BizPlan Genius offers: Free Competitor Check ($0), Competitor Spy Reports ($19), Business Plans ($29-$49), AI Website Builder ($99-$199), Pitch Deck Generator ($39), Social Media Starter Pack ($29), Logo & Brand Kit ($29), and Investor Email Templates ($19). Bundles are available from $59."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does BizPlan Genius use real data?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. BizPlan Genius uses Google Gemini AI with live web search grounding to research real competitors, real pricing data, and real market trends for your specific business and location."
                  }
                }
              ]
            })
          }}
        />
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1463142315102216');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1463142315102216&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="antialiased text-gray-900 bg-white">
        {children}
        <ExitIntentPopup />
        <StickyMobileCTA />
        <SocialProofToast />
        <ReviewRequest />
      </body>
    </html>
  );
}
