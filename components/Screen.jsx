import { View  } from 'react-native'
import React from 'react'

export function Screen({children}) {
  return (
    <View className='flex-1 items-center p-6 justify-center bg-background-light dark:bg-background-dark'>
      {children}
    </View>
  )
}
