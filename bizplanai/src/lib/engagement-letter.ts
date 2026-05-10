/**
 * Generates a one-page engagement letter as .docx, pre-filled with deal terms
 * from the intake form submission. Includes E-SIGN-Act electronic signature
 * stamp (signer name, timestamp, IP address).
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
} from 'docx';

export interface EngagementLetterData {
  orderId: string;
  attorneyName: string;
  firmName: string;
  firmEmail: string;
  barAdmissionState: string;
  visaCategory: string;
  visaCategoryLabel: string;
  investorName: string;
  businessName: string;
  totalPrice: number;
  depositPrice: number;
  rushProduction: boolean;
  productionDays: number;
  signatureName: string;
  submittedAt: string; // ISO
  signerIp: string;
  userAgent: string;
}

function p(text: string, opts: { bold?: boolean; size?: number } = {}): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: opts.bold, size: opts.size || 22 })],
    spacing: { after: 160, line: 320 },
  });
}

function h(text: string, level: 1 | 2): Paragraph {
  return new Paragraph({
    text,
    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    spacing: { before: level === 1 ? 360 : 240, after: 120 },
  });
}

function spacer(): Paragraph {
  return new Paragraph({ text: '' });
}

export async function generateEngagementLetterDocx(d: EngagementLetterData): Promise<Buffer> {
  const today = new Date(d.submittedAt).toISOString().slice(0, 10);

  const doc = new Document({
    creator: 'BizPlan Genius',
    title: `Engagement Letter - ${d.firmName} - ${d.orderId}`,
    description: `Engagement letter for USCIS plan production order ${d.orderId}`,
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'ENGAGEMENT LETTER', bold: true, size: 32 })],
            spacing: { after: 240 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'USCIS Business Plan Production Services', size: 24 })],
            spacing: { after: 360 },
          }),

          p(`Order ID: ${d.orderId}`),
          p(`Date: ${today}`),
          spacer(),

          p('PARTIES', { bold: true }),
          p(`This Engagement Letter is between BizPlan Genius (the "Service Provider") and ${d.firmName} (the "Firm of Record"), with attorney of record ${d.attorneyName}, admitted to the bar of ${d.barAdmissionState}.`),
          spacer(),

          p('SCOPE OF WORK', { bold: true }),
          p(`The Service Provider will produce a USCIS-structured business plan for the ${d.visaCategoryLabel} petition of ${d.investorName} relating to ${d.businessName}. Deliverable is an editable .docx file, white-labeled, suitable for the Firm of Record to apply letterhead and submit as part of the petition package.`),
          spacer(),

          p('PRODUCTION CLOCK', { bold: true }),
          p(`Production clock is ${d.productionDays} business days${d.rushProduction ? ' (rush production)' : ''}, starting on the later of (a) submission of the intake form, and (b) clearance of the deposit invoice referenced below.`),
          spacer(),

          p('FEES AND PAYMENT', { bold: true }),
          p(`Total fee: $${d.totalPrice.toLocaleString()} USD.`),
          p(`Deposit (50%, non-refundable once production clock starts): $${d.depositPrice.toLocaleString()} USD, due upon receipt of the Stripe invoice referenced below.`),
          p(`Balance: $${(d.totalPrice - d.depositPrice).toLocaleString()} USD, invoiced on plan delivery, due within 7 days (Net 7).`),
          spacer(),

          p('REVISIONS AND RFE SUPPORT', { bold: true }),
          p('Two free revisions during the active engagement window. RFE-response narrative included at no charge for 90 days following plan delivery. Beyond 90 days, RFE-response work is billed under a separate engagement.'),
          spacer(),

          p('IP TRANSFER', { bold: true }),
          p('Upon full payment, the Firm of Record receives all rights to the deliverable for use in the petition and ongoing client representation. The Service Provider retains the right to anonymize and improve its underlying production system using non-identifying patterns from completed projects.'),
          spacer(),

          p('COMPLIANCE DISCLAIMER', { bold: true }),
          p('This plan is production-grade business analysis prepared for the Firm of Record\'s USCIS submission package. The Firm of Record is solely responsible for USCIS legal review, visa-category compliance verification, adjudicator strategy, and representation of the applicant. The Service Provider does not provide legal advice and does not represent applicants before USCIS or any government agency.'),
          spacer(),

          p('GOVERNING LAW', { bold: true }),
          p('This Engagement Letter is governed by the laws of the State of Delaware. Any dispute is to be resolved by binding arbitration administered by the American Arbitration Association under its Commercial Arbitration Rules.'),
          spacer(),

          p('ELECTRONIC SIGNATURE', { bold: true }),
          p(`The Firm of Record, by submitting the intake form, has electronically signed this Engagement Letter under the Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. § 7001 et seq.).`),
          spacer(),

          p('Electronic signature record:', { bold: true }),
          p(`Signer name: ${d.signatureName}`),
          p(`Signer email: ${d.firmEmail}`),
          p(`Timestamp (UTC): ${d.submittedAt}`),
          p(`IP address: ${d.signerIp || '(not captured)'}`),
          p(`User agent: ${(d.userAgent || '').slice(0, 200)}`),
          spacer(),
          spacer(),

          p('________________________________'),
          p(`${d.signatureName}, on behalf of ${d.firmName}`),
          spacer(),

          p('________________________________'),
          p('BizPlan Genius (Service Provider)'),
          p('Adi Eadrianene, Founder'),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
