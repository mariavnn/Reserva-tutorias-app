import apiClient from "./apiClient";

export const classroomService = {
  
  async deleteClassroom(id) {
    try {
      const response = await apiClient.delete(`/salones/${id}`);
      return response.data;
    } catch (e) {
      throw e;
    }
  },
};
