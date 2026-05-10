'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const VISA_OPTIONS = [
  { value: 'E-2', label: 'E-2 Treaty Investor', price: 1500 },
  { value: 'L-1', label: 'L-1A Intracompany Transferee', price: 1500 },
  { value: 'O-1', label: 'O-1 Extraordinary Ability', price: 1500 },
  { value: 'EB-5', label: 'EB-5 Immigrant Investor', price: 2500 },
  { value: 'EB-2-NIW', label: 'EB-2 National Interest Waiver', price: 1500 },
];

interface FormState {
  attorneyName: string;
  firmName: string;
  firmEmail: string;
  firmPhone: string;
  barAdmissionState: string;
  investorName: string;
  investorCountry: string;
  visaCategory: string;
  investmentAmount: string;
  businessConcept: string;
  businessName: string;
  industry: string;
  naicsCode: string;
  usLocation: string;
  usState: string;
  sourceOfFundsSummary: string;
  existingUsEntity: string;
  usEntityName: string;
  usEntityState: string;
  hiresYear1: string;
  hiresYear2: string;
  hiresYear3: string;
  rushProduction: boolean;
  complianceNotes: string;
  agreeToTerms: boolean;
  signatureName: string;
}

const INITIAL_STATE: FormState = {
  attorneyName: '',
  firmName: '',
  firmEmail: '',
  firmPhone: '',
  barAdmissionState: '',
  investorName: '',
  investorCountry: '',
  visaCategory: 'E-2',
  investmentAmount: '',
  businessConcept: '',
  businessName: '',
  industry: '',
  naicsCode: '',
  usLocation: '',
  usState: '',
  sourceOfFundsSummary: '',
  existingUsEntity: 'no',
  usEntityName: '',
  usEntityState: '',
  hiresYear1: '',
  hiresYear2: '',
  hiresYear3: '',
  rushProduction: false,
  complianceNotes: '',
  agreeToTerms: false,
  signatureName: '',
};

export default function IntakePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visaInfo = VISA_OPTIONS.find((v) => v.value === form.visaCategory);
  const basePrice = visaInfo?.price || 1500;
  const totalPrice = form.rushProduction ? Math.round(basePrice * 1.3) : basePrice;
  const depositPrice = Math.round(totalPrice * 0.5);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side validation of required fields
    const required: (keyof FormState)[] = [
      'attorneyName', 'firmName', 'firmEmail', 'barAdmissionState',
      'investorName', 'investorCountry', 'visaCategory', 'investmentAmount',
      'businessConcept', 'businessName', 'industry', 'usLocation', 'usState',
      'sourceOfFundsSummary', 'hiresYear1', 'hiresYear2', 'hiresYear3',
      'signatureName',
    ];
    for (const field of required) {
      if (!form[field] || (typeof form[field] === 'string' && (form[field] as string).trim() === '')) {
        setError(`Missing required field: ${field}`);
        return;
      }
    }
    if (!form.agreeToTerms) {
      setError('You must agree to the engagement terms before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/counsel/submit-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          investmentAmount: Number(form.investmentAmount),
          hiresYear1: Number(form.hiresYear1),
          hiresYear2: Number(form.hiresYear2),
          hiresYear3: Number(form.hiresYear3),
          existingUsEntity: form.existingUsEntity === 'yes',
          totalPrice,
          depositPrice,
          submittedAt: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server returned ${res.status}`);
      }
      const data = await res.json();
      // Stash the engagement letter + payment link in sessionStorage so the
      // submitted page can render them as direct download / pay buttons. This
      // lets the lawyer get the letter even if email delivery fails.
      try {
        sessionStorage.setItem(
          `counsel_order_${data.orderId}`,
          JSON.stringify({
            orderId: data.orderId,
            depositPrice: data.depositPrice,
            depositPaymentLink: data.depositPaymentLink,
            productionDays: data.productionDays,
            engagementLetterBase64: data.engagementLetterBase64,
            engagementLetterFilename: data.engagementLetterFilename,
            firmEmail: form.firmEmail,
          }),
        );
      } catch (storageErr) {
        // sessionStorage can fail in incognito with strict modes; not fatal
        console.warn('Failed to write to sessionStorage:', storageErr);
      }
      router.push(`/counsel/intake/submitted?orderId=${encodeURIComponent(data.orderId)}&deposit=${data.depositPrice}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="text-sm font-semibold tracking-tight text-slate-900">
            BizPlan Genius <span className="text-slate-400">|</span>{' '}
            <span className="text-slate-600">Counsel Intake</span>
          </div>
          <a href="/counsel" className="text-xs text-slate-600 hover:text-slate-900">Back to overview</a>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Engagement intake form
        </h1>
        <p className="mt-2 text-slate-700">
          Submit this form to start a USCIS plan production engagement. On submission you receive an engagement letter and a Stripe deposit invoice. The 5-day production clock starts when the deposit clears.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-10">
          {/* Section 1 - Firm */}
          <Section title="1. Firm of record" subtitle="Your contact details">
            <Field label="Attorney name *">
              <input type="text" value={form.attorneyName} onChange={(e) => update('attorneyName', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Firm name *">
              <input type="text" value={form.firmName} onChange={(e) => update('firmName', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Firm email *" hint="We send the engagement letter and Stripe invoice here">
              <input type="email" value={form.firmEmail} onChange={(e) => update('firmEmail', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Firm phone">
              <input type="tel" value={form.firmPhone} onChange={(e) => update('firmPhone', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Bar admission state *" hint="Two-letter code, e.g. NY, FL, CA">
              <input type="text" maxLength={2} value={form.barAdmissionState} onChange={(e) => update('barAdmissionState', e.target.value.toUpperCase())} className={inputClass} />
            </Field>
          </Section>

          {/* Section 2 - Visa + investor */}
          <Section title="2. Petitioner and visa category" subtitle="Investor or beneficiary identity">
            <Field label="Visa category *">
              <select value={form.visaCategory} onChange={(e) => update('visaCategory', e.target.value)} className={inputClass}>
                {VISA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} (${opt.price.toLocaleString()})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Investor / beneficiary name *" hint="Or pseudonym if confidentiality is desired pre-engagement">
              <input type="text" value={form.investorName} onChange={(e) => update('investorName', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Country of citizenship *">
              <input type="text" value={form.investorCountry} onChange={(e) => update('investorCountry', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Total investment amount (USD) *" hint="Numbers only, no commas">
              <input type="number" min={0} value={form.investmentAmount} onChange={(e) => update('investmentAmount', e.target.value)} className={inputClass} />
            </Field>
          </Section>

          {/* Section 3 - Business */}
          <Section title="3. Business concept" subtitle="What the petitioner is building in the U.S.">
            <Field label="Business name *" hint="Legal entity name or DBA">
              <input type="text" value={form.businessName} onChange={(e) => update('businessName', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Business concept *" hint="200-500 words. What the business does, who buys, why this US market.">
              <textarea rows={6} value={form.businessConcept} onChange={(e) => update('businessConcept', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Industry *">
              <input type="text" value={form.industry} onChange={(e) => update('industry', e.target.value)} className={inputClass} />
            </Field>
            <Field label="NAICS code (optional)" hint="6-digit if known">
              <input type="text" maxLength={6} value={form.naicsCode} onChange={(e) => update('naicsCode', e.target.value)} className={inputClass} />
            </Field>
            <Field label="U.S. location (city) *">
              <input type="text" value={form.usLocation} onChange={(e) => update('usLocation', e.target.value)} className={inputClass} />
            </Field>
            <Field label="U.S. state *" hint="Two-letter code">
              <input type="text" maxLength={2} value={form.usState} onChange={(e) => update('usState', e.target.value.toUpperCase())} className={inputClass} />
            </Field>
          </Section>

          {/* Section 4 - Source of funds */}
          <Section title="4. Source of funds" subtitle="Lawful origin and traceable path">
            <Field label="Source of funds summary *" hint="100-300 words. High-level description of sources. Documentation will live in your firm exhibits.">
              <textarea rows={5} value={form.sourceOfFundsSummary} onChange={(e) => update('sourceOfFundsSummary', e.target.value)} className={inputClass} />
            </Field>
          </Section>

          {/* Section 5 - U.S. entity + hiring */}
          <Section title="5. U.S. entity and hiring plan" subtitle="Operating structure">
            <Field label="Existing U.S. entity already formed?">
              <select value={form.existingUsEntity} onChange={(e) => update('existingUsEntity', e.target.value)} className={inputClass}>
                <option value="no">No, will form during the engagement</option>
                <option value="yes">Yes, already formed</option>
              </select>
            </Field>
            {form.existingUsEntity === 'yes' && (
              <>
                <Field label="U.S. entity name">
                  <input type="text" value={form.usEntityName} onChange={(e) => update('usEntityName', e.target.value)} className={inputClass} />
                </Field>
                <Field label="State of formation">
                  <input type="text" maxLength={2} value={form.usEntityState} onChange={(e) => update('usEntityState', e.target.value.toUpperCase())} className={inputClass} />
                </Field>
              </>
            )}
            <Field label="U.S. hires Year 1 *" hint="Direct full-time W-2 hires">
              <input type="number" min={0} value={form.hiresYear1} onChange={(e) => update('hiresYear1', e.target.value)} className={inputClass} />
            </Field>
            <Field label="U.S. hires Year 2 *">
              <input type="number" min={0} value={form.hiresYear2} onChange={(e) => update('hiresYear2', e.target.value)} className={inputClass} />
            </Field>
            <Field label="U.S. hires Year 3 *">
              <input type="number" min={0} value={form.hiresYear3} onChange={(e) => update('hiresYear3', e.target.value)} className={inputClass} />
            </Field>
          </Section>

          {/* Section 6 - Production options */}
          <Section title="6. Production options" subtitle="Turnaround and any compliance notes">
            <Field label="Rush production?" hint="3-day turnaround at +30%">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.rushProduction} onChange={(e) => update('rushProduction', e.target.checked)} className="h-4 w-4" />
                Yes, expedite to 3 business days (+30%)
              </label>
            </Field>
            <Field label="Special compliance notes (optional)" hint="Anything specific about this case the firm wants flagged">
              <textarea rows={3} value={form.complianceNotes} onChange={(e) => update('complianceNotes', e.target.value)} className={inputClass} />
            </Field>
          </Section>

          {/* Pricing summary */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold text-slate-700">Engagement summary</div>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>Visa category</span><span className="font-medium">{visaInfo?.label}</span></div>
              <div className="flex justify-between"><span>Base price</span><span className="font-medium">${basePrice.toLocaleString()}</span></div>
              {form.rushProduction && (
                <div className="flex justify-between"><span>Rush production +30%</span><span className="font-medium">+${(totalPrice - basePrice).toLocaleString()}</span></div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2 mt-2"><span className="font-semibold">Total fee</span><span className="font-semibold">${totalPrice.toLocaleString()}</span></div>
              <div className="flex justify-between text-blue-700"><span className="font-semibold">Deposit due now (50%)</span><span className="font-semibold">${depositPrice.toLocaleString()}</span></div>
              <div className="flex justify-between text-slate-600"><span>Balance due on delivery (Net 7)</span><span>${(totalPrice - depositPrice).toLocaleString()}</span></div>
            </div>
          </div>

          {/* Engagement terms + signature */}
          <Section title="7. Engagement terms" subtitle="Read carefully. Submission below constitutes electronic signature.">
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-700 leading-relaxed space-y-3">
              <p><strong>Production scope:</strong> BizPlan Genius will produce a USCIS-structured business plan for the {visaInfo?.label} petition described above. Deliverable is an editable .docx file, white-labeled, suitable for the firm to apply letterhead and submit.</p>
              <p><strong>Production clock:</strong> 5 business days (or 3 business days if rush production is selected) starting when (a) this intake form is submitted AND (b) the 50% deposit has cleared in our Stripe account, whichever is later.</p>
              <p><strong>Pricing:</strong> Total fee ${totalPrice.toLocaleString()}. 50% deposit (${depositPrice.toLocaleString()}) due upon engagement letter signature. Balance (${(totalPrice - depositPrice).toLocaleString()}) due Net 7 on plan delivery. Deposit is non-refundable once the production clock has started.</p>
              <p><strong>IP transfer:</strong> Upon full payment, the firm of record receives all rights to the deliverable for use in the petition and ongoing client representation. BizPlan Genius retains the right to anonymize and improve its underlying production system using non-identifying patterns from completed projects.</p>
              <p><strong>Revisions:</strong> Two free revisions during the active engagement window. RFE-response narrative included free for 90 days post-delivery.</p>
              <p><strong>Compliance disclaimer:</strong> This plan is production-grade business analysis prepared for the firm's USCIS submission package. The firm of record is solely responsible for USCIS legal review, visa-category compliance verification, adjudicator strategy, and representation of the applicant. BizPlan Genius does not provide legal advice and does not represent applicants before USCIS or any government agency.</p>
            </div>

            <Field label="E-signature: type the attorney's full legal name *" hint="This constitutes an electronic signature under the E-SIGN Act">
              <input type="text" value={form.signatureName} onChange={(e) => update('signatureName', e.target.value)} className={inputClass} placeholder="e.g. Jane M. Smith" />
            </Field>

            <label className="mt-4 flex items-start gap-3 text-sm text-slate-700">
              <input type="checkbox" checked={form.agreeToTerms} onChange={(e) => update('agreeToTerms', e.target.checked)} className="h-4 w-4 mt-0.5" />
              <span>
                I confirm that I am authorized to engage BizPlan Genius on behalf of {form.firmName || 'the firm'}, and that I agree to the engagement terms above. I understand that submitting this form constitutes my electronic signature on the engagement letter that will be emailed to me.
              </span>
            </label>
          </Section>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              On submit: engagement letter and Stripe deposit invoice are emailed to {form.firmEmail || 'your firm email'} within 60 seconds.
            </p>
            <button type="submit" disabled={submitting} className="rounded-md bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60">
              {submitting ? 'Submitting...' : `Submit and pay $${depositPrice.toLocaleString()} deposit`}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

const inputClass = 'mt-1 block w-full rounded-md border  border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600';

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      <div className="mt-4 space-y-4 rounded-lg border border-slate-200 bg-white p-6">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-900">{label}</span>
      {hint && <span className="block text-xs text-slate-500 mt-0.5">{hint}</span>}
      {children}
    </label>
  );
}
