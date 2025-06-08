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

  async getScheduleById(idTutoria) {
    try {
      const response = await axios.get(`${API_URL}/horarios/${idTutoria}`)
      return response.data
    } catch (error) {
      console.log('Error al obtener la tutoria', error)
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

  async deleteSchedule(idTutoria) {
    try {
      const response = await axios.delete(`${API_URL}/horarios/${idTutoria}`)
      return response.data
    } catch (error) {
      console.log('Error al eliminar la tutoría', error)
      throw error
    }
  },

  async getScheduleWithFilters(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Manejo de subjectIds (puede ser array o valor único)
      if (filters.subjectIds) {
        const subjectIds = Array.isArray(filters.subjectIds)
          ? filters.subjectIds
          : [filters.subjectIds];

        subjectIds.forEach(id => {
          if (id) params.append('subjectId', id);
        });
      }

      // Otros filtros
      if (filters.classroomId) {
        params.append('classroomId', filters.classroomId);
      }

      if (filters.date) {
        const dateString = filters.date instanceof Date
          ? filters.date.toISOString().split('T')[0]
          : filters.date;
        params.append('date', dateString);
      }

      if (filters.mode) {
        params.append('mode', filters.mode);
      }

      if (filters.dayOfWeek) {
        params.append('dayOfWeek', filters.dayOfWeek);
      }

      const url = `${API_URL}/horarios/filtro?${params.toString()}`;
      console.log('Fetching tutoring sessions with URL:', url);

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error filtering tutoring sessions:', error.response?.data || error.message);
      throw error;
    }
  },
}
