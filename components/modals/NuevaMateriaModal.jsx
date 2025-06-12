import { View, Text, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import InputField from "../InputField";
import GeneralButton from "../GeneralButton";
import SizedBox from "../SizedBox";
import { Formik } from "formik";
import DropdownInput from "../DropdownInput";
import { useUserStore } from "../../store/useUserStore";
import { userInfoService } from "../../service/infoUser";

export default function NuevaMateriaModal({ visible, onClose, onSubmit }) {
  const { career, setCareer } = useUserStore();
  const [loading, setLoading] = useState(false);
  const MateriaSchema = yup.object().shape({
    nombreCarrera: yup.string().required("El nombre es obligatorio"),
    codigo: yup.string().required("El código es obligatorio"),
    career: yup.string().required("La carrera es obligatoria"),
    creditos: yup.number().required("Los créditos son obligatorios"),
  });

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
                    nombreCarrera: '',
                    codigo: '',
                    career: '',
                    creditos: 0,
                  }}
                  validationSchema={MateriaSchema}
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
                      <InputField
                        label="Nombre de la carrera"
                        value={values.nombreCarrera}
                        onChangeText={handleChange('nombreCarrera')}
                        onBlur={handleBlur('nombreCarrera')}
                        error={errors.nombreCarrera}
                        touched={touched.nombreCarrera}
                      />

                      <InputField
                        label="Código de la carrera"
                        value={values.codigo}
                        onChangeText={handleChange('codigo')}
                        onBlur={handleBlur('codigo')}
                        error={errors.codigo}
                        touched={touched.codigo}
                      />

                      <DropdownInput
                        label="Selecciona la carrera"
                        selectedValue={values.career}
                        onValueChange={(value) => {
                          setFieldValue('career', value);
                        }}
                        items={(career ?? []).map((c) => ({
                          label: c.careerName,
                          value: c.careerId,
                        }))}
                        error={errors.career}
                        touched={touched.career}
                        disabled={false}
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
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
