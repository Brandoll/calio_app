import api from './api';
import { API_ROUTES } from '../constants/api';
import { Exercise, Rutina } from '../types/exercise';

export const exerciseService = {
  getAll: async (params?: { grupoMuscular?: string; equipo?: string; dificultad?: string }): Promise<Exercise[]> => {
    const response = await api.get(API_ROUTES.EXERCISES.ALL, { params });
    return response.data;
  },

  getById: async (id: number): Promise<Exercise> => {
    const response = await api.get(API_ROUTES.EXERCISES.DETAIL(id));
    return response.data;
  },

  generateWorkout: async (data: any): Promise<Rutina> => {
    const response = await api.post(API_ROUTES.EXERCISES.GENERATE_WORKOUT, data);
    return response.data;
  },

  getCurrentWorkout: async (userId: number): Promise<Rutina> => {
    const response = await api.get(API_ROUTES.EXERCISES.CURRENT_WORKOUT(userId));
    return response.data;
  },

  completeWorkout: async (rutinaId: number, data: any): Promise<void> => {
    await api.post(API_ROUTES.EXERCISES.COMPLETE_WORKOUT(rutinaId), data);
  },
};
