import { create } from 'zustand';
import { generalInfoService } from '../service/generalInfoService';
import { scheduleService } from '../service/scheduleService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useFormDataStore = create((set) => ({
  subjects: [],
  blocks: [],
  isLoading: false,
  error: null,

  tutoriaData: null,

  loadInitialData: async () => {
    try {
      set({ isLoading: true });

      const userId = await AsyncStorage.getItem('UserId');

      const [subjectsData, blocksData] = await Promise.all([
        generalInfoService.getInfoById('materiasUsuario', userId),
        generalInfoService.getInfo('bloques')
      ]);

      if (!Array.isArray(subjectsData) || !Array.isArray(blocksData)) {
        throw new Error('Invalid data format from server');
      }

      set({
        subjects: subjectsData || [],
        blocks: blocksData || [],
        isLoading: false
      });

    } catch (error) {
      console.error('Error loading initial data:', error);
      set({
        isLoading: false,
        error: error.message || 'Failed to load initial data'
      });
    }
  },

  loadTutoriaData: async (tutoriaId) => {
    try {
      set({ loading: true });
      const userId = await AsyncStorage.getItem('UserId');

      const [subjectsData, blocksData, tutoriaDetails] = await Promise.all([
        generalInfoService.getInfoById('materiasUsuario', userId),
        generalInfoService.getInfo('bloques'),
        scheduleService.getScheduleById(tutoriaId),
      ]);

      set({
        subjects: subjectsData || [],
        blocks: blocksData || [],
        tutoriaData: tutoriaDetails,
        loading: false
      });

    } catch (error) {
      console.error('Error loading data:', error);
      set({ loading: false });
    }
  },

  reset: () => set({
    subjects: [],
    blocks: [],
    tutoriaData: null,
    isLoading: false,
    error: null
  })
}));