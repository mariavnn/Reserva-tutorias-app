import { View, Text, TextInput } from 'react-native'
import React from 'react'

export default function InputField({ icon, label, error, touched, placeholder, ...props }) {
  return (
    <View className="mb-4">
      {label && <Text className="text-gray-700 mb-1">{label}</Text>}

       <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
        {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
        <TextInput className="flex-1 text-gray-800" {...props} />
      </View>

      {touched && error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  )
}