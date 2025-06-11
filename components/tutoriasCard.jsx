import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { quitarSegundos, formatDate } from '../constants/Utils';

export default function TutoriasCard({ tutoriaInfo, onDelete, onEdit }) {
  const colorClass = 
  tutoriaInfo.modo === "DISPONIBLE"
  ? "bg-green-600"
  : tutoriaInfo.modo === "EN_CURSO"
  ? "bg-blue-600"
  : "bg-red-500";

  return (
    <View className="w-full flex-row border border-gray-200 rounded-xl bg-white shadow-sm mt-3 overflow-hidden">
      <View className={`${colorClass}  w-2`} />

      <View className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold text-gray-800">
            {tutoriaInfo?.materia?.nombreMateria}
          </Text>
          <View className="flex-row gap-2">
            {tutoriaInfo?.modo == "DISPONIBLE" && (
              <>
                <TouchableOpacity onPress={() => onEdit(tutoriaInfo.id)}>
                  <FontAwesome6 name="pen-to-square" size={18} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(tutoriaInfo.id)}>
                  <FontAwesome6 name="trash-can" size={18} color="red" />
                </TouchableOpacity>
              </>
            )
            }
          </View>
        </View>
        <View className="gap-1">
          <Text className="text-sm text-gray-600">
            <MaterialCommunityIcons name="calendar" size={16} />{' '}
            <Text className="font-medium">Fecha:</Text> {formatDate(tutoriaInfo.fechaHorario)}
          </Text>
          <Text className="text-sm text-gray-600">
            <MaterialCommunityIcons name="clock-outline" size={16} />{' '}
            <Text className="font-medium">Horario:</Text> {quitarSegundos(tutoriaInfo?.horaInicio)} - {quitarSegundos(tutoriaInfo?.horaFin)}
          </Text>
          <Text className="text-sm text-gray-600">
            <MaterialCommunityIcons name="map-marker-outline" size={16} />{' '}
            <Text className="font-medium">Ubicación:</Text> {tutoriaInfo?.salon?.ubicacion} - {tutoriaInfo?.salon?.bloque?.seccion}
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
