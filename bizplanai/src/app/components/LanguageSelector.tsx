'use client';

import { useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Espanol', flag: '🇪🇸' },
  { code: 'pt', name: 'Portugues', flag: '🇧🇷' },
  { code: 'fr', name: 'Francais', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ro', name: 'Romana', flag: '🇷🇴' },
  { code: 'tr', name: 'Turkce', flag: '🇹🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
];

export function getLanguagePreference(): string {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('bizplan-language') || 'en';
}

export function getLanguageName(code: string): string {
  return LANGUAGES.find(l => l.code === code)?.name || 'English';
}

export function getLanguagePrompt(code: string): string {
  if (code === 'en') return '';
  const name = getLanguageName(code);
  return `\n\nIMPORTANT: Generate ALL content in ${name} language. All text, headings, descriptions, bullet points, and copy must be written in ${name}. Only keep technical terms (like JSON keys, HTML tags) in English.`;
}

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('en');

  useEffect(() => {
    setCurrent(getLanguagePreference());
  }, []);

  const handleSelect = (code: string) => {
    localStorage.setItem('bizplan-language', code);
    setCurrent(code);
    setOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === current);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition"
        title="Language for generated content">
        <span>{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.name}</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-gray-200 py-2 w-48 max-h-80 overflow-y-auto">
            <p className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase">Content language</p>
            {LANGUAGES.map(lang => (
              <button key={lang.code} onClick={() => handleSelect(lang.code)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${current === lang.code ? 'text-brand-600 font-semibold' : 'text-gray-700'}`}>
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {current === lang.code && <svg className="w-4 h-4 ml-auto text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
