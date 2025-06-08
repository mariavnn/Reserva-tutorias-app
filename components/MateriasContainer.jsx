import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Feather from '@expo/vector-icons/Feather';

export default function MateriasContainer({label, icon, handleDelete}) {
  return (
    <View className= "bg-blue-500 py-2 px-2 rounded-2xl flex-row items-center gap-2">
      <Text className="text-white">{label}</Text>
      {icon && (
        <TouchableOpacity 
          onPress={handleDelete}
        >
          <Feather name="x" size={18} color="white" />
        </TouchableOpacity>
      )}
    </View>
  )
}