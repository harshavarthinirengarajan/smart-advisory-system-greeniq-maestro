import React from 'react';
import { Card } from './Card';
import { ToggleSwitch } from './ToggleSwitch';
import { useTranslations } from '../hooks/useTranslations';
import type { Locale } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceEnabled: boolean;
  onVoiceToggle: (enabled: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, voiceEnabled, onVoiceToggle }) => {
  const { t, setLocale, locale } = useTranslations();

  if (!isOpen) return null;

  const handleLanguageChange = (lang: Locale) => {
    setLocale(lang);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 id="settings-title" className="text-xl font-bold font-display text-gray-800">{t('settings')}</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100" aria-label={t('closeSettings')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t('notifications')}</h3>
                <ToggleSwitch
                    label={t('enableVoiceAlerts')}
                    enabled={voiceEnabled}
                    onChange={onVoiceToggle}
                />
                <p className="text-sm text-gray-500 mt-2">
                    {t('voiceAlertsDescription')}
                </p>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{t('language')}</h3>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => handleLanguageChange('en')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${locale === 'en' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => handleLanguageChange('ta')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${locale === 'ta' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        தமிழ்
                    </button>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};