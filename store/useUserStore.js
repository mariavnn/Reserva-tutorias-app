import { create } from "zustand";
import { userInfoService } from "../service/infoUser";
import { subjectService } from "../service/subjectsService";

export const useUserStore = create((set) => ({
  userType: "Estudiante",
  setUserType: (type) => set({ userType: type }),

  userInfo: null,
  setUserInfo: (info) => set({ userInfo: info }),

  career: null,
  setCareer: (career) => set({ career }),

  subjects: null,
  setSubjects: (subjects) => set({ subjects }), 

  editedPassword: null,
  setEditedPassword: (password) => set({ editedPassword: password }),

  fetchUserInfo: async () => {
    set({ loading: true });
    try {
      const user = await userInfoService.getUserInfo();
      set({ userInfo: user });
    } catch (error) {
      console.error("Error al obtener userInfo", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchCareerInfo: async () => {
    set({ loading: true });
    try {
      const careers = await userInfoService.getCareer();
      set({ career: careers });
    } catch (error) {
      console.error("Error al obtener carreras", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchSubjectsInfo: async (idCareer) => {
    set({ loading: true });
    try {
      const subjects = await subjectService.getSubjectByIdCareer(idCareer);
      set({ subjects: subjects });
    } catch (error) {
      throw error;
    }finally{
      set({loading: false});
    }
  },
}));
