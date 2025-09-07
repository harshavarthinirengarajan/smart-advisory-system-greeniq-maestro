import React, { useEffect, useState } from 'react';
import type { SoilData, WeatherData, Crop, Locale } from '../types';
import { generateCropRecommendations } from '../services/geminiService';
import { Card } from './Card';
import { Loader } from './Loader';
import { useTranslations } from '../hooks/useTranslations';

interface CropRecommendationProps {
  soilData: SoilData;
  weatherData: WeatherData;
  onCropsRecommended: (crops: Crop[]) => void;
  onCropSelect: (crop: Crop) => void;
  selectedCrop: Crop | null;
  locale: Locale;
}

export const CropRecommendation: React.FC<CropRecommendationProps> = ({ soilData, weatherData, onCropsRecommended, onCropSelect, selectedCrop, locale }) => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslations();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const recommendedCrops = await generateCropRecommendations(soilData, weatherData, locale);
        setCrops(recommendedCrops);
        onCropsRecommended(recommendedCrops);
        if (recommendedCrops.length > 0) {
            onCropSelect(recommendedCrops[0]);
        }
      } catch (err) {
        setError(t('fetchCropsError'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soilData, weatherData, locale]);

  return (
    <Card>
      <h2 className="text-xl font-bold font-display text-gray-800 border-b pb-3 mb-4">{t('cropRecommendation')}</h2>
      {loading && <div className="flex justify-center items-center h-40"><Loader /></div>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="space-y-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
             {crops.map((crop) => (
               <button 
                 key={crop.name}
                 onClick={() => onCropSelect(crop)}
                 className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${selectedCrop?.name === crop.name ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-primary-100 hover:text-primary-800'}`}
               >
                 {crop.name}
               </button>
             ))}
           </div>

          {selectedCrop && (
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <h3 className="font-bold text-lg text-primary-800">{selectedCrop.name}</h3>
              <p className="mt-2 text-gray-600">
                <strong className="font-semibold text-gray-700">{t('whyThisCrop')}:</strong> {selectedCrop.reason}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};