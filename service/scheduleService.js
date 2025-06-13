import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./apiClient";

export const scheduleService = {
  async getInfo() {
    try {
      const userId = await AsyncStorage.getItem('UserId');
      const response = await apiClient.get(`/horarios/usuario/${userId}`);
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getScheduleById(idTutoria) {
    try {
      const response = await apiClient.get(`/horarios/edit/${idTutoria}`);
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getScheduleByFilter() {
    try {
      const userId = await AsyncStorage.getItem('UserId');
      const response = await apiClient.get(`/horarios/filtrar-por-usuario/${userId}`);
      return response.data
    } catch (error) {
      throw error
    }
  },

  async saveSchedule(scheduleData, id = null) {
    try {
      const payload = {
        subjectId: scheduleData.subjectId,
        userId: scheduleData.userId,
        description: scheduleData.description,
        scheduleDate: scheduleData.scheduleDate,
        type: scheduleData.type,
        ...(scheduleData.type === 'PRESENCIAL' ? {
          availabilityId: scheduleData.availabilityId
        } : {
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime
        })
      }

      const method = id ? 'put' : 'post'
      const url = id ? `/horarios/${id}` : `/horarios`

      const response = await apiClient[method](url, payload)

      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteSchedule(idTutoria) {
    try {
      const response = await apiClient.delete(`/horarios/${idTutoria}`);
      return response.data
    } catch (error) {
      throw error
    }
  },
}
