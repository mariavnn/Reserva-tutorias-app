import { View, Text, Modal } from 'react-native'
import React, { useState } from 'react'
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useCreateTutoriaStore from '../../store/useCreateTutoriaStore';
import GeneralButton from '../GeneralButton';

export default function CreateTutoriaModal({ visible, onCancel, onClose, onConfirm }) {
  const { tutoriaData } = useCreateTutoriaStore ();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm(); // Llama a la función de confirmación del padre
      setIsConfirmed(true);
    } catch (error) {
      console.error('Error al confirmar:', error);
      setIsConfirmed(false);
      onCancel(); // Cierra el modal si hay error
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="w-11/12 bg-white rounded-xl p-4 max-h-[80%]">
          {!isConfirmed ? (
            // Vista de Confirmación
            <View className="space-y-4">
              <View className="justify-center items-center my-2">
                <MaterialIcons name="help-outline" size={60} color={"#3b82f6"} />
                <Text className="text-xl font-bold text-blue-600 mt-3">¿Confirmar Tutoría?</Text>
                <Text className="text-gray-600 text-center mt-1">Revisa los detalles antes de confirmar</Text>
              </View>

              <View className="border border-gray-300 rounded-md p-4">
                <View className="w-full p-3 bg-blue-100 rounded-md mb-3">
                  <Text className="text-blue-700 text-center font-medium">
                    {tutoriaData?.materia || 'Materia no especificada'}
                  </Text>
                </View>

                <View className="space-y-2">
                  <Text className="text-gray-700">
                    <Text className="font-semibold">Fecha:</Text> {tutoriaData?.fecha || 'No especificada'}
                  </Text>
                  {tutoriaData?.modalidad === 'VIRTUAL' ? (
                    <>
                      <Text className="text-gray-700">
                        <Text className="font-semibold">Hora inicio:</Text> {tutoriaData?.horaInicio || '--:--'}
                      </Text>
                      <Text className="text-gray-700">
                        <Text className="font-semibold">Hora fin:</Text> {tutoriaData?.horaFin || '--:--'}
                      </Text>
                      <Text className="text-gray-700">
                        <Text className="font-semibold">Modalidad:</Text> Virtual
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text className="text-gray-700">
                        <Text className="font-semibold">Horario:</Text> {tutoriaData?.disponibilidad || '--:--'}
                      </Text>
                      <Text className="text-gray-700">
                        <Text className="font-semibold">Salón:</Text> {tutoriaData?.salon || 'No especificado'}
                      </Text>
                      <Text className="text-gray-700">
                        <Text className="font-semibold">Bloque:</Text> {tutoriaData?.bloque || 'No especificado'}
                      </Text>
                    </>
                  )}
                  <Text className="text-gray-700">
                    <Text className="font-semibold">Descripción:</Text> {tutoriaData?.descripcion || 'No especificada'}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-center gap-3">
                <View className="flex-auto">
                  <GeneralButton
                    title="Cancelar"
                    type="secondary"
                    onPress={() => onCancel()}
                    disabled={isLoading}
                  />
                </View>
                <View className="flex-auto">
                  <GeneralButton
                    title={isLoading ? "Enviando..." : "Confirmar"}
                    type="primary"
                    onPress={handleConfirm}
                    disabled={isLoading}
                  />
                </View>
              </View>
            </View>
          ) : (
            // Vista de Éxito
            <View className="space-y-4">
              <View className="justify-center items-center my-2">
                <Feather name="check-circle" size={60} color={"green"} />
                <Text className="text-xl font-bold text-green-700 mt-3">¡Tutoría Creada con Éxito!</Text>
                <Text className="text-gray-600 text-center mt-1">Tu tutoría ha sido registrada correctamente</Text>
              </View>

              <View className="border border-gray-300 rounded-md p-4">
                <View className="w-full p-3 bg-green-100 rounded-md mb-3">
                  <Text className="text-green-700 text-center font-medium">
                    {tutoriaData?.materia || 'Materia no especificada'}
                  </Text>
                </View>

                <View className="space-y-2 mb-3">
                  <Text className="text-gray-700">
                    <Text className="font-semibold">Fecha:</Text> {tutoriaData?.fecha || 'No especificada'}
                  </Text>
                  {tutoriaData?.modalidad === 'VIRTUAL' ? (
                    <Text className="text-gray-700">
                      <Text className="font-semibold">Horario:</Text> {tutoriaData?.horaInicio || '--:--'} - {tutoriaData?.horaFin || '--:--'}
                    </Text>
                  ) : (
                    <Text className="text-gray-700">
                      <Text className="font-semibold">Horario:</Text> {tutoriaData?.disponibilidad || '--:--'}
                    </Text>
                  )}
                  <Text className="text-gray-700">
                    <Text className="font-semibold">Modalidad:</Text> {tutoriaData?.modalidad === 'VIRTUAL' ? 'Virtual' : 'Presencial'}
                  </Text>
                </View>

                <GeneralButton
                  title="Ver Mis Tutorías"
                  type="primary"
                  onPress={handleClose}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}
