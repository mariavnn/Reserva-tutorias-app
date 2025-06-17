import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import AddButton from "../../../../components/AddButton";
import SalonContainer from "../../../../components/SalonContainer";
import NuevoSalonModal from "../../../../components/modals/NuevoSalonModal";
import { Ionicons } from "@expo/vector-icons";
import { availabilityService } from "../../../../service/availabilityService";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import { classroomService } from "../../../../service/classroomService";

export default function SalonTab({ selectedBlock, onBackToBlocks }) {
  const [salonModal, setSalonModal] = useState(false);
  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedBlock && selectedBlock.classrooms) {
      const salonesConBloque = selectedBlock.classrooms.map((classroom) => ({
        ...classroom,
        blockName: selectedBlock.blockName,
        section: selectedBlock.section,
      }));
      setSalones(salonesConBloque);
    } else {
      setSalones([]);
    }
  }, [selectedBlock]);

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

      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          "Éxito",
          "El horario disponible se ha creado correctamente"
        );
      }, 100);
    } catch (e) {
      console.error("❌ Error al crear la disponibilidad:", e);
      const errorMessage =
        e.response?.data?.error ||
        e.response?.data?.message ||
        e.message ||
        "No se pudo crear la disponibilidad";
      setTimeout(() => {
        setLoading(false);
        Alert.alert("Error", errorMessage);
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (id) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar este salon?`,
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
              await classroomService.deleteClassroom(id);
              setSalones((prevSalones) =>
                prevSalones.filter((salon) => salon.classroomId !== id)
              );

              if (onRefreshBlocks) {
                onRefreshBlocks();
              }
              setTimeout(() => {
                Alert.alert("Éxito", "El salon se ha eliminado correctamente", [
                  { text: "OK" },
                ]);
              }, 100);
            } catch (e) {
              const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                "No se pudo eliminar el salon";
              Alert.alert("Error", errorMessage);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
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
            <AddButton label={"Nueva"} onPress={() => setSalonModal(true)} />
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

          <NuevoSalonModal
            visible={salonModal}
            onClose={() => setSalonModal(false)}
            selectedBlock={selectedBlock}
          />
        </View>
      )}
    </>
  );
}
