import { create } from 'zustand';
import { Food } from '../types/food';

interface BasketState {
  items: Food[];
  addItem: (food: Food) => void;
  removeItem: (foodId: number) => void;
  clearBasket: () => void;
}

export const useBasketStore = create<BasketState>((set) => ({
  items: [],
  addItem: (food) => 
    set((state) => {
      // Evitar duplicados
      if (state.items.some((item) => item.id === food.id)) {
        return state;
      }
      return { items: [...state.items, food] };
    }),
  removeItem: (foodId) => 
    set((state) => ({
      items: state.items.filter((item) => item.id !== foodId)
    })),
  clearBasket: () => set({ items: [] }),
}));
