// Submission confirmation page (server component)
// Shows a friendly confirmation + next steps without revealing internal mechanics.

interface PageProps {
  searchParams: { orderId?: string; deposit?: string };
}

export default function SubmittedPage({ searchParams }: PageProps) {
  const orderId = searchParams.orderId || '';
  const deposit = searchParams.deposit || '';

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

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-900">
          <div className="text-lg font-semibold">Engagement received.</div>
          <p className="mt-2 text-sm">
            Order ID: <code className="rounded bg-white px-2 py-1 text-xs">{orderId}</code>
          </p>
        </div>

        <h1 className="mt-10 text-3xl font-bold tracking-tight">What happens next</h1>

        <ol className="mt-6 space-y-6 text-slate-700">
          <li className="flex gap-4">
            <span className="text-2xl font-bold text-slate-300">1</span>
            <div>
              <div className="font-semibold text-slate-900">Engagement letter delivered to your firm email</div>
              <div className="mt-1 text-sm">
                Within 60 seconds, you receive a one-page engagement letter as a .docx attachment. Your e-signature is recorded on it. Save a copy to your matter file.
              </div>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="text-2xl font-bold text-slate-300">2</span>
            <div>
              <div className="font-semibold text-slate-900">Pay the {deposit ? `$${Number(deposit).toLocaleString()}` : '50%'} deposit via Stripe</div>
              <div className="mt-1 text-sm">
                The same email contains a Stripe invoice link. Pay by card, ACH, or wire. Production starts when the deposit clears (typically same business day for card, 1-3 business days for ACH).
              </div>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="text-2xl font-bold text-slate-300">3</span>
            <div>
              <div className="font-semibold text-slate-900">5-day production clock</div>
              <div className="mt-1 text-sm">
                You will receive a delivery email when the white-labeled .docx plan is ready. Two free revisions during the engagement window. RFE-response narrative included free for 90 days.
              </div>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="text-2xl font-bold text-slate-300">4</span>
            <div>
              <div className="font-semibold text-slate-900">Balance invoice on delivery (Net 7)</div>
              <div className="mt-1 text-sm">
                The remaining 50% balance is invoiced on plan delivery, due within 7 days.
              </div>
            </div>
          </li>
        </ol>

        <div className="mt-12 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-700">
          <div className="font-semibold text-slate-900">Need to update your engagement?</div>
          <div className="mt-2">
            Reply directly to the engagement-letter email with any corrections to investor name, business details, or hiring plan. We'll update the order before production starts.
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-slate-500">
          Questions? Email{' '}
          <a href="mailto:hello@bizplangenius.com" className="text-blue-700 hover:text-blue-800">
            hello@bizplangenius.com
          </a>
        </p>
      </div>
    </main>
  );
}
