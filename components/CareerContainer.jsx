import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import React from "react";

export default function CareerContainer({ type, data, onEdit, onDelete }) {
  const renderIcon = () => {
    if (type === "materia") {
      return <Feather name="book-open" size={24} color="#2563eb" />;
    }
    return <Ionicons name="school-outline" size={24} color="#2563eb" />;
  };
  
  return (
    <View className="w-full flex flex-row border border-gray-300 mt-3 p-4 rounded-lg justify-between">
      <View className="flex flex-row gap-4">
        {renderIcon()}
        <View className="flex gap-2">
          <Text className="text-md font-semibold">{data.name}</Text>
          <Text className="text-gray-600">
            Codigo: <Text>{data.code}</Text>
          </Text>
          {type === "materia" && (
            <>
              <Text className="text-gray-600">
                Carrera: <Text>{data.career}</Text>
              </Text>
              <Text className="text-gray-600">
                Créditos: <Text>{data.credits}</Text>
              </Text>
            </>
          )}
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
  );
}
