import { View, Text, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import { Formik } from "formik";
import * as Yup from "yup";
import InputField from "../InputField";
import GeneralButton from "../GeneralButton";
import SuccessModal from "./SuccessModal";

export default function EditPasswordModal({ visible, onClose }) {
  const { setEditedPassword } = useUserStore();
  const [successVisible, setSuccessVisible] = useState(false);

  const PasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Debe tener al menos 6 caracteres")
      .required("Campo requerido"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Las contraseñas no coinciden")
      .required("Campo requerido"),
  });

  const handleSubmit = (values) => {
    setEditedPassword(values.newPassword);
    setSuccessVisible(true);
    onClose();
  };

  const handleSuccessClose = () => {
    setSuccessVisible(false);
    onClose();
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
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
                      <GeneralButton title="Guardar" onPress={handleSubmit} />
                    </View>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
      <SuccessModal
        visible={successVisible}
        onClose={handleSuccessClose}
        message="La contraseña ha sido actualizada correctamente"
      />
    </>
  );
}
