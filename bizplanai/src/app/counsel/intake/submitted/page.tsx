'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface OrderState {
  orderId: string;
  depositPrice: number;
  depositPaymentLink: string;
  productionDays: number;
  engagementLetterBase64: string;
  engagementLetterFilename: string;
  firmEmail: string;
}

function SubmittedContent() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams?.get('orderId') || '';
  const depositFromUrl = searchParams?.get('deposit') || '';

  const [state, setState] = useState<OrderState | null>(null);
  const [downloadHref, setDownloadHref] = useState<string>('');

  useEffect(() => {
    if (!orderIdFromUrl) return;
    try {
      const stored = sessionStorage.getItem(`counsel_order_${orderIdFromUrl}`);
      if (stored) {
        const parsed = JSON.parse(stored) as OrderState;
        setState(parsed);
        if (parsed.engagementLetterBase64) {
          const dataUrl = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${parsed.engagementLetterBase64}`;
          setDownloadHref(dataUrl);
        }
      }
    } catch (err) {
      console.warn('Failed to read from sessionStorage:', err);
    }
  }, [orderIdFromUrl]);

  const orderId = state?.orderId || orderIdFromUrl;
  const deposit = state?.depositPrice ?? Number(depositFromUrl);
  const depositPaymentLink = state?.depositPaymentLink || '';
  const filename = state?.engagementLetterFilename || `engagement-letter-${orderId}.docx`;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold tracking-tight text-slate-900">
            BizPlan Genius <span className="text-slate-400">|</span>{' '}
            <span className="text-slate-600">Counsel Intake</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-900">
          <div className="text-lg font-semibold">Engagement received.</div>
          <p className="mt-2 text-sm">
            Order ID: <code className="rounded bg-white px-2 py-1 text-xs">{orderId}</code>
          </p>
        </div>

        {state ? (
          <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Two actions to complete your engagement
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Download the engagement letter and pay the {deposit ? `$${Number(deposit).toLocaleString()}` : ''} deposit.
              Once the deposit clears, the {state.productionDays}-business-day production clock starts.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a
                href={downloadHref || '#'}
                download={filename}
                className={`flex flex-col rounded-md border p-5 text-left transition ${
                  downloadHref
                    ? 'border-slate-300 bg-white hover:border-blue-700 hover:bg-slate-50'
                    : 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-60'
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Step 1</div>
                <div className="mt-2 text-base font-semibold text-slate-900">Download engagement letter</div>
                <div className="mt-1 text-xs text-slate-600">.docx — your e-signature is recorded inside</div>
                <div className="mt-3 inline-flex items-center text-sm font-semibold text-blue-700">Download .docx →</div>
              </a>

              <a
                href={depositPaymentLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col rounded-md border p-5 text-left transition ${
                  depositPaymentLink
                    ? 'border-blue-700 bg-blue-50 hover:bg-blue-100'
                    : 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-60'
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-widest text-blue-700">Step 2</div>
                <div className="mt-2 text-base font-semibold text-slate-900">
                  Pay {deposit ? `$${Number(deposit).toLocaleString()}` : ''} deposit
                </div>
                <div className="mt-1 text-xs text-slate-700">Stripe — card, ACH, or wire</div>
                <div className="mt-3 inline-flex items-center text-sm font-semibold text-blue-700">Pay deposit on Stripe →</div>
              </a>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              We also attempted to email these to {state.firmEmail || 'your firm email'}.
              If you do not see the email within 5 minutes (check spam), use the buttons above.
              The buttons remain active as long as you keep this tab open.
            </p>
          </section>
        ) : (
          <section className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm text-amber-900">
              Could not restore engagement details from your browser. The order is still saved
              and you should receive an email at the firm address you provided. If not, reply
              to <a className="text-blue-700 underline" href="mailto:hello@bizplangenius.com">hello@bizplangenius.com</a> with
              order ID <code>{orderId}</code> and we will resend the engagement letter.
            </p>
          </section>
        )}

        <h1 className="mt-12 text-2xl font-bold tracking-tight">What happens after the deposit clears</h1>
        <ol className="mt-6 space-y-5 text-slate-700 text-sm">
          <li className="flex gap-3">
            <span className="font-bold text-slate-300">1</span>
            <div>{state?.productionDays || 5}-business-day production clock starts. We notify you when the white-labeled .docx plan is ready.</div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-slate-300">2</span>
            <div>Two free revisions during the engagement window. RFE-response narrative included free for 90 days.</div>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-slate-300">3</span>
            <div>Balance invoice issued on plan delivery, due Net 7.</div>
          </li>
        </ol>

        <div className="mt-12 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-700">
          <div className="font-semibold text-slate-900">Need to update the engagement?</div>
          <div className="mt-2">
            Email <a className="text-blue-700 underline" href="mailto:hello@bizplangenius.com">hello@bizplangenius.com</a> with
            order ID <code>{orderId}</code> and any corrections to the investor name, business details, or hiring plan.
            We update the order before production starts.
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SubmittedPage() {
  // useSearchParams() in a client component requires a Suspense boundary
  // for static rendering. Wrapping the entire content in Suspense satisfies
  // the Next.js 14 app router requirement.
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <SubmittedContent />
    </Suspense>
  );
}
