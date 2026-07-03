import api from './api';
import { API_ROUTES } from '../constants/api';
import { MealRecord, WaterRecord, DailySummary } from '../types/tracking';

export const trackingService = {
  registerMeal: async (data: MealRecord): Promise<void> => {
    await api.post(API_ROUTES.TRACKING.REGISTER_MEAL, data);
  },

  registerWater: async (data: WaterRecord): Promise<void> => {
    await api.post(API_ROUTES.TRACKING.REGISTER_WATER, data);
  },

  getDailySummary: async (userId: number, date: string): Promise<DailySummary> => {
    const response = await api.get(API_ROUTES.TRACKING.DAILY_SUMMARY(userId, date));
    return response.data;
  },
};
