// Paleta de colores extraída del diseño aprobado de CALIO
export const colors = {
  primary: '#D8FF2E',       // Verde lima (botones, acentos)
  primaryDark: '#B8D926',   // Verde lima oscuro (hover/press)
  secondary: '#1C1C1C',     // Negro (textos principales)
  background: '#F5F5F5',    // Gris claro (fondo de pantallas)
  card: '#FFFFFF',          // Blanco (tarjetas)
  border: '#EAEAEA',        // Gris suave (bordes)
  textPrimary: '#1C1C1C',   // Texto principal
  textSecondary: '#6B7280', // Texto secundario / gris
  textMuted: '#9CA3AF',     // Texto apagado
  success: '#4CAF50',       // Verde éxito
  error: '#FF5252',         // Rojo error
  warning: '#FFC107',       // Amarillo advertencia
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Macronutrientes (colores del diseño)
  protein: '#4CAF50',       // Verde
  carbs: '#FFC107',         // Amarillo
  fat: '#FF5252',           // Rojo
} as const;

export type ColorKey = keyof typeof colors;
