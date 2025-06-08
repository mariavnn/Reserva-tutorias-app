import { View, Text, Modal } from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import GeneralButton from "../GeneralButton";
import useCreateTutoriaStore from "../../store/useCreateTutoriaStore";
import { userInfoService } from "../../service/infoUser";
import { useUserStore } from "../../store/useUserStore";

export default function ConfirmRegisterModal2({
  visible,
  onClose,
  data,
  onConfirm,
}) {
  const { tutoriaData } = useCreateTutoriaStore();
  const {fetchUserInfo, fetchCareerInfo } = useUserStore();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnConfirm = async (data) => {
    setLoading(true);
    try {
      const responde = await userInfoService.editUser(data);
      fetchUserInfo();
      fetchCareerInfo();
    } catch (error) {
      console.log(error);
      throw error
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      setLoading(true);
      await handleOnConfirm(data);
      setIsConfirmed(true);
    } catch (error) {
      console.error("Error al confirmar:", error);
      setIsConfirmed(false);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
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
                  ¡Informacion Editada con Éxito!
                </Text>
                <Text className="text-gray-600 text-center mt-1">
                  La informacion del usuario ha sido actualizada correctamente
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
    </Modal>
  );
}
