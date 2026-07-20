import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User } from '../types/auth';

const setStorageItemAsync = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    try { localStorage.setItem(key, value); } catch (e) {}
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getStorageItemAsync = async (key: string) => {
  if (Platform.OS === 'web') {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const deleteStorageItemAsync = async (key: string) => {
  if (Platform.OS === 'web') {
    try { localStorage.removeItem(key); } catch (e) {}
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

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
    await setStorageItemAsync('accessToken', accessToken);
    await setStorageItemAsync('refreshToken', refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  setUser: async (user: User) => {
    await setStorageItemAsync('user', JSON.stringify(user));
    set({ user });
  },

  logout: async () => {
    await deleteStorageItemAsync('accessToken');
    await deleteStorageItemAsync('refreshToken');
    await deleteStorageItemAsync('user');
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  setOnboardingCompleted: async () => {
    await setStorageItemAsync('onboardingCompleted', 'true');
    set({ hasCompletedOnboarding: true });
  },

  setSetupCompleted: async () => {
    await setStorageItemAsync('setupCompleted', 'true');
    set({ hasCompletedSetup: true });
  },

  // Cargar datos persistidos al abrir la app (Auto Login)
  loadStoredAuth: async () => {
    try {
      const accessToken = await getStorageItemAsync('accessToken');
      const refreshToken = await getStorageItemAsync('refreshToken');
      const userStr = await getStorageItemAsync('user');
      const onboardingStr = await getStorageItemAsync('onboardingCompleted');
      const setupStr = await getStorageItemAsync('setupCompleted');
      
      let user = null;
      if (userStr) {
        try { user = JSON.parse(userStr); } catch (e) {}
      }

      set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: !!accessToken,
        hasCompletedOnboarding: onboardingStr === 'true',
        hasCompletedSetup: setupStr === 'true',
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
