import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import CareerContainer from "../../../../components/CareerContainer";
import GeneralTitle from "../../../../components/GeneralTitle";
import AddButton from "../../../../components/AddButton";
import NuevaCarreraModal from "../../../../components/modals/NuevaCarreraModal";

export default function CareerTab() {
  const [addCareerModal, setAddCareerModal] = useState(false);
  const careers = [
    { id: 1, name: "Ingeniería de Sistemas", code: "IS" },
    { id: 2, name: "Ingeniería Industrial", code: "II" },
  ];

  //AQUI SE HACE LA PETICION A LA API GET, PUT, DELETE

  const onEdit = () => {
    console.log("EDITAR CAREER");
  };

  const onDelete = () => {
    console.log("DELETE CAREER");
  };

  return (
    <View className="flex-1">
      <View className="mt-10 mb-4 flex flex-row justify-between px-2 items-center">
        <Text className="font-semibold text-xl">Gestion de Carreras</Text>
        <AddButton label={"Nueva"} onPress={() => setAddCareerModal(true)} />
      </View>
      <ScrollView className='mb-20'>
        {careers.map((career) => (
          <CareerContainer
            type={"carrera"}
            key={career.id}
            data={career}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ScrollView>

      <NuevaCarreraModal
        visible={addCareerModal}
        onClose={() => setAddCareerModal(false)}
      />
    </View>
  );
}
