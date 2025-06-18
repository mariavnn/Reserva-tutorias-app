import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import AddButton from "../../../../components/AddButton";
import SalonContainer from "../../../../components/SalonContainer";
import NuevoSalonModal from "../../../../components/modals/NuevoSalonModal";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import SuccessModal from "../../../../components/modals/SuccessModal";
import FailedModal from "../../../../components/modals/FailedModal";
import ConfirmModal2 from "../../../../components/modals/ConfirmModal2";
import { Ionicons } from "@expo/vector-icons";
import { availabilityService } from "../../../../service/availabilityService";
import { classroomService } from "../../../../service/classroomService";

export default function SalonTab({ selectedBlock, onBackToBlocks }) {
  const [salonModal, setSalonModal] = useState(false);
  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState({ visible: false, message: "" });
  const [errorModal, setErrorModal] = useState({ visible: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ 
    visible: false, 
    message: "", 
    onConfirm: null 
  });

  const fetchClassroomsByBlock = async () => {
    if (!selectedBlock?.blockId) return;
    
    setLoading(true);
    try {
      const response = await classroomService.getClassroomsByBlock(selectedBlock.blockId);
      let classrooms = [];
      if (response.content && Array.isArray(response.content)) {
        classrooms = response.content;
      } else if (Array.isArray(response)) {
        classrooms = response;
      } else {
        classrooms = [];
      }
      
      const salonesConBloque = classrooms.map((classroom) => ({
        ...classroom,
        blockName: selectedBlock.blockName,
        section: selectedBlock.section,
      }));
      
      setSalones(salonesConBloque);
    } catch (e) {
      console.error("Error al obtener salones del bloque: ", e);
      showError("Error al cargar los salones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBlock) {
      fetchClassroomsByBlock();
    }
  }, [selectedBlock]);

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

  const handleCreateAvailability = async (formData, classroomId) => {
    if (loading) return;
    setLoading(true);
    try {
      const availabilityData = {
        classroomId: classroomId,
        dayOfWeek: formData.day,
        startTime: formData.startHour,
        endTime: formData.endHour,
      };
      await availabilityService.createAvailability(availabilityData);
      showSuccess("El horario disponible se ha creado correctamente");
    } catch (e) {
      console.error("❌ Error al crear la disponibilidad:", e);
      const errorMessage = e.response?.data?.error || e.response?.data?.message || e.message || "No se pudo crear la disponibilidad";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async (formData) => {
    setLoading(true);
    try {
      const classroomData = {
        blockId: selectedBlock.blockId,
        description: formData.tipoSalon || "",
        location: formData.nombreSalon,
        capacity: parseInt(formData.capacidad),
      };
      
      await classroomService.createClassroom(classroomData);
      setSalonModal(false);
      await fetchClassroomsByBlock();
      
      showSuccess("El salón se ha creado correctamente");
    } catch (e) {
      console.error("❌ Error al crear el salón:", e);
      setSalonModal(false);
      const errorMessage = e.response?.data?.error || e.response?.data?.message || e.message || "No se pudo crear el salón";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClassroom = async (id) => {
    setLoading(true);
    try {
      await classroomService.deleteClassroom(id);
      await fetchClassroomsByBlock();
      showSuccess("El salón se ha eliminado correctamente");
    } catch (e) {
      console.error("❌ Error al eliminar el salón:", e);
      const errorMessage = e.response?.data?.error || e.response?.data?.message || e.message || "No se pudo eliminar el salón";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (id) => {
    const salon = salones.find((s) => s.classroomId === id);
    const salonName = salon?.location || "este salón";
    const message = `¿Estás seguro de que deseas eliminar el salón "${salonName}"?`;
    
    showConfirm(message, () => {
      closeConfirmModal();
      handleDeleteClassroom(id);
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
            <View className="flex-row items-center flex-1">
              <TouchableOpacity onPress={onBackToBlocks} className="mr-3 p-1">
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="font-semibold text-xl">Salones</Text>
                <Text className="text-sm text-gray-600">
                  {selectedBlock.blockName}
                </Text>
              </View>
            </View>
            <AddButton label="Nueva" onPress={() => setSalonModal(true)} />
          </View>

          <ScrollView className="mb-20">
            {salones.length > 0 ? (
              salones.map((salon) => (
                <SalonContainer
                  key={salon.classroomId}
                  data={salon}
                  onDelete={onDelete}
                  onCreateAvailability={handleCreateAvailability}
                  isParentLoading={loading}
                />
              ))
            ) : (
              <View className="flex-1 justify-center items-center mt-20">
                <Text className="text-gray-500 text-center">
                  No hay salones registrados en este bloque
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      <NuevoSalonModal
        visible={salonModal}
        onClose={() => setSalonModal(false)}
        selectedBlock={selectedBlock}
        onSubmit={handleCreateClassroom}
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