import { View, Text } from 'react-native'
import React from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import SearchBar from '../../../../components/SearchBar'
import { ScrollView } from 'react-native'
import TutorCard from '../../../../components/TutorCard'
import { TouchableOpacity } from 'react-native'
import PopularTutorias from '../../../../components/PopularTutorias'
import { useRouter } from 'expo-router'

const mockTutors = [
  {
    id: 1,
    name: "Prof. López",
    subject: "Programación",
    rating: 5,
    tags: ["SQL", "MongoDB", "PostgreSQL"],
    available: "Mar-Jue, 12:00-18:00",
  },
  {
    id: 2,
    name: "Prof. Martínez",
    subject: "Matemáticas",
    rating: 4,
    tags: ["SQL", "MongoDB", "PostgreSQL"],
    available: "Mar-Jue, 12:00-18:00",
  },
  {
    id: 3,
    name: "Prof. Ramírez",
    subject: "Física",
    rating: 5,
    tags: ["SQL", "MongoDB", "PostgreSQL"],
    available: "Mar-Jue, 12:00-18:00",
  },
  {
    id: 4,
    name: "Prof. Torres",
    subject: "Química",
    rating: 3,
    tags: ["SQL", "MongoDB", "PostgreSQL"],
    available: "Mar-Jue, 12:00-18:00",
  },
];

const sessions = [
  { id: 1, title: "Consultas de Programación", tutor: "Prof. López" },
  { id: 2, title: "Consultas de Programación", tutor: "Prof. López" },
  { id: 3, title: "Consultas de Programación", tutor: "Prof. López" },
  { id: 4, title: "Consultas de Programación", tutor: "Prof. López" },
];


export default function HomeStudent() {
  const router = useRouter();

  return (
    <Screen>
      <View className='w-full flex-1 px-4'>
        <GeneralTitle
          label={"Bienvenido, Carlos"}
          type='primary'
          className='!text-blue-500 mt-4'
        />
        <Text className='text-gray-500 mt-2'>Aprende con tus tutores favoritos</Text>
        <SearchBar/>

        <View className= "w-full h-1/3 mt-5">
          <View className="w-full mb-3 flex-row justify-between items-center">
            <Text className="text-blue-500 text-xl font-semibold">Tutores Populares</Text>
            <TouchableOpacity onPress={() => router.push("../tutoresDisponibles")}>
              <Text className="text-sm text-gray-500 dark:text-text-dark-secondary font-semibold underline ">
                Ver Todo
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {
              mockTutors.map((tutor) => {
                return (
                  <TutorCard
                    key={tutor.id}
                    data={tutor}
                  
                  />
                )
              })
               
            }

          </ScrollView>
        </View>

        <View className= "w-full h-2/5 mt-5">
          <View className="w-full mb-3 flex-row justify-between items-center">
            <Text className="text-blue-500 text-xl font-semibold">Tutorias Populares</Text>
            <TouchableOpacity onPress={() => router.push("/app/(authorized)/(student)/tutoresDisponibles.js")}>
              <Text className="text-sm text-gray-500 dark:text-text-dark-secondary font-semibold underline ">
                Ver Todo
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView>
            <View className='flex-row flex-wrap justify-between'>
              {
                sessions.map((session) => {
                  return (
                    <PopularTutorias
                      key={session.id}
                      data={session}
                    
                    />
                  )
                })
                
              }

            </View>
           

          </ScrollView>
        </View>

      </View>
     
    </Screen>
  )
}