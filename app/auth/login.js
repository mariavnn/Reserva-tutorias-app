import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Pantalla de Login</Text>
      
      <Button title="Iniciar sesión" onPress={() => router.push("/(authorized)/home")} />
      
      <Button title="¿No tienes cuenta? Regístrate" onPress={() => router.push("/auth/register")} />
    </View>
  );
}
