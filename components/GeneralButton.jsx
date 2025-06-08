import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function GeneralButton({ title, onPress, type = "primary", className = "", disabled = false }) {
  return (
    <TouchableOpacity
      onPress={disabled ? null : onPress}
      disabled={disabled}
      className={`w-full py-2 px-3 rounded-lg ${
        disabled
          ? "bg-gray-400" // fondo gris cuando está deshabilitado
          : type === "primary"
          ? "bg-primary-light"
          : "bg-background-light"
      } ${className}`}
    >
      <Text
        className={`text-center text-xl font-semibold ${
          disabled
            ? "text-gray-200" // texto gris oscuro cuando deshabilitado
            : type === "primary"
            ? "text-white"
            : "text-text-light-secondary"
        } ${className}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

