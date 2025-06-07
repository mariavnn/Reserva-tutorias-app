import axios from "axios"
import { API_URL } from "../constants/API"

export const authService = {
    async loginUser (body) {
       try{
            const response = await axios.post(`${API_URL}/auth/login`, body )
            return response.headers
        }catch (error){
            throw error
        }
    },


    async registerUser (body) {
        try{
            const response = await axios.post(`${API_URL}/auth/register`, body )
            return response.data
        }catch (error){
            throw error
        }
    }
}