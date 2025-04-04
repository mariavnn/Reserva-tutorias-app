import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function GeneralButton({ title, onPress, type = "primary" }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-full py-3 rounded-lg ${
        type === "primary"
          ? "bg-primary-light"
          : "bg-background-light"
      }`}
    >
      <Text
        className={`text-center text-xl font-semibold ${
          type === "primary" ? "text-white" : "text-text-light-secondary"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}