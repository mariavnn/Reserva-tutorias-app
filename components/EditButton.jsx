import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Feather from '@expo/vector-icons/Feather';

export default function EditButton({ title, onPress, className = "" }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row w-3/5 items-center gap-3 py-2 px-2 bg-blue-300 rounded-lg ${className}`}
    >
        <Feather name="edit-3" size={24} color="white" />
        <Text className={`text-md text-white font-medium ${className}`}>
            {title}
        </Text>
    </TouchableOpacity>
  );
}
