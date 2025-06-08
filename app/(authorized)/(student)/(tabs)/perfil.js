import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import PerfilInterfaz from '../../../../shared/perfil'
import { userInfoService } from '../../../../service/infoUser';
import ActivityIndicator from '../../../../components/LoadingIndicator';


const materias = [
  { label: 'Programación', value: '1' },
  { label: 'Matemáticas', value: '2' },
  { label: 'Mecánica', value: '3' },
]

export default function PerfilStudent() {
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(false);

  const handleInfo = async () => {
      setLoading(true);
      try{
        const user = await userInfoService.getUserInfo();
        setUserInfo(user);
      }catch (error){
        console.log('Error ', error);
      }finally{
        setLoading(false);
      }
  }

  useEffect(() => {
    handleInfo();
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