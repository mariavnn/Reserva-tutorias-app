import { View, Text, Button, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import "../../../global.css";
import SelectorTab from "../../../components/SelectorTab";
import { Screen } from "../../../components/Screen";
import { useState } from "react";
import GeneralButton from "../../../components/GeneralButton";
import SizedBox from "../../../components/SizedBox";
import * as yup from 'yup';
import { Formik } from 'formik';
import InputField from "../../../components/InputField";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import GeneralTitle from "../../../components/GeneralTitle";
import { useLoginStore } from "../../../store/useLoginStore";

const LoginSchema = yup.object().shape({
  username: yup
    .string('Usuario inválido')
    .required('El usuario es obligatorio'),
  password: yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('La contraseña es obligatoria'),
});


const mockUsers = [
  { username: 'mvnieto', password: 'victoria123', role: 'student' },
  { username: 'tutorUser', password: 'tutor123', role: 'tutor' },
];
 
export default function LoginScreen() {
  const router = useRouter();
  const [userType, setUserType] = useState("Estudiante");
  const login = useLoginStore(state => state.login);


  const handleAuth = (values) => {
    const roleKey = userType === "Estudiante" ? "student" : "tutor";
    const user = mockUsers.find(
      u =>
        u.username.toLowerCase() === values.username.toLowerCase() &&
        u.password === values.password &&
        u.role === roleKey
    );

    console.log("User", user);

    if (user) {
      login(user)
      if (user.role === "student") {
        router.push("/(authorized)/(student)/(tabs)");
      } else if (user.role === "tutor") {
        router.push("/(authorized)/(tutor)/(tabs)"); 
      }
    } else {
      alert("Credenciales inválidas o tipo de usuario incorrecto");
    }
  }

  return (
    <Screen>
      <GeneralTitle
        type="primary"
        label={'Login'}
        className="mt-20"
      />
      <SizedBox height={30}/>
      <SelectorTab 
        tabs={['Soy Estudiante', 'Soy Tutor']}
        onSelect={(selectedTab) => setUserType(selectedTab === "Soy Estudiante" ? "Estudiante" : "Tutor")}
      />
      <SizedBox height={60}/>
      <Text className = 'text-2xl font-bold flex w-full justify-start'>
        Hola {userType}!
      </Text>
      <SizedBox height={28}/>

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          handleAuth(values);
          console.log('Datos enviados:', values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View className='w-full'>
            
            <InputField
            label="Usuario"
            icon={<FontAwesome name="user" size={24} color="gray" />}
            autoCapitalize="none"
            onChangeText={handleChange("username")}
            onBlur={handleBlur("username")}
            value={values.username}
            error={errors.username}
            touched={touched.username}
            placeholder={"Usuario"}
          />

          <SizedBox height={4}/>

          <InputField
            label="Contraseña"
            isPassword= {true}
            icon={<Entypo name="lock" size={24} color="gray" />}
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            error={errors.password}
            touched={touched.password}
            placeholder={"Contraseña"}
          />

            <SizedBox height={40}/>

            <GeneralButton
              title={'Login'}
              onPress={handleSubmit}
              type="primary"
            />
          </View>
        )}
      </Formik>
      
      <SizedBox height={10}/>
      
      
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
