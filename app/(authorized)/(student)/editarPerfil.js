import { View, Text } from 'react-native'
import React from 'react'
import { Screen } from '../../../components/Screen'
import { TouchableOpacity } from 'react-native'
import GeneralTitle from '../../../components/GeneralTitle'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { useRouter } from 'expo-router'
import { ScrollView } from 'react-native'
import InputField from '../../../components/InputField'
import GeneralButton from '../../../components/GeneralButton'


export default function EditarPerfil() {
  const router = useRouter();  
  return (
    <Screen>
        <View className='w-full px-4 mb-4'>
            <View className="w-full flex-row items-center mt-2">
                <TouchableOpacity onPress={() => router.back()}>
                    <View className="p-2.5 rounded-full bg-blue-500 justify-center items-center mr-2">
                        <FontAwesome6 name="arrow-left" size={16} color="white" />
                    </View>
                </TouchableOpacity>
                <GeneralTitle
                    label={"Editar Perfil"}
                    type='primary'
                    className='!text-blue-500 ml-3'
                />
            </View>
        </View>
        <View className="flex-1 w-full ">
            <ScrollView>
                <View className="w-full bg-gray-200 p-4 rounded-xl mb-6">
                    <Text className="text-black text-lg font-bold mb-3">Informacion Personal</Text>
                    <InputField
                        label={"Nombre"}
                        placeholder={"Nombre"}  
                    />
                    <InputField
                        label={"Apellido"}
                        placeholder={"Apellido"}
                    />
                    <InputField
                        label={"Correo Electronico"}
                        placeholder={"Correo Electronico"}
                    />
                    <InputField
                        label={"Usuario"}
                        placeholder={"Usuario"}
                    />
                </View>
                 <View className="w-full bg-gray-200 p-4 rounded-xl">
                    <Text className="text-black text-lg font-bold mb-3">Informacion Academica</Text>
                    <InputField
                        label={"Nombre"}
                        placeholder={"Nombre"}  
                    />
                    <InputField
                        label={"Apellido"}
                        placeholder={"Apellido"}
                    />
                    <InputField
                        label={"Correo Electronico"}
                        placeholder={"Correo Electronico"}
                    />
                    <InputField
                        label={"Usuario"}
                        placeholder={"Usuario"}
                    />
                </View>
            </ScrollView>
            <GeneralButton
                title={"Guardar cambios"}
            />
            
        </View>
    </Screen>
  )
}