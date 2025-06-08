import { create } from 'zustand';

export const useUserStore = create((set) => ({
  userType: 'Estudiante',
  setUserType: (type) => set({ userType: type }),

  userInfo: null,
  setUserInfo: (info) => set({ userInfo: info }),

  career: null,
  setCareer: (career) => set({ career }),

  editedPassword: null,
  setEditedPassword: (password) => set({ editedPassword: password }),
}));
