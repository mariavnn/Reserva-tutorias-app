import { View, Text, Platform } from 'react-native'
import React from 'react'
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../../../../providers/ThemeProvider';

export default function TabLayoutTutor() {
  return (
    <SafeAreaProvider>
        <ThemeProvider>
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
                        tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name='crearTutorias'
                    options={{
                        title: 'Crear Tutorias',
                        tabBarIcon: ({ color }) => <MaterialIcons name="search" size={24} color={color} />
                    }}
                />
                <Tabs.Screen
                    name='perfil'
                    options={{
                        title: 'Perfil',
                        tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />
                    }}
                />
            </Tabs>
        </ThemeProvider>
        
    </SafeAreaProvider>
   
  )
}