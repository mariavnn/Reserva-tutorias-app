import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Pantalla de Registro</Text>
      
      <Button title="Registrarse" onPress={() => router.push("/auth/login")} />
      
      <Button title="¿Ya tienes cuenta? Inicia sesión" onPress={() => router.push("/auth/login")} />
    </View>
  );
}
