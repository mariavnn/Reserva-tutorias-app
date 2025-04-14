import { create } from 'zustand';

const useCreateTutoriaStore = create((set) => ({
  tutoriaData: {},
 
  setTutoriaData: (data) => set({ tutoriaData: data }),
  
}));

export default useCreateTutoriaStore;
