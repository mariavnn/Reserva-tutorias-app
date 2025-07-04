import React, { useContext } from 'react';
import { View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import GeneralTitle from '../../../components/GeneralTitle';
import SelectorTab from '../../../components/SelectorTab';
import { Screen } from '../../../components/Screen';
import { ThemeContext } from '../../../providers/ThemeProvider';

export default function RegisterLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useContext(ThemeContext);

  const handleTabSelect = (selectedTab) => {
    if (selectedTab === 'Información Personal') {
      router.replace('/auth/register/(tabs)/personalForm');
    } else if (selectedTab === 'Información Académica') {
      router.replace('/auth/register/(tabs)/academicForm');
    }
  };

  const activeTab =
    pathname.includes('academic') ? 'Información Académica' : 'Información Personal';

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Screen>
          
          <View className="w-full px-4 mt-2 flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                if (pathname.includes('academicForm')) {
                  router.replace('/auth/register/(tabs)/personalForm');
                } else {
                  router.back();
                }
              }}
              className="bg-primary-light dark:bg-primary-dark rounded-full w-10 h-10 flex items-center justify-center"
            >
              <AntDesign name="left" size={23} color="white" />
            </TouchableOpacity>
          </View>
          <GeneralTitle type="primary" label="Registro" className="mt-4 mb-6" />

          <SelectorTab
            tabs={['Información Personal', 'Información Académica']}
            onSelect={handleTabSelect}
            selectedTab={activeTab}
            key={pathname}
            disabled={true}
          />

          <View className="flex-1 w-full">
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </View>
        </Screen>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}
