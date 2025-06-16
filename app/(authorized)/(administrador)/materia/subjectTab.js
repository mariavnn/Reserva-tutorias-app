import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import AddButton from "../../../../components/AddButton";
import CareerContainer from "../../../../components/CareerContainer";
import NuevaMateriaModal from "../../../../components/modals/NuevaMateriaModal";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import { subjectService } from "../../../../service/subjectsService";

export default function SubjectTab() {
  const [subjects, setSubjects] = useState([]);
  const [addSubjectModal, setAddSubjectModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async () => {
    setLoading(true);
    try{
      const response = await subjectService.getSubjects();
      setSubjects(response);
    } catch (e) {
      console.error("Error al obtener materias: ", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {fetchSubjects();}, []);

  const handleCreateSubject = async (formData) => {
    setLoading(true);
    try {
      const subjectData = {
        careerId: parseInt(formData.career),
        subjectName: formData.nombreMateria,
        code: parseInt(formData.codigo),
        credits: parseInt(formData.creditos)
      };
      await subjectService.createSubject(subjectData);
      setAddSubjectModal(false);
      await fetchSubjects();

      setTimeout(() => {
        Alert.alert("Éxito", "La materia se ha creado correctamente");
      }, 100);
      
    } catch (error) {
      console.error("❌ Error al crear materia:", error);
      setAddSubjectModal(false);
      
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "No se pudo crear la materia";
      
      setTimeout(() => {
        Alert.alert("Error", errorMessage);
      }, 100);
      
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (id) => {
    const subject = subjects.find(s => s.subjectId === id);
    const subjectName = subject?.subjectName || "esta materia";

    Alert.alert("Confirmar eliminación", `¿Estás seguro de que deseas eliminar "${subjectName}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setLoading(true)
            try{
              await subjectService.deleteSubject(id);
              await fetchSubjects();
              setTimeout(() => {
                Alert.alert("Éxito", "La materia se ha eliminado correctamente",
                  [{ text: "OK" }]
                );
              }, 100);
            } catch (e) {
              const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "No se pudo eliminar la carrera";
              Alert.alert("Error", errorMessage);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    )
    
    
  };

  return (
    <>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <LoadingIndicator />
        </View>
      ) : (
        <View className="flex-1">
          <View className="mt-10 mb-4 flex flex-row justify-between px-2 items-center">
            <Text className="font-semibold text-xl">Gestion de Materias</Text>
            <AddButton label={"Nueva"} onPress={() => setAddSubjectModal(true)} />
          </View>
          <ScrollView className='mb-20'>
            {subjects?.map((subject) => (
              <CareerContainer
                type={"materia"}
                key={subject.subjectId}
                data={subject}
                onDelete={onDelete}
              />
            ))}
          </ScrollView>

          <NuevaMateriaModal
            visible={addSubjectModal}
            onClose={() => setAddSubjectModal(false)}
            onSubmit={handleCreateSubject}
          />
        </View>
      )}
    </>
  );
}
