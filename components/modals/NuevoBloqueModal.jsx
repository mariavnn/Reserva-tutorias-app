import { View, Text, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from 'react-native'
import React from 'react'
import { Formik } from 'formik';
import * as yup from "yup";
import InputField from '../InputField';
import GeneralButton from '../GeneralButton';

export default function NuevoBloqueModal({visible, onClose, onSubmit}) {
   const BloqueSchema = yup.object().shape({
      nombreBloque: yup.string().required("El nombre es obligatorio"),
    });
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center bg-black/40 px-4">
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              className="w-full"
            >
              <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View className="bg-white p-6 rounded-lg w-full">
                  <Text className="text-lg font-bold mb-4 text-center">
                    Agregar Bloque
                  </Text>
  
                  <Formik
                    initialValues={{ nombreBloque: ''}}
                    validationSchema={BloqueSchema}
                    onSubmit={(values, { resetForm }) => {
                      onSubmit(values);
                      resetForm();
                      onClose();
                    }}
                  >
                    {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                    }) => (
                      <>
                        <InputField
                          label="Nombre del Bloque"
                          value={values.nombreBloque}
                          onChangeText={handleChange('nombreBloque')}
                          onBlur={handleBlur('nombreBloque')}
                          error={errors.nombreBloque}
                          touched={touched.nombreBloque}
                        />
  
                        <View className="mt-4 flex-row justify-between">
                          <View className="w-2/5">
                            <GeneralButton
                              title="Cancelar"
                              type="secondary"
                              onPress={onClose}
                            />
                          </View>
                          <View className="w-2/5">
                            <GeneralButton
                              title="Guardar"
                              onPress={onSubmit}
                            />
                          </View>
                        </View>
                      </>
                    )}
                  </Formik>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
}