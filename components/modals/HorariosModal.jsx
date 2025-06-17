import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { dayNames } from "../../constants/DayNames";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function HorariosModal({ data, horarios, visible, onClose }) {
  const days = Object.keys(dayNames);

  const handleClose = () => {
    onClose();
  };

  const getHorariosPorDia = (day) => {
    const dayMap = {
      monday: "LUNES",
      tuesday: "MARTES", 
      wednesday: "MIERCOLES",
      thursday: "JUEVES",
      friday: "VIERNES",
      saturday: "SABADO",
    };

    const dayInUpperCase = dayMap[day];
    return horarios.filter((item) => item.dayOfWeek === dayInUpperCase);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="bg-white p-6 rounded-lg w-full max-h-[80%]">
              <Text className="text-lg font-bold text-center mb-1">
                Horarios - {(data?.section || '').toUpperCase()} {data?.location || ''}
              </Text>
              <Text className="text-sm text-center text-gray-500 mb-4">
                Horarios disponibles para este salón
              </Text>

              <ScrollView 
                className="max-h-[80%]" 
                showsVerticalScrollIndicator={false}
              >
                {days.map((day) => {
                  const horariosDelDia = getHorariosPorDia(day);

                  return (
                    <View key={day} className="mb-4">
                      <View className="flex-row items-center mb-1">
                        <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                        <Text className="font-semibold text-gray-800">
                          {dayNames[day]}
                        </Text>
                      </View>

                      <View className="ml-5 pl-2 border-l-2 border-blue-100">
                        {horariosDelDia.length > 0 ? (
                          horariosDelDia.map((horario, index) => (
                            <View
                              key={index}
                              className="py-1 flex-row gap-1 items-center"
                            >
                              <MaterialCommunityIcons
                                name="clock-time-eight-outline"
                                size={18}
                                color="#2563eb"
                              />
                              <Text className="text-sm text-gray-800">
                                {horario.startTime.slice(0, 5)} -{" "}
                                {horario.endTime.slice(0, 5)}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text className="py-1 text-sm italic text-gray-500">
                            No hay horarios disponibles
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>

              <TouchableOpacity 
                onPress={handleClose}
                className="bg-blue-500 py-3 px-6 rounded-lg mt-4"
              >
                <Text className="text-white text-center font-semibold">
                  Cerrar
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}