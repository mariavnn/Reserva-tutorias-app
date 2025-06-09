import { Modal, View, Text, TouchableOpacity } from "react-native";

export default function ConfirmCancelModal({ visible, onClose, onConfirm, data }) {
  if (!data) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className="bg-white w-full rounded-xl p-5">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold">Cancelar Tutoría</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-xl text-gray-500">×</Text>
            </TouchableOpacity>
          </View>

          {/* Mensaje */}
          <Text className="text-sm text-gray-700 mb-4">
            ¿Estás seguro de que deseas cancelar la tutoría?
          </Text>

          {/* Resumen */}
          <View className="bg-gray-100 p-3 rounded-lg mb-4">
            <Text className="font-medium">{data.title}</Text>
            <Text className="text-sm text-gray-600 mt-1">{data.tutor}</Text>
            <Text className="text-sm text-gray-600 mt-1">{data.starTime}, hasta {data.endTime}</Text>
          </View>

          {/* Botones */}
          <View className="flex-row justify-center gap-5">
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-200 px-4 py-2 rounded-lg"
            >
              <Text className="text-sm text-gray-800 font-medium">Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-sm text-white font-medium">Cancelar Tutoría</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
