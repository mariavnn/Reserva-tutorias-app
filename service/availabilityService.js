import axios from "axios"
import { API_URL } from "../constants/API"

export const availabilityService = {
  async getAvailabilityFilter(idSalon, fecha) {
    try {
      const response = await axios.get(`${API_URL}/disponibilidad/salon/${idSalon}?fecha=${fecha}`, {
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