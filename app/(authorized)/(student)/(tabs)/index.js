import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import { ScrollView } from 'react-native'
import TutorCard from '../../../../components/TutorCard'
import { TouchableOpacity } from 'react-native'
import PopularTutorias from '../../../../components/PopularTutorias'
import { router } from 'expo-router'
import { useTutorStore } from '../../../../store/useTutorStore'
import { useTutoriaStore } from '../../../../store/useTutoriasStore'
import LoadingIndicator from '../../../../components/LoadingIndicator'
import { useUserStore } from '../../../../store/useUserStore'
import Feather from '@expo/vector-icons/Feather';

export default function HomeStudent() {
  const { fetchTutores, tutores, loading, error } = useTutorStore();
  const { fetchUserInfo, userInfo } = useUserStore();
  const { loading: loadingTutorias, error: errorTutorias, disponibles, loadTutoring } = useTutoriaStore();

  useEffect(() => {
    fetchTutores();
    loadTutoring();
    fetchUserInfo();
  }, [])

  const getRandom = (data) => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  if (loading || loadingTutorias) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <LoadingIndicator size="large" color="#2673DD" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className='w-full flex-1 px-4'>
        <GeneralTitle
          label={`Bienvenido, ${userInfo?.name}`}
          type='primary'
          className='!text-blue-500 mt-4'
        />
        <Text className='text-gray-500 mt-2'>Aprende con tus tutores favoritos</Text>
        <View className="w-full h-2/5 mt-5">
          <View className="w-full mb-3 flex-row justify-between items-center">
            <Text className="text-blue-500 text-xl font-semibold">Tutores Populares</Text>
            <TouchableOpacity onPress={() => router.push("/(authorized)/(student)/tutoresDisponibles")}>
              <Text className="text-sm text-gray-500 dark:text-text-dark-secondary font-semibold underline ">
                Ver Todo
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {tutores?.length == 0 ? (
              <View className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <Feather name="users" size={40} color={'#6b7280'} />
                <Text className="text-lg font-medium text-gray-900 mb-2">
                  No hay tutores disponibles
                </Text>
                <Text className="text-gray-500 text-center max-w-sm">
                  Los tutores deberán aparecer cuando tengas materias relacionadas.
                </Text>
              </View>
            ) : (
              getRandom(tutores).map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  data={tutor}
                />
              ))
            )}
          </ScrollView>
        </View>
        <View className="w-full h-2/4 mt-5">
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
              {disponibles?.length == 0 ? (
                <View className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <Feather name="book-open" size={40} color={'#6b7280'} />
                  <Text className="text-lg font-medium text-gray-900 mb-2">
                    No hay tutorías disponibles
                  </Text>
                  <Text className="text-gray-500 text-center max-w-sm">
                    Las tutorías estarán disponibles cuando tu tutor cree alguna.
                  </Text>
                </View>
              ) : (
                getRandom(disponibles).map((tutoria) => (
                  <PopularTutorias
                    key={tutoria.idHorario}
                    data={tutoria}
                  />
                ))
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Screen>
  )
}