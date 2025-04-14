import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function ReservarTutoriaCard({ data, onJoin }) {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm mb-4 mt-5">
      <View className="flex-row justify-between items-center mb-1">
        <View className="w-3/4 ">
            <Text className="text-base font-semibold flex-wrap">{data.title}</Text>
        </View>
        
        <Text className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">EN VIVO</Text>
      </View>

      <Text className="text-gray-600 text-sm">{data.tutor}</Text>

      <View className="flex-row items-center mt-1">
        <FontAwesome6 name="clock" size={24} color="black" />
        <Text className="text-gray-600 text-xs ml-1">
          Ahora, hasta {data.endTime}
        </Text>
      </View>

      <View className="h-2 bg-gray-200 rounded-full mt-3 mb-2 overflow-hidden">
        <View
          className="h-2 bg-yellow-400"
          style={{ width: `${(data.current / data.max) * 100}%` }}
        />
      </View>

      <Text className="text-xs text-gray-700 mb-2">
        Participantes: {data.current}/{data.max}
      </Text>

        <View className="flex-row justify-between items-center">
            <Text className="text-green-500 text-xs font-medium">
                {data.status === "Agendadas" ? "Agendada" : data.status === "Historial" ? "Finalizada" : "Disponible"}
            </Text>

            {data.status !== "Historial" && (
                <TouchableOpacity
                onPress={onJoin}
                className={`px-4 py-1.5 rounded-xl ${
                    data.status === "Agendadas" ? "bg-red-500" : "bg-blue-500"
                }`}
                >
                <Text className="text-white font-semibold text-sm">
                    {data.status === "Agendadas" ? "Cancelar" : "Unirse"}
                </Text>
                </TouchableOpacity>
            )}
        </View>

    </View>
  )
}