export interface Exercise {
  id: number;
  nombre: string;
  grupoMuscular: string;
  dificultad: string;
  descripcion?: string;
  series?: number;
  repeticiones?: number;
  caloriasEstimadas?: number;
  gifUrl?: string;
}

export interface Rutina {
  id: number;
  nombre: string;
  ejercicios: Exercise[];
  duracionMinutos?: number;
  caloriasEstimadas?: number;
}
