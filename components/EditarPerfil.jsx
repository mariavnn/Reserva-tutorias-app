import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React from 'react'
import * as yup from 'yup';
import { Formik } from 'formik';
import { useRouter } from 'expo-router';
import { Screen } from './Screen';
import GeneralTitle from './GeneralTitle';
import InputField from './InputField';
import GeneralButton from './GeneralButton';


export default function EditarPerfilComp() {
    const router = useRouter();  

    const validationSchema = yup.object().shape({
        name: yup.string().required('El nombre es obligatorio'),
        lastName: yup.string().required('El apellido es obligatorio'),
        email: yup.string().email('Correo inválido').required('El correo es obligatorio'),
        username: yup.string().required('El usuario es obligatorio'),
        // carrera y semestre los agregas si quieres validarlos también
    });

    const initialValues = {
        name: '',
        lastName: '',
        email: '',
        username: '',
        // carrera: '',
        // semestre: ''
    };

    const handleSubmit = (values) => {
        console.log('Datos enviados:', values);
        // Aquí podrías llamar a tu servicio para actualizar el perfil
    };

    return (
        <Screen>
        <View className="w-full px-4 mb-4">
            <View className="w-full flex-row items-center mt-2">
            <TouchableOpacity onPress={() => router.back()}>
                <View className="p-2.5 rounded-full bg-blue-500 justify-center items-center mr-2">
                <FontAwesome6 name="arrow-left" size={16} color="white" />
                </View>
            </TouchableOpacity>
            <GeneralTitle
                label={"Editar Perfil"}
                type="primary"
                className="!text-blue-500 ml-3"
            />
            </View>
        </View>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            }) => (
            <View className="flex-1 w-full">
                <ScrollView>
                    <View className="w-full bg-gray-200 p-4 rounded-xl mb-6">
                        <Text className="text-black text-lg font-bold mb-3">
                        Información Personal
                        </Text>

                        <InputField
                        label="Nombre"
                        placeholder="Nombre"
                        value={values.name}
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        error={touched.name && errors.name}
                        />

                        <InputField
                        label="Apellido"
                        placeholder="Apellido"
                        value={values.lastName}
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                        error={touched.lastName && errors.lastName}
                        />

                        <InputField
                        label="Correo Electrónico"
                        placeholder="Correo Electrónico"
                        value={values.email}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        error={touched.email && errors.email}
                        />

                        <InputField
                        label="Usuario"
                        placeholder="Usuario"
                        value={values.username}
                        onChangeText={handleChange("username")}
                        onBlur={handleBlur("username")}
                        error={touched.username && errors.username}
                        />
                    </View>

                    <View className="w-full bg-gray-200 p-4 rounded-xl mb-16">
                        <Text className="text-black text-lg font-bold mb-3">
                        Información Académica
                        </Text>
                        {/* Puedes integrar dropdowns también aquí si lo necesitas */}
                    </View>
                </ScrollView>

                <View className="mb-2">
                <GeneralButton title="Guardar cambios" onPress={handleSubmit} />
                </View>
            </View>
            )}
        </Formik>
        </Screen>
    );
}
