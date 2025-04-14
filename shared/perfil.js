import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Screen } from '../components/Screen';
import GeneralTitle from '../components/GeneralTitle';
import MateriasContainer from '../components/MateriasContainer';
import { useUserTypeStore } from '../store/useUserTypeStore';
import InfoPefil from '../components/InfoPefil';

export default function PerfilInterfaz({ data }) {
    const router = useRouter();

    const handleLogout = () => {
      router.replace('/auth/login/login')
    }
    
    const userType = useUserTypeStore(state => state.userType);
    
    return (
      <Screen>
        <View className="w-full flex-1 px-6">
          <GeneralTitle
            label={"Mi Perfil"}
            type='primary'
            className='!text-blue-500 mt-4'
          />
  
          <View className="justify-center items-center mt-10">
            <View className="p-6 rounded-full bg-blue-100">
              <FontAwesome6 name="user-large" size={80} color="#2673DD" />
            </View>
            <Text className="text-xl font-semibold mt-4">Carlos Rodriguez</Text>
            <Text className="text-gray-600">carlitos@unipamplona.edu.co</Text>
  
            <TouchableOpacity className="flex-row items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg mt-4">
              <MaterialCommunityIcons name="account-edit-outline" size={20} color="#2673DD" />
              <Text className="text-blue-500 text-base font-medium">Editar Perfil</Text>
            </TouchableOpacity>
          </View>

          <InfoPefil
            userType={userType}
            data={data}
          
          />
  
          <TouchableOpacity 
            className="flex-row items-center justify-center gap-2 px-4 py-2 bg-gray-200 rounded-lg"
            onPress={handleLogout}
          >
              
              <Text className="text-gray-700 text-base font-medium">Cerrar Sesion</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    )
}