import axios from "axios"
import { API_URL } from "../constants/API"

export const generalInfoService = {
  async getInfo(option) {
    try {
      const response = await axios.get(`${API_URL}/${option}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data
    } catch (error) {
      throw error
    }
  },
  async getInfoById(option, id) {
    try {
      const response = await axios.get(`${API_URL}/${option}/${id}`, {
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
