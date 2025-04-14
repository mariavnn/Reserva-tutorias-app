import { View, Text, Modal } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function ConfirmReservaModal({ visible, onClose, onConfirm, data}) {
    if (!data) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className="bg-white w-full rounded-xl p-5">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold">Confirmar Participación</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-xl text-gray-500">×</Text>
            </TouchableOpacity>
          </View>

          {/* Subtexto */}
          <Text className="text-sm text-gray-700 mb-4">
            ¿Estás seguro que deseas unirte a esta tutoría?
          </Text>

          {/* Card resumen */}
          <View className="bg-gray-100 p-3 rounded-lg mb-4">
            <Text className="font-medium mb-2">{data.title}</Text>
            <Text className="text-sm text-gray-600 mt-1 mb-">{data.tutor}</Text>
            <View className="flex-row items-center mt-1">
                <FontAwesome6 name="clock" size={18} color="black" />
                <Text className="text-sm text-gray-600 ml-1">
                    Ahora, hasta {data.endTime}
                </Text>
            </View>
          </View>

          {/* Descripción */}
          <Text className="text-xs text-gray-500 mb-4">
            Al unirte, te comprometes a asistir a la sesión. Si no puedes asistir, por favor cancela con anticipación.
          </Text>

          {/* Botones */}
          <View className="flex-row justify-around space-x-3">
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-200 px-4 py-2 rounded-lg"
            >
              <Text className="text-sm text-gray-800 font-medium">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="bg-blue-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-sm text-white font-medium">Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}