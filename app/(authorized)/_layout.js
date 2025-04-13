import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="student/tabs" options={{ headerShown: false }} />
      <Stack.Screen name="tutor/tabs" options={{ headerShown: false }} />
    </Stack>
  );
}