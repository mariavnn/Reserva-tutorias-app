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
import { useUserStore } from '../../../../store/useUserStore';

export default function PerfilTutor() {
  

  return (
    <PerfilInterfaz />
  )
}
