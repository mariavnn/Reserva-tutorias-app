import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import CareerContainer from "../../../../components/CareerContainer";
import GeneralTitle from "../../../../components/GeneralTitle";
import AddButton from "../../../../components/AddButton";
import NuevaCarreraModal from "../../../../components/modals/NuevaCarreraModal";
import { careerService } from "../../../../service/careerService";
import LoadingIndicator from "../../../../components/LoadingIndicator";

export default function CareerTab() {
  const [addCareerModal, setAddCareerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [careers, setCareers] = useState([]);
  
  const fetchCareers = async () => {
    setLoading(true);
    try {
      const response = await careerService.getCareers();
      setCareers(response);
    } catch (e) {
      console.error("Error al obtener carreras:", e);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() =>{
    fetchCareers()
  },[]);

  const handleCreateCareer = async (formData) => {
    setLoading(true)
    try {
      const careerData = {
        careerName: formData.nombreCarrera,
        code: parseInt(formData.codigo)
      };
      
      await careerService.createCareer(careerData);
      await fetchCareers();
      Alert.alert(
        "Éxito", 
        "La carrera se ha creado correctamente",
        [{ text: "OK", onPress: () => setAddCareerModal(false) }]
      );
      
    } catch (error) {
      console.error("❌ Error al crear carrera:", error);
      setAddCareerModal(false)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "No se pudo crear la carrera";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false)
    }
  };

  const onDelete = (careerId) => {
    const career = careers.find(c => c.careerId === careerId);
    const careerName = career?.careerName || "esta carrera";

    Alert.alert("Confirmar eliminación", `¿Estás seguro de que deseas eliminar "${careerName}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setLoading(true)
            try {
              await careerService.deleteCareer(careerId);
              await fetchCareers();
              setTimeout(() => {
                Alert.alert("Éxito", "La carrera se ha eliminado correctamente",
                  [{ text: "OK" }]
                );
              }, 100);
            } catch (error) {
              const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "No se pudo eliminar la carrera";
              Alert.alert("Error", errorMessage);
            } finally {
              setLoading(false)
            }
          },
        },
      ]
    );
  };

  const handleCloseModal = useCallback(() => {
    setAddCareerModal(false);
  }, []);

  const handleOpenModal = useCallback(() => {
    setAddCareerModal(true);
  }, []);

  return (
    <>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <LoadingIndicator />
        </View>
      ) : (
        <View className="flex-1">
          <View className="mt-10 mb-4 flex flex-row justify-between px-2 items-center">
            <Text className="font-semibold text-xl">Gestion de Carreras</Text>
            <AddButton
              label={"Nueva"}
              onPress={handleOpenModal}
            />
          </View>
          <ScrollView className="mb-20">
            {careers?.map((career) => (
              <CareerContainer
                type={"carrera"}
                key={career.careerId}
                data={career}
                onDelete={onDelete}
              />
            ))}
          </ScrollView>

          <NuevaCarreraModal
            visible={addCareerModal}
            onClose={handleCloseModal}
            onSubmit={handleCreateCareer}
          />
        </View>
      )}
    </>
  );
}
