import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import React from "react";

export default function CareerContainer({ type, data, onDelete }) {
  
  const getNormalizedData = () => {
    if (type === "materia") {
      return {
        id: data.subjectId,
        name: data.subjectName,
        code: data.code || "N/A",
        career: data.career?.careerName || "Sin carrera",
        credits: data.credits || "N/A"
      };
    } else {
      return {
        id: data.careerId,
        name: data.careerName,
        code: data.code || "N/A"
      };
    }
  };

  const normalizedData = getNormalizedData();
  
  const renderIcon = () => {
    if (type === "materia") {
      return <Feather name="book-open" size={24} color="#2563eb" />;
    }
    return <Ionicons name="school-outline" size={24} color="#2563eb" />;
  };
  
  return (
    <View className="w-full flex flex-row border bg-white border-gray-300 mt-3 p-4 rounded-lg justify-between">
      <View className="flex flex-row gap-4">
        {renderIcon()}
        <View className="flex gap-2">
          <Text className="text-md font-semibold">{normalizedData.name}</Text>
          <Text className="text-gray-600">
            Codigo: <Text>{normalizedData.code}</Text>
          </Text>
          {type === "materia" && (
            <>
              <Text className="text-gray-600">
                Carrera: <Text>{normalizedData.career}</Text>
              </Text>
              <Text className="text-gray-600">
                Créditos: <Text>{normalizedData.credits}</Text>
              </Text>
            </>
          )}
        </View>
      </View>
      <View className="flex flex-row gap-3">
        {/* <TouchableOpacity onPress={() => onEdit(normalizedData.id)}>
          <FontAwesome6 name="pen-to-square" size={18} color="#2563eb" />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => onDelete(normalizedData.id)}>
          <FontAwesome6 name="trash-can" size={18} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
