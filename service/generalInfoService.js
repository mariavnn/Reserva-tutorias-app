import apiClient from "./apiClient";

export const generalInfoService = {
  async getInfo(option) {
    try {
      const response = await apiClient.get(`/${option}`);
      return response.data
    } catch (error) {
      throw error
    }
  },
  async getInfoById(option, id) {
    try {
      const response = await apiClient.get(`/${option}/${id}`);
      return response.data
    } catch (error) {
      throw error
    }
  },
}
