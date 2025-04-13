import { View, Text, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { Screen } from '../../../components/Screen'
import SelectorTab from '../../../components/SelectorTab'
import GeneralTitle from '../../../components/GeneralTitle'
import { Slot, usePathname, useRouter } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RegisterLayout() {
    const router = useRouter()
  const pathname = usePathname()

  const handleTabSelect = (selectedTab) => {
    if (selectedTab === 'Información Personal') {
        router.replace('/auth/register/personalForm')
    } else if (selectedTab === 'Información Académica') {
        router.replace('/auth/register/academicForm') 
    }
  }

  
  const activeTab =
    pathname.includes('academic') ? 'Información Académica' : 'Información Personal'

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Screen>
          <GeneralTitle type="primary" label="Registro"  className='mt-4 mb-6'/>

          <SelectorTab
            tabs={['Información Personal', 'Información Académica']}
            onSelect={handleTabSelect}
            selectedTab={activeTab}
            key={pathname}
            defaultTab={activeTab}
          />

          <View className="flex-1 w-full mt-10">
            <Slot />
          </View>
        </Screen>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
    
  )
}