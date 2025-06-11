import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { quitarSegundos, formatDate } from '../constants/Utils';

export default function ReservarTutoriaCard({ data, onJoin, status }) {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm mb-4 mt-5">
      <View className="flex-row justify-between items-center mb-1">
        <View className="w-3/4">
          <Text className="text-base font-semibold flex-wrap">{data?.materia?.nombreMateria}</Text>
        </View>

        <Text className={`text-white text-xs px-2 py-0.5 rounded-full ${data?.tipo === "PRESENCIAL" ? "bg-green-500" : "bg-blue-500"
          }`}>
          {data?.tipo === "PRESENCIAL" ? "PRESENCIAL" : "VIRTUAL"}
        </Text>
      </View>

      <Text className="text-gray-600 text-sm">{data?.usuario?.nombre} {data?.usuario?.apellido}</Text>
      <Text className="text-gray-500 text-xs mt-1">{data?.descripcion}</Text>

      <View className="flex-row items-center mt-2">
        <FontAwesome6 name="calendar" size={14} color="gray" />
        <Text className="text-gray-600 text-xs ml-1">
          {formatDate(data?.fechaHorario)}
        </Text>
      </View>

      <View className="flex-row items-center mt-1">
        <FontAwesome6 name="clock" size={14} color="gray" />
        <Text className="text-gray-600 text-xs ml-1">
          {quitarSegundos(data?.horaInicio)} - {quitarSegundos(data?.horaFin)}
        </Text>

        {data?.salon?.ubicacion && (
          <>
            <FontAwesome6 name="location-dot" size={14} color="gray" className="ml-3" />
            <Text className="text-gray-600 text-xs ml-1">
              {data?.salon?.ubicacion} - {data.salon?.bloque?.seccion}
            </Text>
          </>
        )}
      </View>

      <View className="h-2 bg-gray-200 rounded-full mt-3 mb-2 overflow-hidden">
        <View
          className="h-2 bg-yellow-400"
          style={{ width: `${(data.agendados?.length / 5) * 100}%` }}
        />
      </View>

      <Text className="text-xs text-gray-700 mb-2">
        Cupos: {data?.agendados?.length}/5
      </Text>

      <View className="flex-row justify-between items-center">
        <Text className={`text-xs font-medium ${status === "Agendada" ? "text-blue-500" :
          status !== "Finalizada" ? "text-green-500" : "text-red-500"
          }`}>
          {status} {data?.modo == "EN_CURSO" && (<Text>En curso</Text>)}
        </Text>

        {status !== "Finalizada" && (
          <TouchableOpacity
            onPress={onJoin}
            className={`px-4 py-1.5 rounded-xl ${status === "Agendada" ? "bg-red-500" : "bg-blue-500"
              }`}
          >
            <Text className="text-white font-semibold text-sm">
              {status === "Agendada" ? "Cancelar" : "Reservar"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}