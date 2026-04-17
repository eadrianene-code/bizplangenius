// Server component. Entry point for /build-website.
//
// - Cold visitor (no URL params): render <ShowcaseContent /> server-side.
//   Full SSR, Googlebot indexes every line of copy and the FAQ schema.
//
// - Post-purchase or post-plan visitor (has ?session_id= or ?plan_session_id=):
//   render <ClientApp /> so the interactive generator / editor takes over.

import { Suspense } from 'react';
import ShowcaseContent from './ShowcaseContent';
import ClientApp from './ClientApp';

type SearchParams = {
  session_id?: string;
  plan_session_id?: string;
  type?: string;
  color?: string;
};

export default function BuildWebsitePage({ searchParams }: { searchParams: SearchParams }) {
  const hasSession = Boolean(searchParams?.session_id || searchParams?.plan_session_id);

  if (hasSession) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      }>
        <ClientApp />
      </Suspense>
    );
  }

  // Default: server-render the marketing/SEO content.
  return <ShowcaseContent />;
}
