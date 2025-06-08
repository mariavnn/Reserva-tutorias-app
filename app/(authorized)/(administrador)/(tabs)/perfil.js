import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { userInfoService } from "../../../../service/infoUser";
import PerfilInterfaz from "../../../../shared/perfil";
import { useUserStore } from "../../../../store/useUserStore";

export default function PerfilAdmin() {
  
  return <PerfilInterfaz/>;
}
