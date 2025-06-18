import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from "react-native";
import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Keyboard } from "react-native";
import InputField from "../InputField";
import GeneralButton from "../GeneralButton";

export default function NuevoSalonModal({
  visible,
  onClose,
  selectedBlock,
  onSubmit,
}) {
  const SalonSchema = yup.object().shape({
    nombreSalon: yup.string().required("El nombre es obligatorio"),
    capacidad: yup
      .number()
      .required("La capacidad es obligatorio")
      .min(1, "La capacidad debe ser mayor a 0"),
    tipoSalon: yup.string(),
  });

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
                  Agregar Salon
                </Text>

                <Formik
                  initialValues={{
                    nombreSalon: "",
                    capacidad: "",
                    tipoSalon: "",
                  }}
                  validationSchema={SalonSchema}
                  onSubmit={(values, { resetForm }) => {
                    onSubmit(values);
                    resetForm();
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
                        label="Número del Salon"
                        value={values.nombreSalon}
                        placeholder={"Ej. 105"}
                        onChangeText={handleChange("nombreSalon")}
                        onBlur={handleBlur("nombreSalon")}
                        error={errors.nombreSalon}
                        touched={touched.nombreSalon}
                      />

                      <View className="mb-4">
                        <View className="flex-row gap-2 items-center mb-1">
                          <Text className="text-gray-700 mr-1">Bloque</Text>
                        </View>
                        <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-100">
                          <TextInput
                            style={{ minHeight: 32 }}
                            className="flex-1 text-gray-600"
                            value={selectedBlock?.blockName || ""}
                            editable={false}
                            pointerEvents="none"
                          />
                        </View>
                      </View>

                      <InputField
                        type="number"
                        label="Capacidad"
                        value={values.capacidad}
                         placeholder={"Ej. 30"}
                        onChangeText={handleChange("capacidad")}
                        onBlur={handleBlur("capacidad")}
                        error={errors.capacidad}
                        touched={touched.capacidad}
                        keyboardType="numeric"
                      />

                      <InputField
                        label="Tipo de Salon (Opcional)"
                        value={values.tipoSalon}
                        onChangeText={handleChange("tipoSalon")}
                        onBlur={handleBlur("tipoSalon")}
                        error={errors.tipoSalon}
                        touched={touched.tipoSalon}
                        placeholder="Ej: Aula, Laboratorio, etc."
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
