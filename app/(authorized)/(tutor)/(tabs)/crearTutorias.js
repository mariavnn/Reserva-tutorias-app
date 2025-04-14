import { View, Text, KeyboardAvoidingView, ScrollViewBase, ScrollView } from 'react-native'
import React from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import SizedBox from '../../../../components/SizedBox'
import InputField from '../../../../components/InputField'
import { Platform } from 'react-native'
import GeneralButton from '../../../../components/GeneralButton'
import DropdownInput from '../../../../components/DropdownInput'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import Feather from '@expo/vector-icons/Feather';
import InputDate from '../../../../components/InputDate'
import { Formik } from 'formik';
import * as yup from 'yup';
import InputHour from '../../../../components/InputHour'
import useCreateTutoriaStore from '../../../../store/useCreateTutoriaStore'
import { useState } from 'react'
import ConfirmRegisterModal from '../../../../components/modals/ConfirmRegisterModal'
import CreateTutoriaModal from '../../../../components/modals/createTutoriaModal'


const salones = [
  { label: 'ZL-102', value: '1' },
  { label: 'GM-208', value: '2' },
  { label: 'Sala de Profesore', value: '3' },
  { label: 'CICOM-104', value: '4' },
]

const crearTutoriaSchema = yup.object().shape({
  materia: yup.string().required("El campo materia es requerido"),
  cantidadEstudiantes: yup.number()
    .positive("La cantidad de estudiantes debe ser un número positivo")
    .integer("La cantidad de estudiantes debe ser un número entero")
    .required("La cantidad de estudiantes es requerida"),
  fecha: yup.date()
    .required("La fecha es requerida"),
  horaInicio: yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, "Hora de inicio inválida")
    .required("La hora de inicio es requerida"),
  horaFin: yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, "Hora de fin inválida")
    .required("La hora de fin es requerida"),
  ubicacion: yup.string().required("La ubicación es requerida"),
  });

export default function CrearTutoriasTutor() {
  const { setTutoriaData } = useCreateTutoriaStore();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Screen>
        
        <View className="w-full">
          <GeneralTitle
            label={"Registrar Nueva Tutoria"}
            type='primary'
            className='!text-blue-500 mt-4 !text-2xl'
          />
          <SizedBox height={8}/>
          <Text className="text-gray-500 text-md">Completa los detalles para crear una nueva sesion de tutorias</Text>

          <SizedBox height={24}/>
          <Formik
            initialValues={{
              materia: '',
              cantidadEstudiantes: '',
              fecha: '',
              horaInicio: '',
              horaFin: '',
              ubicacion: ''
            }}
            validationSchema={crearTutoriaSchema}
            onSubmit={values => {
              // Manejar el envío del formulario aquí
              setTutoriaData(values);
              setModalVisible(true);
              console.log(values);
            }}
          
          >
          {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
            <View className="w-full h-[79%]">
              <ScrollView className="mb-4" contentContainerStyle={{paddingBottom: 10}}>
                <InputField
                  labelIcon={<FontAwesome5 name="book" size={16} color="black" />}
                  label={"Materia"}
                  placeholder={"Nombre de la Materia"}
                  onChangeText={handleChange("materia")}
                  onBlur={handleBlur("materia")}
                  value={values.materia}
                  error={errors.materia}
                  touched={touched.materia}
                />
                <DropdownInput
                  label={"Ubicacion"}
                  labelIcon={<Entypo name="location-pin" size={18} color="black" />}
                  items={salones}
                  selectedValue={values.ubicacion}
                  onValueChange={(item) => setFieldValue('ubicacion', item.label)}
                  error={errors.typeUser}
                  touched={touched.typeUser}
                  disabled={false}
                />
                <SizedBox height={10}/>
                <InputField
                  labelIcon={<FontAwesome5 name="users" size={16} color="black" />}
                  label={"Cantidad de Estudiantes"}
                  type='number'
                  placeholder={"Numero de Estudiantes"}
                  onChangeText={handleChange("cantidadEstudiantes")}
                  onBlur={handleBlur("cantidadEstudiantes")}
                  value={values.cantidadEstudiantes}
                  error={errors.cantidadEstudiantes}
                  touched={touched.cantidadEstudiantes}
                />
            
                <InputDate
                  label={"Fecha"}
                  labelIcon={<Fontisto name="date" size={16} color="black" />}
                  type='date'
                  placeholder='DD/MM/AAAA'
                  onChange={(date) => setFieldValue("fecha", date)}
                  value={values.fecha}
                  error={errors.fecha}
                  touched={touched.fecha}
                />
                 <InputHour
                  label={"Hora Inicio"}
                  labelIcon={<Feather name="clock" size={24} color="black" />}
                  type='time'
                  placeholder='HH:MM'
                  onChange={(hora) => setFieldValue("horaInicio", hora)}
                  value={values.horaInicio}
                  error={errors.horaInicio}
                  touched={touched.horaInicio}
                />
                
                <InputHour
                  label={"Hora Fin"}
                  labelIcon={<Feather name="clock" size={24} color="black" />}
                  type='time'
                  placeholder='HH:MM'
                  onChange={(hora) => setFieldValue("horaFin", hora)}
                  value={values.horaFin}
                  error={errors.horaFin}
                  touched={touched.horaFin}
                />
                
                
              
              </ScrollView>
              <View className="w-full bg-background-light justify-center">
                <GeneralButton
                  title={"Crear tutoria"}
                  onPress={handleSubmit}
                />
              </View>

            </View>
          )}
          </Formik>
          
          
          

        </View>
     
    </Screen>

      {
        modalVisible && (
          <CreateTutoriaModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onConfirm={() => {
              setModalVisible(false);
            }}
          />
        )
      }
    </KeyboardAvoidingView>
   
  )
}