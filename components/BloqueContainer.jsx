import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function BloqueContainer({ data, onEdit, onDelete, onSelect }) {
  return (
    <TouchableOpacity 
      onPress={() => onSelect && onSelect(data)}
      className="w-full flex flex-row border border-gray-300 mt-3 p-4 rounded-lg justify-between items-center bg-white"
      activeOpacity={0.7}
    >
      <View className="flex flex-row items-center gap-3">
        <View className="bg-blue-100 p-2 rounded-md">
          <FontAwesome name="building-o" size={20} color="#2563eb" />
        </View>
        <View className="flex gap-1">
          <View className="flex flex-row items-center gap-2">
            <Text className="text-lg font-semibold text-gray-900">
              {data.blockName || 'N/A'}
            </Text>
            <View className="bg-green-100 px-2 py-1 rounded-md">
              <Text className="text-xs font-semibold text-green-700">
                {(data.section).toUpperCase() || 'N/A'}
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center gap-2">
            <FontAwesome name="map-marker" size={12} color="#6b7280" />
            <Text className="text-sm text-gray-500">
              {data.totalSalons || "0"} salones
            </Text>
            <Text className="text-xs text-blue-600 ml-2">
              • Toca para ver salones
            </Text>
          </View>
        </View>
      </View>

      <View className="flex flex-row gap-3 items-center">
        <View className="mr-2">
          <FontAwesome name="chevron-right" size={16} color="#6b7280" />
        </View>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            onDelete(data.blockId);
          }}
          className="p-1"
        >
          <FontAwesome6 name="trash-can" size={18} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}