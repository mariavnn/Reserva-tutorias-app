import { View, Text, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import React from "react";
import { Formik } from "formik";
import * as yup from 'yup';
import InputField from "../InputField";
import GeneralButton from "../GeneralButton";
import { Keyboard } from "react-native";

export default function NuevaCarreraModal({visible, onClose, onSubmit}) {
  const CarreraSchema = yup.object().shape({
    nombreCarrera: yup.string().required("El nombre es obligatorio"),
    codigo: yup.string().required("El código es obligatorio"),
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
                  Agregar Carrera
                </Text>

                <Formik
                  initialValues={{ nombreCarrera: '', codigo: '' }}
                  validationSchema={CarreraSchema}
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
                        label="Nombre de la carrera"
                        value={values.nombreCarrera}
                        onChangeText={handleChange('nombreCarrera')}
                        onBlur={handleBlur('nombreCarrera')}
                        error={errors.nombreCarrera}
                        touched={touched.nombreCarrera}
                      />

                      <InputField
                        label="Código de la carrera"
                        value={values.codigo}
                        onChangeText={handleChange('codigo')}
                        onBlur={handleBlur('codigo')}
                        error={errors.codigo}
                        touched={touched.codigo}
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
                            onPress={handleSubmit}
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
  );
}
