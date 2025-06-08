import axios from "axios"
import { API_URL } from "../constants/API"

export const generalInfoService = {
   async getInfo (option) {
        try{
            const response = await axios.get(`${API_URL}/${option}`)
            return response.data
        }catch (error) {
            console.log('Error al obtener la lista información', error)
            throw error
        }
   },
}
