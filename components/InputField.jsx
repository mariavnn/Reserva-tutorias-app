import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import Entypo from '@expo/vector-icons/Entypo'

export default function InputField({ 
  icon,
  labelIcon,  
  label, 
  error, 
  touched,
  isPassword = false, 
  placeholder, 
  type = 'text', // 'text' | 'number' | 'email'
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false);

  const getKeyboardType = () => {
    switch (type) {
      case 'number':
        return 'numeric';
      case 'email':
        return 'email-address';
      default:
        return 'default';
    }
  };

  return (
    <View className="mb-4">
      {label && (
        <View className="flex-row gap-2 items-center mb-1">
          {labelIcon && <View>{labelIcon}</View>}
          <Text className="text-gray-700 mr-1">{label}</Text>
        </View>
      )}

      <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
        {icon && <View className="mr-2">{icon}</View>}

        <TextInput 
          placeholder={placeholder} 
          className="flex-1 text-gray-800 h-8"
          secureTextEntry={isPassword && !showPassword}
          keyboardType={getKeyboardType()}
          {...props} 
        />

        {isPassword && (
          <Pressable onPress={() => setShowPassword(prev => !prev)}>
            {showPassword ? (
              <AntDesign name="eye" size={20} color="gray" />
            ) : (
              <Entypo name="eye-with-line" size={20} color="gray" />
            )}
          </Pressable>
        )}
      </View>

      {touched && error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  )
}
