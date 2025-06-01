import { View, Text, Modal, ScrollView } from 'react-native'
import React from 'react'
import useRegisterStore from '../../store/useRegisterStore';
import GeneralButton from '../GeneralButton';

export default function ConfirmRegisterModal({visible, onClose, onConfirm}) {
    const { personalData, academicData } = useRegisterStore();

    


    return (
        <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="w-11/12 bg-white rounded-xl p-4 max-h-[80%]">
                <ScrollView>
                    <Text className="text-xl font-bold mb-2">Resumen del Registro</Text>
                    <Text><Text className="font-semibold">Tipo de usuario:</Text> {personalData.typeUser}</Text>
                    <Text><Text className="font-semibold">Nombre:</Text> {personalData.name} {personalData.lastName}</Text>
                    <Text><Text className="font-semibold">Usuario:</Text> {personalData.userName}</Text>
                    <Text><Text className="font-semibold">Carrera:</Text> {academicData.career.label}</Text>
                    <Text><Text className="font-semibold">Semestre:</Text> {academicData.academicLevel.label}</Text>
                    <Text className="font-semibold mt-2">Materias seleccionadas:</Text>
                    {academicData.subjects?.map((m, i) => (
                    <Text key={i}>• {m}</Text>
                    ))}
                </ScrollView>

                <View className="mt-4 flex flex-row  justify-between w-full">
                    <View className='w-2/5 pl-4'>
                        <GeneralButton title="Cancelar" type='secondary' onPress={onClose}/>
                    </View>
                    <View className='pr-4'>
                        <GeneralButton title="Confirmar" type='primary' onPress={onConfirm}/>
                    </View>
                </View>
            </View>
        </View>
        </Modal>
    )
}