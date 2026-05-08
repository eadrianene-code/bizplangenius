import Link from 'next/link';
import UpsellModule from '@/app/components/UpsellModule';

export default function CompareLivePlan() {
  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-5 py-12 leading-relaxed text-slate-800">
        <header className="mb-8 border-b pb-6">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Comparison, updated May 2026</p>
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-slate-900">BizPlan Genius vs LivePlan</h1>
          <p className="text-lg text-slate-700">
            Honest, side-by-side comparison. Both tools produce business plans. They differ in price, in how the plan is
            generated, in whether competitor research is real or template-based, and in which buyer they fit.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Quick comparison</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr><th className="border-b p-3 text-left">Dimension</th><th className="border-b p-3 text-left">BizPlan Genius</th><th className="border-b p-3 text-left">LivePlan</th></tr>
              </thead>
              <tbody>
                <tr><td className="border-b p-3 font-medium">Pricing model</td><td className="border-b p-3">One-time, $97 to $147</td><td className="border-b p-3">Subscription, $20/mo</td></tr>
                <tr><td className="border-b p-3 font-medium">12-month cost</td><td className="border-b p-3">$97 to $147</td><td className="border-b p-3">$240</td></tr>
                <tr><td className="border-b p-3 font-medium">Generation flow</td><td className="border-b p-3">AI from a single brief</td><td className="border-b p-3">Template + AI assist</td></tr>
                <tr><td className="border-b p-3 font-medium">Real competitor data</td><td className="border-b p-3">Yes, Gemini + Google Search grounding</td><td className="border-b p-3">Industry benchmarks only</td></tr>
                <tr><td className="border-b p-3 font-medium">Financial projections</td><td className="border-b p-3">3-year monthly</td><td className="border-b p-3">3 to 5-year, configurable</td></tr>
                <tr><td className="border-b p-3 font-medium">Visa-specific format (E-2, L-1, EB-5)</td><td className="border-b p-3">Yes, dedicated landing page</td><td className="border-b p-3">No</td></tr>
                <tr><td className="border-b p-3 font-medium">SBA-specific format</td><td className="border-b p-3">Yes, dedicated landing page</td><td className="border-b p-3">No, generic</td></tr>
                <tr><td className="border-b p-3 font-medium">Money-back guarantee</td><td className="border-b p-3">Yes (Pro tier)</td><td className="border-b p-3">60-day refund</td></tr>
                <tr><td className="border-b p-3 font-medium">Plan-to-website flow</td><td className="border-b p-3">Yes, one click</td><td className="border-b p-3">No</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Where BizPlan Genius wins</h2>
          <ul className="list-disc pl-6">
            <li className="mb-2"><strong>One-time pricing.</strong> $97 or $147 once. No subscription that compounds while you take three months to validate.</li>
            <li className="mb-2"><strong>Real competitor data in every plan.</strong> Gemini with Google Search grounding pulls actual competitor pricing and positioning, not template benchmarks.</li>
            <li className="mb-2"><strong>Trigger-segment formats.</strong> Dedicated <Link className="underline text-blue-700" href="/e2-visa-business-plan">E-2 visa</Link> and <Link className="underline text-blue-700" href="/sba-loan-business-plan">SBA loan</Link> formats. LivePlan does not.</li>
            <li className="mb-2"><strong>Plan-to-website.</strong> Your <Link className="underline text-blue-700" href="/build-website">website builds itself</Link> from your plan with one click.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Where LivePlan wins</h2>
          <ul className="list-disc pl-6">
            <li className="mb-2"><strong>Iteration over time.</strong> If you need to revise the plan monthly for the next year, the LivePlan subscription model includes ongoing updates and budgeting tools.</li>
            <li className="mb-2"><strong>Multi-year forecasting depth.</strong> LivePlan's financial forecasting goes 5 years deep with more granular configurability for buyers who want to model scenarios manually.</li>
            <li className="mb-2"><strong>Brand recognition.</strong> 25 years on market. SBA lenders and consultants are familiar with the format.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Which fits which buyer</h2>
          <p className="mb-3"><strong>Pick BizPlan Genius if:</strong> you want a plan generated this week, with real competitor data, for a one-time fee, and you value visa-specific or SBA-specific formats.</p>
          <p className="mb-3"><strong>Pick LivePlan if:</strong> you will iterate on the plan monthly, you want subscription-grade financial modeling, and you have a consultant or accountant who already uses LivePlan.</p>
        </section>

        <UpsellModule />
      </article>
    </main>
  );
}
