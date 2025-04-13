import { View, Text } from 'react-native'
import React from 'react'
import DropdownInput from '../../../../components/DropdownInput'
import { Formik } from 'formik';
import * as yup from 'yup';
import SizedBox from '../../../../components/SizedBox';
import GeneralButton from '../../../../components/GeneralButton';
import SelectableCard from '../../../../components/SelectableCard';
import { ScrollView } from 'react-native';

export default function AcademicForm() {

  const RegisterSchema = yup.object().shape({
      semestre: yup.string().required("El campo es requerido"),
    });

  const semestres = [
    { label: '1er Semestre', value: '1' },
    { label: '2do Semestre', value: '2' },
    { label: '3er Semestre', value: '2' },
    { label: '4to Semestre', value: '2' },
    { label: '5to Semestre', value: '2' },
    { label: '6to Semestre', value: '2' },
    { label: '7mo Semestre', value: '2' },
    { label: '8vo Semestre', value: '2' },
    { label: '9mo Semestre', value: '2' },
    { label: '10mo Semestre', value: '2' }
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
          typeUser: '',
          name: '', 
          lastName: '', 
          userName: '', 
          password: '', 
          confirmPassword: '' 
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          console.log('Datos enviados:', values);
        }}
      
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View className='w-full'>
          <DropdownInput
            label="Selecciona tu semestre actual"
            selectedValue={values.semestre}
            onValueChange={handleChange('semestres')}
            items={semestres}
            error={errors.semestre}
            touched={touched.semestre}
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
     
      
    </View>
  )
}