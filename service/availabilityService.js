import apiClient from "./apiClient";

export const availabilityService = {
  async getAvailabilityById(idDisponibilidad) {
    try { 
      const response = await apiClient.get(`/disponibilidad/${idDisponibilidad}`);
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getAvailabilityFilter(idSalon, fecha) {
    try {
      const response = await apiClient.get(`/disponibilidad/salon/${idSalon}?fecha=${fecha}`);
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getAvailabilityBySalon(id) {
    try {
      const response = await apiClient.get(`/disponibilidad/filtro?classroomId=${id}`);
      return response.data
    } catch (e){
      throw e;
    }
  },

  async createAvailability(data){
    try{
      const response = await apiClient.post("/disponibilidad", data);
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}