import api from './api';
import { API_ROUTES } from '../constants/api';
import { Food, FoodCategory } from '../types/food';

export const foodService = {
  getCategories: async (): Promise<FoodCategory[]> => {
    const response = await api.get(API_ROUTES.FOODS.CATEGORIES);
    return response.data || [];
  },

  getAll: async (search?: string, categoria?: number): Promise<Food[]> => {
    const params: Record<string, any> = {};
    if (search) params.q = search;
    if (categoria) params.categoriaId = categoria;
    const response = await api.get(API_ROUTES.FOODS.ALL, { params });
    // El interceptor ya desempaquetó ApiResponse. response.data es PagedResponse.
    return response.data?.content || [];
  },

  getById: async (id: number): Promise<Food> => {
    const response = await api.get(API_ROUTES.FOODS.DETAIL(id));
    return response.data;
  },

  getByCategory: async (categoryId: number): Promise<Food[]> => {
    const response = await api.get(API_ROUTES.FOODS.BY_CATEGORY(categoryId));
    return response.data?.content || [];
  },

  addFavorite: async (foodId: number): Promise<void> => {
    await api.post(API_ROUTES.FOODS.ADD_FAVORITE(foodId));
  },

  removeFavorite: async (foodId: number): Promise<void> => {
    await api.delete(API_ROUTES.FOODS.ADD_FAVORITE(foodId));
  },

  getFavorites: async (): Promise<Food[]> => {
    const response = await api.get(API_ROUTES.FOODS.FAVORITES);
    return response.data || [];
  },
};
