import { View, Text, Platform } from 'react-native'
import React from 'react'
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
                        tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name='materia'
                    options={{
                        title: 'Materias',
                        tabBarIcon: ({ color }) => <Feather name="book-open" size={24} color={color} />
                    }}
                />
                <Tabs.Screen
                    name='salones'
                    options={{
                        title: 'Salones',
                        tabBarIcon: ({ color }) => <MaterialCommunityIcons name="google-classroom" size={24} color={color} />
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