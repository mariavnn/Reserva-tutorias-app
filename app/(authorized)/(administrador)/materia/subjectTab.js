import { View, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import AddButton from "../../../../components/AddButton";
import CareerContainer from "../../../../components/CareerContainer";
import NuevaMateriaModal from "../../../../components/modals/NuevaMateriaModal";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import SuccessModal from "../../../../components/modals/SuccessModal";
import FailedModal from "../../../../components/modals/FailedModal";
import ConfirmModal2 from "../../../../components/modals/ConfirmModal2";
import { subjectService } from "../../../../service/subjectsService";

export default function SubjectTab() {
  const [subjects, setSubjects] = useState([]);
  const [addSubjectModal, setAddSubjectModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState({ visible: false, message: "" });
  const [errorModal, setErrorModal] = useState({ visible: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ 
    visible: false, 
    message: "", 
    onConfirm: null 
  });

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await subjectService.getSubjects();
      setSubjects(response);
    } catch (e) {
      console.error("Error al obtener materias: ", e);
      showError("Error al cargar las materias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const showSuccess = (message) => {
    setSuccessModal({ visible: true, message });
  };

  const showError = (message) => {
    setErrorModal({ visible: true, message });
  };

  const showConfirm = (message, onConfirm) => {
    setConfirmModal({ visible: true, message, onConfirm });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ visible: false, message: "" });
  };

  const closeErrorModal = () => {
    setErrorModal({ visible: false, message: "" });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ visible: false, message: "", onConfirm: null });
  };

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
      showSuccess("La materia se ha creado correctamente");
      
    } catch (error) {
      console.error("❌ Error al crear materia:", error);
      setAddSubjectModal(false);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "No se pudo crear la materia";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      setLoading(true);
      await subjectService.deleteSubject(id);
      await fetchSubjects();
      showSuccess("La materia se ha eliminado correctamente");
    } catch (e) {
      console.error("❌ Error al eliminar materia:", e);
      const errorMessage = e.response?.data?.error || e.response?.data?.message || e.message || "No se pudo eliminar la materia";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (id) => {
    const subject = subjects.find(s => s.subjectId === id);
    const subjectName = subject?.subjectName || "esta materia";
    const message = `¿Estás seguro de que deseas eliminar "${subjectName}"?`;

    showConfirm(message, async () => {
      // Primero cerramos el modal de confirmación
      closeConfirmModal();
      
      // Pequeño delay para asegurar que el modal se cierre completamente
      setTimeout(() => {
        handleDeleteSubject(id);
      }, 100);
    });
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
            <Text className="font-semibold text-xl">Gestión de Materias</Text>
            <AddButton label="Nueva" onPress={() => setAddSubjectModal(true)} />
          </View>
          <ScrollView className="mb-20">
            {subjects?.map((subject) => (
              <CareerContainer
                type="materia"
                key={subject.subjectId}
                data={subject}
                onDelete={onDelete}
              />
            ))}
          </ScrollView>
        </View>
      )}

      <NuevaMateriaModal
        visible={addSubjectModal}
        onClose={() => setAddSubjectModal(false)}
        onSubmit={handleCreateSubject}
      />

      <SuccessModal
        visible={successModal.visible}
        message={successModal.message}
        onClose={closeSuccessModal}
      />

      <FailedModal
        visible={errorModal.visible}
        message={errorModal.message}
        onClose={closeErrorModal}
      />

      <ConfirmModal2
        visible={confirmModal.visible}
        message={confirmModal.message}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
      />
    </>
  );
}