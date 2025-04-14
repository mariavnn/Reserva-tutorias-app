import { create } from 'zustand';

export const useUserTypeStore = create((set) => ({
  userType: 'Estudiante',
  setUserType: (type) => set({ userType: type }),
}));
