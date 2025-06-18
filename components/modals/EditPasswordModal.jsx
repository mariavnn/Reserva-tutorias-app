import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import { Formik } from "formik";
import * as Yup from "yup";
import InputField from "../InputField";
import GeneralButton from "../GeneralButton";
import SuccessModal from "./SuccessModal";
import FailedModal from "./FailedModal";
import LoadingIndicator from "../LoadingIndicator";

export default function EditPasswordModal({ visible, onClose, onConfirm }) {
  const { setEditedPassword } = useUserStore();
  const [successVisible, setSuccessVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const PasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Debe tener al menos 6 caracteres")
      .required("Campo requerido"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Las contraseñas no coinciden")
      .required("Campo requerido"),
  });

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const body = {
        password: values.newPassword,
      };
      await onConfirm(body);
      setLoading(false);
      setEditedPassword(values.newPassword);
      setSuccessVisible(true);
      onClose();
    } catch (error) {
      console.error("Error al confirmar:", error);

      let message = "Error desconocido";

      if (error.response?.data) {
        message = error.response.data;
      } else {
        message = "Error desconocido";
      }
      setErrorMessage(message);
      setError(true);
    }finally{
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessVisible(false);
    onClose();
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center bg-black/40 px-4">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="w-full"
            >
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "center",
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View className="bg-white p-6 rounded-lg w-full">
                  <Text className="text-lg font-bold mb-4 text-center">
                    Editar Contraseña
                  </Text>

                  <Formik
                    initialValues={{ newPassword: "", confirmPassword: "" }}
                    validationSchema={PasswordSchema}
                    onSubmit={handleSubmit}
                  >
                    {({
                      handleChange,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      handleBlur,
                    }) => (
                      <>
                        <InputField
                          label="Nueva contraseña"
                          isPassword={true}
                          value={values.newPassword}
                          onChangeText={handleChange("newPassword")}
                          onBlur={handleBlur("newPassword")}
                          error={errors.newPassword}
                          touched={touched.newPassword}
                        />
                        <InputField
                          label="Confirmar contraseña"
                          isPassword={true}
                          value={values.confirmPassword}
                          onChangeText={handleChange("confirmPassword")}
                          onBlur={handleBlur("confirmPassword")}
                          error={errors.confirmPassword}
                          touched={touched.confirmPassword}
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
                              title={loading ? "Cargando..." : "Guardar"}
                              onPress={handleSubmit}
                              disabled={loading}
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
      <SuccessModal
        visible={successVisible}
        onClose={handleSuccessClose}
        message="La contraseña ha sido actualizada correctamente"
      />
      <FailedModal
        visible={error}
        message={errorMessage}
        onClose={() => {
          setError(false);
          setErrorMessage("");
        }}
      />
    </>
  );
}
