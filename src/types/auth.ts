// Interfaces de autenticación

// ==========================================
// REQUESTS
// ==========================================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: string;
  gender?: string;
}

// ==========================================
// RESPONSES
// ==========================================

/** Wrapper genérico que el backend envuelve en TODA respuesta */
export interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/** Respuesta del backend al hacer login/register */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

/** Usuario devuelto por el backend (coincide con UserResponse.java) */
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  gender?: string;
  createdAt?: string;
  active?: boolean;
  emailVerified?: boolean;
}

// ==========================================
// PERFIL / SETUP
// ==========================================
export interface BiometricData {
  edad: number;
  peso: number;
  altura: number;
  genero: string;
  nivelActividad: string;
}

export interface UserGoal {
  id?: number;
  tipo: 'PERDER_PESO' | 'GANAR_MASA' | 'MANTENER_PESO' | 'MEJORAR_RENDIMIENTO';
  pesoObjetivo?: number;
  activo?: boolean;
}
