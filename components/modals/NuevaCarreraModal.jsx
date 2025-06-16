import { View, Text, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from "react-native";
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as yup from 'yup';
import InputField from "../InputField";
import GeneralButton from "../GeneralButton";

export default function NuevaCarreraModal({ visible, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CarreraSchema = yup.object().shape({
    nombreCarrera: yup
      .string()
      .required("El nombre es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres"),
    codigo: yup
      .string()
      .required("El código es obligatorio")
      .matches(/^\d+$/, "El código debe contener solo números")
      .min(1, "El código debe tener al menos 1 dígito")
      .max(10, "El código no puede exceder 10 dígitos"),
  });

  // Resetear el estado cuando el modal se cierra
  useEffect(() => {
    if (!visible) {
      setIsSubmitting(false);
    }
  }, [visible]);

  const handleSubmit = async (values, { resetForm }) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      resetForm();
    } catch (error) {
      console.error("❌ Error en el submit del modal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent
      onRequestClose={handleClose}
    >
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
                  Agregar Nueva Carrera
                </Text>

                <Formik
                  initialValues={{ nombreCarrera: '', codigo: '' }}
                  validationSchema={CarreraSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize={true}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    isValid,
                  }) => (
                    <>
                      <InputField
                        label="Nombre de la carrera"
                        placeholder="Ej: Ingeniería de Sistemas"
                        value={values.nombreCarrera}
                        onChangeText={handleChange('nombreCarrera')}
                        onBlur={handleBlur('nombreCarrera')}
                        error={errors.nombreCarrera}
                        touched={touched.nombreCarrera}
                        editable={!isSubmitting}
                      />

                      <InputField
                        label="Código de la carrera"
                        placeholder="Ej: 1234"
                        value={values.codigo}
                        onChangeText={handleChange('codigo')}
                        onBlur={handleBlur('codigo')}
                        error={errors.codigo}
                        touched={touched.codigo}
                        keyboardType="numeric"
                        editable={!isSubmitting}
                      />

                      <View className="mt-6 flex-row justify-between">
                        <View className="w-2/5">
                          <GeneralButton
                            title="Cancelar"
                            type="secondary"
                            onPress={handleClose}
                            disabled={isSubmitting}
                          />
                        </View>
                        <View className="w-2/5">
                          <GeneralButton
                            title={isSubmitting ? "Guardando..." : "Guardar"}
                            onPress={handleSubmit}
                            disabled={isSubmitting || !isValid}
                            loading={isSubmitting}
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