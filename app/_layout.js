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
            headerShown:false
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
