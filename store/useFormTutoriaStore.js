import { create } from 'zustand';
import { generalInfoService } from '../service/generalInfoService';
import { scheduleService } from '../service/scheduleService';
import { userInfoService } from '../service/infoUser';

const filterSubjectsByUser = (allSubjects, userInfo) => {
  const subjectIds = userInfo.subjectUsers.map(su => su.subjectId);
  return allSubjects
    .filter(subject => subjectIds.includes(subject.subjectId))
    .map(subject => ({
      label: subject.subjectName,
      value: subject.subjectId
    }));
};

export const useFormDataStore = create((set) => ({
  subjects: [],
  blocks: [],
  isLoading: false,

  loadInitialData: async () => {
    try {
      set({ isLoading: true });

      const userInfo = await userInfoService.getUserInfo();

      const [subjectsData, blocksData] = await Promise.all([
        generalInfoService.getInfo('materias'),
        generalInfoService.getInfo('bloques')
      ]);

      set({
        subjects: filterSubjectsByUser(subjectsData, userInfo),
        blocks: blocksData.map(block => ({
          label: `${block.blockName} (${block.section})`,
          value: block.blockId.toString(),
          data: block
        })),
        isLoading: false
      });
    } catch (error) {
      console.error('Error loading initial data:', error);
      set({ isLoading: false });
    }
  }
}));

// Para el segundo caso con tutoriaDetails
export const useTutoriaFormStore = create((set) => ({
  subjects: [],
  blocks: [],
  tutoriaData: null,
  loading: false,

  loadData: async (tutoriaId) => {
    try {
      set({ loading: true });

      const userInfo = await userInfoService.getUserInfo();

      const [subjectsData, blocksData, tutoriaDetails] = await Promise.all([
        generalInfoService.getInfo('materias'),
        generalInfoService.getInfo('bloques'),
        scheduleService.getScheduleById(tutoriaId)
      ]);

      set({
        subjects: filterSubjectsByUser(subjectsData, userInfo),
        blocks: blocksData.map(block => ({
          label: `${block.blockName} (${block.section})`,
          value: block.blockId.toString(),
          data: block
        })),
        tutoriaData: tutoriaDetails,
        loading: false
      });

    } catch (error) {
      console.error('Error loading data:', error);
      set({ loading: false });
    }
  }
}));