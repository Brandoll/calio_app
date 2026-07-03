import api from './api';
import { API_ROUTES } from '../constants/api';
import { MealRecord, WaterRecord, DailySummary } from '../types/tracking';

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
    };
    await api.post(API_ROUTES.TRACKING.REGISTER_MEAL, payload);
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
