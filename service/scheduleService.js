import axios from "axios"
import { API_URL } from "../constants/API"

export const scheduleService = {
  async getInfo(idUsuario) {
    try {
      const response = await axios.get(`${API_URL}/horarios/usuario/${idUsuario}`)
      return response.data
    } catch (error) {
      console.log('Error al obtener la lista información', error)
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

      const response = await axios.post(`${API_URL}/horarios`, payload);
      return response.data;

    } catch (error) {
      console.log('Error al crear horario tutoria', error)
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

      const response = await axios.put(`${API_URL}/horarios/${idTutoria}`, payload);
      return response.data;

    } catch (error) {
      console.log('Error al editar horario tutoria', error)
      throw error
    }
  },

  async getScheduleById(idTutoria) {
    try {
      const response = await axios.get(`${API_URL}/horarios/${idTutoria}`)
      return response.data
    } catch (error) {
      console.log('Error al obtener la tutoria', error)
      throw error
    }
  },

  async deleteSchedule(idTutoria) {
    try {
      const response = await axios.delete(`${API_URL}/horarios/${idTutoria}`)
      return response.data
    } catch (error) {
      console.log('Error al eliminar la tutoría', error)
      throw error
    }
  },
}
