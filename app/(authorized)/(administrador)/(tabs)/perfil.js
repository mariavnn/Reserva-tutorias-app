import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { userInfoService } from "../../../../service/infoUser";
import PerfilInterfaz from "../../../../shared/perfil";

export default function PerfilAdmin() {
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(false);

  const handleInfo = async () => {
    try {
      const user = await userInfoService.getUserInfo();
      setUserInfo(user);
    } catch (error) {
      console.log("Error ", error);
    }
  };

  useEffect(() => {
    handleInfo();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!userInfo) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No se pudo cargar la información del perfil.</Text>
      </View>
    );
  }

  return <PerfilInterfaz data={userInfo} />;
}
