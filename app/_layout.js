import React from 'react'
import { Stack } from 'expo-router'
import { ThemeProvider } from '../providers/ThemeProvider'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  return(
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen
              name='index'
              options={{headerShown: false}}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
    
    
  )
}
