import { View, Text } from 'react-native'
import React from 'react'

export default function MateriasContainer({label}) {
  return (
    <View className= "bg-blue-500 py-2 px-2 rounded-2xl">
      <Text className="text-white">{label}</Text>
    </View>
  )
}