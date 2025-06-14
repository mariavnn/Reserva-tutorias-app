import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./apiClient";

export const bookingService = {
  async getBookingByUserId() {
    try {
      const userId = await AsyncStorage.getItem('UserId');
      const response = await apiClient.get(`/agendados/usuario/${userId}`);
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
      const response = await apiClient.post(`/agendados`, body);
      return response.data
    } catch (error) {
      throw error
    }
  },
  async deleteBookingByUserId(bookingId) {
    try {
      const response = await apiClient.delete(`/agendados/${bookingId}`);
      return response.data
    } catch (error) {
      throw error
    }
  },
}