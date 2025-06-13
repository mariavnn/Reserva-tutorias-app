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
import DropdownInput from "../DropdownInput";
import InputField from "../InputField";
import GeneralButton from "../GeneralButton";
import { Dropdown } from "react-native-element-dropdown";
import SizedBox from "../SizedBox";

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
          return value <= "17:00"; // correcto con nuevos valores
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
    { label: "Lunes", value: "1" },
    { label: "Martes", value: "2" },
    { label: "Miercoles", value: "3" },
    { label: "Jueves", value: "4" },
    { label: "Viernes", value: "5" },
    { label: "Sabado", value: "6" },
  ];

  const hours = [
    { label: "09:00", value: "09:00" },
    { label: "10:00", value: "10:00" },
    { label: "11:00", value: "11:00" },
    { label: "12:00", value: "12:00" },
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
                    onSubmit(values);
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
                      <DropdownInput
                        label="Dia"
                        selectedValue={values.day}
                        onValueChange={(option) =>
                          setFieldValue("day", option.value)
                        }
                        items={weekDays}
                        error={errors.day}
                        touched={touched.day}
                        disabled={false}
                      />
                      <SizedBox height={15} />

                      <DropdownInput
                        label="Hora Inicio"
                        selectedValue={values.startHour}
                        onValueChange={(option) =>
                          setFieldValue("startHour", option.value)
                        }
                        items={hours}
                        error={errors.startHour}
                        touched={touched.startHour}
                        disabled={false}
                      />
                      <SizedBox height={15} />
                      <DropdownInput
                        label="Hora Fin"
                        selectedValue={values.endHour}
                        onValueChange={(option) =>
                          setFieldValue("endHour", option.value)
                        }
                        items={hours}
                        error={errors.endHour}
                        touched={touched.endHour}
                        disabled={false}
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
