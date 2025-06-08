import { create } from 'zustand';
import {userInfoService} from '../service/infoUser'

export const useTutorStore = create((set) => ({
  tutores: [],
  loading: false,
  error: null,

  setTutores: (data) => set({ tutores: data }),
  setLoading: (state) => set({ loading: state }),
  setError: (message) => set({ error: message }),

  fetchTutores: async () => {
    set({ loading: true, error: null });
    try {
      const response = await userInfoService.getProfesoresCompatibles();
      const mapped = response.map((profesor) => ({
        id: profesor.userId,
        name: `Prof. ${profesor.name} ${profesor.lastName}`,
        rating: profesor.averageRating || 0,
        tags: profesor.subjectUsers?.map((mu) => mu.subjectName) || [],
      }));
      set({ tutores: mapped });
    } catch (err) {
      console.error(err);
      set({ error: 'Error al cargar los tutores' });
    } finally {
      set({ loading: false });
    }
  },
}));
