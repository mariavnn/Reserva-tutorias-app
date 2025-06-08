// ConfirmModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

export default function ConfirmModal2({ visible, onClose, onConfirm, message }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/40 px-5">
        <View className="bg-white p-6 rounded-xl w-full max-w-md">
          <Text className="text-lg font-semibold text-center mb-4">Confirmación</Text>
          <Text className="text-center text-gray-700 mb-6">{message}</Text>
          <View className="flex-row gap-5 justify-center">
            <TouchableOpacity onPress={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
              <Text className="text-gray-800">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} className="px-4 py-2 bg-red-500 rounded-md">
              <Text className="text-white">Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
} 