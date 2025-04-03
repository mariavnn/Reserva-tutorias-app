import { View, Text, Button, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import "../../global.css"

export default function LoginScreen() {
  const router = useRouter();
  const handleTabChange = (index) => {
    console.log('Pestaña activa:', index);
  };

  return (
    <View className='flex-1 items-center justify-center bg-background-light dark:bg-background-dark'>
      <Text className ="font-bold text-2xl text-text-light-primary dark:text-text-dark-primary">Login</Text>
      <TabMenu tabs={['Soy Estudiante', 'Soy Tutor']} onTabSelect={handleTabChange} />
      
      {/* <Button title="Iniciar sesión" onPress={() => router.push("/(authorized)/home")} />
      
      <Button title="¿No tienes cuenta? Regístrate" onPress={() => router.push("/auth/register")} /> */}
    </View>
  );
}
