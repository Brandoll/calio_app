export interface Food {
  id: number;
  nombre: string;
  categoria: string;
  calorias: number;
  proteinas: number;
  grasas: number;
  carbohidratos: number;
  fibra?: number;
  indiceGlucemico?: number;
  porcion?: string;
  imagen?: string;
}

export interface FoodCategory {
  id: number;
  nombre: string;
  icono?: string;
}

export interface AIFoodResult {
  items: AIFoodItem[];
  confianza: number;
}

export interface AIFoodItem {
  nombre: string;
  calorias: number;
  proteinas: number;
  grasas: number;
  carbohidratos: number;
}
