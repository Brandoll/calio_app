import api from './api';
import { API_BASE_URL } from '../constants/api';

const ANALYTICS_API_URL = `/api/analytics`;

export interface WeightRecord {
  date: string;
  weight: number;
}

export interface CaloriesRecord {
  date: string;
  calories_consumed: number;
  calories_burned: number;
}

export interface WeeklyMacros {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

export interface WeeklyStats {
  user_id: number;
  weight_progress: WeightRecord[];
  streak_days: number;
  logros: string[];
  historial_calorias: CaloriesRecord[];
  weekly_macros: WeeklyMacros;
}

export const analyticsService = {
  getWeeklyStats: async (userId: number): Promise<WeeklyStats> => {
    const response = await api.get(`${ANALYTICS_API_URL}/stats/week/${userId}`);
    return response.data;
  },

  getWeightChart: async (userId: number): Promise<WeightRecord[]> => {
    const response = await api.get(`${ANALYTICS_API_URL}/analytics/chart/weight/${userId}`);
    return response.data;
  },

  getCaloriesChart: async (userId: number): Promise<CaloriesRecord[]> => {
    const response = await api.get(`${ANALYTICS_API_URL}/analytics/chart/calories/${userId}`);
    return response.data;
  },

  getPdfReportUrl: (userId: number): string => {
    return `${API_BASE_URL}${ANALYTICS_API_URL}/report/pdf/${userId}`;
  }
};
