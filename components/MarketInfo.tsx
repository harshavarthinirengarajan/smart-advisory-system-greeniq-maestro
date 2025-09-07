import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from './Card';
import { marketPriceData, marketLinkages } from '../constants';
import { PhoneIcon, TruckIcon, LocationMarkerIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon } from './IconComponents';
import { useTranslations } from '../hooks/useTranslations';

export const MarketInfo: React.FC = () => {
    const { t } = useTranslations();
    const cropsToPredict = ['Wheat', 'Rice', 'Maize'];

    const getPrediction = (cropName: 'Wheat' | 'Rice' | 'Maize') => {
        if (marketPriceData.length < 2) {
            return { trend: t('trendStable'), message: t('trendInsufficientData'), color: 'text-gray-600', Icon: MinusIcon };
        }
        const lastPrice = marketPriceData[marketPriceData.length - 1][cropName];
        const secondLastPrice = marketPriceData[marketPriceData.length - 2][cropName];

        if (lastPrice > secondLastPrice) {
            return { trend: t('trendUpward'), message: t('trendUpwardMessage'), color: 'text-green-600', Icon: TrendingUpIcon };
        } else if (lastPrice < secondLastPrice) {
            return { trend: t('trendDownward'), message: t('trendDownwardMessage'), color: 'text-red-600', Icon: TrendingDownIcon };
        } else {
            return { trend: t('trendStable'), message: t('trendStableMessage'), color: 'text-gray-600', Icon: MinusIcon };
        }
    };


  return (
    <div className="space-y-8">
        <Card>
            <h2 className="text-xl font-bold font-display text-gray-800 border-b pb-3 mb-4">{t('marketPriceTrends')}</h2>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={marketPriceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
                        <Legend wrapperStyle={{ fontSize: '14px' }}/>
                        <Line type="monotone" dataKey="Wheat" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Rice" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Maize" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
        <Card>
            <h2 className="text-xl font-bold font-display text-gray-800 border-b pb-3 mb-4">{t('marketPricePrediction')}</h2>
            <div className="space-y-4">
                {cropsToPredict.map((crop) => {
                    const prediction = getPrediction(crop as 'Wheat' | 'Rice' | 'Maize');
                    return (
                        <div key={crop} className="flex items-start space-x-4">
                            <div className={`flex-shrink-0 mt-1 p-1 rounded-full ${prediction.color.replace('text', 'bg').replace('-600', '-100')}`}>
                                <prediction.Icon className={`w-5 h-5 ${prediction.color}`} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{crop}</p>
                                <p className={`font-bold text-md ${prediction.color}`}>{prediction.trend}</p>
                                <p className="text-xs text-gray-500">{prediction.message}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
         <Card>
            <h2 className="text-xl font-bold font-display text-gray-800 border-b pb-3 mb-4">{t('marketLinkages')}</h2>
            <div className="space-y-4">
                {marketLinkages.map((market, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="font-bold text-lg text-primary-800">{t(market.name)}</h3>
                        <div className="mt-2 space-y-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <LocationMarkerIcon className="w-4 h-4 text-gray-400" />
                                <span>{market.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <PhoneIcon className="w-4 h-4 text-gray-400" />
                                <span>{market.contact}</span>
                            </div>
                             <div className="flex items-center space-x-2">
                                <TruckIcon className="w-4 h-4 text-gray-400" />
                                <span>{t(market.transport)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    </div>
  );
};