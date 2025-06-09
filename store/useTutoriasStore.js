import { create } from 'zustand';
import { scheduleService } from '../service/scheduleService';

export const useTutoriaStore = create((set, get) => ({
  loading: false,
  error: null,
  finalizados: [],
  disponibles: [],
  agendados: [],
  activos: [],

  setLoading: (state) => set({ loading: state }),
  setError: (msg) => set({ error: msg }),

  loadTutoring: async () => {
    set({ loading: true, error: null });
    try {
      const response = await scheduleService.getScheduleByFilter();

      set({
        finalizados: response.finalizados || [],
        disponibles: response.disponibles || [],
        agendados: response.agendados || [],
        activos: response.activos || [],
      });

    } catch (err) {
      console.error('Error al cargar tutorías:', err);
      set({ error: 'Error al cargar las tutorías' });
    } finally {
      set({ loading: false });
    }
  },
}));
