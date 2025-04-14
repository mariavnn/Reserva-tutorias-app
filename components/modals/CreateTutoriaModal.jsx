import { View, Text, Modal } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import useCreateTutoriaStore from '../../store/useCreateTutoriaStore';

export default function CreateTutoriaModal({ visible, onClose, data }) {
    const { tutoriaData } = useCreateTutoriaStore();
  return (
    <Modal isVisible={visible} backdropOpacity={0.5}>
        <View className="bg-white rounded-2xl p-6 items-center">
        <Feather name="check-circle" size={32} color="black" />

        <Text className="text-xl font-bold text-green-600 mt-3">
            ¡Tutoría Creada con Éxito!
        </Text>
        <Text className="text-gray-600 text-center mt-1">
            Tu tutoría ha sido registrada correctamente
        </Text>

        <View className="bg-green-100 rounded-md px-4 py-2 mt-4 mb-2">
            <Text className="text-green-700 font-medium text-center">
            {tutoriaData?.materia}
            </Text>
        </View>

        <View className="w-full px-2 mt-2 mb-4 space-y-1">
            <Text className="text-gray-700">Fecha: {tutoriaData?.fecha}</Text>
            <Text className="text-gray-700"> Horario: {`${tutoriaData?.horaInicio || "–"} - ${tutoriaData?.horaFin || "–"}`}</Text>
            <Text className="text-gray-700">Estudiantes: {tutoriaData?.cantidadEstudiantes || "0"}</Text>
            <Text className="text-gray-700">Ubicación: {tutoriaData?.ubicacion}</Text>
        </View>

        <Pressable
            onPress={onClose}
            className="bg-blue-600 px-6 py-2 rounded-md"
        >
            <Text className="text-white font-medium">Ver Mis Tutorías</Text>
        </Pressable>
        </View>
    </Modal>
  )
}