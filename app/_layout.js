import React, { useContext } from 'react'
import { Stack, useRouter } from 'expo-router'
import { ThemeContext, ThemeProvider } from '../providers/ThemeProvider'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native';

export default function RootLayout() {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  return(
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack
           screenOptions={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: theme === 'dark' ? 'rgba(18, 18, 18, 0.9)' : '#F0F2F5',
            },
            headerShadowVisible: false,
            headerTintColor: '#fff',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                className="ml-3 pr-1 bg-primary-light dark:bg-primary-dark rounded-full w-10 h-10 flex items-center justify-center"
              >
                <AntDesign name="left" size={23} color="white"/>
            </TouchableOpacity>
            ),
              
            
          }}>
          <Stack.Screen
              name='index'
              options={{
                headerShown: false
              }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
    
    
  )
}
