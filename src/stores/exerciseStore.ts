import { create } from 'zustand';
import { Exercise } from '../types/exercise';

interface ExerciseListState {
  exercises: Exercise[];
  addExercise: (exercise: Exercise) => void;
  removeExercise: (exerciseId: number) => void;
  isInList: (exerciseId: number) => boolean;
  clearList: () => void;
  moveUp: (exerciseId: number) => void;
  moveDown: (exerciseId: number) => void;
}

export const useExerciseListStore = create<ExerciseListState>((set, get) => ({
  exercises: [],
  
  addExercise: (exercise) =>
    set((state) => {
      if (state.exercises.some((e) => e.id === exercise.id)) {
        return state;
      }
      return { exercises: [...state.exercises, exercise] };
    }),

  removeExercise: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.filter((e) => e.id !== exerciseId),
    })),

  isInList: (exerciseId) => {
    return get().exercises.some((e) => e.id === exerciseId);
  },

  clearList: () => set({ exercises: [] }),

  moveUp: (exerciseId) =>
    set((state) => {
      const idx = state.exercises.findIndex((e) => e.id === exerciseId);
      if (idx <= 0) return state;
      const newList = [...state.exercises];
      [newList[idx - 1], newList[idx]] = [newList[idx], newList[idx - 1]];
      return { exercises: newList };
    }),

  moveDown: (exerciseId) =>
    set((state) => {
      const idx = state.exercises.findIndex((e) => e.id === exerciseId);
      if (idx === -1 || idx >= state.exercises.length - 1) return state;
      const newList = [...state.exercises];
      [newList[idx], newList[idx + 1]] = [newList[idx + 1], newList[idx]];
      return { exercises: newList };
    }),
}));
