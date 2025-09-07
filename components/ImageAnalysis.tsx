import React, { useState, useCallback } from 'react';
import { analyzeCropImage } from '../services/geminiService';
import type { Report, Notification, Locale } from '../types';
import { Card } from './Card';
import { Loader } from './Loader';
import { UploadIcon } from './IconComponents';
import { useTranslations } from '../hooks/useTranslations';

interface ImageAnalysisProps {
  onNewReport: (report: Report) => void;
  onNewNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  locale: Locale;
}

export const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ onNewReport, onNewNotification, locale }) => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslations();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      setError(null);
      setResult(null);
      
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      try {
        const base64Image = await fileToBase64(file);
        const analysisResult = await analyzeCropImage(base64Image, file.type, locale);
        setResult(analysisResult);
        onNewReport({
          type: 'Image Analysis',
          name: file.name,
          summary: analysisResult.substring(0, 100) + '...',
          timestamp: new Date().toISOString(),
        });
        onNewNotification({
          type: 'success',
          title: t('imageAnalysisCompleteTitle'),
          message: t('imageAnalysisCompleteMessage', { fileName: file.name }),
        });
      } catch (err) {
        setError(t('imageAnalysisError'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, [onNewReport, onNewNotification, locale, t]);

  return (
    <Card>
      <h2 className="text-xl font-bold font-display text-gray-800 border-b pb-3 mb-4">{t('diseaseDetectionTitle')}</h2>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input type="file" id="imageUpload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={loading} />
          <label htmlFor="imageUpload" className={`cursor-pointer ${loading ? 'opacity-50' : 'hover:text-primary-600'}`}>
            <UploadIcon className="w-12 h-12 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
                {image ? t('uploadAnotherImage') : t('clickToUpload')}
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
          </label>
        </div>

        {image && <img src={image} alt={t('uploadedCropAlt')} className="mt-4 rounded-lg w-full max-h-64 object-cover" />}

        {loading && <div className="flex items-center justify-center pt-4"><Loader /> <span className="ml-2">{t('analyzingImage')}</span></div>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {result && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800">{t('analysisResult')}:</h3>
            <p className="mt-1 text-gray-600 whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </Card>
  );
};