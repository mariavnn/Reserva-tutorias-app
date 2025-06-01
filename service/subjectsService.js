import axios from "axios"
import { API_URL } from "../constants/API"

export const subjectService = {
   async getSubjectByIdCareer (idCareer) {
        try{
            console.log('Id career service', idCareer)
            const response = await axios.get(`${API_URL}/materias/filtro/carrera/${idCareer}`)
            return response.data
        }catch (error) {
            console.log('Error al obtener la lista de materias ', error)
            throw error
        }
   },

}

