import api from './api';
import { API_ROUTES } from '../constants/api';
import { WeeklyStats, WeightEntry, CaloriesEntry } from '../types/analytics';

export const analyticsService = {
  getWeeklyStats: async (userId: number): Promise<WeeklyStats> => {
    const response = await api.get(API_ROUTES.ANALYTICS.WEEKLY_STATS(userId));
    return response.data;
  },

  getWeightChart: async (userId: number): Promise<WeightEntry[]> => {
    const response = await api.get(API_ROUTES.ANALYTICS.WEIGHT_CHART(userId));
    return response.data;
  },

  getCaloriesChart: async (userId: number): Promise<CaloriesEntry[]> => {
    const response = await api.get(API_ROUTES.ANALYTICS.CALORIES_CHART(userId));
    return response.data;
  },

  downloadPdfReport: async (userId: number): Promise<Blob> => {
    const response = await api.get(API_ROUTES.ANALYTICS.PDF_REPORT(userId), {
      responseType: 'blob',
    });
    return response.data;
  },
};
