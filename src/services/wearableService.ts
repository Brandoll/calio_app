import api from './api';
import { API_ROUTES } from '../constants/api';

export const wearableService = {
  sync: async (data: any): Promise<any> => {
    const response = await api.post(API_ROUTES.WEARABLES.SYNC, data);
    return response.data;
  },

  getHistory: async (userId: number): Promise<any[]> => {
    const response = await api.get(API_ROUTES.WEARABLES.HISTORY(userId));
    return response.data;
  },
};
