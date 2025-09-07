import React, { useState } from 'react';
import { SoilWeatherInput } from './SoilWeatherInput';
import { CropRecommendation } from './CropRecommendation';
import { FertilizerPlan } from './FertilizerPlan';
import { AdvisoryWidgets } from './AdvisoryWidgets';
import { ImageAnalysis } from './ImageAnalysis';
import { MarketInfo } from './MarketInfo';
import { Reports } from './Reports';
import type { SoilData, WeatherData, Crop, Report, Notification, Locale } from '../types';
import { LeafIcon } from './IconComponents';
import { useTranslations } from '../hooks/useTranslations';

interface DashboardProps {
  voiceNotificationsEnabled: boolean;
  onNewNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  locale: Locale;
}

export const Dashboard: React.FC<DashboardProps> = ({ voiceNotificationsEnabled, onNewNotification, locale }) => {
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [recommendedCrops, setRecommendedCrops] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const { t } = useTranslations();

  const handleAnalysis = (soil: SoilData, weather: WeatherData) => {
    setSoilData(soil);
    setWeatherData(weather);
    setSelectedCrop(null); // Reset selected crop on new analysis
  };

  const handleNewReport = (report: Report) => {
    setReports(prev => [report, ...prev]);
  };

  const hasAnalysisData = soilData && weatherData;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <SoilWeatherInput onAnalyze={handleAnalysis} />
          {hasAnalysisData && <AdvisoryWidgets weatherData={weatherData} voiceNotificationsEnabled={voiceNotificationsEnabled} onNewNotification={onNewNotification} locale={locale} />}
        </div>
        <div className="lg:col-span-2 space-y-8">
          {hasAnalysisData ? (
            <>
              <CropRecommendation 
                soilData={soilData} 
                weatherData={weatherData}
                onCropsRecommended={setRecommendedCrops}
                onCropSelect={setSelectedCrop}
                selectedCrop={selectedCrop}
                locale={locale}
              />
              {selectedCrop && <FertilizerPlan crop={selectedCrop} onNewReport={handleNewReport} onNewNotification={onNewNotification} locale={locale} />}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center h-full text-center">
                 <div className="bg-primary-100 p-4 rounded-full mb-4">
                    <LeafIcon className="w-12 h-12 text-primary-600"/>
                 </div>
                <h2 className="text-2xl font-bold font-display text-gray-800">{t('welcomeTitle')}</h2>
                <p className="mt-2 text-gray-500 max-w-md">
                    {t('welcomeMessage')}
                </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageAnalysis onNewReport={handleNewReport} onNewNotification={onNewNotification} locale={locale} />
        <MarketInfo />
      </div>

      <Reports reports={reports} />
    </div>
  );
};