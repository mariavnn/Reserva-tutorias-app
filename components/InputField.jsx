import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

export default function InputField({ 
  icon, 
  label, 
  error, 
  touched,
  isPassword = false, 
  placeholder, 
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className="mb-4">
      {label && <Text className="text-gray-700 mb-1">{label}</Text>}

       <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
        {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
        <TextInput 
          placeholder={placeholder} 
          className="flex-1 text-gray-800 h-8"
          secureTextEntry={isPassword && !showPassword}
          key={showPassword ? 'password' : 'text'} 
          {...props} 
        />
        {isPassword && (
          <Pressable onPress={() => setShowPassword(prev => !prev)}>
            {showPassword ? (
              <AntDesign name="eye" size={24} color="gray" />
            ) : (
              <Entypo name="eye-with-line" size={20} color="gray" />
              
            )}
          </Pressable>
        )}

      </View>

      {touched && error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  )
}