'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StandaloneBusinessForm from '../components/StandaloneBusinessForm';

interface Section { heading: string; content: string; }
interface LegalDoc { title: string; lastUpdated: string; sections: Section[]; }
interface LegalData { businessName: string; termsOfService: LegalDoc; privacyPolicy: LegalDoc; cookiePolicy: LegalDoc; }

function LegalPagesInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const planSessionId = searchParams.get('plan_session_id');

  const [step, setStep] = useState<'landing' | 'generating' | 'result'>('landing');
  const [legal, setLegal] = useState<LegalData | null>(null);
  const [activeDoc, setActiveDoc] = useState<'tos' | 'privacy' | 'cookie'>('tos');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sessionId) generateLegal();
  }, []);

  const generateLegal = async () => {
    setStep('generating'); setError('');
    try {
      const res = await fetch('/api/legal-pages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, planSessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLegal(data.legal); setStep('result');
    } catch (err: any) { setError(err.message); setStep('landing'); }
  };

  const getDocContent = (doc: LegalDoc) => {
    return `${doc.title}\nLast updated: ${doc.lastUpdated}\n\n` +
      doc.sections.map(s => `${s.heading}\n\n${s.content}`).join('\n\n');
  };

  const copyDoc = (doc: LegalDoc) => {
    navigator.clipboard.writeText(getDocContent(doc));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const downloadDoc = (doc: LegalDoc, filename: string) => {
    const blob = new Blob([getDocContent(doc)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHtml = (doc: LegalDoc, filename: string) => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${doc.title}</title><style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:20px;color:#333;line-height:1.6}h1{font-size:24px}h2{font-size:18px;margin-top:30px}p{margin:10px 0}</style></head><body><h1>${doc.title}</h1><p><em>Last updated: ${doc.lastUpdated}</em></p>${doc.sections.map(s => `<h2>${s.heading}</h2><p>${s.content.replace(/\n/g, '</p><p>')}</p>`).join('')}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  if (!sessionId && step === 'landing') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">Legal Pages Generator</h1>
            <p className="text-gray-600 text-lg">Terms of Service, Privacy Policy, and Cookie Policy -- tailored to your business. GDPR + CCPA compliant.</p>
          </div>

          <div className="bg-white rounded-2xl border p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">You'll receive 3 legal documents</h3>
            <div className="space-y-4">
              {[
                { title: 'Terms of Service', desc: '10 sections: agreement, services, payments, IP, liability, termination, governing law, and more. Specific to your business type.', icon: '📜' },
                { title: 'Privacy Policy', desc: 'GDPR + CCPA compliant. Covers: data collection, usage, sharing, retention, user rights (access, delete, portability), and security.', icon: '🔒' },
                { title: 'Cookie Policy', desc: 'Types of cookies used, how to manage them, third-party cookies. Required for EU compliance.', icon: '🍪' },
              ].map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl">{d.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{d.title}</p>
                    <p className="text-xs text-gray-500">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
              <div><p className="font-bold text-gray-900">Copy & paste</p>Ready for your website</div>
              <div><p className="font-bold text-gray-900">HTML download</p>Styled pages included</div>
              <div><p className="font-bold text-gray-900">Editable</p>Customize any section</div>
            </div>
          </div>

          <StandaloneBusinessForm productName="Legal Pages" productPrice={19} checkoutEndpoint="/api/legal-pages-checkout" />
        </main>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Generating Your Legal Pages</h1>
            <p className="text-gray-600">Writing Terms of Service, Privacy Policy, and Cookie Policy...</p>
          </div>
          <div className="bg-white rounded-2xl border p-8"><ProgressBar /></div>
        </main>
      </div>
    );
  }

  if (step === 'result' && legal) {
    const docs = {
      tos: legal.termsOfService,
      privacy: legal.privacyPolicy,
      cookie: legal.cookiePolicy,
    };
    const doc = docs[activeDoc];
    const docLabels = { tos: 'Terms of Service', privacy: 'Privacy Policy', cookie: 'Cookie Policy' };

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
            <a href={`/dashboard?session_id=${sessionId}`} className="text-sm text-brand-600 hover:text-brand-700">My Toolkit</a>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Legal Pages: {legal.businessName}</h1>
            <p className="text-sm text-gray-500">3 documents generated. Copy, download, or edit as needed.</p>
          </div>

          {/* Doc tabs */}
          <div className="flex gap-2 mb-6">
            {(['tos', 'privacy', 'cookie'] as const).map(key => (
              <button key={key} onClick={() => setActiveDoc(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeDoc === key ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {docLabels[key]}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-4">
            <button onClick={() => copyDoc(doc)} className={`px-4 py-2 text-sm font-medium rounded-lg transition ${copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            <button onClick={() => downloadDoc(doc, `${activeDoc}-${legal.businessName.toLowerCase().replace(/\s+/g, '-')}.txt`)}
              className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              Download .txt
            </button>
            <button onClick={() => downloadHtml(doc, `${activeDoc}-${legal.businessName.toLowerCase().replace(/\s+/g, '-')}.html`)}
              className="px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition">
              Download .html
            </button>
          </div>

          {/* Document content */}
          <div className="bg-white rounded-2xl border p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{doc.title}</h2>
            <p className="text-xs text-gray-400 mb-6">Last updated: {doc.lastUpdated}</p>
            <div className="space-y-6">
              {(doc.sections || []).map((s, i) => (
                <div key={i}>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{s.heading}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{s.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-800"><span className="font-bold">Note:</span> These documents are AI-generated starting points. We recommend having a lawyer review them before publishing, especially if you handle sensitive data or operate in regulated industries.</p>
          </div>
        </main>
      </div>
    );
  }

  return null;
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-gradient">BizPlan Genius</a>
        <span className="text-sm text-gray-500">Legal Pages</span>
      </div>
    </header>
  );
}

function ProgressBar() {
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState('Analyzing your business...');
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        if (next < 10) setStatus('Analyzing your business type and requirements...');
        else if (next < 25) setStatus('Drafting Terms of Service...');
        else if (next < 45) setStatus('Writing Privacy Policy (GDPR + CCPA)...');
        else if (next < 60) setStatus('Creating Cookie Policy...');
        else setStatus('Finalizing documents...');
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{status}</span>
        <span className="text-gray-400">{elapsed}s</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div className="h-full rounded-full bg-brand-600 transition-all duration-1000 ease-out" style={{ width: `${Math.min(90, (elapsed / 70) * 90)}%` }} />
      </div>
    </div>
  );
}

export default function LegalPagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <LegalPagesInner />
    </Suspense>
  );
}
