import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI-Augmented Business Plan Production for Immigration Counsel',
  description:
    'White-labeled USCIS business plan production for immigration law firms. E-2, L-1, O-1, EB-5, EB-2 NIW. From $1,500. 5-day turnaround. You handle compliance review, we produce the plan.',
  alternates: { canonical: '/counsel' },
  // Intentionally excluded from main site nav. Discoverable via direct URL only.
  // Allow indexing so cold-email recipients land here, but do not promote.
  robots: { index: true, follow: false },
};

export default function CounselLandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top minimal header (no main BPG nav) */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold tracking-tight text-slate-900">
            BizPlan Genius <span className="text-slate-400">|</span>{' '}
            <span className="text-slate-600">Counsel Services</span>
          </div>
          <a
            href="#request"
            className="rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Request engagement letter
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              For U.S. immigration attorneys
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-900 lg:text-5xl">
              AI-augmented business plan production for immigration counsel.
              White-labeled. 5-day delivery. From $1,500.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              You handle USCIS compliance review and letterhead. We produce the
              plan, market analysis, financial model, and operations narrative.
              Saves your firm 10-15 hours per case.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#request"
                className="rounded-md bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Request engagement letter
              </a>
              <a
                href="#samples"
                className="rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                See sample plans
              </a>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              50% deposit on engagement-letter signature. Balance due on delivery.
              Net 7 terms on the balance invoice.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Pricing
          </h2>
          <p className="mt-2 text-slate-700">
            Flat-fee per visa category. No per-page or per-revision charges.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                E-2, L-1, O-1
              </div>
              <div className="mt-2 text-4xl font-bold text-slate-900">
                $1,500
              </div>
              <div className="mt-1 text-sm text-slate-600">per plan, flat fee</div>
              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                <li>30 to 50 page USCIS-structured plan</li>
                <li>Visa-specific eligibility section</li>
                <li>5-year financial model (monthly Y1, quarterly Y2-5)</li>
                <li>U.S. hiring plan with BLS-aligned salary ranges</li>
                <li>Source of funds narrative with documentation pointers</li>
                <li>USCIS-targeted risk analysis (RFE preparedness)</li>
                <li>Adjudicator summary with prong mapping</li>
                <li>Delivered as editable .docx, white-labeled</li>
                <li>Two free revisions during the engagement</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                EB-5
              </div>
              <div className="mt-2 text-4xl font-bold text-slate-900">
                $2,500
              </div>
              <div className="mt-1 text-sm text-slate-600">per plan, flat fee</div>
              <ul className="mt-6 space-y-2 text-sm text-slate-700">
                <li>Everything in E-2 / L-1 / O-1, plus:</li>
                <li>EB-5-grade source of funds narrative</li>
                <li>Job creation modeling with buffer analysis</li>
                <li>Capital deployment timeline</li>
                <li>Sustainment narrative for I-829</li>
                <li>RIMS II indirect / induced job estimates (informational)</li>
                <li>50 to 70 page deliverable</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Rush production available:</strong> +30% for 3-day turnaround.
            Toggle on intake form.
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            How it works
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {[
              {
                n: '1',
                title: 'Submit intake form',
                body: 'Your associate fills the structured intake (investor profile, business concept, source of funds summary, hiring plan). 15 minutes.',
              },
              {
                n: '2',
                title: 'Sign engagement letter',
                body: 'We auto-generate a one-page engagement letter with deal terms pre-filled. Your firm reviews and e-signs.',
              },
              {
                n: '3',
                title: 'Pay 50% deposit',
                body: 'Stripe invoice for the deposit clears. Production clock starts.',
              },
              {
                n: '4',
                title: '5-day production',
                body: 'Plan delivered as editable .docx. Balance due Net 7 on delivery. Two free revisions included.',
              },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-lg border border-slate-200 bg-slate-50 p-5"
              >
                <div className="text-3xl font-bold text-slate-300">
                  {step.n}
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {step.title}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">
                  {step.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Samples */}
      <section id="samples" className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Sample plans
          </h2>
          <p className="mt-2 text-slate-700">
            Three redacted samples. Email-gated download.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                visa: 'E-2',
                title: 'Brazilian quick-casual restaurant, $200K, Miami',
                desc: 'Substantial-investment sliding scale, treaty country narrative, marginality analysis with sensitivity. ~30 pages.',
                slug: 'e2-brazilian-restaurant',
              },
              {
                visa: 'L-1A',
                title: 'Romanian software parent, Austin subsidiary',
                desc: 'New-office L-1A, qualifying relationship, executive-capacity duties, 18-month staffing. ~28 pages.',
                slug: 'l1a-romanian-austin',
              },
              {
                visa: 'EB-5',
                title: '$1.05M direct investment, U.S. tech-services',
                desc: 'EB-5-grade source of funds, 10-job creation timeline with 4-job buffer, capital deployment phases. ~55 pages.',
                slug: 'eb5-tech-services',
              },
            ].map((s) => (
              <div
                key={s.slug}
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  {s.visa}
                </div>
                <div className="mt-2 text-base font-semibold text-slate-900">
                  {s.title}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-slate-600">
                  {s.desc}
                </div>
                <a
                  href={`/api/counsel/sample-request?plan=${s.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  Request sample (email-gated) -&gt;
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Frequently asked
          </h2>
          <div className="mt-8 space-y-6">
            {[
              {
                q: 'Is this USCIS-compliant?',
                a: 'We produce production-grade business plans for immigration counsel. Your firm reviews for USCIS compliance, which is your firm\'s expertise. We do not file petitions, give legal advice, or guarantee outcomes.',
              },
              {
                q: 'What about my malpractice carrier?',
                a: 'White-label production with attorney review is industry-standard practice. Joorney, Wise Business Plans, OGS Capital, Black Sheep, and others have operated this model for over a decade. Your firm of record signs and submits.',
              },
              {
                q: 'Can I see a sample first?',
                a: 'Yes - request below. Three redacted samples (E-2, L-1A, EB-5) available via email-gated download.',
              },
              {
                q: 'What is your turnaround?',
                a: '5 business days from intake form submission and 50% deposit cleared. 3-day rush production available at +30%.',
              },
              {
                q: 'Who owns the IP?',
                a: 'On full payment, your firm owns the deliverable IP. We retain the right to anonymize and improve our underlying production system using non-identifying patterns from completed projects.',
              },
              {
                q: 'What happens if my client receives an RFE?',
                a: 'RFE-response narrative is included free for 90 days post-delivery. Beyond 90 days, RFE-response work is billed at the same flat-fee structure.',
              },
              {
                q: 'Do you handle other visa categories?',
                a: 'E-2, L-1, O-1, EB-5, and EB-2 NIW are the v1 catalog. We will quote other categories (TN, H-1B businesses, B-1, OAW) on request.',
              },
              {
                q: 'How do you price relative to Joorney and Wise Business Plans?',
                a: 'Our flat fee is below market for the same scope. Joorney and Wise typically range $2,000 to $4,500 depending on visa and complexity. Our $1,500 (E-2/L-1/O-1) and $2,500 (EB-5) reflects an AI-augmented production model with attorney review still owned by your firm.',
              },
            ].map((f) => (
              <div key={f.q}>
                <div className="text-base font-semibold text-slate-900">
                  {f.q}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">
                  {f.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="request" className="bg-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to outsource production on your next case?
          </h2>
          <p className="mt-4 text-slate-300">
            Submit the intake form. We auto-generate an engagement letter and a
            Stripe invoice for the 50% deposit. 5-day production clock starts on
            deposit clearance.
          </p>
          <div className="mt-8">
            <Link
              href="/counsel/intake"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Submit intake form
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-400">
            Or reply directly to your sales contact for any questions before
            engaging.
          </p>
        </div>
      </section>

      {/* Compliance footer */}
      <footer className="bg-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-10 text-xs leading-relaxed text-slate-600">
          <p>
            <strong>Important:</strong> BizPlan Genius does not provide legal
            advice. Plans are produced for review and submission by licensed
            immigration counsel. The firm of record retains all responsibility for
            USCIS representation.
          </p>
          <p className="mt-3">
            (c) 2026 BizPlan Genius. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
