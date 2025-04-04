import { View, Text, Button, useColorScheme, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import "../../global.css";
import SelectorTab from "../../components/SelectorTab";
import { Screen } from "../../components/Screen";
import { useState } from "react";
import GeneralButton from "../../components/GeneralButton";
import SizedBox from "../../components/SizedBox";
import { TextInput } from "react-native-web";


export default function LoginScreen() {
  const router = useRouter();
  const [userType, setUserType] = useState("Estudiante");

  return (
    <Screen>
      <Text className ="font-bold text-3xl text-text-light-primary dark:text-text-dark-primary">Login</Text>
      <SelectorTab 
        tabs={['Soy Estudiante', 'Soy Tutor']}
        onSelect={(selectedTab) => setUserType(selectedTab === "Soy Estudiante" ? "Estudiante" : "Tutor")}
      />

      <Text className = 'text-2xl font-bold flex w-full justify-start'>
        Hola {userType}!
      </Text>



      <Pressable>
        <View>
            <Text>Email</Text>

            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              textContentType="username"
            />
          </View>
      </Pressable>

      <SizedBox height={16} />

      <Pressable>
        <View >
          <Text >Password</Text>

          <TextInput
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            returnKeyType="done"
            secureTextEntry
            textContentType="password"
          />
        </View>
      </Pressable>

      <GeneralButton
        title={'Login'}
        onPress={() =>  router.push("/(authorized)/home")}
        type="primary"
      />
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Text className="text-sm text-text-light-secondary dark:text-text-dark-secondary">¿No tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text className="text-sm text-text-light-secondary dark:text-text-dark-secondary font-semibold underline">
            Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
