import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import AddButton from "../../../../components/AddButton";
import BloqueContainer from "../../../../components/BloqueContainer";
import NuevoBloqueModal from "../../../../components/modals/NuevoBloqueModal";

export default function BloqueTab() {
    const [nuevoBloqueModal, setNuevoBloqueModal] = useState(false);
    const buildings = [
        { id: 1, name: "Bloque A"  },
    { id: 2, name: "Bloque B" },
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
        <Text className="font-semibold text-xl">Gestion de Bloques</Text>
        <AddButton label={"Nueva"} onPress={() => setNuevoBloqueModal(true)} />
      </View>
      <ScrollView className="mb-20">
        {buildings.map((building) => (
          <BloqueContainer
            key={building.id}
            data={building}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ScrollView>
      
      <NuevoBloqueModal
        visible={nuevoBloqueModal}
        onClose={() => setNuevoBloqueModal(false)}
      
      />
    </View>
  );
}
