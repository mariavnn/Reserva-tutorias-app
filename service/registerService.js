import axios from "axios"
import { API_URL } from "../constants/API"

export const registerService = {
    async registerUser (body) {
        try{
            const response = await axios.post(`${API_URL}/auth/register`, body )
            console.log('respuesta ', response);
            return response.data
        }catch (error){
            throw error
        }
    }
}