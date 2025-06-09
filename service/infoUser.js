import axios from "axios";
import { API_URL } from "../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userInfoService = {
  async getUserInfo() {
    try {
      const userId = await AsyncStorage.getItem("UserId");
      const response = await axios.get(`${API_URL}/usuarios/${userId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCareer() {
    try {
      const response = await axios.get(`${API_URL}/carreras`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async editUser(body) {
    try {
      const userId = await AsyncStorage.getItem("UserId");
      if (!userId) {
        throw new Error("UserId not found in AsyncStorage");
      }
      const response = await axios.put(`${API_URL}/usuarios/${userId}`, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getProfesoresCompatibles() {
    try {
      const userId = await AsyncStorage.getItem('UserId');
      const response = await axios.get(`${API_URL}/usuarios/profesores-compatibles/${userId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error
    }
  },
}
