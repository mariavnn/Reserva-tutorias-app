import axios from "axios"
import { API_URL } from "../constants/API"
import AsyncStorage from "@react-native-async-storage/async-storage";

export const scheduleService = {
  async getInfo() {
    try {
      const userId = await AsyncStorage.getItem('UserId');
      const response = await axios.get(`${API_URL}/horarios/usuario/${userId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getScheduleById(idTutoria) {
    try {
      const response = await axios.get(`${API_URL}/horarios/edit/${idTutoria}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getScheduleByFilter() {
    try {
      const userId = await AsyncStorage.getItem('UserId');
      const response = await axios.get(`${API_URL}/horarios/filtrar-por-usuario/${userId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
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
      const url = id ? `${API_URL}/horarios/${id}` : `${API_URL}/horarios`

      const response = await axios[method](url, payload, {
        headers: { 'Content-Type': 'application/json' }
      })

      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteSchedule(idTutoria) {
    try {
      const response = await axios.delete(`${API_URL}/horarios/${idTutoria}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data
    } catch (error) {
      throw error
    }
  },
}
