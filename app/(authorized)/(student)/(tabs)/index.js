import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import SearchBar from '../../../../components/SearchBar'
import { ScrollView } from 'react-native'
import TutorCard from '../../../../components/TutorCard'
import { TouchableOpacity } from 'react-native'
import PopularTutorias from '../../../../components/PopularTutorias'
import { router } from 'expo-router'
import { useTutorStore } from '../../../../store/useTutorStore'
import { useTutoriaStore } from '../../../../store/useTutoriasStore'

export default function HomeStudent() {
  const { fetchTutores, tutores, loading, error} = useTutorStore();
  const { sesiones, loading: loadingTutorias, error: errorTutorias, loadAvailableTutorings } = useTutoriaStore();

  useEffect(()=> {
    fetchTutores();
    loadAvailableTutorings();
  }, [])

  return (
    <Screen>
      <View className='w-full flex-1 px-4'>
        <GeneralTitle
          label={"Bienvenido, Carlos"}
          type='primary'
          className='!text-blue-500 mt-4'
        />
        <Text className='text-gray-500 mt-2'>Aprende con tus tutores favoritos</Text>
        {/* <SearchBar/> */}
        <View className= "w-full h-2/5 mt-5">
          <View className="w-full mb-3 flex-row justify-between items-center">
            <Text className="text-blue-500 text-xl font-semibold">Tutores Populares</Text>
            <TouchableOpacity onPress={() => router.push("/(authorized)/(student)/tutoresDisponibles")}>
              <Text className="text-sm text-gray-500 dark:text-text-dark-secondary font-semibold underline ">
                Ver Todo
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {
              tutores.map((tutor) => {
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
        <View className= "w-full h-2/4 mt-5">
          <View className="w-full mb-3 flex-row justify-between items-center">
            <Text className="text-blue-500 text-xl font-semibold">Tutorias Populares</Text>
            <TouchableOpacity onPress={() => router.push('/(student)/tutorias')}>
              <Text className="text-sm text-gray-500 dark:text-text-dark-secondary font-semibold underline ">
                Ver Todo
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView>
            <View className='flex-row flex-wrap justify-between'>
              {
                sesiones.map((session) => {
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