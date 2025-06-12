import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import AddButton from "../../../../components/AddButton";
import CareerContainer from "../../../../components/CareerContainer";
import NuevaMateriaModal from "../../../../components/modals/NuevaMateriaModal";

export default function SubjectTab() {
  const subjects = [
    {
      id: 1,
      name: "Programación I",
      code: "PROG1",
      career: "Ingeniería de Sistemas",
      credits: 4,
    },
    {
      id: 2,
      name: "Cálculo I",
      code: "CALC1",
      career: "Ingeniería de Sistemas",
      credits: 3,
    },
    {
      id: 3,
      name: "Estadística",
      code: "EST1",
      career: "Ingeniería Industrial",
      credits: 3,
    },
     {
      id: 4,
      name: "Estadística",
      code: "EST1",
      career: "Ingeniería Industrial",
      credits: 3,
    },
       {
      id: 5,
      name: "Estadística",
      code: "EST1",
      career: "Ingeniería Industrial",
      credits: 3,
    },
  ];
  const [addSubjectModal, setAddSubjectModal] = useState(false);

  const onEdit = () => {
    console.log("EDITAR CAREER");
  };

  const onDelete = () => {
    console.log("DELETE CAREER");
  };

  return (
    <View className="flex-1">
      <View className="mt-10 mb-4 flex flex-row justify-between px-2 items-center">
        <Text className="font-semibold text-xl">Gestion de Materias</Text>
        <AddButton label={"Nueva"} onPress={() => setAddSubjectModal(true)} />
      </View>
      <ScrollView className='mb-20'>
        {subjects.map((subject) => (
          <CareerContainer
            type={"materia"}
            key={subject.id}
            data={subject}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ScrollView>

      <NuevaMateriaModal
        visible={addSubjectModal}
        onClose={() => setAddSubjectModal(false)}
      />
    </View>
  );
}
