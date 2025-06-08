import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Screen } from '../components/Screen';
import GeneralTitle from '../components/GeneralTitle';
import MateriasContainer from '../components/MateriasContainer';
import InfoPefil from '../components/InfoPefil';
import { useUserStore } from '../store/useUserStore';
import { userInfoService } from '../service/infoUser';
import LoadingIndicator from "../components/LoadingIndicator";



export default function PerfilInterfaz() {
    const router = useRouter();
    const { userInfo, setUserInfo, setCareer } = useUserStore();
    const [loading, setLoading] = useState(false);
  

    useEffect(() => {
      const handleInfo = async () => {
        setLoading(true);
        try {
          const user = await userInfoService.getUserInfo();
          setUserInfo(user);
        } catch (error) {
          console.log("Error al obtener la información del usuario: ", error);
        } finally {
          setLoading(false);
        }
      };

      const handleCareerInfo = async () => {
        setLoading(true);
        try {
          const career = await userInfoService.getCareer();
          setCareer(career);
        }catch(error){
          console.log("Error al obtener la información de las carreras: ", error);
        }finally{
          setLoading(false);
        }
      }

      handleInfo();
      handleCareerInfo();
    }, []);

    
    if (loading) {
      return (
        <LoadingIndicator/>
      )
    }

  if (!userInfo) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No se pudo cargar la información del perfil.</Text>
      </View>
    );
  }

  const handleLogout = () => {
    router.replace("/auth/login/login");
  };

  return (
    <Screen>
      <View className="w-full flex-1 px-6">
        <GeneralTitle
          label={"Mi Perfil"}
          type="primary"
          className="!text-blue-500 mt-4"
        />

        <View className="justify-center items-center mt-10">
          <View className="p-6 rounded-full bg-blue-100">
            <FontAwesome6 name="user-large" size={80} color="#2673DD" />
          </View>
          <Text className="text-xl font-semibold mt-4">
            {`${userInfo.name} ${userInfo.lastName}`}
          </Text>
          <Text className="text-gray-600">{userInfo.email}</Text>

          <TouchableOpacity
            className="flex-row items-center gap-2 px-4 py-2 rounded-lg mt-4 mb-4"
            onPress={() =>
              router.push("/(authorized)/(student)/editarPerfil")
            }
          >
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={20}
              color="#2673DD"
            />
            <Text className="text-blue-500 text-base font-medium">
              Editar Perfil
            </Text>
          </TouchableOpacity>
        </View>

        {(userInfo?.role?.name === "Profesor" ||
          userInfo?.role?.name === "Estudiante") && (
          <InfoPefil data={userInfo} />
        )}

        <TouchableOpacity
          className="flex-row items-center justify-center gap-2 px-4 py-2 bg-gray-200 rounded-lg"
          onPress={handleLogout}
        >
          <Text className="text-gray-700 text-base font-medium">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}