import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useUserStore } from "../store/useUserStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Formik } from "formik";
import * as yup from "yup";
import { Screen } from "../components/Screen";
import GeneralTitle from "../components/GeneralTitle";
import InputField from "../components/InputField";
import GeneralButton from "../components/GeneralButton";
import EditButton from "../components/EditButton";
import MateriasContainer from "../components/MateriasContainer";
import SizedBox from "../components/SizedBox";
import EditPasswordModal from "../components/modals/EditPasswordModal";
import EditMaterias from "../components/modals/EditMaterias";
import { userInfoService } from "../service/infoUser";
import ConfirmRegisterModal2 from "../components/modals/ConfirmRegisterModal2";
import { KeyboardAvoidingView } from "react-native";
import NewDropdown from "../components/NewDropdown";
import LoadingIndicator from "../components/LoadingIndicator";
import SelectableCard from "../components/SelectableCard";

export default function EditarInterfaz() {
  const router = useRouter();
  const {
    userInfo,
    career,
    editedPassword,
    subjects,
    fetchSubjectsInfo,
    fetchUserInfo,
    fetchCareerInfo,
  } = useUserStore();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editInfo, setEditInfo] = useState(null);
  const formikRef = useRef();

  useEffect(() => {
    const handleFetchSubjects = async () => {
      setLoading(true);
      try {
        await fetchSubjectsInfo(userInfo?.career?.careerId);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    handleFetchSubjects();
  }, []);

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
    name: yup.string(),
    lastName: yup.string(),
    email: yup
      .string()
      .matches(
        /^[\w-.]+@unipamplona\.edu\.co$/,
        "El email debe ser institucional (@unipamplona.edu.co)"
      )
      .email("Correo inválido"),
    username: yup.string(),
    career: yup.string(),
    academicLevel: yup
      .string()
      .nullable()
      .oneOf(
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        "Semestre inválido"
      ),
    subjects: yup.array().min(1, "Selecciona al menos una materia"),
  });

  const initialValues = {
    name: "",
    lastName: "",
    email: "",
    username: "",
    career: "",
    academicLevel: "",
    subjects: [],
  };

  const handleOnConfirm = async (data) => {
    setLoading(true);
    try {
      const response = await userInfoService.editUser(data);
      fetchUserInfo();
      fetchCareerInfo();

      console.log("UserInfo ", userInfo);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (value) => {
    console.log("Values ", value);
    setEditInfo(value);
    setConfirmModal(true);
  };

  return (
    <Screen>
      <View className="w-full px-4 mb-4">
        <View className="w-full flex-row items-center mt-2">
          <TouchableOpacity onPress={() => router.back()}>
            <View className="p-3 rounded-full bg-blue-500 justify-center items-center mr-2">
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
        innerRef={formikRef}
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
          resetForm,
          setFieldValue,
        }) => {
          const isFormEmpty =
            !values.name &&
            !values.lastName &&
            !values.email &&
            !values.username &&
            !values.career &&
            !values.academicLevel &&
            (!values.subjects || values.subjects.length === 0);

          return (
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "height" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
            >
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
                  <SizedBox height={18} />

                  <View className="w-full bg-gray-200 p-4 rounded-xl mb-8">
                    <Text className="text-black text-lg font-bold mb-3">
                      Información Académica
                    </Text>
                    <View className="flex gap-4">
                      <NewDropdown
                        label="Carrera"
                        value={values.career}
                        onValueChange={(value) =>
                          setFieldValue("career", value)
                        }
                        options={career.map((c) => ({
                          label: c.careerName,
                          value: c.careerId,
                        }))}
                        error={touched.career && errors.career}
                        placeholder={
                          userInfo?.career?.careerName ??
                          "Selecciona una carrera"
                        }
                        disabled={true}
                      />
                      <NewDropdown
                        label="Semestre"
                        value={values.academicLevel}
                        onValueChange={(selectedValue) => {
                          setFieldValue("academicLevel", selectedValue);
                        }}
                        options={semestres}
                        error={errors.academicLevel && touched.academicLevel}
                        placeholder={userInfo.semester}
                      />

                      <View className="mt-2">
                        <Text className="mb-2 font-medium">
                          Materias Actuales{" "}
                        </Text>
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

                        {/* <EditButton
                          title={"Editar Asignaturas"}
                          onPress={() => setSubjectsModalVisible(true)}
                        /> */}
                      </View>
                      <ScrollView className="h-[300px]">
                        {loading ? (
                          <LoadingIndicator />
                        ) : subjects?.length === 0 ? (
                          <Text className="text-center text-gray-500 mt-4">
                            No hay materias disponibles
                          </Text>
                        ) : (
                          subjects?.map((subject) => (
                            <SelectableCard
                              key={subject.idMateria}
                              label={subject.nombreMateria || subject}
                              subject={subject}
                              value={values.subjects}
                              onChange={(newSubjects) =>
                                setFieldValue("subjects", newSubjects)
                              }
                            />
                          ))
                        )}
                      </ScrollView>
                    </View>
                  </View>

                  <SizedBox height={24} />
                </ScrollView>

                <View className="mb-2">
                  <GeneralButton
                    title="Guardar cambios"
                    onPress={handleSubmit}
                    disabled={isFormEmpty}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          );
        }}
      </Formik>
      <EditPasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      />
      <ConfirmRegisterModal2
        visible={confirmModal}
        onClose={() => {
          setConfirmModal(false);
          formikRef.current?.resetForm();
        }}
        onConfirm={() => handleOnConfirm(editInfo)}
        data={editInfo}
        type="edit"
      />
    </Screen>
  );
}
