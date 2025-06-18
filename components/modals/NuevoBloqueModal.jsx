import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import InputField from "../InputField";
import GeneralButton from "../GeneralButton";

export default function NuevoBloqueModal({ visible, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const BloqueSchema = yup.object().shape({
    nombreBloque: yup.string().required("El nombre es obligatorio"),
    seccion: yup.string().required("La seccion es requerida"),
  });

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

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="w-full"
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="bg-white p-6 rounded-lg w-full">
                <Text className="text-lg font-bold mb-4 text-center">
                  Agregar Bloque
                </Text>

                <Formik
                  initialValues={{ nombreBloque: "", seccion: "", }}
                  validationSchema={BloqueSchema}
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
                    <>
                      <InputField
                        label="Nombre del Bloque"
                        value={values.nombreBloque}
                        onChangeText={handleChange("nombreBloque")}
                        onBlur={handleBlur("nombreBloque")}
                        error={errors.nombreBloque}
                        touched={touched.nombreBloque}
                      />
                      <InputField
                        label="Seccion del bloque"
                        value={values.seccion}
                        onChangeText={handleChange("seccion")}
                        onBlur={handleBlur("seccion")}
                        error={errors.seccion}
                        touched={touched.seccion}
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
                            title={isSubmitting ? "Guardando..." : "Guardar"} 
                            onPress={handleSubmit}
                            disabled={isSubmitting}
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
