import Link from 'next/link';
import UpsellModule from '@/app/components/UpsellModule';

export default function CompareBizplanCom() {
  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-5 py-12 leading-relaxed text-slate-800">
        <header className="mb-8 border-b pb-6">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Comparison, updated May 2026</p>
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-slate-900">BizPlan Genius vs Bizplan.com</h1>
          <p className="text-lg text-slate-700">
            BizPlan Genius and Bizplan.com (the Startups.com product) sound similar but operate differently. One is a one-time
            AI generator. The other is a subscription template builder bundled with a startup community.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Quick comparison</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr><th className="border-b p-3 text-left">Dimension</th><th className="border-b p-3 text-left">BizPlan Genius</th><th className="border-b p-3 text-left">Bizplan.com</th></tr>
              </thead>
              <tbody>
                <tr><td className="border-b p-3 font-medium">Pricing model</td><td className="border-b p-3">One-time, $97 to $147</td><td className="border-b p-3">Subscription, $29/mo</td></tr>
                <tr><td className="border-b p-3 font-medium">12-month cost</td><td className="border-b p-3">$97 to $147</td><td className="border-b p-3">$348</td></tr>
                <tr><td className="border-b p-3 font-medium">Generation flow</td><td className="border-b p-3">AI from one brief</td><td className="border-b p-3">Drag-drop template</td></tr>
                <tr><td className="border-b p-3 font-medium">Real competitor data</td><td className="border-b p-3">Yes, live web search</td><td className="border-b p-3">No, manual entry</td></tr>
                <tr><td className="border-b p-3 font-medium">Community access</td><td className="border-b p-3">No</td><td className="border-b p-3">Yes (Startups.com)</td></tr>
                <tr><td className="border-b p-3 font-medium">Visa-specific format</td><td className="border-b p-3">Yes</td><td className="border-b p-3">No</td></tr>
                <tr><td className="border-b p-3 font-medium">SBA-specific format</td><td className="border-b p-3">Yes</td><td className="border-b p-3">Generic</td></tr>
                <tr><td className="border-b p-3 font-medium">Plan-to-website flow</td><td className="border-b p-3">Yes</td><td className="border-b p-3">No</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Where BizPlan Genius wins</h2>
          <ul className="list-disc pl-6">
            <li className="mb-2"><strong>Speed.</strong> Brief in, plan out, single flow. Bizplan.com expects you to fill each section manually.</li>
            <li className="mb-2"><strong>Real competitor data.</strong> Live Google Search grounding vs manual competitor entry.</li>
            <li className="mb-2"><strong>Total cost.</strong> $97 to $147 once vs $348 over 12 months on Bizplan.com.</li>
            <li className="mb-2"><strong>Trigger-segment plans.</strong> <Link className="underline text-blue-700" href="/e2-visa-business-plan">E-2 visa</Link> and <Link className="underline text-blue-700" href="/sba-loan-business-plan">SBA</Link> formats out of the box.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Where Bizplan.com wins</h2>
          <ul className="list-disc pl-6">
            <li className="mb-2"><strong>Bundled community.</strong> Startups.com membership includes mentor sessions and a founder community.</li>
            <li className="mb-2"><strong>Iteration cadence.</strong> If you actively edit the plan over a 12-month launch period, the subscription model gives you continuous editor access.</li>
            <li className="mb-2"><strong>Brand familiarity.</strong> Used by some accelerators and SBDC programs.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Which fits which buyer</h2>
          <p className="mb-3"><strong>Pick BizPlan Genius if:</strong> you want a plan in under an hour, with real competitor data, for one payment, and you may need a visa or SBA format.</p>
          <p className="mb-3"><strong>Pick Bizplan.com if:</strong> you want the Startups.com community membership in the same purchase, and you will edit the plan continuously over a long timeline.</p>
        </section>

        <UpsellModule />
      </article>
    </main>
  );
}
