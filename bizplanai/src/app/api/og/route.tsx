import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Dynamic OG image generator for bizplangenius.com.
// Usage: /api/og?title=...&subtitle=...
// Returns a 1200x630 PNG suitable for Twitter/Facebook/LinkedIn previews.
// If no params, renders the default homepage card.

const DEFAULT_TITLE = 'Your Business Plan Just Built Your Website.';
const DEFAULT_SUBTITLE = 'Real research. Investor-ready plan. Matching website. From $97.';

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + '…';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = truncate(searchParams.get('title') || DEFAULT_TITLE, 120);
    const subtitle = truncate(searchParams.get('subtitle') || DEFAULT_SUBTITLE, 180);
    const badge = searchParams.get('badge') || 'BizPlan Genius';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            background:
              'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)',
            color: 'white',
            padding: '80px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Top row: brand + badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: 32,
                fontWeight: 700,
                color: '#60a5fa',
              }}
            >
              BizPlan Genius
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 22px',
                borderRadius: '999px',
                background: 'rgba(96, 165, 250, 0.15)',
                border: '1px solid rgba(96, 165, 250, 0.4)',
                fontSize: 22,
                color: '#bfdbfe',
                fontWeight: 500,
              }}
            >
              {badge}
            </div>
          </div>

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: title.length > 60 ? 64 : 80,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: '100%',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 30,
                color: '#cbd5e1',
                lineHeight: 1.3,
                fontWeight: 400,
                maxWidth: '95%',
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(148, 163, 184, 0.3)',
              paddingTop: '24px',
              fontSize: 22,
              color: '#94a3b8',
            }}
          >
            <div style={{ display: 'flex' }}>bizplangenius.com</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ display: 'flex' }}>Plan</span>
              <span style={{ color: '#60a5fa', display: 'flex' }}>→</span>
              <span style={{ display: 'flex' }}>Website</span>
              <span style={{ color: '#60a5fa', display: 'flex' }}>→</span>
              <span style={{ display: 'flex' }}>Launched</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    console.error('OG image generation failed:', err);
    return new Response('Failed to generate image', { status: 500 });
  }
}
