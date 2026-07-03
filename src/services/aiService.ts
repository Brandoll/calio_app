import api from './api';
import { API_ROUTES } from '../constants/api';

export interface FoodItem {
  nombre: string;
  calorias: number;
  proteinas: number;
  grasas: number;
  carbohidratos: number;
}

export interface AiAnalysisResult {
  items: FoodItem[];
  confianza: number;
}

export const aiService = {
  analyzeImage: async (imageUri: string, mimeType: string = 'image/jpeg', fileName: string = 'food.jpg'): Promise<AiAnalysisResult> => {
    // Para enviar archivos en React Native usamos FormData
    const formData = new FormData();
    
    formData.append('imagen', {
      uri: imageUri,
      name: fileName,
      type: mimeType,
    } as any);

    const response = await api.post(API_ROUTES.AI_FOOD.ANALYZE_IMAGE, formData, {
      // Axios genera automáticamente el header Content-Type con el boundary en React Native
      // Puede tomar más tiempo procesar la imagen con IA

      timeout: 30000,
    });

    return response.data;
  },
};
