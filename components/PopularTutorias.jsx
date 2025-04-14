import { View, Text } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';


export default function PopularTutorias({ data }) {
  return (
    <View className="w-[48%] bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
    <View className="p-3">
      <View className="flex-row justify-between items-start">
        <Text className="text-base font-semibold flex-1">{data.title}</Text>
        <TouchableOpacity >
          <FontAwesome name="heart-o" size={18} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <Text className="text-gray-500 text-sm mt-1">{data.tutor}</Text>
    </View>

    <TouchableOpacity
      className="bg-blue-500 py-2 justify-center items-center"
    >
      <Text className="text-white font-medium">Unirse</Text>
    </TouchableOpacity>
  </View>
  )
}