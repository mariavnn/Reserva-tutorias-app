import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import AddButton from "../../../../components/AddButton";
import SalonContainer from "../../../../components/SalonContainer";

export default function SalonTab() {
  const salones =[
    {
      id: 1,
      name: "A-101",
      building: "Bloque A",
      capacity: 30,
      type: "Aula",
      schedule: {
        monday: ["08:00-10:00", "14:00-16:00"],
        tuesday: ["10:00-12:00"],
        wednesday: ["08:00-10:00", "14:00-16:00"],
        thursday: ["10:00-12:00"],
        friday: ["08:00-10:00"],
      },
    },
    {
      id: 2,
      name: "B-201",
      building: "Bloque B",
      capacity: 25,
      type: "Laboratorio",
      schedule: {
        monday: ["14:00-16:00"],
        tuesday: ["08:00-10:00", "14:00-16:00"],
        wednesday: ["10:00-12:00"],
        thursday: ["08:00-10:00", "14:00-16:00"],
        friday: ["10:00-12:00"],
        saturday:["9:00-11:00"]
      },
    },
  ]
  

  const onEdit = () => {
    console.log("EDITAR CAREER");
  };

  const onDelete = () => {
    console.log("DELETE CAREER");
  };

  return (
    <View className="flex-1">
      <View className="mt-10 mb-4 flex flex-row justify-between px-2 items-center">
        <Text className="font-semibold text-xl">Gestion de Salones</Text>
        <AddButton label={"Nueva"} onPress={() => setNuevoBloqueModal(true)} />
      </View>
      <ScrollView>
        {salones.map((salon) =>(
          <SalonContainer
            key={salon.id}
            data={salon}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )

        )}
      </ScrollView>
    </View>
  );
}
