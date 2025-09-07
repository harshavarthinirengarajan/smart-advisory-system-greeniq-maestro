import { GoogleGenAI, Type } from "@google/genai";
import type { SoilData, WeatherData, Crop, Locale, FertilizerPlanData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const cropRecommendationSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: {
          type: Type.STRING,
          description: 'The name of the recommended crop.',
        },
        reason: {
          type: Type.STRING,
          description: 'A short explanation of why this crop is suitable for the given conditions.',
        },
      },
      required: ['name', 'reason'],
    },
};

const fertilizerPlanSchema = {
    type: Type.OBJECT,
    properties: {
        organic: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'List of organic fertilizer dosages per acre.',
        },
        chemical: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'List of chemical fertilizer dosages per acre.',
        },
        alternatives: {
            type: Type.STRING,
            description: 'Alternative suggestions if local fertilizers are unavailable.'
        },
        productNames: {
            type: Type.OBJECT,
            properties: {
                organic: { type: Type.ARRAY, items: { type: Type.STRING } },
                chemical: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            description: 'Common marketable product names for the recommended fertilizers.'
        }
    },
    required: ['organic', 'chemical', 'alternatives', 'productNames'],
};

const diseasePredictionSchema = {
    type: Type.OBJECT,
    properties: {
        risk: {
            type: Type.STRING,
            enum: ['Low', 'Medium', 'High'],
            description: 'The predicted risk level for diseases.'
        },
        details: {
            type: Type.STRING,
            description: 'Details about potential diseases and preventative measures.'
        }
    },
    required: ['risk', 'details'],
};

const getLanguageInstruction = (locale: Locale) => {
    return `Respond in the following language: ${locale === 'en' ? 'English' : 'Tamil'}.`;
}

export const generateCropRecommendations = async (soil: SoilData, weather: WeatherData, locale: Locale): Promise<Crop[]> => {
    const prompt = `Based on the following soil and weather conditions, recommend 3 to 5 suitable crops.
    Soil: pH=${soil.ph}, N=${soil.n} kg/ha, P=${soil.p} kg/ha, K=${soil.k} kg/ha, EC=${soil.ec} dS/m.
    Weather: Temperature=${weather.temperature}°C, Humidity=${weather.humidity}%, Rainfall=${weather.rainfall}mm.
    For each crop, provide a short explanation of why it's suitable.
    ${getLanguageInstruction(locale)}
    Respond in JSON format.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: cropRecommendationSchema,
        }
    });
    
    const text = response.text.trim();
    return JSON.parse(text);
};

export const generateFertilizerPlan = async (crop: Crop, locale: Locale): Promise<FertilizerPlanData> => {
    const prompt = `Create a per-acre fertilizer plan for ${crop.name}.
    Provide dosages for both organic and chemical fertilizers.
    Also, suggest alternatives if primary options are unavailable locally.
    Finally, provide a list of common marketable product names for the suggested chemical and organic fertilizers (e.g., 'Urea 46-0-0', 'Farm Yard Manure').
    ${getLanguageInstruction(locale)}
    Respond in JSON format.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: fertilizerPlanSchema,
        }
    });

    const text = response.text.trim();
    return JSON.parse(text);
};


export const generateDiseasePrediction = async (weather: WeatherData, locale: Locale): Promise<{ risk: string, details: string }> => {
    const prompt = `Based on weather conditions (Temperature: ${weather.temperature}°C, Humidity: ${weather.humidity}%), predict the potential disease risk for common crops. 
    Categorize the risk as 'Low', 'Medium', or 'High' and provide a brief explanation.
    ${getLanguageInstruction(locale)}
    Respond in JSON format.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: diseasePredictionSchema,
        }
    });
    
    const text = response.text.trim();
    return JSON.parse(text);
};

export const analyzeCropImage = async (base64Image: string, mimeType: string, locale: Locale): Promise<string> => {
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };
    const textPart = {
        text: `Analyze this image of a plant leaf. Identify any potential diseases or pests. Suggest organic treatment methods in a concise, easy-to-understand format for a farmer. ${getLanguageInstruction(locale)}`,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
    
    return response.text;
};