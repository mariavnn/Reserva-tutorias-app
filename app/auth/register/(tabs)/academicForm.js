import { View, Text } from "react-native";
import React, { useEffect } from "react";
import DropdownInput from "../../../../components/DropdownInput";
import { Formik } from "formik";
import * as yup from "yup";
import SizedBox from "../../../../components/SizedBox";
import GeneralButton from "../../../../components/GeneralButton";
import SelectableCard from "../../../../components/SelectableCard";
import { ScrollView } from "react-native";
import useRegisterStore from "../../../../store/useRegisterStore";
import { useState } from "react";
import ConfirmRegisterModal from "../../../../components/modals/ConfirmRegisterModal";
import { useRouter } from "expo-router";
import ConfirmModal from "../../../../components/modals/ConfirmModal";
import { subjectService } from "../../../../service/subjectsService";
import { useUserStore } from "../../../../store/useUserStore";
import { userInfoService } from "../../../../service/infoUser";
import LoadingIndicator from "../../../../components/LoadingIndicator";

export default function AcademicForm() {
  const { academicData, setAcademicData } = useRegisterStore();
  const { career, setCareer } = useUserStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const userType = useUserStore((state) => state.userType);
  const containerHeight = userType === "Estudiante" ? "h-[70%]" : "h-[82%]";
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const router = useRouter();

  const RegisterSchema = yup.object().shape({
    career: yup
      .object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
      .nullable()
      .required("Selecciona una carrera"),
    academicLevel: yup
      .object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
      .nullable(),
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
        console.log("Error al obtener la información de las carreras: ", error);
      } finally {
        setLoading(false);
      }
    };

    handleCareerInfo();
  }, []);

  const handleGetSubject = async (idCareer) => {
    try {
      setLoadingSubjects(true);
      const response = await subjectService.getSubjectByIdCareer(idCareer);
      setSubjects(response);
    } catch (error) {
      console.error("Error al obtener materias:", error);
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  return (
    <>
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
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <View className="w-full">
              <DropdownInput
                label="Selecciona la carrera a la que perteneces"
                selectedValue={values.career}
                onValueChange={(value) => {
                  setFieldValue("career", value);
                  if (value?.value) {
                    handleGetSubject(value.value);
                  }
                }}
                items={career.map((c) => ({
                  label: c.careerName,
                  value: c.careerId,
                }))}
                error={errors.career}
                touched={touched.career}
                disabled={false}
              />

              <SizedBox height={12} />

              {userType === "Estudiante" && (
                <DropdownInput
                  label="Selecciona tu semestre actual"
                  selectedValue={values.academicLevel}
                  onValueChange={(value) =>
                    setFieldValue("academicLevel", value)
                  }
                  items={semestres}
                  error={errors.academicLevel}
                  touched={touched.academicLevel}
                  disabled={false}
                />
              )}

              <SizedBox height={12} />

              <View className={`${containerHeight} py-2 pb-16`}>
                <ScrollView keyboardShouldPersistTaps="handled">
                  {loadingSubjects ? (
                   <LoadingIndicator/>
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

              <SizedBox height={12} />

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

      {modalVisible && (
        <ConfirmRegisterModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={() => {
            setModalVisible(false);
            setToastVisible(true);
          }}
        />
      )}

      {toastVisible && (
        <ConfirmModal
          visible={toastVisible}
          onClose={() => {
            setToastVisible(false);
            router.back();
          }}
          message="Registro confirmado con éxito"
        />
      )}
    </>
  );
}
