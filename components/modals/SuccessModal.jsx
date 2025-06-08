// SuccessModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

export default function SuccessModal({ visible, onClose, message }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/40 px-5">
        <View className="bg-white p-6 rounded-xl w-full max-w-md">
          <Text className="text-lg font-semibold text-center mb-4 text-green-600">Éxito</Text>
          <Text className="text-center text-gray-700 mb-6">{message}</Text>
          <TouchableOpacity onPress={onClose} className="px-6 py-2 bg-green-500 rounded-md self-center">
            <Text className="text-white">Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
