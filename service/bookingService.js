import axios from "axios"
import { API_URL } from "../constants/API"
import AsyncStorage from "@react-native-async-storage/async-storage";

export const bookingService = {
  async getBookingByUserId() {
    try {
      const userId = await AsyncStorage.getItem('UserId');
      const response = await axios.get(`${API_URL}/agendados/usuario/${userId}`,{
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data
    } catch (error) {
      throw error
    }
  },
  async postBookingByUserId(scheduleId) {
    try {
      const userId = await AsyncStorage.getItem('UserId');
      let body = {
        userId,
        scheduleId
      }
      const response = await axios.post(`${API_URL}/agendados`, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data
    } catch (error) {
      throw error
    }
  },
  async deleteBookingByUserId(bookingId) {
    try {
      const response = await axios.delete(`${API_URL}/agendados/${bookingId}`,{
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