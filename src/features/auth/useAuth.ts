import { useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { LoginRequest, RegisterRequest } from '../../types/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setTokens, setUser, logout: storeLogout, refreshToken } = useAuthStore();

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      await setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      Alert.alert('Error', message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      await setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrarse';
      Alert.alert('Error', message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      // Ignorar errores de logout del servidor
    } finally {
      await storeLogout();
    }
  };

  const fetchProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
    }
  };

  return { login, register, logout, fetchProfile, isLoading };
};
