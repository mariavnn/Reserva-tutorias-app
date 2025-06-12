import { View, Text, TouchableOpacity } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";

export default function AddButton({ label, onPress, className}) {
  return (
    <TouchableOpacity
        onPress={onPress}
      className={`flex-row  items-center gap-3 py-2 px-2 bg-blue-500 rounded-lg ${className}`}
    >
      <AntDesign name="plus" size={20} color="white" />
      <Text className='text-white font-semibold'>{label}</Text>
    </TouchableOpacity>
  );
}
