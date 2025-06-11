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
      const response = await axios.get(`${API_URL}/horarios/${idTutoria}`, {
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

  async postSchedule(scheduleData) {
    try {
      let payload = {};

      if (scheduleData.type === 'PRESENCIAL') {
        // Formato para asesoría presencial
        payload = {
          availabilityId: scheduleData.availabilityId,
          subjectId: scheduleData.subjectId,
          userId: scheduleData.userId,
          description: scheduleData.description,
          scheduleDate: scheduleData.scheduleDate,
          type: 'PRESENCIAL'
        };
      } else if (scheduleData.type === 'VIRTUAL') {
        // Formato para asesoría virtual
        payload = {
          subjectId: scheduleData.subjectId,
          userId: scheduleData.userId,
          description: scheduleData.description,
          scheduleDate: scheduleData.scheduleDate,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          type: 'VIRTUAL'
        };
      } else {
        throw new Error("Tipo de asesoría no válido. Debe ser 'PRESENCIAL' o 'VIRTUAL'.");
      }

      const response = await axios.post(`${API_URL}/horarios`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;

    } catch (error) {
      throw error
    }
  },

  async updateSchedule(idTutoria, scheduleData) {
    try {
      let payload = {};

      if (scheduleData.type === 'PRESENCIAL') {
        // Formato para asesoría presencial
        payload = {
          availabilityId: scheduleData.availabilityId,
          subjectId: scheduleData.subjectId,
          userId: scheduleData.userId,
          description: scheduleData.description,
          scheduleDate: scheduleData.scheduleDate,
          type: 'PRESENCIAL'
        };
      } else if (scheduleData.type === 'VIRTUAL') {
        // Formato para asesoría virtual
        payload = {
          subjectId: scheduleData.subjectId,
          userId: scheduleData.userId,
          description: scheduleData.description,
          scheduleDate: scheduleData.scheduleDate,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          type: 'VIRTUAL'
        };
      } else {
        throw new Error("Tipo de asesoría no válido. Debe ser 'PRESENCIAL' o 'VIRTUAL'.");
      }

      const response = await axios.put(`${API_URL}/horarios/${idTutoria}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;

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
