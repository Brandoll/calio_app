export interface Food {
  id: number;
  nombre: string;
  categoria: string;
  energiaKcal: number;
  proteinasG: number;
  grasaTotalG: number;
  carbohidratosTotalesG: number;
  fibraDietariaG?: number;
  porcionRef?: string;
  imagenUrl?: string; // no parece usar imagen, pero por si acaso
  esFavorito?: boolean;
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
