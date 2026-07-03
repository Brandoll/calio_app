// Formatear número de calorías con separador de miles
export const formatCalories = (value: number): string => {
  return value.toLocaleString('es-ES');
};

// Formatear gramos con unidad
export const formatGrams = (value: number): string => {
  return `${value} g`;
};

// Formatear peso con unidad
export const formatWeight = (value: number): string => {
  return `${value.toFixed(1)} kg`;
};

// Formatear altura
export const formatHeight = (value: number): string => {
  return `${value} cm`;
};

// Obtener fecha actual en formato YYYY-MM-DD
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Formatear hora legible
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

// Calcular porcentaje
export const calculatePercentage = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min(Math.round((current / total) * 100), 100);
};
