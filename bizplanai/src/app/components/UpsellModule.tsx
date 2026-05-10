/**
 * Cross-property upsell to done-for-you. Drop on every product/pricing page.
 *
 * Updated 2026-05-10: removed the $497 price anchor in advance of the B2B
 * counsel channel launch ($1,500-$2,500 lawyer tier). Public price would
 * undercut B2B positioning if a prospective firm researches our consumer
 * pages before requesting an engagement letter.
 *
 * Adi quotes each inbound lead manually:
 *   - Consumer (founder direct): $797
 *   - Immigration attorney / law firm: route to /counsel
 *   - SBA-only requests: $797
 *   - Anything complex (EB-5, multi-entity): custom quote
 */

const QUOTE_REQUEST_URL =
  'mailto:eadrianene@gmail.com?subject=Done-for-you%20business%20plan%20-%20quote%20request';

export default function UpsellModule() {
  return (
    <section
      aria-label="Done-for-you upgrade"
      className="my-8 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700"
    >
      Want this done for you instead?{' '}
      <a
        href={QUOTE_REQUEST_URL}
        className="font-semibold text-blue-700 underline hover:text-blue-800"
      >
        Request a quote
      </a>
      . 5-day turnaround on most projects.
    </section>
  );
}
