import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, UserInfo } from '@/types';

interface AppState {
  token: string;
  user: UserInfo | null;
  cartItems: CartItem[];
  cartTotal: number;
  setAuth: (token: string, user: UserInfo) => void;
  logout: () => void;
  setCart: (items: CartItem[], total: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: '',
      user: null,
      cartItems: [],
      cartTotal: 0,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: '', user: null, cartItems: [], cartTotal: 0 }),
      setCart: (cartItems, cartTotal) => set({ cartItems, cartTotal })
    }),
    { name: 'shopping-platform-store' }
  )
);
