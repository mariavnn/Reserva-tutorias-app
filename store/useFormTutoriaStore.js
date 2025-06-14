import { create } from 'zustand';
import { generalInfoService } from '../service/generalInfoService';
import { scheduleService } from '../service/scheduleService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { availabilityService } from '../service/availabilityService';

export const useFormDataStore = create((set) => ({
  subjects: [],
  blocks: [],
  loading: false,
  error: null,

  tutoriaData: null,

  loadInitialData: async () => {
    try {
      set({ loading: true });

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
        loading: false
      });

    } catch (error) {
      console.error('Error loading initial data:', error);
      set({
        loading: false,
        error: error.message || 'Failed to load initial data'
      });
    }
  },

  loadTutoriaData: async (tutoriaId) => {
    try {
      set({ loading: true });

      const tutoriaDetails = await scheduleService.getScheduleById(tutoriaId);
      const disponibilidadId = tutoriaDetails.availabilityId;

      let disponibilidadData = null;

      if (disponibilidadId) {
        disponibilidadData = await availabilityService.getAvailabilityById(disponibilidadId);
      }

      set({
        tutoriaData: disponibilidadData
          ? { ...tutoriaDetails, disponibilidad: disponibilidadData }
          : tutoriaDetails,
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
    loading: false,
    error: null
  })
}));