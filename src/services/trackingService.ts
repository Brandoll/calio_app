import api from './api';
import { API_BASE_URL, API_ROUTES } from '../constants/api';
import { useAuthStore } from '../stores/authStore';
import { MealRecord, WaterRecord, DailySummary } from '../types/tracking';
import { Platform } from 'react-native';

export const trackingService = {
  registerMeal: async (data: MealRecord): Promise<void> => {
    // Transformar los datos del frontend al formato exacto (MealRequest) que espera el backend
    const payload = {
      userId: data.userId,
      alimentoId: data.alimentoId,
      nombre: data.nombre,
      porcionGramos: data.cantidad, // mapeado de cantidad -> porcionGramos
      momento: data.tipoComida,     // mapeado de tipoComida -> momento
      fecha: data.fecha,
      calorias: data.calorias,
      proteinas: data.proteinas,
      grasas: data.grasas,
      carbohidratos: data.carbohidratos,
      imageUrl: data.imageUrl,
    };
    await api.post(API_ROUTES.TRACKING.REGISTER_MEAL, payload);
  },

  uploadMealImage: async (imageUri: string, mimeType: string = 'image/jpeg', fileName: string = 'food.jpg'): Promise<string> => {
    const formData = new FormData();

    if (Platform.OS === 'web') {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      formData.append('file', blob, fileName);
    } else {
      formData.append('file', {
        uri: imageUri,
        name: fileName,
        type: mimeType,
      } as any);
    }

    const token = useAuthStore.getState().accessToken;
    // Usamos fetch nativo para evitar problemas de form-data con axios en react native
    const url = `${API_BASE_URL}${API_ROUTES.TRACKING.BASE}/meals/upload-image`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error subiendo la imagen');
    }

    // Retorna la url relativa servida por el backend, ej: /api/tracking/images/...
    return data.imageUrl;
  },

  deleteMeal: async (id: number): Promise<void> => {
    await api.delete(API_ROUTES.TRACKING.DELETE_MEAL(id));
  },

  registerWater: async (data: WaterRecord): Promise<void> => {
    await api.post(API_ROUTES.TRACKING.REGISTER_WATER, data);
  },

  getDailySummary: async (userId: number, date: string): Promise<DailySummary> => {
    const response = await api.get(API_ROUTES.TRACKING.DAILY_SUMMARY(userId, date));
    const summaryData = response.data;
    
    // Mapear los MealRecordDto devueltos por el backend de vuelta al formato del frontend
    if (summaryData.comidas && Array.isArray(summaryData.comidas)) {
      summaryData.comidas = summaryData.comidas.map((c: any) => ({
        ...c,
        cantidad: c.porcionGramos,
        tipoComida: c.momento,
      }));
    }
    
    return summaryData;
  },
};
