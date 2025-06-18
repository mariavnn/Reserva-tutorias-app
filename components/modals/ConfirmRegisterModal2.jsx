import { View, Text, Modal } from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import GeneralButton from "../GeneralButton";
import useCreateTutoriaStore from "../../store/useCreateTutoriaStore";
import { userInfoService } from "../../service/infoUser";
import { useUserStore } from "../../store/useUserStore";
import FailedModal from "./FailedModal";
import { useRouter } from "expo-router";

export default function ConfirmRegisterModal2({
  visible,
  onClose,
  data,
  onConfirm,
  type = "edit",
}) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { editedPassword } = useUserStore();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = type === "edit";

  const router = useRouter();

     const prepareDataEdit = () => {
        const  body = {
          roleID: data?.roleId,
          name: data?.name,
          lastName: data?.lastName,
          user: data?.username,
          email: data?.email,
          password: editedPassword,
          semester: data?.academicLevel ? parseInt(data?.academicLevel?.value) : 1,
          careerID: data?.career ? parseInt(data?.career?.careerId): 1,
          idSubjects: data?.subjects?.map((s) => s.idMateria) || []
        };
        return body;
    }


  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (isEdit) {
        const body = prepareDataEdit();
        await onConfirm(body);
      } else {
        await onConfirm(data);
      }
      setIsConfirmed(true);
      
    } catch (error) {
      setIsConfirmed(false);
      console.error("Error al confirmar:", error);

      let message = "Error desconocido";

      if (error.response?.data) {
        message = error.response.data;
      } else{
        message = "Error desconocido";
      }
      setErrorMessage(message);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
    router.back();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="w-11/12 bg-white rounded-xl p-4 max-h-[80%]">
          {!isConfirmed ? (
            // Vista de Confirmación
            <View className="space-y-4">
              <View className="justify-center items-center my-2">
                <MaterialIcons
                  name="help-outline"
                  size={60}
                  color={"#3b82f6"}
                />
                <Text className="text-xl font-bold text-blue-600 mt-3">
                  ¿Confirmar Informacion?
                </Text>
                <Text className="text-gray-600 text-center mt-1">
                  Revisa los detalles antes de confirmar
                </Text>
              </View>

              <View className="border border-gray-300 rounded-md p-4">
                <View className="space-y-2">
                  {data?.typeUser?.label && (
                    <Text className="text-gray-700">
                      <Text className="font-semibold">Tipo de Usuario:</Text>{" "}
                      {data?.typeUser?.label}
                    </Text>
                  )}
                  {data?.name && (
                    <Text className="text-gray-700">
                      <Text className="font-semibold">Nombre:</Text>{" "}
                      {data?.name}
                    </Text>
                  )}
                  {data?.lastName && (
                    <Text className="text-gray-700">
                      <Text className="font-semibold">Apellido:</Text>{" "}
                      {data?.lastName}
                    </Text>
                  )}
                  {data?.email && (
                    <Text className="text-gray-700">
                      <Text className="font-semibold">Email:</Text>{" "}
                      {data?.email}
                    </Text>
                  )}
                  {data?.username && (
                    <Text className="text-gray-700">
                      <Text className="font-semibold">Username:</Text>{" "}
                      {data?.username}
                    </Text>
                  )}
                  {data?.career && (
                    <Text>
                      <Text className="font-semibold">Carrera:</Text>{" "}
                      {data?.career}
                    </Text>
                  )}
                  {data?.semester && (
                    <Text>
                      <Text className="font-semibold">Semestre:</Text>{" "}
                      {data?.semester}
                    </Text>
                  )}
                  {data?.subjects && (
                    <>
                      <Text className="font-semibold mt-2">
                        Materias seleccionadas:
                      </Text>
                      {data?.subjects?.map((m, i) => (
                        <Text key={i}>• {m.nombreMateria}</Text>
                      ))}
                    </>
                  )}
                </View>
              </View>

              <View className="flex-row justify-between w-full mt-4">
                <View className="w-2/5">
                  <GeneralButton
                    title="Cancelar"
                    type="secondary"
                    onPress={handleClose}
                    disabled={loading}
                  />
                </View>
                <View className="w-2/5">
                  <GeneralButton
                    title={loading ? "Enviando..." : "Confirmar"}
                    type="primary"
                    onPress={handleConfirm}
                    disabled={loading}
                  />
                </View>
              </View>
            </View>
          ) : (
            // Vista de Éxito
            <View className="space-y-4">
              <View className="justify-center items-center my-2">
                <Feather name="check-circle" size={60} color={"green"} />
                <Text className="text-xl font-bold text-green-700 mt-3">
                  {isEdit
                    ? "¡Información editada con éxito!"
                    : "¡Registro exitoso!"}
                </Text>
                <Text className="text-gray-600 text-center mt-1">
                  {isEdit
                    ? "La información del usuario ha sido actualizada correctamente."
                    : "El usuario ha sido registrado correctamente."}
                </Text>
              </View>

              <View className="border border-gray-300 rounded-md p-4">
                <View className="space-y-2 mb-3">
                  {data?.name && (
                    <Text className="text-gray-700">
                      <Text className="font-semibold">Nombre:</Text>{" "}
                      {data?.name}
                    </Text>
                  )}
                  {data?.lastName && (
                    <Text className="text-gray-700">
                      <Text className="font-semibold">Apellido:</Text>{" "}
                      {data?.lastName}
                    </Text>
                  )}
                  {data?.email && (
                    <Text className="text-gray-700">
                      <Text className="font-semibold">Email:</Text>{" "}
                      {data?.email}
                    </Text>
                  )}
                  {data?.username && (
                    <Text className="text-gray-700">
                      <Text className="font-semibold">Username:</Text>{" "}
                      {data?.username}
                    </Text>
                  )}
                  {data?.career && (
                    <Text>
                      <Text className="font-semibold">Carrera:</Text>{" "}
                      {data?.career}
                    </Text>
                  )}
                  {data?.semester && (
                    <Text>
                      <Text className="font-semibold">Semestre:</Text>{" "}
                      {data?.semester}
                    </Text>
                  )}
                  {data.subjects && (
                    <>
                      <Text className="font-semibold mt-2">
                        Materias seleccionadas:
                      </Text>
                      {data.subjects?.map((m, i) => (
                        <Text key={i}>• {m.nombreMateria}</Text>
                      ))}
                    </>
                  )}
                </View>

                <GeneralButton
                  title="Cerrar"
                  type="primary"
                  onPress={handleClose}
                />
              </View>
            </View>
          )}
        </View>
      </View>

      <FailedModal
        visible={error}
        message={errorMessage}
        onClose={() => {
          setError(false);
          setErrorMessage("");
        }}
      />
    </Modal>
  );
}
