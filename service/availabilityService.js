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
}