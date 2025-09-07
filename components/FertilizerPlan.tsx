import React, { useState, useEffect } from 'react';
import type { Crop, Report, Notification, Locale, FertilizerPlanData } from '../types';
import { generateFertilizerPlan } from '../services/geminiService';
import { Card } from './Card';
import { Loader } from './Loader';
import { useTranslations } from '../hooks/useTranslations';
import { ShoppingCartIcon } from './IconComponents';

interface FertilizerPlanProps {
  crop: Crop;
  onNewReport: (report: Report) => void;
  onNewNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  locale: Locale;
}

export const FertilizerPlan: React.FC<FertilizerPlanProps> = ({ crop, onNewReport, onNewNotification, locale }) => {
  const [plan, setPlan] = useState<FertilizerPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslations();

  useEffect(() => {
    if (!crop) return;
    const fetchPlan = async () => {
      setLoading(true);
      setError(null);
      setPlan(null);
      try {
        const result = await generateFertilizerPlan(crop, locale);
        setPlan(result);
        onNewReport({
          type: 'Fertilizer Plan',
          name: `${t('for')} ${crop.name}`,
          summary: `${t('organic')}: ${result.organic.join(', ')}. ${t('chemical')}: ${result.chemical.join(', ')}.`,
          timestamp: new Date().toISOString(),
        });
        onNewNotification({
            type: 'success',
            title: t('fertilizerPlanReadyTitle'),
            message: t('fertilizerPlanReadyMessage', { cropName: crop.name }),
        });
      } catch (err) {
        setError(t('fetchFertilizerError'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop, locale]);

  return (
    <Card>
      <h2 className="text-xl font-bold font-display text-gray-800 border-b pb-3 mb-4">{t('fertilizerPlanFor')} {crop.name}</h2>
      {loading && <div className="flex justify-center items-center h-40"><Loader /></div>}
      {error && <p className="text-red-500">{error}</p>}
      {plan && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg text-green-800">{t('organicOptions')}</h3>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              {plan.organic.map((item: string, index: number) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-orange-800">{t('chemicalOptions')}</h3>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
              {plan.chemical.map((item: string, index: number) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-blue-800">{t('alternatives')}</h3>
            <p className="mt-1 text-gray-600">{plan.alternatives}</p>
          </div>
          {(plan.productNames?.chemical || plan.productNames?.organic) && (
            <div>
                 <h3 className="font-semibold text-lg text-purple-800 flex items-center">
                    <ShoppingCartIcon className="w-5 h-5 mr-2"/>
                    {t('findBestPrices')}
                </h3>
                 <div className="mt-2 space-y-1 text-sm">
                    {[...(plan.productNames.organic || []), ...(plan.productNames.chemical || [])].map((product, index) => (
                        <a 
                            key={index}
                            href={`https://www.google.com/search?q=buy+${encodeURIComponent(product)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-800 hover:underline"
                        >
                           {t('searchFor')} "{product}"
                        </a>
                    )).reduce((prev, curr, i) => [prev, <span key={`sep-${i}`} className="mx-1">|</span>, curr] as any)}
                 </div>
                 <p className="text-xs text-gray-400 mt-2">{t('priceDisclaimer')}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};