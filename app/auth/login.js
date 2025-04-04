import { View, Text, Button, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import "../../global.css";
import SelectorTab from "../../components/SelectorTab";
import { Screen } from "../../components/Screen";
import { useState } from "react";
import GeneralButton from "../../components/GeneralButton";
import SizedBox from "../../components/SizedBox";
import * as yup from 'yup';
import { Formik } from 'formik';
import InputField from "../../components/InputField";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import GeneralTitle from "../../components/GeneralTitle";

const LoginSchema = yup.object().shape({
  email: yup
    .string('Usuario inválido')
    .required('El usuario es obligatorio'),
  password: yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('La contraseña es obligatoria'),
});


export default function LoginScreen() {
  const router = useRouter();
  const [userType, setUserType] = useState("Estudiante");

  return (
    <Screen>
      <GeneralTitle
        type="primary"
        label={'Login'}
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
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          console.log('Datos enviados:', values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View className='w-full'>
            
            <InputField
            label="Usuario"
            icon={<FontAwesome name="user" size={24} color="gray" />}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            error={errors.email}
            touched={touched.email}
            placeholder={"Usuario"}
          />

          <SizedBox height={4}/>

          <InputField
            label="Contraseña"
            icon={<Entypo name="lock" size={24} color="gray" />}
            secureTextEntry
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            error={errors.password}
            touched={touched.password}
          />

            <SizedBox height={40}/>

            <GeneralButton
              title={'Login'}
              onPress={() =>  router.push("/(authorized)/home")}
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
