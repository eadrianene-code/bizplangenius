import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bizplangenius.com'),
  alternates: {
    canonical: '/',
  },
  title: 'BizPlan Genius | AI Business Plan Generator with Real Market Research',
  description: 'Generate investor-ready business plans with real competitor analysis and market data. Powered by AI. Get your professional business plan in minutes, not weeks.',
  keywords: 'AI business plan generator, business plan writer, competitor analysis, market research, startup business plan, business plan template',
  openGraph: {
    title: 'BizPlan Genius | Professional Business Plans in Minutes',
    description: 'AI-powered business plans with real competitor research and market analysis. From $29, one-time payment.',
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
      </body>
    </html>
  );
}
