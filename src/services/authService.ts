import api from './api';
import { API_ROUTES } from '../constants/api';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  BiometricRequest,
  GoalRequest,
  UserGoal,
  UpdateProfileRequest
} from '../types/auth';

export const authService = {
  // Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post(API_ROUTES.AUTH.LOGIN, data);
    return response.data;
  },

  // Registro
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post(API_ROUTES.AUTH.REGISTER, data);
    return response.data;
  },

  // Cerrar sesión
  logout: async (refreshToken: string): Promise<void> => {
    await api.post(API_ROUTES.AUTH.LOGOUT, { refreshToken });
  },

  // Obtener perfil del usuario autenticado
  getProfile: async (): Promise<User> => {
    const response = await api.get(API_ROUTES.AUTH.PROFILE);
    return response.data;
  },

  // Actualizar perfil (edad, género, etc)
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await api.patch(API_ROUTES.AUTH.PROFILE, data);
    return response.data;
  },

  // Guardar datos biométricos (peso, altura)
  saveBiometrics: async (data: BiometricRequest): Promise<void> => {
    await api.post(API_ROUTES.AUTH.BIOMETRICS, data);
  },

  // Obtener datos biométricos
  getBiometrics: async (): Promise<any> => {
    const response = await api.get(API_ROUTES.AUTH.BIOMETRICS);
    return response.data;
  },

  // Guardar objetivo del usuario y calcular macros
  saveGoal: async (data: GoalRequest): Promise<void> => {
    await api.post(API_ROUTES.AUTH.GOALS, data);
  },

  // Obtener objetivo activo
  getActiveGoal: async (): Promise<UserGoal> => {
    const response = await api.get(API_ROUTES.AUTH.ACTIVE_GOAL);
    return response.data;
  },
};
