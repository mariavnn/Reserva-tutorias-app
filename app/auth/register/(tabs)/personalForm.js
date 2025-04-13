import { View, Text, Keyboard, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import InputField from '../../../../components/InputField'
import SizedBox from '../../../../components/SizedBox'
import * as yup from 'yup';
import { Formik } from 'formik';
import GeneralButton from '../../../../components/GeneralButton';
import DropdownInput from '../../../../components/DropdownInput';
import useRegisterStore from '../../../../store/useRegisterStore';
import { useRouter } from 'expo-router';

export default function PersonalForm() {
  const { setPersonalData } = useRegisterStore();
  const router = useRouter();

  const RegisterSchema = yup.object().shape({
    typeUser: yup.string().required("El campo es requerido"),
    name: yup.string().required("El campo nombre es requerido"),
    lastName: yup.string().required("El campo apellido es requerido"),
    userName: yup.string().required("El campo usuario es requerido"),
    password: yup.string()
      .min(6, 'Mínimo 6 caracteres')
      .required('La contraseña es obligatoria'),
    confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas deben ser igual')
  });

  const typeUsers = [
    { label: 'Estudiante', value: '1' },
    { label: 'Tutor', value: '2' }
  ]

  return (
        <Formik
          initialValues={{
            typeUser: '',
            name: '', 
            lastName: '', 
            userName: '', 
            password: '', 
            confirmPassword: '' 
          }}
          validationSchema={RegisterSchema}
          onSubmit={(values) => {
            setPersonalData(values);
            console.log('Datos enviados:', values);
            router.replace('/auth/register/academicForm') 
          }}
        >
        {({ handleChange, handleBlur, handleSubmit,setFieldValue,  values, errors, touched }) => (
            <View className= "flex-1 w-ful py-2">
               <ScrollView 
                className=''
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 120}}
              >
                <View className = "h-5/6">
                  <DropdownInput
                    label="Eres estudiante o tutor"
                    selectedValue={values.typeUser}
                    onValueChange={(item) => setFieldValue('typeUser', item.label)}
                    items={typeUsers}
                    error={errors.typeUser}
                    touched={touched.typeUser}
                    disabled={false}
                    
                  />
                  <SizedBox height={20}/>
                  <InputField
                    label={"Nombres"}
                    placeholder={"Nombres"}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                    error={errors.name}
                    touched={touched.name}
                  />
                  <SizedBox height={6}/>
                  <InputField
                    label={"Apellidos"}
                    placeholder={"Apellidos"}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    value={values.lastName}
                    error={errors.lastName}
                    touched={touched.lastName}
                  />
                  <SizedBox height={6}/>
                  <InputField
                    label={"Usuario"}
                    placeholder={"Usuario"}
                    onChangeText={handleChange("userName")}
                    onBlur={handleBlur("userName")}
                    value={values.userName}
                    error={errors.userName}
                    touched={touched.userName}
                  />
                  <SizedBox height={6}/>
                  <InputField
                    label={"Contraseña"}
                    isPassword={true}
                    placeholder={"Contraseña"}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    error={errors.password}
                    touched={touched.password}
                  />
                  <SizedBox height={6}/>
                  <InputField
                    label={"Confirmar Contraseña"}
                    placeholder={"Confirmar Contraseña"}
                    isPassword={true}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                  />
                </View>
              </ScrollView>

              <SizedBox height={6}/>
              <View className="absolute bottom-3 w-full h-[110px] px-4 py-2 bg-background-light">
                <GeneralButton
                  title={"Siguiente"}
                  onPress={handleSubmit}
                />
              </View>
              
            </View>

          )}
        </Formik>

  
  )
}