import { View, Text } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';


export default function TutorCard({ data, onPress }) {
  return (
    <TouchableOpacity 
      onPress={() => onPress?.(data)}
      className="bg-white rounded-2xl shadow-md mb-3 p-4 border border-gray-50"
      activeOpacity={0.95}
    >
      <View className="flex-row items-center space-x-3">
        <View className="relative">
        <View className="w-14 h-14 rounded-full bg-gray-200 justify-center items-center">
          <FontAwesome name="user" size={25} color="#2673DD" />
        </View>
          <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
        </View>
        {/* Contenido principal */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-lg font-bold text-gray-800 flex-1" numberOfLines={1}>
              {data.name}
            </Text>
            <View className="flex-row items-center ml-2">
              <FontAwesome name="star" size={12} color="#facc15" />
              <Text className="text-sm font-medium text-gray-600 ml-1">
                {data.rating.toFixed(1)}
              </Text>
            </View>
          </View>

          {/* Tags compactos */}
          <View className="flex-row flex-wrap gap-1 mb-3 ml-4">
            {data.tags.slice(0, 3).map((tag, index) => (
              <View key={index} className="bg-gray-100 px-2 py-1 rounded-full">
                <Text className="text-xs text-gray-600 font-medium">{tag}</Text>
              </View>
            ))}
            {data.tags.length > 3 && (
              <View className="bg-gray-100 px-2 py-1 rounded-full">
                <Text className="text-xs text-gray-500">+{data.tags.length - 3}</Text>
              </View>
            )}
          </View>

          {/* Footer con precio y botón */}
          <View className="flex-row items-center justify-between">
            <View>
            </View>
            <View className="bg-blue-500 px-4 py-2 rounded-full shadow-sm">
              <Text className="text-white text-sm font-semibold">Ver Perfil</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}