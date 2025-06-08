import { View, Text, Keyboard, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect } from 'react'
import InputField from '../../../../components/InputField'
import SizedBox from '../../../../components/SizedBox'
import * as yup from 'yup';
import { Formik } from 'formik';
import GeneralButton from '../../../../components/GeneralButton';
import DropdownInput from '../../../../components/DropdownInput';
import useRegisterStore from '../../../../store/useRegisterStore';
import { useRouter } from 'expo-router';
import { useUserTypeStore } from '../../../../store/useUserTypeStore';

export default function PersonalForm() {
  const { personalData, setPersonalData } = useRegisterStore();
  const router = useRouter();
  const {userType, setUserType} = useUserTypeStore();
  

  const RegisterSchema = yup.object().shape({
    typeUser: yup.string().required("El campo es requerido"),
    name: yup.string().required("El campo nombre es requerido"),
    lastName: yup.string().required("El campo apellido es requerido"),
    email: yup.string()
        .matches(/^[\w-.]+@unipamplona\.edu\.co$/, "El email debe ser institucional (@unipamplona.edu.co)")
        .email("El email es invalido").required('El campo email es requerido'),
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
            typeUser: personalData?.typeUser?.value || '',
            name: personalData?.name || '',
            lastName: personalData?.lastName || '',
            email: personalData?.email || '',
            userName: personalData?.userName || '',
            password: personalData?.password || '',
            confirmPassword: personalData?.confirmPassword || '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={(values) => {
            const fullTypeUser = typeUsers.find(item => item.value === values.typeUser);
            setPersonalData({
              ...values,
              typeUser: fullTypeUser || null
            });

            router.replace('/auth/register/academicForm') 
          }}
        >
        {({ handleChange, handleBlur, handleSubmit,setFieldValue,  values, errors, touched }) => { 
          
          useEffect(() => {
            const mappedValue = userType === 'Estudiante' ? '1' : '2';
            setFieldValue('typeUser', mappedValue);
          }, [userType]);

          const selectedItem = typeUsers.find(item => item.value === values.typeUser);
          
          return (
            <View className= "flex-1 w-full py-2">
               <ScrollView 
                className=''
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 10}}
              >
                <View className = "h-5/6">
                  <DropdownInput
                    label="Eres estudiante o tutor"
                    selectedValue={values.typeUser}
                    onValueChange={(item) => {
                      setFieldValue('typeUser', item.label)
                      setUserType(item.label);
                    }}
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
                    label={"Email"}
                    placeholder={"Email"}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    error={errors.email}
                    touched={touched.email}
                  />
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
              <GeneralButton
                  title={"Siguiente"}
                  onPress={handleSubmit}
              />
              
              
            </View>

        )}}
        </Formik>

  
  )
}