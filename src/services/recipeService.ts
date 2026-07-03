import api from './api';
import { API_ROUTES } from '../constants/api';

export const recipeService = {
  generateMealPlan: async (data: any): Promise<any> => {
    const response = await api.post(API_ROUTES.RECIPES.GENERATE_PLAN, data);
    return response.data;
  },

  getHistory: async (userId: number): Promise<any[]> => {
    const response = await api.get(API_ROUTES.RECIPES.HISTORY(userId));
    return response.data;
  },
};
