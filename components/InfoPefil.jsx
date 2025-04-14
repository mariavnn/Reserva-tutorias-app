import { View, Text } from 'react-native'
import React from 'react'
import MateriasContainer from './MateriasContainer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function InfoPefil({userType, data}) {
    const isTutor = userType === "Tutor";

    return (
      <View className="bg-white w-full mt-10 p-5 rounded-xl shadow-sm mb-10">
        <View className="flex-row items-center mb-3">
          <MaterialIcons name="menu-book" size={20} color="black" />
          <Text className="text-lg font-medium ml-2">
            {isTutor ? "Materias que imparto" : "Información Académica"}
          </Text>
        </View>
  
        {isTutor ? (
          <>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {data.map((materia) => (
                <MateriasContainer key={materia.value} label={materia.label} />
              ))}
            </View>
  
            <View className="flex-row justify-around mt-2">
              <View className="justify-center items-center w-1/3">
                <Text className="text-3xl font-semibold">24</Text>
                <Text className="text-gray-500 text-sm text-center">Tutorías Realizadas</Text>
              </View>
  
              <View className="justify-center items-center w-1/3">
                <Text className="text-3xl font-semibold">4.8</Text>
                <Text className="text-gray-500 text-sm text-center">Calificación Promedio</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View className="mb-2">
              <Text className="text-gray-500">Carrera:</Text>
              <Text className="font-medium">Ingeniería De Sistemas</Text>
            </View>
  
            <View className="mb-2">
              <Text className="text-gray-500">Semestre:</Text>
              <Text className="font-medium">6to Semestre</Text>
            </View>
  
            <View className="mb-2">
              <Text className="text-gray-500">Intereses:</Text>
            </View>
  
            <View className="flex-row flex-wrap gap-2">
              {data.map((item) => (
                <MateriasContainer key={item.value} label={item.label} />
              ))}
            </View>
          </>
        )}
      </View>
    );
}