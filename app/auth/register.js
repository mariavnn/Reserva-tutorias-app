import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View className="flex-1, bg-slate-700">
      <Text>Pantalla de Registro</Text>
      
      <Button title="Registrarse" onPress={() => router.push("/auth/login")} />
      
      <Button title="¿Ya tienes cuenta? Inicia sesión" onPress={() => router.push("/auth/login")} />
    </View>
  );
}
