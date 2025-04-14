import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MateriasContainer from '../../../../components/MateriasContainer';
import { useRouter } from 'expo-router';
import PerfilInterfaz from '../../../../shared/perfil';

const materias = [
  { label: 'Programación', value: '1' },
  { label: 'Matemáticas', value: '2' },
  { label: 'Mecánica', value: '3' },
]

export default function PerfilTutor() {
 
  return (
    <PerfilInterfaz 
      data={materias}        
    />
  )
}
