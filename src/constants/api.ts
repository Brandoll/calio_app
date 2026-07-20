// Constantes de la API — Toda comunicación pasa por el Gateway
const DEV_URL = 'https://api.calio360.app'; // Apuntamos al VPS incluso en desarrollo por ahora
const PROD_URL = 'https://api.calio360.app'; // Producción Azure VPS

export const API_BASE_URL = __DEV__ ? DEV_URL : PROD_URL;

// Rutas del API Gateway (StripPrefix=2 en el backend)
export const API_ROUTES = {
  // S-01 Identity
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/users/me',
    BIOMETRICS: '/api/auth/users/me/biometrics',
    GOALS: '/api/auth/users/me/goals',
    ACTIVE_GOAL: '/api/auth/users/me/goals/active',
    SETTINGS: '/api/auth/users/me/settings',
  },
  // S-02 AI Food Recognition
  AI_FOOD: {
    ANALYZE_IMAGE: '/api/ai/analyze',
    ANALYZE_TEXT: '/api/ai/analyze-text',
  },
  // S-03 Food Catalog
  FOODS: {
    CATEGORIES: '/api/foods/catalogo/categorias',
    ALL: '/api/foods/catalogo/alimentos',
    DETAIL: (id: number) => `/api/foods/catalogo/alimentos/${id}`,
    BY_CATEGORY: (catId: number) => `/api/foods/catalogo/categorias/${catId}/alimentos`,
    ADD_FAVORITE: (id: number) => `/api/foods/catalogo/favoritos/${id}`,
    FAVORITES: '/api/foods/catalogo/favoritos',
  },
  // S-04 Recipe & Meal Plan
  RECIPES: {
    GENERATE_PLAN: '/api/recipes/meal-plan/generate',
    HISTORY: (userId: number) => `/api/recipes/meal-plan/history/${userId}`,
  },
  // S-05 Tracking
  TRACKING: {
    REGISTER_MEAL: '/api/tracking/meals',
    DELETE_MEAL: (id: number) => `/api/tracking/meals/${id}`,
    UPLOAD_IMAGE: '/api/tracking/meals/upload-image',
    REGISTER_WATER: '/api/tracking/water',
    DAILY_SUMMARY: (userId: number, date: string) => `/api/tracking/meals/summary/${userId}/${date}`,
  },
  // S-06 Analytics
  ANALYTICS: {
    WEEKLY_STATS: (userId: number) => `/api/analytics/stats/week/${userId}`,
    WEIGHT_CHART: (userId: number) => `/api/analytics/analytics/chart/weight/${userId}`,
    CALORIES_CHART: (userId: number) => `/api/analytics/analytics/chart/calories/${userId}`,
    PDF_REPORT: (userId: number) => `/api/analytics/report/pdf/${userId}`,
  },
  // S-07 Notifications
  NOTIFICATIONS: {
    SEND: '/api/notifications/notify',
  },
  // S-10 Wearables
  WEARABLES: {
    SYNC: '/api/wearables/wearables/sync',
    HISTORY: (userId: number) => `/api/wearables/wearables/history/${userId}`,
  },
  // Exercise Service
  EXERCISES: {
    ALL: '/api/exercises/exercises',
    DETAIL: (id: number) => `/api/exercises/exercises/${id}`,
    GENERATE_WORKOUT: '/api/exercises/workout-plan/generate',
    CURRENT_WORKOUT: (userId: number) => `/api/exercises/workout-plan/${userId}/current`,
    WORKOUT_HISTORY: (userId: number) => `/api/exercises/workout-plan/${userId}/history`,
    COMPLETE_WORKOUT: (rutinaId: number) => `/api/exercises/workout-plan/${rutinaId}/complete`,
  },
} as const;
