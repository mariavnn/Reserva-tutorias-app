import apiClient from "./apiClient";

export const careerService = {
    async getCareers(){
        try {
            const response = await apiClient.get('/carreras');
            return response.data
        } catch (e) {
            throw e
        }
    },
    async createCareer(data){
        try{
            const response = await apiClient.post('/carreras', data);
            return response.data
        }catch(e){
            throw e
        }
    },
    async deleteCareer(id){
        try{
            const response = await apiClient.delete(`/carreras/${id}`);
            return response.data
        }catch (e){
            throw e
        }
    }
}