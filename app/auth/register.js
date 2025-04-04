import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../components/Screen";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Text>Pantalla de Registro</Text>
      
      <Button title="Registrarse" onPress={() => router.push("/auth/login")} />
      
      <Button title="¿Ya tienes cuenta? Inicia sesión" onPress={() => router.push("/auth/login")} />
    </Screen>
  );
}
