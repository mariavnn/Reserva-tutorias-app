import { create } from 'zustand';

const useRegisterStore = create((set) => ({
  personalData: {},
  academicData: {},
  setPersonalData: (data) => set({ personalData: data }),
  setAcademicData: (data) => set({ academicData: data }),
  clearData: () => set({ personalData: null, academicData: null }),
}));

export default useRegisterStore;
