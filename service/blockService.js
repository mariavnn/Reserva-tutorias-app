import apiClient from "./apiClient";

export const blockService = {
  async getBlocks() {
    try {
      const response = await apiClient.get('/bloques');
      return response.data;
    } catch (e) {
      throw e;
    }
  },
  async createBlock(data){
    try {
      const response = await apiClient.post("/bloques", data);
      return response.data;
    } catch (e) {
      throw e;
    }
  },
  async deleteBlock(id){
    try{
      const response = await apiClient.delete(`/bloques/${id}`);
      return response.data
    }catch (e) {
      throw e
    }
  }
};
