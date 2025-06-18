import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState, useEffect } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import HorariosModal from "./modals/HorariosModal";
import AddHorarioModal from "./modals/AddHorarioModal";
import { availabilityService } from "../service/availabilityService";

export default function SalonContainer({ data, onDelete, onCreateAvailability, isParentLoading }) {
  const [horariosModal, setHorariosModal] = useState(false);
  const [addHorarioModal, setAddHorarioModal] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  useEffect(() => {
    setHorariosModal(false);
    setAddHorarioModal(false);
    setHorarios([]);
  }, [data.classroomId]);

  const handleCloseHorarios = () => {
    setHorariosModal(false);
    setHorarios([]);
  };

  const handleCreateAvailability = async (formData) => {
    if (isParentLoading) return;
    
    try {
      setAddHorarioModal(false);
      await onCreateAvailability(formData, data.classroomId);
    } catch (error) {
      console.error("Error en handleCreateAvailability:", error);
    }
  };

  const handleOpenHorarios = async () => {
    setLoadingHorarios(true);
    try {
      const response = await availabilityService.getAvailabilityBySalon(
        data.classroomId
      );
      setHorarios(response.data || []);
      setHorariosModal(true);
    } catch (error) {
      console.error("Error al obtener horarios:", error);
      setHorarios([]);
    } finally {
      setLoadingHorarios(false);
    }
  };

  return (
    <View className="w-full flex border border-gray-300 bg-white mt-3 py-3 rounded-lg ">
      <View className="w-full flex flex-row justify-between">
        <View className="flex flex-row gap-1 items-center ml-1">
          <Ionicons name="location-outline" size={24} color="#2563eb" />
          <Text className="text-md font-semibold">
            {" "}
            Salon:{" "}
            <Text>
              {data.section.toUpperCase()} {data.location}
            </Text>
          </Text>
        </View>

        <View className="flex flex-row items-center gap-3  mr-2">
          <TouchableOpacity
            onPress={() => setAddHorarioModal(!addHorarioModal)}
          >
            <MaterialIcons name="more-time" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(data.classroomId)}>
            <FontAwesome6 name="trash-can" size={18} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex gap-2 px-5 mr-2 ml-4 mt-2">
        <Text className="text-md text-gray-500">{data.blockName}</Text>
        <View className="flex flex-row items-center mb-3 gap-2">
          <View className="bg-blue-100 rounded-2xl px-2 py-1">
            <Text>{data.description ? (data.description).toUpperCase() : "AULA"}</Text>
          </View>

          <View className="flex flex-row gap-1">
            <Ionicons name="people-outline" size={24} color="black" />
            <Text>{data.capacity}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleOpenHorarios}
          disabled={loadingHorarios}
          className={`${
            loadingHorarios ? "bg-gray-400" : "bg-blue-500"
          } w-1/2 flex flex-row gap-2 items-center rounded-xl px-2 py-2`}
        >
          <MaterialIcons name="access-time" size={20} color="white" />
          <Text className="text-white">
            {loadingHorarios ? "Cargando..." : "Ver Horarios"}
          </Text>
        </TouchableOpacity>
      </View>

      <HorariosModal
        data={data}
        horarios={horarios}
        visible={horariosModal}
        onClose={handleCloseHorarios}
      />

      <AddHorarioModal
        visible={addHorarioModal}
        onClose={() => setAddHorarioModal(false)}
        onSubmit={handleCreateAvailability}
        id={data.classroomId}
      />
    </View>
  );
}
