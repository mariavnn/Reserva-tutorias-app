import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function ReservarTutoriaCard({ data, onJoin }) {
  // Formatear la fecha para mostrar
  const formatDate = (dateString) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm mb-4 mt-5">
      <View className="flex-row justify-between items-center mb-1">
        <View className="w-3/4">
          <Text className="text-base font-semibold flex-wrap">{data.title}</Text>
        </View>
        
        <Text className={`text-white text-xs px-2 py-0.5 rounded-full ${
          data.mode === "PRESENCIAL" ? "bg-green-500" : "bg-blue-500"
        }`}>
          {data.mode === "PRESENCIAL" ? "PRESENCIAL" : "VIRTUAL"}
        </Text>
      </View>

      <Text className="text-gray-600 text-sm">{data.tutor}</Text>
      <Text className="text-gray-500 text-xs mt-1">{data.description}</Text>

      <View className="flex-row items-center mt-2">
        <FontAwesome6 name="calendar" size={14} color="gray" />
        <Text className="text-gray-600 text-xs ml-1">
          {formatDate(data.date)}
        </Text>
      </View>

      <View className="flex-row items-center mt-1">
        <FontAwesome6 name="clock" size={14} color="gray" />
        <Text className="text-gray-600 text-xs ml-1">
          {data.starTime} - {data.endTime}
        </Text>
        
        {data.location && (
          <>
            <FontAwesome6 name="location-dot" size={14} color="gray" className="ml-3" />
            <Text className="text-gray-600 text-xs ml-1">
              {data.location}
            </Text>
          </>
        )}
      </View>

      <View className="h-2 bg-gray-200 rounded-full mt-3 mb-2 overflow-hidden">
        <View
          className="h-2 bg-yellow-400"
          style={{ width: `${(data.current / data.max) * 100}%` }}
        />
      </View>

      <Text className="text-xs text-gray-700 mb-2">
        Cupos: {data.current}/{data.max}
      </Text>

      <View className="flex-row justify-between items-center">
        <Text className={`text-xs font-medium ${
          data.status === "Agendada" ? "text-blue-500" : 
          data.status === "Finalizada" ? "text-gray-500" : "text-green-500"
        }`}>
          {data.status}
        </Text>

        {data.status !== "Finalizada" && (
          <TouchableOpacity
            onPress={onJoin}
            className={`px-4 py-1.5 rounded-xl ${
              data.status === "Agendada" ? "bg-red-500" : "bg-blue-500"
            }`}
          >
            <Text className="text-white font-semibold text-sm">
              {data.status === "Agendada" ? "Cancelar" : "Reservar"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}