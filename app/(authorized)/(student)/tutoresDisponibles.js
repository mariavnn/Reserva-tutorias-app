import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Screen } from '../../../components/Screen'
import GeneralTitle from '../../../components/GeneralTitle'
import { ScrollView } from 'react-native';
import TutorCard from '../../../components/TutorCard';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { useTutorStore } from '../../../store/useTutorStore';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';

export default function TutoresDisponibles() {
  const { fetchTutores, tutores, loading, error} = useTutorStore();

  useEffect(() => {
    fetchTutores();
  }, []);

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <LoadingIndicator size="large" color="#2673DD" />
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500">{error}</Text>
          <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-500 px-4 py-2 rounded">
            <Text className="text-white">Volver</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }
  return (
    <Screen>
      <View className='w-full flex-1 px-4'>
        <View className="w-full flex-row items-center mt-2">
          <TouchableOpacity onPress={() => router.back()}>
            <View className="px-3 py-2 rounded-full bg-blue-500 justify-center items-center mr-2">
              <FontAwesome6 name="arrow-left" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <GeneralTitle
            label="Tutores"
            type='primary'
            className='!text-blue-500 ml-3'
          />
        </View>
        <View className="flex-1 mt-5">
          <ScrollView>
            {tutores?.length == 0 ? (
              <View className="flex flex-col items-center justify-center mt-40 py-12 px-6 text-center">
                <Feather name="users" size={40} color={'#6b7280'} />
                <Text className="text-lg font-medium text-gray-900 mb-2">
                  No hay tutores disponibles
                </Text>
                <Text className="text-gray-500 text-center max-w-sm">
                  Los tutores deberán aparecer cuando tengas materias relacionadas.
                </Text>
              </View>
            ) : (
              tutores.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  data={tutor}
                />
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Screen>
  )
}