import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import CareerContainer from "../../../../components/CareerContainer";
import GeneralTitle from "../../../../components/GeneralTitle";
import AddButton from "../../../../components/AddButton";
import NuevaCarreraModal from "../../../../components/modals/NuevaCarreraModal";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import SuccessModal from "../../../../components/modals/SuccessModal";
import FailedModal from "../../../../components/modals/FailedModal";
import ConfirmModal2 from "../../../../components/modals/ConfirmModal2";
import { careerService } from "../../../../service/careerService";

export default function CareerTab() {
  const [addCareerModal, setAddCareerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [careers, setCareers] = useState([]);
  const [successModal, setSuccessModal] = useState({ visible: false, message: "" });
  const [errorModal, setErrorModal] = useState({ visible: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ 
    visible: false, 
    message: "", 
    onConfirm: null 
  });
  
  const fetchCareers = async () => {
    setLoading(true);
    try {
      const response = await careerService.getCareers();
      setCareers(response);
    } catch (e) {
      console.error("Error al obtener carreras:", e);
      showError("Error al cargar las carreras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
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

  const handleCreateCareer = async (formData) => {
    setLoading(true);
    try {
      const careerData = {
        careerName: formData.nombreCarrera,
        code: parseInt(formData.codigo)
      };
      
      await careerService.createCareer(careerData);
      await fetchCareers();
      setAddCareerModal(false);
      showSuccess("La carrera se ha creado correctamente");
      
    } catch (error) {
      console.error("❌ Error al crear carrera:", error);
      setAddCareerModal(false);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "No se pudo crear la carrera";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCareer = async (careerId) => {
    try {
      setLoading(true);
      await careerService.deleteCareer(careerId);
      await fetchCareers();
      showSuccess("La carrera se ha eliminado correctamente");
    } catch (error) {
      console.error("❌ Error al eliminar carrera:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "No se pudo eliminar la carrera";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (careerId) => {
    const career = careers.find(c => c.careerId === careerId);
    const careerName = career?.careerName || "esta carrera";
    const message = `¿Estás seguro de que deseas eliminar "${careerName}"?`;

    showConfirm(message, async () => {
      // Primero cerramos el modal de confirmación
      closeConfirmModal();
      
      // Pequeño delay para asegurar que el modal se cierre completamente
      setTimeout(() => {
        handleDeleteCareer(careerId);
      }, 100);
    });
  };

  const handleCloseModal = useCallback(() => {
    setAddCareerModal(false);
  }, []);

  const handleOpenModal = useCallback(() => {
    setAddCareerModal(true);
  }, []);

  return (
    <>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <LoadingIndicator />
        </View>
      ) : (
        <View className="flex-1">
          <View className="mt-10 mb-4 flex flex-row justify-between px-2 items-center">
            <Text className="font-semibold text-xl">Gestión de Carreras</Text>
            <AddButton label="Nueva" onPress={handleOpenModal} />
          </View>
          <ScrollView className="mb-20">
            {careers?.map((career) => (
              <CareerContainer
                type="carrera"
                key={career.careerId}
                data={career}
                onDelete={onDelete}
              />
            ))}
          </ScrollView>
        </View>
      )}

      <NuevaCarreraModal
        visible={addCareerModal}
        onClose={handleCloseModal}
        onSubmit={handleCreateCareer}
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