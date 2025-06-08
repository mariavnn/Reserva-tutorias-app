import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TutoriasCard({ tutoriaInfo, onDelete, onEdit }) {
  return (
    <View className="w-full flex-row border border-gray-200 rounded-xl bg-white shadow-sm mb-6 overflow-hidden">
      <View className="bg-blue-600 w-2" />

      <View className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold text-gray-800">
            {tutoriaInfo.nombreMateria}
          </Text>
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={() => onEdit(tutoriaInfo.id)}>
              <MaterialCommunityIcons name="application-edit-outline" size={22} color="#2563eb" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(tutoriaInfo.id)}>
              <MaterialCommunityIcons name="trash-can-outline" size={22} color="red" />
            </TouchableOpacity>
          </View>
        </View>


        <View className="gap-1">
          <Text className="text-sm text-gray-600">
            <MaterialCommunityIcons name="calendar" size={16} />{' '}
            <Text className="font-medium">Fecha:</Text> {tutoriaInfo.fecha}
          </Text>
          <Text className="text-sm text-gray-600">
            <MaterialCommunityIcons name="clock-outline" size={16} />{' '}
            <Text className="font-medium">Horario:</Text> {tutoriaInfo.horario}
          </Text>
          <Text className="text-sm text-gray-600">
            <MaterialCommunityIcons name="map-marker-outline" size={16} />{' '}
            <Text className="font-medium">Ubicación:</Text> {tutoriaInfo.ubicacion}
          </Text>
          <Text className="text-sm text-gray-600">
            <MaterialCommunityIcons name="book-open-outline" size={16} />{' '}
            <Text className="font-medium">Modo:</Text> {tutoriaInfo.modo}
          </Text>
          <Text className="text-sm text-gray-600">
            <MaterialCommunityIcons name="book-outline" size={16} />{' '}
            <Text className="font-medium">Descripción:</Text> {tutoriaInfo.descripcion}
          </Text>
        </View>
      </View>
    </View>
  );
}
