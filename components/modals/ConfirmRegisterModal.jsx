import { View, Text, Modal, ScrollView } from 'react-native'
import React, { useState } from 'react'
import useRegisterStore from '../../store/useRegisterStore';
import GeneralButton from '../GeneralButton';
import { authService, registerService } from '../../service/authService';
import LoadingIndicator from '../LoadingIndicator';

export default function ConfirmRegisterModal({visible, onClose, onConfirm}) {
    const { personalData, academicData } = useRegisterStore();
    const [loading, setLoading] = useState(false);
    
    const subjectIds = academicData.subjects.map(s => s.idMateria);

    const prepareData = () => {
        const  body = {
        roleID: parseInt(personalData.typeUser.value),
        name: personalData.name.trim(),
        lastName: personalData.lastName.trim(),
        user: personalData.userName.trim(),
        email: personalData.email.trim(),
        password: personalData.password,
        semester: academicData.academicLevel ? parseInt(academicData.academicLevel.value) : 1,
        subjects: subjectIds
        };
        return body;
    }

    const handleRegister = async () => {
        try{
            setLoading(true);
            const body = prepareData();
            console.log('body', body);
            const response = await authService.registerUser(body);
            onConfirm();
        }catch(error){
            console.log('Error ', error);
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    return (
        <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="w-11/12 bg-white rounded-xl p-4 max-h-[80%]">
                <ScrollView>
                    <Text className="text-xl font-bold mb-2">Resumen del Registro</Text>
                    <Text><Text className="font-semibold">Tipo de usuario:</Text> {personalData.typeUser.label}</Text>
                    <Text><Text className="font-semibold">Nombre:</Text> {personalData.name} {personalData.lastName}</Text>
                    <Text><Text className="font-semibold">Email:</Text> {personalData.email}</Text>
                    <Text><Text className="font-semibold">Usuario:</Text> {personalData.userName}</Text>
                    <Text><Text className="font-semibold">Carrera:</Text> {academicData.career?.label || ''}</Text>
                    {academicData.academicLevel && (
                        <Text>
                            <Text className="font-semibold">Semestre:</Text> {academicData.academicLevel.label}
                        </Text>
                    )}
                    <Text className="font-semibold mt-2">Materias seleccionadas:</Text>
                    {academicData.subjects?.map((m, i) => (
                        <Text key={i}>• {m.nombreMateria}</Text>
                    ))}
                </ScrollView>

                {loading && (
                    <LoadingIndicator size="large" color="#000" className="mt-4" />
                )}

                <View className="mt-4 flex flex-row  justify-between w-full">
                    <View className='w-2/5 pl-4'>
                        <GeneralButton title="Cancelar" type='secondary' onPress={onClose}/>
                    </View>
                    <View className='pr-4'>
                        <GeneralButton title="Confirmar" type='primary' onPress={handleRegister}/>
                    </View>
                </View>
            </View>
        </View>
        </Modal>
    )
}