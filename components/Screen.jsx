import { View  } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Screen({children}) {
  const insets = useSafeAreaInsets();
  return (
    <View className='flex-1 items-center px-8 bg-background-light dark:bg-background-dark'
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom
      }}
    >
      {children}
    </View>
  )
}
