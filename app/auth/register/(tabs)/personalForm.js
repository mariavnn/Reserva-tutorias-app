import { View, Text, Keyboard, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useRef } from 'react'
import InputField from '../../../../components/InputField'
import SizedBox from '../../../../components/SizedBox'
import * as yup from 'yup';
import { Formik } from 'formik';
import GeneralButton from '../../../../components/GeneralButton';
import DropdownInput from '../../../../components/DropdownInput';
import useRegisterStore from '../../../../store/useRegisterStore';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../../../store/useUserStore';
import NewDropdown from '../../../../components/NewDropdown';

export default function PersonalForm() {
  const { personalData, setPersonalData } = useRegisterStore();
  const router = useRouter();
  const { userType, setUserType } = useUserStore();


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
  const formikRef = useRef(null); 

  useEffect(() => {
    if (formikRef.current) {
      const mappedValue = userType === 'Estudiante' ? '1' : '2';
      formikRef.current.setFieldValue('typeUser', mappedValue);
    }
  }, [userType]);

  return (
    <Formik
      innerRef={formikRef}
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
      {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => {
        return (
          <View className="flex-1 w-full">
            <ScrollView
              className=''
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              <View className="h-5/6">
                <NewDropdown
                  label="Eres estudiante o tutor"
                  options={typeUsers}
                  value={values.typeUser}
                  onValueChange={(value) => {
                    const selected = typeUsers.find(item => item.value === value);
                    setFieldValue('typeUser', value);
                    setUserType(selected?.label || '');
                  }}
                  error={touched.typeUser && errors.typeUser}
                  disabled={false}
                />
                <InputField
                  label={"Nombres"}
                  placeholder={"Nombres"}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  error={errors.name}
                  touched={touched.name}
                />
                <SizedBox height={6} />
                <InputField
                  label={"Apellidos"}
                  placeholder={"Apellidos"}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  value={values.lastName}
                  error={errors.lastName}
                  touched={touched.lastName}
                />
                <SizedBox height={6} />
                <InputField
                  label={"Usuario"}
                  placeholder={"Usuario"}
                  onChangeText={handleChange("userName")}
                  onBlur={handleBlur("userName")}
                  value={values.userName}
                  error={errors.userName}
                  touched={touched.userName}
                />
                <SizedBox height={6} />
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
                <SizedBox height={6} />
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

            <SizedBox height={6} />
            <GeneralButton
              title={"Siguiente"}
              onPress={handleSubmit}
            />
          </View>
        )
      }}
    </Formik>
  );
}