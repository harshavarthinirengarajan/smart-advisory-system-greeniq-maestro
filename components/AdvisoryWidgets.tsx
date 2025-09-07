import React, { useState, useEffect, useRef } from 'react';
import type { WeatherData, Notification, Locale } from '../types';
import { Card } from './Card';
import { DropIcon, ShieldIcon, CalendarIcon, MarketIcon } from './IconComponents';
import { generateDiseasePrediction } from '../services/geminiService';
import { Loader } from './Loader';
import { speak } from '../utils/speech';
import { useTranslations } from '../hooks/useTranslations';

// Custom hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  // Fix: The useRef hook requires an initial value. It is now initialized with `undefined`, and the ref's type is updated to be type-safe.
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface AdvisoryWidgetsProps {
    weatherData: WeatherData;
    voiceNotificationsEnabled: boolean;
    onNewNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    locale: Locale;
}

export const AdvisoryWidgets: React.FC<AdvisoryWidgetsProps> = ({ weatherData, voiceNotificationsEnabled, onNewNotification, locale }) => {
    const { t } = useTranslations();
    const [diseasePrediction, setDiseasePrediction] = useState<{ risk: string; details: string }>({ risk: 'Low', details: t('lowDiseaseRiskDetails') });
    const [loading, setLoading] = useState(true);
    const [hasAnnouncedStatic, setHasAnnouncedStatic] = useState(false);

    const irrigationNeeded = weatherData.rainfall < 20 && weatherData.temperature > 28;
    const prevDiseaseRisk = usePrevious(diseasePrediction.risk);
    const prevWeatherData = usePrevious(weatherData);

    useEffect(() => {
        if (weatherData !== prevWeatherData) {
            setHasAnnouncedStatic(false);
        }
        const fetchPrediction = async () => {
            setLoading(true);
            try {
                const prediction = await generateDiseasePrediction(weatherData, locale);
                setDiseasePrediction(prediction);
            } catch (error) {
                console.error("Failed to fetch disease prediction:", error);
                setDiseasePrediction({ risk: 'Error', details: t('fetchDiseaseError') });
            } finally {
                setLoading(false);
            }
        };
        fetchPrediction();
    }, [weatherData, prevWeatherData, locale, t]);

    // Effect for dynamic disease alert
    useEffect(() => {
        if (!loading && diseasePrediction.risk === 'High' && prevDiseaseRisk !== 'High') {
            const message = t('diseaseAlertVoice', { details: diseasePrediction.details });
            speak(message, voiceNotificationsEnabled);
            onNewNotification({
                type: 'alert',
                title: t('highDiseaseRisk'),
                message: diseasePrediction.details,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, diseasePrediction, prevDiseaseRisk, voiceNotificationsEnabled, t]);

    // Effect for one-time static alerts per analysis
    useEffect(() => {
        if (!loading && !hasAnnouncedStatic) {
            const harvestingMessage = t('harvestingAlertVoice');
            speak(harvestingMessage, voiceNotificationsEnabled);
            onNewNotification({
                type: 'info',
                title: t('harvestingWindowTitle'),
                message: t('harvestingWindowMessage')
            });
            setHasAnnouncedStatic(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, hasAnnouncedStatic, voiceNotificationsEnabled, t]);


    return (
        <div className="space-y-6">
            <Card>
                 <h3 className="text-lg font-bold font-display text-gray-800 mb-3">{t('quickAdvisory')}</h3>
                 <div className="space-y-4">
                    <AdvisoryItem
                        icon={<DropIcon className={`w-6 h-6 ${irrigationNeeded ? 'text-blue-500' : 'text-gray-400'}`} />}
                        title={t('irrigationAdvisory')}
                        value={irrigationNeeded ? t('irrigationRecommended') : t('sufficientMoisture')}
                        colorClass={irrigationNeeded ? "text-blue-600" : "text-green-600"}
                    />
                    <AdvisoryItem
                        icon={<ShieldIcon className={`w-6 h-6 ${diseasePrediction.risk === 'High' ? 'text-red-500' : 'text-green-500'}`} />}
                        title={t('diseaseThreat')}
                        value={loading ? <Loader size="sm"/> : t('riskValue', { risk: diseasePrediction.risk })}
                        details={loading ? '' : diseasePrediction.details}
                        colorClass={diseasePrediction.risk === 'High' ? "text-red-600" : diseasePrediction.risk === 'Medium' ? 'text-yellow-600' : "text-green-600"}
                    />
                </div>
            </Card>
            <Card>
                 <h3 className="text-lg font-bold font-display text-gray-800 mb-3">{t('harvestingAndMarket')}</h3>
                 <div className="space-y-4">
                    <AdvisoryItem
                        icon={<CalendarIcon className="w-6 h-6 text-indigo-500" />}
                        title={t('harvestingWindowTitle')}
                        value={t('harvestingStarts')}
                        details={t('harvestingDetails')}
                        colorClass="text-indigo-600"
                    />
                     <AdvisoryItem
                        icon={<MarketIcon className="w-6 h-6 text-secondary" />}
                        title={t('marketPriceAlert')}
                        value={t('bestPriceMandi')}
                        details={t('marketPriceDetails')}
                        colorClass="text-secondary"
                    />
                </div>
            </Card>
        </div>
    );
};


interface AdvisoryItemProps {
    icon: React.ReactNode;
    title: string;
    value: React.ReactNode;
    details?: string;
    colorClass?: string;
}
const AdvisoryItem: React.FC<AdvisoryItemProps> = ({ icon, title, value, details, colorClass = "text-gray-800" }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className={`font-bold text-lg ${colorClass}`}>{value}</p>
            {details && <p className="text-xs text-gray-500">{details}</p>}
        </div>
    </div>
);