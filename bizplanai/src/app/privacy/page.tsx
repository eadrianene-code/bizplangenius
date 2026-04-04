import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — BizPlan Genius',
  description: 'Privacy Policy for BizPlan Genius business plan generator.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700 transition">
            BizPlan Genius
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: April 4, 2026</p>

        <div className="prose prose-gray max-w-none space-y-10 text-gray-700 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              BizPlan Genius (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and
              is committed to protecting the personal information you share with us. This Privacy Policy explains
              what information we collect, how we use it, and your rights regarding your data when you use our
              website at bizplangenius.com (the &ldquo;Service&rdquo;).
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="font-medium text-gray-900 mb-2">Information you provide directly:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Business name, industry, and description submitted through our form.</li>
              <li>Target audience, revenue model, location, budget, and competitor information.</li>
              <li>Email address (if provided during checkout).</li>
            </ul>
            <p className="font-medium text-gray-900 mt-5 mb-2">Information collected automatically:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Device information (browser type, operating system).</li>
              <li>IP address and approximate geographic location.</li>
              <li>Pages visited, time spent on site, and referral source.</li>
              <li>Cookies and similar tracking technologies (see Section 6).</li>
            </ul>
            <p className="font-medium text-gray-900 mt-5 mb-2">Payment information:</p>
            <p>
              All payment processing is handled by Stripe. We do not collect, store, or have access to your full
              credit card number, CVV, or banking details. Stripe&rsquo;s privacy practices are governed by{' '}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                Stripe&rsquo;s Privacy Policy
              </a>.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Generate your business plan based on the information you submit.</li>
              <li>Process your payment and deliver your business plan.</li>
              <li>Communicate with you regarding your order or support requests.</li>
              <li>Improve and optimize our Service, including AI model quality.</li>
              <li>Detect and prevent fraud or unauthorized use of our Service.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. How We Share Your Information</h2>
            <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
            <ul className="mt-3 space-y-3 list-disc pl-5">
              <li>
                <strong>Service Providers.</strong> We share data with third-party providers that help us operate
                the Service, including Stripe (payments), AI providers (business plan generation), and hosting
                providers (Vercel). These providers are bound by contractual obligations to protect your data.
              </li>
              <li>
                <strong>Legal Requirements.</strong> We may disclose information if required by law, regulation,
                legal process, or governmental request.
              </li>
              <li>
                <strong>Business Transfers.</strong> In the event of a merger, acquisition, or sale of assets,
                your information may be transferred to the acquiring entity.
              </li>
              <li>
                <strong>With Your Consent.</strong> We may share information for other purposes with your explicit consent.
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Data Retention</h2>
            <p>
              We retain your submitted business information for up to 90 days after your purchase to allow for
              support requests and plan revisions. After this period, your business submission data is deleted from
              our active systems.
            </p>
            <p className="mt-3">
              Anonymized or aggregated data (which cannot identify you) may be retained indefinitely to improve
              our Service. Payment records are retained as required by applicable tax and financial regulations.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Cookies and Tracking</h2>
            <p>
              We use essential cookies that are necessary for the Service to function (e.g., session management
              and payment processing). We may also use analytics tools to understand how visitors interact with
              our website.
            </p>
            <p className="mt-3">
              You can control cookies through your browser settings. Disabling essential cookies may affect the
              functionality of the Service.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Data Security</h2>
            <p>
              We implement reasonable technical and organizational measures to protect your information, including
              encrypted data transmission (HTTPS/TLS), secure payment processing through Stripe, and access controls
              on our systems. However, no method of electronic transmission or storage is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Your Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong>Access</strong> — request a copy of the personal information we hold about you.</li>
              <li><strong>Correction</strong> — request correction of inaccurate personal information.</li>
              <li><strong>Deletion</strong> — request deletion of your personal information.</li>
              <li><strong>Portability</strong> — request your data in a portable format.</li>
              <li><strong>Objection</strong> — object to certain processing of your personal information.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:support@bizplangenius.com" className="text-blue-600 hover:text-blue-800 underline">
                support@bizplangenius.com
              </a>. We will respond within 30 days.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. California Residents (CCPA)</h2>
            <p>
              If you are a California resident, you have the right to know what personal information we collect,
              request deletion of your data, and opt out of the sale of personal information. As stated above,
              we do not sell personal information. To make a request, contact us at{' '}
              <a href="mailto:support@bizplangenius.com" className="text-blue-600 hover:text-blue-800 underline">
                support@bizplangenius.com
              </a>.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. International Users</h2>
            <p>
              Our Service is operated from the United States. If you are accessing the Service from outside the
              United States, your information will be transferred to and processed in the United States, where
              data protection laws may differ from those in your country. By using the Service, you consent to
              this transfer and processing.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Children&rsquo;s Privacy</h2>
            <p>
              Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal
              information from children. If we become aware that we have collected information from a child under 18,
              we will take steps to delete that information promptly.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an
              updated &ldquo;Last updated&rdquo; date. Your continued use of the Service after changes are posted
              constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">13. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:{' '}
              <a href="mailto:support@bizplangenius.com" className="text-blue-600 hover:text-blue-800 underline">
                support@bizplangenius.com
              </a>
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; 2026 BizPlan Genius. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-700 transition font-medium text-gray-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-700 transition">Terms of Service</Link>
            <a href="mailto:support@bizplangenius.com" className="hover:text-gray-700 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
