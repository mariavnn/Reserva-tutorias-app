import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import HorariosModal from "./modals/HorariosModal";
import AddHorarioModal from "./modals/AddHorarioModal";

export default function SalonContainer({ data, onEdit, onDelete }) {
  const [horariosModal, setHorariosModal] = useState(false);
  const [addHorarioModal, setAddHorarioModal] = useState(false);

  return (
    <View className="w-full flex border border-gray-300 mt-3 py-3 rounded-lg ">
      <View className="w-full flex flex-row justify-between">
        <View className="flex flex-row gap-1 items-center ml-1">
          <Ionicons name="location-outline" size={24} color="#2563eb" />
          <Text className="text-md font-semibold">
            {" "}
            Salon: <Text>{data.name}</Text>
          </Text>
        </View>

        <View className="flex flex-row items-center gap-3  mr-2">
          <TouchableOpacity onPress={() => setAddHorarioModal(!addHorarioModal)}>
            <MaterialIcons name="more-time" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onEdit(tutoriaInfo.id)}>
            <FontAwesome6 name="pen-to-square" size={18} color="#2563eb" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(tutoriaInfo.id)}>
            <FontAwesome6 name="trash-can" size={18} color="red" />
          </TouchableOpacity>
        </View>
        
      </View>
      <View className="flex gap-2 px-5 mr-2 ml-4 mt-2">
        <Text className="text-md text-gray-500">{data.building}</Text>
        <View className="flex flex-row items-center mb-3 gap-2">
          <View className="bg-blue-100 rounded-2xl px-2 py-1">
            <Text>{data.type}</Text>
          </View>

          <View className='flex flex-row gap-1'>
            <Ionicons name="people-outline" size={24} color="black" />
            <Text>{data.capacity}</Text>
          </View>

        </View>
        <TouchableOpacity
          onPress={() => setHorariosModal(!horariosModal)}
          className="bg-blue-500 w-1/2 flex flex-row gap-2 items-center rounded-xl px-2 py-2">
          <MaterialIcons name="access-time" size={20} color="white" />
          <Text className="text-white">Ver Horarios</Text>
        </TouchableOpacity>
      </View>
      <HorariosModal
        data={data}
        visible={horariosModal}
        onClose={() => setHorariosModal(false)}
      />
      <AddHorarioModal
        visible={addHorarioModal}
        onClose={() => setAddHorarioModal(false)}
      
      />
    </View>
  );
}
