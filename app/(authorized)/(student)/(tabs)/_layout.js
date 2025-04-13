import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function StudentTabLayout() {
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
                title: 'Home',
                tabBarIcon: () => <Feather name="home" size={24} color="black" />,
            }}
        />
        <Tabs.Screen
            name='tutorias'
            options={{
                title: 'Tutorias',
                tabBarIcon: ({ color }) => <AntDesign name="search1" size={24} color="black" />
            }}
        />
        <Tabs.Screen
            name='notificaciones'
            options={{
                title: 'Notificaciones',
                tabBarIcon: ({ color }) => <Feather name="clock" size={24} color="black" />
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