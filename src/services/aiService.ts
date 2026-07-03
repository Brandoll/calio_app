import { API_BASE_URL, API_ROUTES } from '../constants/api';
import { useAuthStore } from '../stores/authStore';

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
    // Usar FormData nativo
    const formData = new FormData();
    
    formData.append('imagen', {
      uri: imageUri,
      name: fileName,
      type: mimeType,
    } as any);

    // Obtenemos el token de zustand
    const token = useAuthStore.getState().accessToken;

    // Usamos FETCH nativo en lugar de Axios porque Axios tiene un bug conocido en React Native 
    // que rompe el boundary del FormData o no envía los archivos correctamente causando un 400.
    const url = `${API_BASE_URL}${API_ROUTES.AI_FOOD.ANALYZE_IMAGE}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
        // IMPORTANTE: NO SETEAR Content-Type, fetch inyecta el boundary de multipart automáticamente
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Error analizando la imagen');
    }

    return data;
  },
};
