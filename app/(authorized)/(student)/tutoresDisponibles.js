import { View, Text } from 'react-native'
import React from 'react'
import { Screen } from '../../../components/Screen'
import GeneralTitle from '../../../components/GeneralTitle'
import { ScrollView } from 'react-native';
import TutorCard from '../../../components/TutorCard';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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

export default function TutoresDisponibles() {
    const router = useRouter();
  return (
    <Screen>
        <View className='w-full flex-1 px-4'>
            <View className="w-full flex-row items-center mt-2">
                <TouchableOpacity onPress={() => router.back()}>
                    <View className="p-2 rounded-full bg-blue-500 justify-center items-center mr-2">
                        <FontAwesome name="arrow-left" size={16} color="white" />
                    </View>
                </TouchableOpacity>
                <GeneralTitle
                    label={"Tutores"}
                    type='primary'
                    className='!text-blue-500 ml-3'
                />
                

            </View>
            

            <View className="flex-1 mt-5">
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
        </View>
    </Screen>
   
  )
}