import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import PerfilInterfaz from '../../../../shared/perfil'
import { userInfoService } from '../../../../service/infoUser';
import ActivityIndicator from '../../../../components/LoadingIndicator';
import { useUserStore } from '../../../../store/useUserStore';

export default function PerfilStudent() {
  return (
    <PerfilInterfaz/>
  )
}