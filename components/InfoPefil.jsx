import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import MateriasContainer from './MateriasContainer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function InfoPefil({ data }) {
    const isTutor = data.role.name === "Profesor";

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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full h-15">
              <View className="flex-row flex-wrap gap-2 mb-4">
                {data.subjectUsers.map((materia) => (
                  <MateriasContainer key={materia.subjectId} label={materia.subjectName} />
                ))}
              </View>
            </ScrollView>
            
  
            <View className="flex-row justify-around mt-2">
              <View className="justify-center items-center w-1/3">
                <Text className="text-3xl font-semibold">{data?.totalSchedule}</Text>
                <Text className="text-gray-500 text-sm text-center">Tutorías Realizadas</Text>
              </View>
  
              {/* <View className="justify-center items-center w-1/3">
                <Text className="text-3xl font-semibold">{data.averageRating}</Text>
                <Text className="text-gray-500 text-sm text-center">Calificación Promedio</Text>
              </View> */}
            </View>
          </>
        ) : (
          <>
            <View className="mb-2">
              <Text className="text-gray-500">Carrera:</Text>
              <Text className="font-medium">{data.career.careerName}</Text>
            </View>
  
            <View className="mb-2">
              <Text className="text-gray-500">Semestre:</Text>
              <Text className="font-medium">{data.semester}</Text>
            </View>
  
            <View className="mb-2">
              <Text className="text-gray-500">Intereses:</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full">
              <View className="flex-row gap-2">
                {data.subjectUsers.map((item) => (
                  <MateriasContainer key={item.subjectId} label={item.subjectName} />
                ))}
              </View>
            </ScrollView>

          </>
        )}
      </View>
    );
}