import { create } from 'zustand';

const useRegisterStore = create((set) => ({
  personalData: {},
  academicData: {},
  setPersonalData: (data) => set({ personalData: data }),
  setAcademicData: (data) => set({ academicData: data }),
}));

export default useRegisterStore;
