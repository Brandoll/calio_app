export interface WeeklyStats {
  user_id: number;
  weight_progress: WeightEntry[];
  streak_days: number;
  logros: string[];
  historial_calorias: CaloriesEntry[];
  weekly_macros: MacroSummary;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface CaloriesEntry {
  date: string;
  calories_consumed: number;
  calories_burned: number;
}

export interface MacroSummary {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}
