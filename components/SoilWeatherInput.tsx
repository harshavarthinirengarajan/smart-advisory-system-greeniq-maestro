import React, { useState } from 'react';
import type { SoilData, WeatherData } from '../types';
import { Card } from './Card';
import { useTranslations } from '../hooks/useTranslations';

interface SoilWeatherInputProps {
  onAnalyze: (soilData: SoilData, weatherData: WeatherData) => void;
}

const initialSoilData: SoilData = {
  ph: 7.0, n: 50, p: 25, k: 50, ec: 1.5,
  micronutrients: { zinc: 1, iron: 2, manganese: 2 }
};

const initialWeatherData: WeatherData = {
  temperature: 25, humidity: 60, rainfall: 50
};

export const SoilWeatherInput: React.FC<SoilWeatherInputProps> = ({ onAnalyze }) => {
  const [soil, setSoil] = useState<SoilData>(initialSoilData);
  const [weather, setWeather] = useState<WeatherData>(initialWeatherData);
  const { t } = useTranslations();

  const handleSoilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSoil(prev => ({ ...prev, [name]: parseFloat(value) }));
  };
  
  const handleWeatherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWeather(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(soil, weather);
  };
  
  return (
    <Card>
      <h2 className="text-xl font-bold font-display text-gray-800 border-b pb-3 mb-4">{t('farmInputData')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="font-semibold text-primary-700 mb-2">{t('soilParameters')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="pH" name="ph" value={soil.ph} onChange={handleSoilChange} step={0.1} />
            <Input label={t('nitrogenLabel')} name="n" value={soil.n} onChange={handleSoilChange} />
            <Input label={t('phosphorusLabel')} name="p" value={soil.p} onChange={handleSoilChange} />
            <Input label={t('potassiumLabel')} name="k" value={soil.k} onChange={handleSoilChange} />
            <Input label={t('ecLabel')} name="ec" value={soil.ec} onChange={handleSoilChange} step={0.1}/>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-primary-700 mb-2">{t('weatherInformation')}</h3>
          <div className="grid grid-cols-1 gap-4">
             <Input label={t('temperatureLabel')} name="temperature" type="range" min="0" max="50" value={weather.temperature} onChange={handleWeatherChange} displayValue={`${weather.temperature}°C`} />
             <Input label={t('humidityLabel')} name="humidity" type="range" min="0" max="100" value={weather.humidity} onChange={handleWeatherChange} displayValue={`${weather.humidity}%`} />
             <Input label={t('rainfallLabel')} name="rainfall" type="range" min="0" max="200" value={weather.rainfall} onChange={handleWeatherChange} displayValue={`${weather.rainfall}mm`} />
          </div>
        </div>
        <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50">
          {t('analyzeAndAdvisory')}
        </button>
      </form>
    </Card>
  );
};


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    displayValue?: string;
}

const Input: React.FC<InputProps> = ({ label, name, value, onChange, type = "number", displayValue, ...props }) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
            <div className="flex items-center space-x-2">
              <input
                  type={type}
                  id={name}
                  name={name}
                  value={value}
                  onChange={onChange}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                  {...props}
              />
              {displayValue && <span className="text-sm text-gray-700 font-medium min-w-[50px] text-right">{displayValue}</span>}
            </div>
        </div>
    );
}