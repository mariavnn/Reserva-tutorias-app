import { View, Text, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import InputField from "../InputField";
import GeneralButton from "../GeneralButton";
import SizedBox from "../SizedBox";
import { Formik } from "formik";
import { useUserStore } from "../../store/useUserStore";
import { userInfoService } from "../../service/infoUser";
import NewDropdown from "../NewDropdown";

export default function NuevaMateriaModal({ visible, onClose, onSubmit }) {
  const { career, setCareer } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MateriaSchema = yup.object().shape({
    nombreMateria: yup.string().required("El nombre es obligatorio"),
    codigo: yup.string().required("El código es obligatorio"),
    career: yup.string().required("La carrera es obligatoria"),
    creditos: yup.number().required("Los créditos son obligatorios"),
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

  useEffect(() => {
    const handleCareerInfo = async () => {
      setLoading(true);
      try {
        const career = await userInfoService.getCareer();
        setCareer(career);
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    handleCareerInfo();
  }, []);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="w-full"
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="bg-white p-6 rounded-lg w-full">
                <Text className="text-lg font-bold mb-4 text-center">
                  Agregar Materia
                </Text>

                <Formik
                  initialValues={{
                    nombreMateria: '',
                    codigo: '',
                    career: '',
                    creditos: 0,
                  }}
                  validationSchema={MateriaSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize={true}
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
                      <InputField
                        label="Nombre de la materia"
                        value={values.nombreMateria}
                        onChangeText={handleChange('nombreMateria')}
                        onBlur={handleBlur('nombreMateria')}
                        error={errors.nombreMateria}
                        touched={touched.nombreMateria}
                      />

                      <InputField
                        label="Código de la materia"
                        value={values.codigo}
                        onChangeText={handleChange('codigo')} 
                        onBlur={handleBlur('codigo')}
                        error={errors.codigo}
                        touched={touched.codigo}
                      />
                      <NewDropdown
                        label="Selecciona la carrera"
                        value={values.career}
                        onValueChange={(value) => setFieldValue('career', value)}
                        options={(career ?? []).map((c) => ({
                          label: c.careerName,
                          value: c.careerId,
                        }))}
                        error={touched.career && errors.career}
                      />

                      <SizedBox height={16} />

                      <InputField
                        type="number"
                        label="Créditos de la Materia"
                        value={values.creditos}
                        onChangeText={handleChange('creditos')}
                        onBlur={handleBlur('creditos')}
                        error={errors.creditos}
                        touched={touched.creditos}
                      />

                      <View className="mt-4 flex-row justify-between">
                        <View className="w-2/5">
                          <GeneralButton
                            title="Cancelar"
                            type="secondary"
                            onPress={onClose}
                            disabled={isSubmitting}
                          />
                        </View>
                        <View className="w-2/5">
                          <GeneralButton 
                            title={isSubmitting ? "Guardando..." : "Guardar"} 
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            loading={isSubmitting}
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
