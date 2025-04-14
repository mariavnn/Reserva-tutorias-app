import { View, Text } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import MateriasContainer from './MateriasContainer';


export default function TutorCard({ data }) {
  return (
    <View className="flex-row justify-between bg-white px-4 py-3 rounded-xl shadow-sm mb-3 items-center">
      {/* Parte izquierda */}
      <View className="flex-row items-start space-x-3 flex-1">
        {/* Avatar */}
        <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center">
          <FontAwesome name="user" size={20} color="#2673DD" />
        </View>

        <View className="flex-1 ml-2">
          <View className="flex-row items-center gap-5">
            <Text className="text-base font-semibold w-1/2">{data.name}</Text>
            <View className="flex-row mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <FontAwesome
                  key={i}
                  name="star"
                  size={14}
                  color={i < data.rating ? "#facc15" : "#e5e7eb"}
                />
              ))}
            </View>
          </View>

          <Text className="text-gray-500 text-sm">{data.subject}</Text>

          <View className="flex-row flex-wrap gap-2 mt-2">
            {data.tags.map((tag, index) => (
              <MateriasContainer key={index} label={tag} />
            ))}
          </View>

          {/* Horario */}
          <View className="w-full flex-row justify-between mt-4">
            <View className="w-1/2">
              <Text className="text-gray-500 text-xs mt-2">
                Disponible: {data.available}
              </Text>
            </View>
            

            <TouchableOpacity
              onPress={() => onPress?.(data)}
              className="bg-blue-500 px-3 py-1 rounded-full ml-3 w-1/3 items-center justify-center"
            >
              <Text className="text-white text-sm font-medium">Ver Perfil</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </View>

  )
}

 {/* <View className="items-end">
        <View className="flex-row mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <FontAwesome
              key={i}
              name="star"
              size={14}
              color={i < data.rating ? "#facc15" : "#e5e7eb"}
            />
          ))}
        </View>

        <TouchableOpacity
          className="bg-blue-500 px-3 py-1 rounded-full mt-3"
        >
          <Text className="text-white text-sm font-medium">Ver Perfil</Text>
        </TouchableOpacity>
      </View> */}