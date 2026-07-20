export interface Exercise {
  id: number;
  nombre: string;
  grupoMuscular: string;
  equipo: string;
  dificultad: string;
  caloriasPorMinuto?: number;
  gifUrl?: string;
  instrucciones?: string;
  seriesRecomendadas?: number;
  repeticionesRecomendadas?: string;
  activo?: boolean;
}

export interface Rutina {
  id: number;
  nombre?: string;
  ejercicios?: Exercise[];
  duracionMinutos?: number;
  caloriasEstimadas?: number;
  userId?: number;
  semana?: string;
  objetivo?: string;
  diasPorSemana?: number;
  equipoDisponible?: string;
  rutinaJson?: string;
}
