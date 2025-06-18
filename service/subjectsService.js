import apiClient from "./apiClient";

export const subjectService = {
  async getSubjects() {
    try {
      const response = await apiClient.get(`/materias`);
      return response.data
    } catch (error) {
      throw error
    }
  },
  async getSubjectByIdCareer(idCareer) {
    try {
      const response = await apiClient.get(`/materias/filtro/carrera/${idCareer}`);
      return response.data
    } catch (error) {
      throw error
    }
  },
  async createSubject(data) {
    try{
      const response = await apiClient.post("/materias", data);
      return response.data
    } catch (e) {
      throw e
    }
  },
  async deleteSubject(id){
    try{
      const response = await apiClient.delete(`/materias/${id}`);
      return response.data
    }catch (e) {
      throw e
    }
  }
}

