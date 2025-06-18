import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React from "react";
import { Keyboard } from "react-native";
import { Platform } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import GeneralButton from "../GeneralButton";
import NewDropdown from "../NewDropdown";
import Feather from '@expo/vector-icons/Feather';

export default function AddHorarioModal({ visible, onClose, onSubmit }) {
  const HorarioSchema = yup.object().shape({
    day: yup.string().required("El día es obligatorio"),
    startHour: yup
      .string()
      .required("La hora de inicio es obligatoria")
      .test(
        "hora-inicio-max",
        "La hora de inicio no puede ser después de las 17:00",
        (value) => {
          if (!value) return false;
          return value <= "17:00";
        }
      ),
    endHour: yup
      .string()
      .required("La hora de fin es obligatoria")
      .test(
        "hora-fin-valida",
        "La hora de fin debe ser 1 o 2 horas después de la hora de inicio",
        function (endValue) {
          const { startHour } = this.parent;
          if (!startHour || !endValue) return false;

          const [startH, startM] = startHour.split(":").map(Number);
          const [endH, endM] = endValue.split(":").map(Number);

          const diff = endH * 60 + endM - (startH * 60 + startM);
          return diff >= 60 && diff <= 120;
        }
      ),
  });

  const weekDays = [
    { label: "Lunes", value: "LUNES" },
    { label: "Martes", value: "MARTES" },
    { label: "Miercoles", value: "MIERCOLES" },
    { label: "Jueves", value: "JUEVES" },
    { label: "Viernes", value: "VIERNES" },
    { label: "Sabado", value: "SABADO" },
  ];

  const hours = [
    { label: "09:00", value: "09:00" },
    { label: "10:00", value: "10:00" },
    { label: "11:00", value: "11:00" },
    { label: "12:00", value: "12:00" },
    { label: "13:00", value: "13:00" },
    { label: "14:00", value: "14:00" },
    { label: "15:00", value: "15:00" },
    { label: "16:00", value: "16:00" },
    { label: "17:00", value: "17:00" },
    { label: "18:00", value: "18:00" },
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
                  Agregar Horario
                </Text>

                <Formik
                  initialValues={{ day: "", startHour: "", endHour: "" }}
                  validationSchema={HorarioSchema}
                  onSubmit={(values, { resetForm }) => {
                    if (onSubmit) {
                      onSubmit(values);
                    }
                    resetForm();
                    onClose();
                  }}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    values,
                    errors,
                    touched,
                  }) => (
                    <>
                      <NewDropdown
                        label="Dia"
                        value={values.day}
                        onValueChange={(option) =>
                          setFieldValue("day", option)
                        }
                        options={weekDays}
                        error={errors.day && touched.day ? errors.day : null}
                        placeholder="Selecciona un día"
                        labelIcon={<Feather name="calendar" size={18} color="black" />}
                      />
                      <NewDropdown
                        label="Hora Inicio"
                        value={values.startHour}
                        onValueChange={(option) =>
                          setFieldValue("startHour", option)
                        }
                        options={hours}
                        error={errors.startHour && touched.startHour ? errors.startHour : null}
                        placeholder="Selecciona hora de inicio"
                        labelIcon={<Feather name="clock" size={18} color="black" />}
                      />
                      <NewDropdown
                        label="Hora Fin"
                        value={values.endHour}
                        onValueChange={(option) =>
                          setFieldValue("endHour", option)
                        }
                        options={hours}
                        error={errors.endHour && touched.endHour ? errors.endHour : null}
                        placeholder="Selecciona hora de fin"
                        labelIcon={<Feather name="clock" size={18} color="black" />}
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
