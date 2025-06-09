import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function FailedModal({visible, message, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/40 px-5">
        <View className="bg-white p-6 rounded-xl w-full max-w-md items-center">
          <MaterialIcons name="error-outline" size={30} color="red" />
          <Text className="text-lg font-semibold text-center mb-4 text-red-600">
            Error
          </Text>
          <Text className="text-center text-gray-700 mb-6">{message}</Text>
          <TouchableOpacity
            onPress={onClose}
            className="px-6 py-2 bg-red-500 rounded-md self-center"
          >
            <Text className="text-white">Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
