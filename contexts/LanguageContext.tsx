import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { Locale } from '../types';

type Translations = Record<string, string>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Record<Locale, Translations> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
        try {
            const [enResponse, taResponse] = await Promise.all([
                fetch('/locales/en.json'),
                fetch('/locales/ta.json')
            ]);
            
            if (!enResponse.ok || !taResponse.ok) {
                throw new Error('Failed to load translation files');
            }

            const en = await enResponse.json();
            const ta = await taResponse.json();

            setTranslations({ en, ta });
        } catch (error) {
            console.error("Could not load translations:", error);
            // Fallback to empty objects to prevent crashing the app
            setTranslations({ en: {}, ta: {} });
        } finally {
            setLoading(false);
        }
    };

    fetchTranslations();
  }, []);

  const t = useCallback((key: string, replacements: Record<string, string | number> = {}): string => {
    if (!translations) {
        return key; // Return key if translations aren't loaded yet
    }
    
    let translation = translations[locale]?.[key] || translations['en']?.[key] || key;
    
    Object.keys(replacements).forEach(placeholder => {
        const regex = new RegExp(`{{${placeholder}}}`, 'g');
        translation = translation.replace(regex, String(replacements[placeholder]));
    });

    return translation;
  }, [locale, translations]);
  
  if (loading) {
    // Render a simple loading state to prevent the app from breaking before translations are ready.
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f9fafb' }}>
             <svg
                style={{ width: '50px', height: '50px', color: '#22c55e' }}
                className="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                >
                <circle
                    style={{ opacity: 0.25 }}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    style={{ opacity: 0.75 }}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};