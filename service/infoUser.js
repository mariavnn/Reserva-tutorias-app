import axios from "axios";
import { API_URL } from "../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userInfoService = {
  async getUserInfo() {
    try {
      const userId = await AsyncStorage.getItem("UserId");
      const response = await axios.get(`${API_URL}/usuarios/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCareer() {
    try {
      const response = await axios.get(`${API_URL}/carreras`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async editUser(body) {
    try {
      const userId = await AsyncStorage.getItem("UserId");
      console.log('body axios ', body);
      if (!userId) {
        throw new Error("UserId not found in AsyncStorage");
      }
      const response = await axios.put(`${API_URL}/usuarios/${userId}`, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
