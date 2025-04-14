import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import SizedBox from './SizedBox'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TutoriasCard({ tutoriaInfo, onDelete}) {
  return (
    <View className='w-full flex-row gap-3 justify-start border border-border-light rounded-md bg-white mb-6'>
        <View className='bg-blue-500  border border-blue-500 rounded-l-md w-3'>
          <Text></Text>
        </View>
        <View className="py-3">
          <View className="w-full flex-row justify-between">
            <Text>{tutoriaInfo.nombreMateria}</Text>
            <TouchableOpacity>
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
          
          <SizedBox height={2}/>
          <Text><Text className="font-semibold">Fecha:</Text> {tutoriaInfo.fecha}</Text>
          <SizedBox height={2}/>
          <Text><Text className="font-semibold">Horario:</Text> {tutoriaInfo.horario}</Text>
          <SizedBox height={2}/>
          <Text><Text className="font-semibold">Estudiantes:</Text> {tutoriaInfo.estudiantes.lenght}</Text>
          <Text><Text className="font-semibold">Ubicacion:</Text> {tutoriaInfo.ubicacion}</Text>
        </View>
       
    </View>
  )
}