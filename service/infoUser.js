import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./apiClient";

export const userInfoService = {
  async getUserInfo() {
    try {
      const userId = await AsyncStorage.getItem("UserId");
      const response = await apiClient.get(`/usuarios/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCareer() {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await apiClient.get(`/carreras`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async editUser(body) {
    try {
      const userId = await AsyncStorage.getItem("UserId");
      if (!userId) {
        throw new Error("UserId not found in AsyncStorage");
      }
      const response = await apiClient.put(`/usuarios/${userId}`, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getProfesoresCompatibles() {
    try {
      const userId = await AsyncStorage.getItem("UserId");
      const response = await apiClient.get(
        `/usuarios/profesores-compatibles/${userId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteMateriasByUser(idSubjects) {
    try {
      const userId = await AsyncStorage.getItem("UserId");

      const response = await apiClient.delete(`/usuarios/subjects/${userId}`, {
        data: { idSubjects },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
