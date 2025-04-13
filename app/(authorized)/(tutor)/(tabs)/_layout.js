import { View, Text, Platform } from 'react-native'
import React from 'react'
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';

export default function TabLayoutTutor() {
  return (
    <Tabs
        screenOptions={{
            headerShown: false,
            tabBarStyle: Platform.select({
            ios: {
                // Use a transparent background on iOS to show the blur effect
                position: 'absolute',
            },
            default: {},
            }),
        }}
    >
        <Tabs.Screen
            name='index'
            options={{
                title: 'Tutorias',
                tabBarIcon: ({ color }) => <Feather name="home" size={24} color="black" />,
            }}
        />
        <Tabs.Screen
            name='crearTutorias'
            options={{
                title: 'Crear Tutorias',
                tabBarIcon: ({ color }) => <MaterialIcons name="search" size={24} color="black" />
            }}
        />
        <Tabs.Screen
            name='perfil'
            options={{
                title: 'Perfil',
                tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color="black" />
            }}
        />
    </Tabs>
  )
}