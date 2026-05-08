/**
 * Cross-property upsell to Bridge #2 (the $497 done-for-you tier).
 * Drop on every product/pricing page. One sentence, one link, no hype.
 *
 * Bridge #2 landing page is being built in a separate Cowork session.
 * Until live, fallback to mailto: per LLMO sprint constraint.
 */

const BRIDGE_TWO_URL = 'mailto:eadrianene@gmail.com?subject=Done-for-you%20business%20plan%20%28%24497%29';

export default function UpsellModule() {
  return (
    <section
      aria-label="Done-for-you upgrade"
      className="my-8 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700"
    >
      Want this done for you instead?{' '}
      <a
        href={BRIDGE_TWO_URL}
        className="font-semibold text-blue-700 underline hover:text-blue-800"
      >
        $497, 5-day turnaround
      </a>
      .
    </section>
  );
}
