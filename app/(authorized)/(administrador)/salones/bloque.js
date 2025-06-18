import { View, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import AddButton from "../../../../components/AddButton";
import BloqueContainer from "../../../../components/BloqueContainer";
import NuevoBloqueModal from "../../../../components/modals/NuevoBloqueModal";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import SuccessModal from "../../../../components/modals/SuccessModal";
import FailedModal from "../../../../components/modals/FailedModal";
import ConfirmModal2 from "../../../../components/modals/ConfirmModal2";
import { blockService } from "../../../../service/blockService";

export default function BloqueTab({ onSelectBlock, refreshTrigger, onBlocksUpdate }) {
  const [nuevoBloqueModal, setNuevoBloqueModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [successModal, setSuccessModal] = useState({ visible: false, message: "" });
  const [errorModal, setErrorModal] = useState({ visible: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ 
    visible: false, 
    message: "", 
    onConfirm: null 
  });

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const response = await blockService.getBlocks();
      setBuildings(response);
      if (onBlocksUpdate) {
        onBlocksUpdate(response);
      }
    } catch (e) {
      console.error("Error al obtener bloques: ", e);
      showError("Error al cargar los bloques");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlocks(); }, []);
  useEffect(() => { fetchBlocks(); }, [refreshTrigger]);

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

  const handleCreateBlock = async (formData) => {
    setLoading(true);
    try {
      const blockData = {
        blockName: formData.nombreBloque,
        section: formData.seccion,
      };
      await blockService.createBlock(blockData);
      setNuevoBloqueModal(false);
      await fetchBlocks();
      showSuccess("El bloque se ha creado correctamente");
    } catch (e) {
      console.error("❌ Error al crear el bloque:", e);
      setNuevoBloqueModal(false);
      const errorMessage = e.response?.data?.error || e.response?.data?.message || e.message || "No se pudo crear el bloque";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlock = async (id) => {
    setLoading(true);
    try {
      await blockService.deleteBlock(id);
      await fetchBlocks();
      showSuccess("El bloque se ha eliminado correctamente");
    } catch (e) {
      console.error("❌ Error al eliminar el bloque:", e);
      const errorMessage = e.response?.data?.error || e.response?.data?.message || e.message || "No se pudo eliminar el bloque";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (id) => {
    const block = buildings.find((b) => b.blockId === id);
    const blockName = block?.blockName || "este bloque";
    const message = `¿Estás seguro de que deseas eliminar "${blockName}"?`;
    
    showConfirm(message, () => {
      closeConfirmModal();
      handleDeleteBlock(id);
    });
  };

  const handleSelectBlock = (block) => {
    if (onSelectBlock) {
      onSelectBlock(block);
    }
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
            <Text className="font-semibold text-xl">Gestión de Bloques</Text>
            <AddButton
              label="Nueva"
              onPress={() => setNuevoBloqueModal(true)}
            />
          </View>
          <ScrollView className="mb-20">
            {buildings.map((building) => (
              <BloqueContainer
                key={building.blockId}
                data={building}
                onDelete={onDelete}
                onSelect={() => handleSelectBlock(building)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      <NuevoBloqueModal
        visible={nuevoBloqueModal}
        onClose={() => setNuevoBloqueModal(false)}
        onSubmit={handleCreateBlock}
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