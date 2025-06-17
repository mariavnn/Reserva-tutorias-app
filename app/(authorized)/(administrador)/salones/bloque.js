import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import AddButton from "../../../../components/AddButton";
import BloqueContainer from "../../../../components/BloqueContainer";
import NuevoBloqueModal from "../../../../components/modals/NuevoBloqueModal";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import { blockService } from "../../../../service/blockService";

export default function BloqueTab({ onSelectBlock, refreshTrigger }) {
  const [nuevoBloqueModal, setNuevoBloqueModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buildings, setBuildings] = useState([]);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const response = await blockService.getBlocks();
      setBuildings(response);
    } catch (e) {
      console.error("Error al obtener bloques: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlocks(); }, []);
  useEffect(() => { fetchBlocks(); }, [refreshTrigger]);

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
      setTimeout(() => {
        Alert.alert("Éxito", "El bloque se ha creado correctamente");
      }, 100);
    } catch (e) {
      console.error("❌ Error al crear el bloque:", e);
      setNuevoBloqueModal(false);
      const errorMessage = e.response?.data?.error || e.response?.data?.message || e.message || "No se pudo crear el bloque";
      setTimeout(() => { Alert.alert("Error", errorMessage); }, 100);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (id) => {
    const block = buildings.find((b) => b.blockId === id);
    const blockName = block?.blockName || "este bloque";

    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar "${blockName}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await blockService.deleteBlock(id);
              await fetchBlocks();
              setTimeout(() => {
                Alert.alert(
                  "Éxito",
                  "El bloque se ha eliminado correctamente",
                  [{ text: "OK" }]
                );
              }, 100);
            } catch (e) {
              const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                "No se pudo eliminar el bloque";
              Alert.alert("Error", errorMessage);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
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
            <Text className="font-semibold text-xl">Gestion de Bloques</Text>
            <AddButton
              label={"Nueva"}
              onPress={() => setNuevoBloqueModal(true)}
            />
          </View>
          <ScrollView className="mb-20">
            {buildings.map((building) => (
              <BloqueContainer
                key={building.blockId}
                data={building}
                onDelete={onDelete}
                onSelect={()=>handleSelectBlock(building)}
              />
            ))}
          </ScrollView>

          <NuevoBloqueModal
            visible={nuevoBloqueModal}
            onClose={() => setNuevoBloqueModal(false)}
            onSubmit={handleCreateBlock}
          />
        </View>
      )}
    </>
  );
}
