import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../../providers/ThemeProvider';

export default function Layout() {
  return (
    <SafeAreaProvider>
        <ThemeProvider>
            <Stack
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="(student)/(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(tutor)/(tabs)" options={{ headerShown: false }} />
            </Stack>
        </ThemeProvider>
    </SafeAreaProvider>
    
  );
}