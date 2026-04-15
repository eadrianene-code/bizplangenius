import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import ExitIntentPopup from './components/ExitIntentPopup';

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
                }
              ],
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
      </body>
    </html>
  );
}
