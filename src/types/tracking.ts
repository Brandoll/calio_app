export interface MealRecord {
  id?: number;
  userId: number;
  alimentoId: number;
  nombre: string;
  imageUrl?: string;
  calorias: number;
  proteinas: number;
  grasas: number;
  carbohidratos: number;
  cantidad: number;
  fecha: string;
  hora: string;
  tipoComida: 'DESAYUNO' | 'ALMUERZO' | 'CENA' | 'SNACK';
}

export interface WaterRecord {
  userId: number;
  vasos: number;
  fecha: string;
}

export interface DailySummary {
  totalCalorias: number;
  totalProteinas: number;
  totalCarbohidratos: number;
  totalGrasas: number;
  aguaVasos: number;
  comidas: MealRecord[];
}
