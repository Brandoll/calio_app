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

export interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

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
// PERFIL / SETUP (Mapped to backend DTOs)
// ==========================================

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: string; // MALE, FEMALE, OTHER
}

export interface BiometricRequest {
  weightKg: number;
  heightCm: number;
  bodyFatPct?: number;
}

export interface GoalRequest {
  goalType: string; // LOSE_WEIGHT, GAIN_MUSCLE, MAINTAIN, EAT_HEALTHY
  activityLevel: string; // SEDENTARY, LIGHT, MODERATE, ACTIVE, VERY_ACTIVE
  targetWeightKg?: number;
  dailyCalories?: number;
}

export interface UserGoal {
  id?: number;
  goalType: string;
  targetWeightKg?: number;
  dailyCalories?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatGrams?: number;
}
