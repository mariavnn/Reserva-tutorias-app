import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useUserStore } from "../store/useUserStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Formik } from "formik";
import * as yup from "yup";
import { Screen } from "../components/Screen";
import GeneralTitle from "../components/GeneralTitle";
import InputField from "../components/InputField";
import GeneralButton from "../components/GeneralButton";
import DropdownInput from "../components/DropdownInput";
import EditButton from "../components/EditButton";
import MateriasContainer from "../components/MateriasContainer";
import SizedBox from "../components/SizedBox";
import EditPasswordModal from "../components/modals/EditPasswordModal";
import EditMaterias from "../components/modals/EditMaterias";

export default function EditarInterfaz() {
  const router = useRouter();
  const { userInfo, career, editedPassword } = useUserStore();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [subjectsModalVisible, setSubjectsModalVisible] = useState(false);

  const semestres = [
    { label: "1er Semestre", value: "1" },
    { label: "2do Semestre", value: "2" },
    { label: "3er Semestre", value: "3" },
    { label: "4to Semestre", value: "4" },
    { label: "5to Semestre", value: "5" },
    { label: "6to Semestre", value: "6" },
    { label: "7mo Semestre", value: "7" },
    { label: "8vo Semestre", value: "8" },
    { label: "9mo Semestre", value: "9" },
    { label: "10mo Semestre", value: "10" },
  ];

  const validationSchema = yup.object().shape({
    name: yup.string().required("El nombre es obligatorio"),
    lastName: yup.string().required("El apellido es obligatorio"),
    email: yup
      .string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
    username: yup.string().required("El usuario es obligatorio"),
    career: yup.string().required("La carrera es obligatoria"),
    academicLevel: yup
      .object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
      .nullable(),
    // carrera y semestre los agregas si quieres validarlos también
  });

  const initialValues = {
    name: "",
    lastName: "",
    email: "",
    username: "",
    career: "",
    academicLevel: null,
    // carrera: '',
    // semestre: ''
  };

  const handleSubmit = (values) => {
    console.log("Datos enviados:", values);
    // Aquí podrías llamar a tu servicio para actualizar el perfil
  };

  return (
    <Screen>
      <View className="w-full px-4 mb-4">
        <View className="w-full flex-row items-center mt-2">
          <TouchableOpacity onPress={() => router.back()}>
            <View className="p-2 rounded-full bg-blue-500 justify-center items-center mr-2">
              <FontAwesome name="arrow-left" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <GeneralTitle
            label={"Editar Perfil"}
            type="primary"
            className="!text-blue-500 ml-3"
          />
        </View>
      </View>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View className="flex-1 w-full">
            <ScrollView>
              <View className="w-full bg-gray-200 p-4 rounded-xl">
                <Text className="text-black text-lg font-bold mb-3">
                  Información Personal
                </Text>

                <InputField
                  label="Nombre"
                  placeholder={userInfo.name}
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  error={touched.name && errors.name}
                />

                <InputField
                  label="Apellido"
                  placeholder={userInfo.lastName}
                  value={values.lastName}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  error={touched.lastName && errors.lastName}
                />

                <InputField
                  label="Correo Electrónico"
                  placeholder={userInfo.email}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={touched.email && errors.email}
                />

                <InputField
                  label="Usuario"
                  placeholder={userInfo.username}
                  value={values.username}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  error={touched.username && errors.username}
                />

                <EditButton 
                  title={"Editar contraseña"} 
                  onPress={() => setPasswordModalVisible(true)} 
                />
              </View>
              <SizedBox height={18}/>

              <View className="w-full bg-gray-200 p-4 rounded-xl mb-20">
                <Text className="text-black text-lg font-bold mb-3">
                  Información Académica
                </Text>
                <View className="flex gap-4">
                  <DropdownInput
                    label="Carrera"
                    placeholder={
                      userInfo?.career?.careerName ?? "Selecciona una carrera"
                    }
                    items={career.map((c) => ({
                      label: c.careerName,
                      value: c.careerId,
                    }))}
                    selectedValue={values.career}
                    onValueChange={(value) => setFieldValue("career", value)}
                    error={touched.career && errors.career}
                  />
                  <DropdownInput
                    label="Semestre"
                    placeholder={userInfo.semester}
                    selectedValue={values.academicLevel}
                    onValueChange={(value) =>
                      setFieldValue("academicLevel", value)
                    }
                    items={semestres}
                    error={errors.academicLevel}
                    touched={touched.academicLevel}
                    disabled={false}
                  />
                  <View className="mt-3">
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      className="w-full h-15"
                    >
                      <View className="flex-row flex-wrap gap-2 mb-4">
                        {userInfo.subjectUsers.map((materia) => (
                          <MateriasContainer
                            key={materia.subjectId}
                            label={materia.subjectName}
                            icon={true}
                          />
                        ))}
                      </View>
                    </ScrollView>
                    
                    <EditButton title={"Editar Asignaturas"} onPress={() => router.push("../shared/editarSubject")}/>
                  </View>
                 
                </View>
              </View>

              <SizedBox height={24}/>
            </ScrollView>

            <View className="mb-2">
              <GeneralButton title="Guardar cambios" onPress={handleSubmit} />
            </View>
          </View>
        )}
      </Formik>
      <EditPasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      />

    </Screen>
  );
}
