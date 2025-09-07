export type Locale = 'en' | 'ta';

export interface SoilData {
  ph: number;
  n: number;
  p: number;
  k: number;
  ec: number;
  micronutrients: {
    zinc: number;
    iron: number;
    manganese: number;
  };
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
}

export interface Crop {
  name: string;
  reason: string;
}

export interface Report {
    type: 'Fertilizer Plan' | 'Image Analysis';
    name: string;
    summary: string;
    timestamp: string;
}

export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface FertilizerPlanData {
    organic: string[];
    chemical: string[];
    alternatives: string;
    productNames: {
        organic: string[];
        chemical: string[];
    };
}