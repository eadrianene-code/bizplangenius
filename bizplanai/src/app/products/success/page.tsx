'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface UniversalFulfillResponse {
  status: 'success' | 'error';
  isBundle?: boolean;
  shouldRedirect?: string;
  productType?: string;
  sessionId?: string;
  data?: any;
  message?: string;
}

interface BundleProduct {
  id: string;
  name: string;
  type: string;
  generated?: boolean;
}

export default function ProductSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ProductSuccessContent />
    </Suspense>
  );
}

function ProductSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'generating' | 'done' | 'error'>('loading');
  const [productType, setProductType] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [bundleProducts, setBundleProducts] = useState<BundleProduct[]>([]);
  const [generatingBundle, setGeneratingBundle] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('error');
      return;
    }

    setStatus('generating');
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 8, 90));
    }, 500);

    fetch('/api/universal-fulfill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    })
      .then(res => res.json())
      .then((response: UniversalFulfillResponse) => {
        clearInterval(interval);
        setProgress(100);

        if (response.shouldRedirect) {
          setTimeout(() => {
            router.push(`${response.shouldRedirect}?session_id=${sessionId}`);
          }, 500);
          return;
        }

        if (response.status === 'success' && response.data) {
          setProductType(response.productType || '');
          setData(response.data);

          if (response.isBundle && response.data.bundleItems) {
            setBundleProducts(
              response.data.bundleItems.map((item: any) => ({
                id: item.id || '',
                name: item.name || '',
                type: item.type || '',
                generated: false,
              }))
            );
          }

          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Purchase', {
              content_name: response.data.productName || response.productType,
              content_category: response.productType,
              currency: 'USD',
            });
          }

          setTimeout(() => {
            setStatus('done');
          }, 500);
        } else {
          setStatus('error');
        }
      })
      .catch(() => {
        clearInterval(interval);
        setStatus('error');
      });
  }, [searchParams, router]);

  const handleBundleProductGenerate = async (productId: string) => {
    setGeneratingBundle(productId);
    try {
      const response = await fetch('/api/fulfill-bundle-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bundleId: data.bundleId,
          productId: productId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setBundleProducts(prev =>
          prev.map(p => (p.id === productId ? { ...p, generated: true } : p))
        );
      }
    } catch (error) {
      console.error('Error generating bundle product:', error);
    } finally {
      setGeneratingBundle(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    const copied = document.createElement('div');
    copied.textContent = 'Copied!';
    copied.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm animate-pulse z-50';
    document.body.appendChild(copied);
    setTimeout(() => copied.remove(), 2000);
  };

  /* ---- Loading / Generating state ---- */
  if (status === 'loading' || status === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm">
              <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Product</h1>
            <p className="text-gray-500">We are preparing your content. This may take a moment...</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 font-medium">
            {progress < 25 ? 'Initializing...' :
             progress < 50 ? 'Processing content...' :
             progress < 75 ? 'Finalizing...' :
             progress < 95 ? 'Almost ready...' :
             'Finalizing details...'}
          </p>
        </div>
      </div>
    );
  }

  /* ---- Error state ---- */
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
          <p className="text-gray-500 mb-6">
            Don't worry, your payment is safe. Our team will generate your product right away.
          </p>
          <a href="mailto:support@bizplangenius.com" className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm">
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  /* ---- Success state - render based on product type ---- */

  return (
    <div className="min-h-screen bg-gray-50">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          header, .print-hide, [class*="fixed bottom"] { display: none !important; }
          body, .min-h-screen { background: white !important; }
          section { box-shadow: none !important; border: none !important; border-radius: 0 !important; padding: 16px 0 !important; break-inside: avoid; }
          @page { margin: 1in 0.75in; }
        }
      `}} />

      {/* Sticky Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 print-hide">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-lg font-bold text-gray-900">
            <span className="text-blue-600">BizPlan</span> Genius
          </a>
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-sm shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Save / Print
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-28 sm:pb-12">

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 sm:p-8 text-center mb-8 print-hide">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Your Product is Ready</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Review your content below. Copy, download, or export as needed.</p>
        </div>

        {/* BUNDLE VIEW */}
        {data?.isBundle && (
          <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Your Bundle</h2>
            <p className="text-gray-600 text-sm mb-6">Generate individual products from your bundle. Each product is available on demand.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bundleProducts.map(product => (
                <div key={product.id} className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{product.type}</p>
                    </div>
                    {product.generated && (
                      <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Generated</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleBundleProductGenerate(product.id)}
                    disabled={product.generated || generatingBundle === product.id}
                    className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition ${
                      product.generated
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : generatingBundle === product.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    {generatingBundle === product.id ? 'Generating...' : product.generated ? 'Generated' : 'Generate'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* INVESTOR EMAILS */}
        {productType === 'investor_emails' && data?.emails && (
          <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Investor Email Templates</h2>
              <button
                onClick={() => copyToClipboard(data.emails.map((e: any) => `${e.subject}\n\n${e.body}`).join('\n\n---\n\n'))}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition"
              >
                Copy All
              </button>
            </div>
            <div className="space-y-4">
              {data.emails.map((email: any, idx: number) => (
                <div key={idx} className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">Subject</p>
                      <h3 className="font-medium text-gray-900 text-sm">{email.subject}</h3>
                    </div>
                    <button
                      onClick={() => copyToClipboard(email.subject)}
                      className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded hover:bg-gray-200 transition"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">Body</p>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100">{email.body}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(email.body)}
                    className="w-full py-2 px-3 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition"
                  >
                    Copy Email Body
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LEGAL PAGES */}
        {productType === 'legal_pages' && data?.pages && (
          <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Legal Pages</h2>
              <button
                onClick={() => copyToClipboard(Object.values(data.pages).map((p: any) => p.content).join('\n\n---\n\n'))}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition"
              >
                Copy All
              </button>
            </div>
            <div className="space-y-4">
              {Object.entries(data.pages).map(([key, page]: [string, any]) => (
                <div key={key} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm capitalize">{page.title || key.replace(/_/g, ' ')}</h3>
                    <button
                      onClick={() => copyToClipboard(page.content)}
                      className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded hover:bg-blue-100 transition"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">{page.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AD COPY */}
        {productType === 'ad_copy' && data?.platforms && (
          <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Ad Copy by Platform</h2>
            <div className="space-y-6">
              {Object.entries(data.platforms).map(([platform, ads]: [string, any]) => (
                <div key={platform} className="border border-gray-100 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-4 capitalize">{platform}</h3>
                  <div className="space-y-3">
                    {Array.isArray(ads) ? ads.map((ad: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-sm mb-2">{ad}</p>
                        <button
                          onClick={() => copyToClipboard(ad)}
                          className="text-xs px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-100 transition"
                        >
                          Copy
                        </button>
                      </div>
                    )) : (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-sm mb-2">{ads.copy || ads}</p>
                        <button
                          onClick={() => copyToClipboard(ads.copy || ads)}
                          className="text-xs px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-100 transition"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SOCIAL MEDIA */}
        {productType === 'social_media' && data?.posts && (
          <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">30-Day Social Media Calendar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.posts.map((post: any, idx: number) => (
                <div key={idx} className="p-4 border border-gray-100 rounded-xl hover:border-blue-200 transition group">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Day {idx + 1}</span>
                    {post.platform && <span className="text-xs text-gray-400">{post.platform}</span>}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-4">{post.content || post}</p>
                  <button
                    onClick={() => copyToClipboard(post.content || post)}
                    className="w-full py-2 px-2 text-xs text-gray-600 bg-gray-50 rounded hover:bg-blue-50 hover:text-blue-600 transition font-medium"
                  >
                    Copy Post
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* LOGO & BRAND */}
        {productType === 'logo_brand' && (
          <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Logo & Brand Kit</h2>

            {data?.colors && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 text-sm mb-3 uppercase tracking-wide">Color Palette</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {data.colors.map((color: any, idx: number) => (
                    <div key={idx} className="rounded-lg overflow-hidden border border-gray-100">
                      <div
                        className="h-20 cursor-pointer hover:opacity-90 transition"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyToClipboard(color.hex)}
                      />
                      <div className="p-2 bg-gray-50 text-xs">
                        <p className="font-mono text-gray-700">{color.hex}</p>
                        {color.name && <p className="text-gray-500">{color.name}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data?.typography && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 text-sm mb-3 uppercase tracking-wide">Typography</h3>
                <div className="space-y-3">
                  {data.typography.map((font: any, idx: number) => (
                    <div key={idx} className="p-4 border border-gray-100 rounded-lg">
                      <p className="text-xs font-semibold text-blue-600 mb-2 uppercase">{font.use}</p>
                      <p style={{ fontFamily: font.family }} className="text-lg mb-1">{font.name}</p>
                      <p className="text-xs text-gray-500">{font.family}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data?.logoDescriptions && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 text-sm mb-3 uppercase tracking-wide">Logo Concepts</h3>
                <div className="space-y-3">
                  {data.logoDescriptions.map((logo: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                      <p className="font-medium text-gray-900 text-sm mb-1">{logo.concept}</p>
                      <p className="text-gray-600 text-sm">{logo.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data?.guidelines && (
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-3 uppercase tracking-wide">Brand Guidelines</h3>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{data.guidelines}</p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* PITCH DECK */}
        {productType === 'pitch_deck' && data?.slides && (
          <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Pitch Deck</h2>
            <div className="space-y-6">
              {data.slides.map((slide: any, idx: number) => (
                <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="bg-blue-50 p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{slide.title}</h3>
                      <span className="text-xs font-semibold text-blue-600 bg-white px-2.5 py-1 rounded">Slide {idx + 1}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    {slide.bulletPoints && (
                      <ul className="space-y-2 mb-4">
                        {slide.bulletPoints.map((point: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                    {slide.content && (
                      <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">{slide.content}</p>
                    )}
                    {slide.speakerNotes && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                        <p className="text-xs font-semibold text-amber-700 mb-1 uppercase">Speaker Notes</p>
                        <p className="text-sm text-amber-900 whitespace-pre-wrap">{slide.speakerNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* WEBSITE */}
        {productType?.startsWith('website_') && data?.sections && (
          <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Generated Website</h2>
            <div className="space-y-6">
              {Object.entries(data.sections).map(([sectionName, content]: [string, any]) => (
                <div key={sectionName} className="border border-gray-100 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3 capitalize">{sectionName.replace(/_/g, ' ')}</h3>
                  <div className="text-gray-600 text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100 max-h-64 overflow-y-auto">
                    {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                  </div>
                  <button
                    onClick={() => copyToClipboard(typeof content === 'string' ? content : JSON.stringify(content, null, 2))}
                    className="mt-3 w-full py-2 px-3 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition"
                  >
                    Copy Section
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* COMPETITOR SPY - should redirect but fallback display */}
        {productType === 'competitor_spy' && data?.report && (
          <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Competitor Spy Report</h2>
            <div className="space-y-4">
              {data.report.map((item: any, idx: number) => (
                <div key={idx} className="p-4 border border-gray-100 rounded-xl">
                  <p className="font-medium text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-gray-600 text-sm">{item.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CROSS-SELLS */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 sm:p-8 mb-6 print-hide">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Grow Your Business</h3>
          <p className="text-gray-600 text-sm mb-4">Combine products to accelerate growth:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Business Plan Pro', price: '$147', desc: 'Full business plan with operations & risk analysis' },
              { name: 'Pitch Deck', price: '$39', desc: 'Investor-ready presentation deck' },
              { name: 'Website Builder', price: '$99', desc: 'Professional website in minutes' },
              { name: 'Logo & Brand Kit', price: '$29', desc: 'Complete brand identity system' },
            ].map((product, idx) => (
              <a
                key={idx}
                href={`/#${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 transition text-sm"
              >
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500 mt-1">{product.desc}</p>
                <p className="text-sm font-bold text-blue-600 mt-2">{product.price}</p>
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-center text-white print-hide">
          <h3 className="text-lg font-bold mb-2">Need Help?</h3>
          <p className="text-blue-100 text-sm mb-4">Our team is ready to answer any questions about your product.</p>
          <a
            href="mailto:support@bizplangenius.com"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition text-sm"
          >
            Email Support
          </a>
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-xs text-gray-400 print-hide">
          <p>Generated by BizPlan Genius - bizplangenius.com</p>
        </div>
      </main>

      {/* Floating Action Bar (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 z-50 sm:hidden print-hide">
        <button
          onClick={() => window.print()}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Save / Print
        </button>
      </div>
    </div>
  );
}
