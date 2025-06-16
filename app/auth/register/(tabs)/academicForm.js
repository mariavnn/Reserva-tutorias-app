import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import SizedBox from "../../../../components/SizedBox";
import GeneralButton from "../../../../components/GeneralButton";
import SelectableCard from "../../../../components/SelectableCard";
import { ScrollView } from "react-native";
import useRegisterStore from "../../../../store/useRegisterStore";
import { useState } from "react";
import { useRouter } from "expo-router";
import { subjectService } from "../../../../service/subjectsService";
import { useUserStore } from "../../../../store/useUserStore";
import { userInfoService } from "../../../../service/infoUser";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import ConfirmRegisterModal2 from "../../../../components/modals/ConfirmRegisterModal2";
import { authService } from "../../../../service/authService";
import FailedModal from "../../../../components/modals/FailedModal";
import NewDropdown from "../../../../components/NewDropdown";

export default function AcademicForm() {
  const { personalData, academicData, setAcademicData, setPersonalData } =
    useRegisterStore();
  const { career, setCareer } = useUserStore();
  const [modalVisible, setModalVisible] = useState(false);
  const userType = useUserStore((state) => state.userType);
  const containerHeight = userType === "Estudiante" ? "h-[70%]" : "h-[82%]";
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const RegisterSchema = yup.object().shape({
    career: yup.string().required("Selecciona una carrera"),
    academicLevel: yup.string().nullable(),
    subjects: yup.array().min(1, "Selecciona al menos una materia"),
  });

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

  useEffect(() => {
    const handleCareerInfo = async () => {
      setLoading(true);
      try {
        const career = await userInfoService.getCareer();
        setCareer(career);
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    handleCareerInfo();
  }, []);

  const handleGetSubject = async (idCareer) => {
    setLoadingSubjects(true);
    try {
      const response = await subjectService.getSubjectByIdCareer(idCareer);
      setSubjects(response);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      console.log("ERROR ", error);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      console.log("DATA ANTES DE PAYLOAD ", data);
      const body = {
        roleID: data?.typeUser ? parseInt(data?.typeUser?.value) : 1,
        name: data?.name,
        lastName: data?.lastName,
        user: data?.username,
        email: data?.email,
        password: data?.password,
        semester: data?.academicLevel
          ? parseInt(data?.academicLevel?.value)
          : 1,
        //career: data?.career ? parseInt(data?.career) : 1,
        subjects: data?.subjects?.map((s) => s.idMateria) || [],
      };

      await authService.registerUser(body);
      setPersonalData({});
      setAcademicData({});
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const prepareData = (personalData, academicData) => {
    return {
      typeUser: personalData?.typeUser,
      name: personalData?.name,
      lastName: personalData?.lastName,
      email: personalData?.email,
      username: personalData?.userName,
      password: personalData?.password,
      career: academicData?.careerName || academicData?.career,
      semester: academicData?.academicLevel,
      subjects: academicData?.subjects,
    };
  };

  const body = prepareData(personalData, academicData);

  return (
    <>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <LoadingIndicator />
        </View>
      ) : (
        <View>
          <Formik
            initialValues={{
              career: academicData?.career || null,
              academicLevel: academicData?.academicLevel || null,
              subjects: academicData?.subjects || [],
            }}
            validationSchema={RegisterSchema}
            onSubmit={(values) => {
              if (userType === "Estudiante" && !values.academicLevel) {
                alert("Selecciona un semestre");
                return;
              }
              setAcademicData(values);
              setModalVisible(true);
            }}
          >
            {({ handleSubmit, setFieldValue, values, errors, touched }) => (
              <View className="w-full">
                <NewDropdown
                  label="Selecciona la carrera a la que perteneces"
                  value={values.career}
                  onValueChange={(value) => {
                    setFieldValue("career", value);
                    if (value) {
                      handleGetSubject(value);
                    }
                  }}
                  options={(career ?? []).map((c) => ({
                    label: c.careerName,
                    value: c.careerId.toString(),
                  }))}
                  error={errors.career && touched.career ? errors.career : null}
                  placeholder="Selecciona una carrera"
                  disabled={false}
                />

                {userType === "Estudiante" && (
                  <NewDropdown
                    label="Selecciona tu semestre actual"
                    value={values.academicLevel}
                    onValueChange={(value) =>
                      setFieldValue("academicLevel", value)
                    }
                    options={semestres}
                    error={
                      errors.academicLevel && touched.academicLevel
                        ? errors.academicLevel
                        : null
                    }
                    placeholder="Selecciona un semestre"
                    disabled={false}
                  />
                )}

                <View className={`${containerHeight} py-2 pb-16`}>
                  <ScrollView keyboardShouldPersistTaps="handled">
                    {loadingSubjects ? (
                      <LoadingIndicator />
                    ) : subjects.length === 0 ? (
                      <Text className="text-center text-gray-500 mt-4">
                        No hay materias disponibles
                      </Text>
                    ) : (
                      subjects.map((subject) => (
                        <SelectableCard
                          key={subject.idMateria || subject}
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

                <SizedBox height={6} />

                <View className="absolute bottom-0 w-full px-4 py-2 bg-background-light">
                  <GeneralButton
                    title={"Finalizar Registro"}
                    onPress={handleSubmit}
                  />
                </View>
              </View>
            )}
          </Formik>
        </View>
      )}

      <ConfirmRegisterModal2
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleRegister}
        data={body}
        type="Registro"
      />
      <FailedModal
        visible={error}
        onClose={() => setError(false)}
        message={errorMessage}
      />
    </>
  );
}
