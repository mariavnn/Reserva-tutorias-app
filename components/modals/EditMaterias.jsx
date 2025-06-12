import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import LoadingIndicator from "../LoadingIndicator";
import SelectableCard from "../SelectableCard";
import { Formik } from "formik";
import * as yup from "yup";
import { subjectService } from "../../service/subjectsService";
import { useUserStore } from "../../store/useUserStore";
import { Modal } from "react-native";
import GeneralButton from "../GeneralButton";
import SuccessModal from "./SuccessModal";

export default function EditMaterias({ visible, onClose }) {
  const [loading, setLoading] = useState(false);
  const [allSubjects, setAllSubjects] = useState([]);
  const [successVisible, setSuccessVisible] = useState(false);
  const { userInfo } = useUserStore();
  const SubjectsSchema = yup.object().shape({
    subjects: yup.array().min(1, "Selecciona al menos una materia"),
  });

  useEffect(() => {
    const getAllSubjects = async () => {
      setLoading(true);
      try {
        const subjects = await subjectService.getSubjectByIdCareer(
          userInfo?.career?.careerId
        );
        setAllSubjects(subjects);
        console.log("MATERIAS ", subjects);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getAllSubjects();
  }, []);

  const handleSubmit = async (values) => {
    try {
      console.log("Materias seleccionadas: ", values.subjects);
      setSuccessVisible(true);
    } catch (error) {
      console.log("Error al guardar asignaturas", error);
    }
  };
  const handleSuccessClose = () => {
    setSuccessVisible(false);
    onClose();
  };
  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <View className="bg-white p-6 rounded-lg w-full max-h-[80%] min-h-[60%]">
            <Text className="text-lg font-bold mb-4 text-center">
              Editar Asignatura
            </Text>

            <Formik
              initialValues={{ subjects: userInfo.subjectUsers || [] }}
              validationSchema={SubjectsSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, values, setFieldValue }) => (
                <View className="h-full">
                  <View className="h-28">
                    <ScrollView
                      contentContainerStyle={{ paddingBottom: 8 }}
                      keyboardShouldPersistTaps="handled"
                    >
                      {loading ? (
                        <LoadingIndicator />
                      ) : allSubjects.length === 0 ? (
                        <Text className="text-center text-gray-500 mt-4">
                          No hay materias disponibles
                        </Text>
                      ) : (
                        allSubjects.map((subject) => (
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

                  <View className="mt-4 flex-row justify-between">
                    <View className="w-2/5">
                      <GeneralButton
                        title="Cancelar"
                        type="secondary"
                        onPress={onClose}
                      />
                    </View>
                    <View className="w-2/5">
                      <GeneralButton title="Guardar" onPress={handleSubmit} />
                    </View>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>

      <SuccessModal
        visible={successVisible}
        onClose={handleSuccessClose}
        message="Las asignaturas han sido actualizada correctamente"
      />
    </>
  );
}
