import { View, Text, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React from "react";
import { Keyboard } from "react-native";
import { dayNames } from "../../constants/DayNames";
import GeneralButton from "../GeneralButton";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function HorariosModal({data, visible, onClose}) {
    const days = Object.keys(dayNames);
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="w-full"
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="bg-white p-6 rounded-lg w-full">
                <Text className="text-lg font-bold text-center mb-1">
                  Horarios - {data?.name}
                </Text>
                <Text className="text-sm text-center text-gray-500 mb-4">
                  Horarios disponibles para este salón
                </Text>

                {days.map((day) => (
                  <View key={day} className="mb-4">
                    <View className="flex-row items-center mb-1">
                      <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                      <Text className="font-semibold text-gray-800">
                        {dayNames[day]}
                      </Text>
                    </View>

                    <View className="ml-5 pl-2 border-l-2 border-blue-100">
                      {data?.schedule?.[day]?.length > 0 ? (
                        data.schedule[day].map((time, index) => (
                          <View key={index} className="py-1 flex-row gap-1 items-center">
                            <MaterialCommunityIcons name="clock-time-eight-outline" size={18} color="#2563eb" />
                            <Text className="text-sm text-gray-800">{time}</Text>
                          </View>
                        ))
                      ) : (
                        <Text className="py-1 text-sm italic text-gray-500">
                          No hay horarios disponibles
                        </Text>
                      )}
                    </View>
                  </View>
                ))}

                <View className="mt-4">
                  <GeneralButton title="Cerrar" onPress={onClose} />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
