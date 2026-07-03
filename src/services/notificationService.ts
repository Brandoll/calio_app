import api from './api';
import { API_ROUTES } from '../constants/api';

export const notificationService = {
  sendManual: async (data: { userId: number; mensaje: string; tipo?: string }): Promise<void> => {
    await api.post(API_ROUTES.NOTIFICATIONS.SEND, data);
  },
};
