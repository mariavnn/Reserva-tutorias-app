import { View, Text } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function InfoTutoria({ data }) {
  return (
    <View className="w-full flex-row border border-gray-200 rounded-xl bg-white shadow-sm mt-3 overflow-hidden">
      <View className='w-2 bg-green-600' />

      <View className="flex-1 p-4">
        <Text className='text-lg font-medium'>{data.subject}</Text>
        <Text className='text-sm font-medium'>{data.tutor}</Text>
        <View className='flex flex-row justify-between mt-2'>
           <View className='flex flex-row gap-1 items-center'>
                <MaterialCommunityIcons name="clock-outline" size={17} color="gray" />
                <Text className="text-gray-600">{data.time}</Text>
           </View>
           <View className='flex flex-row gap-1 items-center'>
                <Ionicons name="people-outline" size={18} color="gray" />
                <Text  className="text-gray-600" >{data.students} <Text>estudiantes</Text></Text>
           </View>
        </View>
      </View>
    </View>
  )
}