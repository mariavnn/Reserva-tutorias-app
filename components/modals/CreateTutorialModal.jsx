import { View, Text, Modal } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import useCreateTutoriaStore from '../../store/useCreateTutoriaStore';
import GeneralButton from '../GeneralButton';

export default function CreateTutoriaModal({ visible, onClose  }) {
    const { tutoriaData } = useCreateTutoriaStore();
  return (
    <Modal isVisible={visible} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="w-11/12 bg-white rounded-xl p-4 max-h-[80%]">
                <View className="w-full justify-center items-center my-6">
                    <Feather name="check-circle" size={60} color={"green"} />
                    <Text className="text-xl font-bold text-green-700 mt-3">¡Tutoría Creada con Éxito!</Text>
                    <Text className="text-gray-600 text-center mt-1">Tu tutoría ha sido registrada correctamente</Text>
                </View>
                
               
                <View className="justify-center items-center border border-gray-300 rounded-md pb-2">
                    <View className="w-full p-6 bg-green-200 rounded-t-md">
                        <Text className="text-green-700 text-center">
                            {tutoriaData?.materia}
                        </Text>
                    </View>
                   

                    <View className="w-full px-4 mt-4 mb-4 space-y-1">
                        <Text className="text-gray-700">Fecha: {tutoriaData?.fecha}</Text>
                        <Text className="text-gray-700">Horario: {`${tutoriaData?.horaInicio || "–"} - ${tutoriaData?.horaFin || "–"}`}</Text>
                        <Text className="text-gray-700">Estudiantes: {tutoriaData?.cantidadEstudiantes || "0"}</Text>
                        <Text className="text-gray-700">Ubicación: {tutoriaData?.ubicacion}</Text>
                    </View> 

                    <View className = " my-2">
                        <GeneralButton
                            title={"Ver Mis Tutorias"}
                            type='primary'
                            className='!text-sm !px-2'
                            onPress={onClose}
                        />
                    </View> 

                </View>
                

                
            </View>
        </View>
    </Modal>
  )
}