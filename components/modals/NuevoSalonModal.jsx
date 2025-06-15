import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Keyboard } from "react-native";
import InputField from "../InputField";
import GeneralButton from "../GeneralButton";
import NewDropdown from "../NewDropdown";
import SizedBox from "../SizedBox";

export default function NuevoSalonModal({ visible, onClose }) {
  const SalonSchema = yup.object().shape({
    nombreSalon: yup.string().required("El nombre es obligatorio"),
    bloque: yup.string().required("El bloque es obligatorio"),
    capacidad: yup.number().required("La capacidad es obligatorio"),
    tipoSalon: yup.string().required("El tipo de salon es obligatorio"),
  });

  const buildings = [
    { value: 1, label: "Bloque A" },
    { value: 2, label: "Bloque B" },
  ];

  const typeClassroom = [
    { value: 1, label: "Aula" },
    { value: 2, label: "Laboratorio" },
  ];

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
                    bloque: "",
                    capacidad: 0,
                    tipoSalon: "",
                  }}
                  validationSchema={SalonSchema}
                  onSubmit={(values, { resetForm }) => {
                    //onSubmit(values);
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
                        label="Nombre del Salon"
                        value={values.nombreSalon}
                        onChangeText={handleChange("nombreSalon")}
                        onBlur={handleBlur("nombreSalon")}
                        error={errors.nombreSalon}
                        touched={touched.nombreSalon}
                      />

                      <NewDropdown
                        label="Bloque"
                        value={values.bloque}
                        onValueChange={(value) => {
                          setFieldValue("bloque", value);
                          console.log(value);
                        }}
                        options={buildings}
                        error={
                          errors.bloque && touched.bloque ? errors.bloque : null
                        }
                        placeholder="Selecciona un Bloque"
                      />
                      <SizedBox height={8} />
                      <InputField
                        type="number"
                        label="Capacidad"
                        value={values.capacidad}
                        onChangeText={handleChange("capacidad")}
                        onBlur={handleBlur("capacidad")}
                        error={errors.capacidad}
                        touched={touched.capacidad}
                      />

                      <NewDropdown
                        label="Tipo de Salon"
                        value={values.tipoSalon}
                        onValueChange={(value) => {
                          setFieldValue("tipoSalon", value);
                          console.log(value);
                        }}
                        options={typeClassroom}
                        error={
                          errors.tipoSalon && touched.tipoSalon
                            ? errors.tipoSalon
                            : null
                        }
                        placeholder="Selecciona un Tipo de Salon"
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
                          <GeneralButton title="Guardar" />
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
