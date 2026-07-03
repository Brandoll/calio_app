import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types/auth';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  hasCompletedSetup: boolean;

  // Acciones
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setOnboardingCompleted: () => void;
  setSetupCompleted: () => void;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasCompletedOnboarding: false,
  hasCompletedSetup: false,

  setTokens: async (accessToken: string, refreshToken: string) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  setUser: async (user: User) => {
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    set({ user });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('user');
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  setOnboardingCompleted: async () => {
    await SecureStore.setItemAsync('onboardingCompleted', 'true');
    set({ hasCompletedOnboarding: true });
  },

  setSetupCompleted: async () => {
    await SecureStore.setItemAsync('setupCompleted', 'true');
    set({ hasCompletedSetup: true });
  },

  // Cargar datos persistidos al abrir la app (Auto Login)
  loadStoredAuth: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      const onboardingCompleted = await SecureStore.getItemAsync('onboardingCompleted');
      const setupCompleted = await SecureStore.getItemAsync('setupCompleted');
      const userStr = await SecureStore.getItemAsync('user');
      
      let user = null;
      if (userStr) {
        try { user = JSON.parse(userStr); } catch (e) {}
      }

      set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: !!accessToken,
        hasCompletedOnboarding: onboardingCompleted === 'true',
        hasCompletedSetup: setupCompleted === 'true',
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
