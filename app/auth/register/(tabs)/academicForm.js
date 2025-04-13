import { View, Text } from 'react-native'
import React from 'react'
import DropdownInput from '../../../../components/DropdownInput'
import { Formik } from 'formik';
import * as yup from 'yup';
import SizedBox from '../../../../components/SizedBox';
import GeneralButton from '../../../../components/GeneralButton';
import SelectableCard from '../../../../components/SelectableCard';
import { ScrollView } from 'react-native';
import useRegisterStore from '../../../../store/useRegisterStore';
import { useState } from 'react';
import ConfirmRegisterModal from '../../../../components/modals/ConfirmRegisterModal';
import { useRouter } from 'expo-router';
import ConfirmModal from '../../../../components/modals/ConfirmModal';

export default function AcademicForm() {
  const { setAcademicData } = useRegisterStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const router = useRouter()

  const RegisterSchema = yup.object().shape({
      academicLevel: yup.string().required(),
      subjects: yup.array().min(1, 'Selecciona al menos una materia'),
    });

  const semestres = [
    { label: '1er Semestre', value: '1' },
    { label: '2do Semestre', value: '2' },
    { label: '3er Semestre', value: '3' },
    { label: '4to Semestre', value: '4' },
    { label: '5to Semestre', value: '5' },
    { label: '6to Semestre', value: '6' },
    { label: '7mo Semestre', value: '7' },
    { label: '8vo Semestre', value: '8' },
    { label: '9mo Semestre', value: '9' },
    { label: '10mo Semestre', value: '10' }
  ]

  const subjects = [
    "Ingles III",
    "Programacion Orientada a Objetos",
    "Estadistica y Probabilidad",
    "Calculo Integral",
    "Mecanica",
    "Electromagnetismo"
  ];

  return (


    <View>
      <Formik
         initialValues={{
          academicLevel: '', 
          subjects: [],
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          setAcademicData(values);
          console.log('Datos enviados:', values);
          setModalVisible(true);
        }}
      
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
        <View className='w-full'>
          <DropdownInput
            label="Selecciona tu semestre actual"
            selectedValue={values.academicLevel}
            onValueChange={(item) => setFieldValue('academicLevel', item.label)}
            items={semestres}
            error={errors.academicLevel}
            touched={touched.academicLevel}
            disabled={false}
          />

          <SizedBox height={12}/>

          <View className='h-[450px] py-2 pb-16'>
            <ScrollView>
              {
                subjects.map((subject) => (
                  <SelectableCard
                    key={subject}
                    label={subject}
                    value={values.subjects}
                    onChange={(newSubjects) => setFieldValue('subjects', newSubjects)}
                  />
                ))
              }
            </ScrollView>
          </View>
          
          <SizedBox height={12}/>

          <View className="absolute bottom-0 w-full px-4 py-2 bg-background-light">
            <GeneralButton
              title={"Finalizar Registro"}
              onPress={handleSubmit}
            />
          </View>

        </View>
        
        )}
      </Formik>
     
      {
        modalVisible && (
          <ConfirmRegisterModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onConfirm={() => {
              setModalVisible(false);
              setToastVisible(true);
            }}
          />
        )
      }

      {
        toastVisible && (
          <ConfirmModal
            visible={toastVisible}
            onClose={() => {
              setToastVisible(false)
              router.back()
            }}
            message="Registro confirmado con éxito"
          />

        )
      }
    </View>
    
  )
}