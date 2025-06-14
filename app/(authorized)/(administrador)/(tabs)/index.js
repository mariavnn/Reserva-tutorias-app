import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Screen } from "../../../../components/Screen";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import InfoHomeAdmin from "../../../../components/InfoHomeAdmin";

export default function HomeAdmin() {
  const infoAdmin = [
    {
      id: 1,
      room: "A-101",
      block: "Bloque A",
      capacity: 30,
      sessions: [
        {
          id: 1,
          time: "08:00 - 10:00",
          subject: "Cálculo I",
          tutor: "Prof. García",
          room: "A-101",
          students: 8,
        },
        {
          id: 2,
          time: "10:00 - 12:00",
          subject: "Programación I",
          tutor: "Prof. Martínez",
          room: "A-101",
          students: 12,
        },
      ],
    },
    {
      id: 2,
      room: "B-201",
      block: "Bloque B",
      capacity: 25,
      sessions: [
        {
          id: 1,
          time: "16:00 - 18:00",
          subject: "Física I",
          tutor: "Prof. Rodríguez",
          room: "B-201",
          students: 10,
        },
      ],
    },
    {
      id: 3,
      room: "A-203",
      block: "Bloque A",
      capacity: 40,
      sessions: [
        {
          id: 1,
          time: "17:00 - 19:00",
          subject: "Química",
          tutor: "Prof. Hernández",
          room: "A-203",
          students: 5,
        },
      ],
    },
  ];

  return (
    <Screen>
      <View className="bg-blue-500 w-full p-4 rounded-lg">
        <Text className="text-2xl text-white font-semibold">
          Panel de Administrador
        </Text>
        <Text className="text-md text-white mt-2">
          Sistema de Reserva de Tutorias
        </Text>
      </View>
      <View className="mt-3 w-full">
        <Text className="w-full flex text-xl justify-start font-bold text-gray-500">
          Resumen de Hoy
        </Text>
        <View className="flex flex-row justify-between mt-2">
          <View className="flex items-center gap-2 bg-blue-200 p-3 rounded-xl">
            <View className="flex flex-row items-center justify-center gap-1">
              <Ionicons name="people-outline" size={24} color="#2563eb" />
              <Text className="text-gray-700">7</Text>
            </View>
            <Text className="text-gray-700">Tutorias Registradas</Text>
          </View>
          <View className="flex items-center gap-2.5 bg-blue-200 p-3 rounded-xl">
            <View className="flex flex-row items-center justify-center gap-1">
              <MaterialCommunityIcons
                name="office-building-outline"
                size={24}
                color="#2563eb"
              />
              <Text className="text-gray-700">5</Text>
            </View>
            <Text className="text-gray-700">Salones Ocupados</Text>
          </View>
        </View>
        <ScrollView
          className="mt-4"
          contentContainerStyle={{ paddingBottom: 250, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {infoAdmin.map((info) => (
            <InfoHomeAdmin key={info.id} data={info} />
          ))}
        </ScrollView>
      </View>
    </Screen>
  );
}
