import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from "./apiClient";

export const authService = {
  async loginUser(body) {
    try {
      const response = await apiClient.post(`/auth/login`, body);

      const authHeader = response.headers['authorization'];

      if (authHeader) {
        await AsyncStorage.setItem('authToken', authHeader); 
      }

      return response.headers
    } catch (error) {
      throw error
    }
  },


  async registerUser(body) {
    try {
      const response = await apiClient.post(`/auth/register`, body);
      return response.data
    } catch (error) {
      throw error
    }
  }
}