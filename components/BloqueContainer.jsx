import { View, Text, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function BloqueContainer({ data, onEdit, onDelete}) {
  return (
    <View className="w-full flex flex-row border border-gray-300 mt-3 p-4 rounded-lg justify-between">
      <View className="flex flex-row gap-4">
        <FontAwesome name="building-o" size={24} color="#2563eb" />
        <View className="flex gap-2">
          <Text className="text-md font-semibold">{data.name}</Text>
        
        </View>
      </View>
      <View className="flex flex-row gap-3">
        <TouchableOpacity onPress={() => onEdit(tutoriaInfo.id)}>
          <FontAwesome6 name="pen-to-square" size={18} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(tutoriaInfo.id)}>
          <FontAwesome6 name="trash-can" size={18} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  )
}