import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import SizedBox from './SizedBox'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TutoriasCard({ tutoriaInfo, onDelete}) {
  return (
    <View className='w-full flex-row gap-3 justify-start border border-border-light rounded-md bg-white mb-6'>
        <View className='bg-blue-500  border border-blue-500 rounded-l-md w-3'>
          <Text></Text>
        </View>
        <View className="py-3">
          <View className="w-full flex-row justify-between">
            <Text className="font-semibold">{tutoriaInfo.nombreMateria}</Text>
            <TouchableOpacity className="h-10 w-16" onPress={() => onDelete(tutoriaInfo.id)}>
              <MaterialCommunityIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
          
          <SizedBox height={2}/>
          <Text><Text className="font-semibold">Fecha:</Text> {tutoriaInfo.fecha}</Text>
          <SizedBox height={2}/>
          <Text><Text className="font-semibold">Horario:</Text> {tutoriaInfo.horario}</Text>
          <SizedBox height={2}/>
          <Text><Text className="font-semibold">Estudiantes:</Text> {tutoriaInfo.estudiantes.length}</Text>
          <Text><Text className="font-semibold">Ubicacion:</Text> {tutoriaInfo.ubicacion}</Text>
        </View>
       
    </View>
  )
}