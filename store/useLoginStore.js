// store/auth.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLoginStore = create(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
