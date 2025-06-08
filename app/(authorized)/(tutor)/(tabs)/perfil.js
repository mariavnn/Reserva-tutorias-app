import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MateriasContainer from '../../../../components/MateriasContainer';
import { useRouter } from 'expo-router';
import PerfilInterfaz from '../../../../shared/perfil';
import { userInfoService } from '../../../../service/infoUser';

const materias = [
  { label: 'Programación', value: '1' },
  { label: 'Matemáticas', value: '2' },
  { label: 'Mecánica', value: '3' },
]

export default function PerfilTutor() {
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(false);
  

  const handleInfo = async () => {
    try{
      const user = await userInfoService.getUserInfo();
      setUserInfo(user);
    }catch (error){
      console.log('Error ', error);
    }
  }

  useEffect(() => {
    handleInfo()
  }, [])

  
  if (loading) {
     return (
       <ActivityIndicator/>
     );
  }
 
  if (!userInfo) {
     return (
       <View className="flex-1 justify-center items-center">
         <Text>No se pudo cargar la información del perfil.</Text>
       </View>
     );
  }

  return (
    <PerfilInterfaz 
      data={userInfo}        
    />
  )
}
