import apiClient from "./apiClient";

export const classroomService = {
  async getClassroomsByBlock(id){
    try {
      const response = await apiClient.get(`/salones/bloque/${id}`);
      return response.data;
    } catch (e) {
      throw e;
    }
  },

  async createClassroom(data){
    try {
      const response = await apiClient.post("/salones", data);
      return response.data;
    } catch (e){
      throw e;
    }
  },

  async deleteClassroom(id) {
    try {
      const response = await apiClient.delete(`/salones/${id}`);
      return response.data;
    } catch (e) {
      throw e;
    }
  },
};
