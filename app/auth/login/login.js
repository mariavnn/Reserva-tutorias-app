import { View, Text, Button, TouchableOpacity, TextInput, Modal, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import "../../../global.css";
import SelectorTab from "../../../components/SelectorTab";
import { Screen } from "../../../components/Screen";
import { useEffect, useState } from "react";
import GeneralButton from "../../../components/GeneralButton";
import SizedBox from "../../../components/SizedBox";
import * as yup from 'yup';
import { Formik } from 'formik';
import InputField from "../../../components/InputField";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import GeneralTitle from "../../../components/GeneralTitle";
import { useLoginStore } from "../../../store/useLoginStore";
import { useUserTypeStore } from "../../../store/useUserTypeStore";
import { authService } from "../../../service/authService";
import { jwtDecode } from "jwt-decode";
import useRegisterStore from "../../../store/useRegisterStore";
import { BlurView } from "expo-blur";

const LoginSchema = yup.object().shape({
  username: yup
    .string('Usuario inválido')
    .required('El usuario es obligatorio'),
  password: yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .required('La contraseña es obligatoria'),
});

 
export default function LoginScreen() {
  const router = useRouter();
  const userType = useUserTypeStore(state => state.userType);
  const setUserType = useUserTypeStore(state => state.setUserType);
  const login = useLoginStore(state => state.login);
  const { clearData } = useRegisterStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearData();
  }, [])

  const validateToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (!decoded.exp || !decoded.role) {
        throw new Error("Token inválido: falta información necesaria");
      }

      if (decoded.exp < currentTime) {
        throw new Error("Token expirado");
      }

      return {
        isValid: true,
        role: decoded.role,
      };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  };

  const handleAuth = async (values) => {
    setLoading(true);
    try {
      const data = {
        username: values.username,
        password: values.password,
      };

      const response = await authService.loginUser(data);

      const token = response['authorization'];

      if (!token) {
        throw new Error("Token no recibido en la respuesta");
      }

      const decoded = validateToken(token);

      console.log('role ', decoded.role)

      if (decoded.isValid) {
        if (decoded.role === "estudiante") {
          router.push("/(authorized)/(student)/(tabs)");
        } else if (decoded.role === "profesor") {
          router.push("/(authorized)/(tutor)/(tabs)");
        }else if (decoded.role === "administrador"){
          router.push("/(authorized)/(administrador)/(tabs)");
        }  else {
          alert("Rol no reconocido.");
        }
      } else {
        alert(`Token inválido: ${decoded.error}`);
      }
    } catch (error) {
      console.error("Error en login:", error);
    }finally {
      setLoading(false);
    }
  };


  return (
    <Screen>
      <GeneralTitle
        type="primary"
        label={'Login'}
        className="mt-20"
      />
      <SizedBox height={30}/>
      {/* <SelectorTab 
        tabs={['Soy Estudiante', 'Soy Tutor']}
        selectedTab={userType === "Estudiante" ? "Soy Estudiante" : "Soy Tutor"}
        onSelect={(selectedTab) => setUserType(selectedTab === "Soy Estudiante" ? "Estudiante" : "Tutor")}
      /> */}
      <SizedBox height={60}/>
      <Text className = 'text-2xl font-bold flex w-full justify-start'>
        Bienvenido!
      </Text>
      <SizedBox height={28}/>

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          handleAuth(values);
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

      {loading && (
        <Modal transparent animationType="fade">
          <BlurView intensity={50} tint="light" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </BlurView>
        </Modal>
      )}

    </Screen>
  );
}
