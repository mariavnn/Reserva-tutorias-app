import { View, Text } from 'react-native'
import React from 'react'
import { Screen } from '../../../components/Screen'
import SelectorTab from '../../../components/SelectorTab'
import GeneralTitle from '../../../components/GeneralTitle'
import { Slot, usePathname, useRouter } from 'expo-router'

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
    <Screen>
      <GeneralTitle type="primary" label="Registro" />

      <SelectorTab
        tabs={['Información Personal', 'Información Académica']}
        onSelect={handleTabSelect}
        defaultTab={activeTab}
      />

      <View className="mt-4">
        <Slot />
      </View>
    </Screen>
  )
}