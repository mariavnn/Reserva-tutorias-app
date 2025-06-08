import axios from "axios";
import { API_URL } from "../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userInfoService = {
    async getUserInfo () {
        try{
            const userId = await AsyncStorage.getItem('UserId');
            const response = await axios.get(`${API_URL}/usuarios/${userId}`)
            return response.data;
        }catch(error){
            console.log('Error al obtener la lista de materias ', error)
            throw error
        }

    }
}