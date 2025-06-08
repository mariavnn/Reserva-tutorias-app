import axios from "axios"
import { API_URL } from "../constants/API"

export const subjectService = {
    async getSubjects (){
        try{
            const response = await axios.get(`${API_URL}/materias`)
            return response.data
        }catch(error){
            throw error 
        }
    },
    
    async getSubjectByIdCareer (idCareer) {
        try{
            const response = await axios.get(`${API_URL}/materias/filtro/carrera/${idCareer}`)
            return response.data
        }catch (error) {
            console.log('Error al obtener la lista de materias ', error)
            throw error
        }
   },

}

