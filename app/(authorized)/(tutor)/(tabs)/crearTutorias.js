import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import SizedBox from '../../../../components/SizedBox'
import InputField from '../../../../components/InputField'
import InputDate from '../../../../components/InputDate'
import InputHour from '../../../../components/InputHour'
import GeneralButton from '../../../../components/GeneralButton'
import DropdownInput from '../../../../components/DropdownInput'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { Formik } from 'formik';
import useCreateTutoriaStore from '../../../../store/useCreateTutoriaStore'
import { router } from 'expo-router'
import { scheduleService } from '../../../../service/scheduleService'
import { useFormDataStore } from '../../../../store/useFormTutoriaStore'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Feather from '@expo/vector-icons/Feather'
import { useTutoriaStore } from '../../../../store/useTutoriasStore'
import useFormLogic from '../../../../store/useFormLogic'
import CreateTutoriaModal from '../../../../components/modals/CreateTutorialModal'

const MODALITY_OPTIONS = [
  { label: 'Presencial', value: 'PRESENCIAL' },
  { label: 'Virtual', value: 'VIRTUAL' },
];

export default function CrearTutoriasTutor() {
  const { subjects, blocks, isLoading, loadInitialData, reset } = useFormDataStore();
  const { loadTutoring } = useTutoriaStore();
  const { setTutoriaData } = useCreateTutoriaStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const formikRef = useRef();

  const subjectOptions = useMemo(() =>
    subjects.map(subject => ({
      label: subject.nombreMateria,
      value: subject.idMateria
    })), [subjects]
  );

  const blockOptions = useMemo(() =>
    blocks.map(block => ({
      label: `${block.blockName} (${block.section})`,
      value: block.blockId,
      data: block
    })), [blocks]
  );

  const formLogic = useFormLogic(subjectOptions, blocks);

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSubmit = (values) => {
    setFormValues(values);

    const modalData = {
      materia: values.materia,
      descripcion: values.descripcion,
      fecha: values.fecha,
      modalidad: values.modalidad,
      ...(values.modalidad === 'VIRTUAL'
        ? {
          horaInicio: values.horaInicio,
          horaFin: values.horaFin
        }
        : {
          bloque: values.bloque,
          salon: values.salon,
          disponibilidad: values.disponibilidad
        }
      )
    };

    setTutoriaData(modalData);
    setModalVisible(true);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const tutoriaData = await formLogic.buildTutoriaData(formValues);
      await scheduleService.saveSchedule(tutoriaData);
    } catch (error) {
      console.error('Error al crear tutoría:', error);
      setModalVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSuccessClose = () => {
    loadInitialData();
    loadTutoring();
    formikRef.current?.resetForm();
    formLogic.resetData();
    router.back();
    setModalVisible(false)
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Screen>
        <View className="w-full">
          <GeneralTitle
            label="Registrar Nueva Tutoria"
            type="primary"
            className="!text-blue-500 mt-4 !text-2xl"
          />
          <SizedBox height={8} />
          <Text className="text-gray-500 text-md">
            Completa los detalles para crear una nueva sesión de tutorías
          </Text>

          <SizedBox height={24} />

          <Formik
            innerRef={formikRef}
            initialValues={formLogic.getInitialValues()}
            validationSchema={formLogic.getValidationSchema()}
            enableReinitialize={true}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, setFieldValue, values, errors, touched }) => (
              <View className="w-full h-[79%]">
                <ScrollView
                  className="mb-4"
                  contentContainerStyle={{ paddingBottom: 10, flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Modalidad */}
                  <DropdownInput
                    label="Modalidad"
                    labelIcon={<FontAwesome6 name="laptop" size={16} color="black" />}
                    items={MODALITY_OPTIONS}
                    selectedValue={values.modalidad}
                    onValueChange={(item) => formLogic.handleModalityChange(item, setFieldValue, values)}
                    error={errors.modalidad}
                    touched={touched.modalidad}
                  />
                  <SizedBox height={10} />

                  {/* Materia */}
                  <DropdownInput
                    label="Materia"
                    labelIcon={<Feather name="book" size={16} color="black" />}
                    items={subjectOptions}
                    selectedValue={values.materia}
                    onValueChange={(item) => setFieldValue('materia', item.label)}
                    error={errors.materia}
                    touched={touched.materia}
                    disabled={isLoading}
                    placeholder={isLoading ? "Cargando materias..." : "Selecciona una materia"}
                  />
                  <SizedBox height={10} />

                  {/* Descripción */}
                  <InputField
                    label="Descripción de la tutoría"
                    placeholder="Describe brevemente el tema o contenido de la tutoría"
                    value={values.descripcion}
                    onChangeText={(text) => setFieldValue('descripcion', text)}
                    error={errors.descripcion}
                    touched={touched.descripcion}
                    labelIcon={<FontAwesome6 name="file-alt" size={16} color="black" />}
                    multiline={true}
                    numberOfLines={3}
                  />
                  <SizedBox height={10} />

                  {/* Fecha */}
                  <InputDate
                    label="Fecha de la tutoría"
                    placeholder="DD-MM-AAAA (ej: 11-06-2025)"
                    type="date"
                    value={values.fecha}
                    onChange={(date) => formLogic.handleDateChange(date, setFieldValue)}
                    error={errors.fecha}
                    touched={touched.fecha}
                    labelIcon={<FontAwesome6 name="calendar" size={16} color="black" />}
                  />
                  <SizedBox height={10} />

                  {/* Campos Presencial */}
                  {!formLogic.isVirtual && formLogic.formState.modalidad === "PRESENCIAL" && (
                    <>
                      <DropdownInput
                        label="Bloque"
                        labelIcon={<Entypo name="location-pin" size={18} color="black" />}
                        items={blockOptions}
                        selectedValue={values.bloque}
                        onValueChange={(item) => formLogic.handleBlockChange(item, setFieldValue)}
                        error={errors.bloque}
                        touched={touched.bloque}
                        disabled={isLoading}
                        placeholder={isLoading ? "Cargando bloques..." : "Selecciona un bloque"}
                      />
                      <SizedBox height={10} />

                      <DropdownInput
                        label="Salón"
                        labelIcon={<Entypo name="home" size={18} color="black" />}
                        items={formLogic.formState.availableClassrooms}
                        selectedValue={values.salon}
                        onValueChange={(item) => formLogic.handleClassroomChange(item, setFieldValue)}
                        error={errors.salon}
                        touched={touched.salon}
                        disabled={!formLogic.formState.selectedBlock || formLogic.formState.availableClassrooms.length === 0}
                        placeholder={!formLogic.formState.selectedBlock ? "Selecciona un bloque primero" : "Selecciona un salón"}
                      />
                      <SizedBox height={10} />

                      <DropdownInput
                        label="Horario disponible"
                        labelIcon={<FontAwesome5 name="clock" size={16} color="black" />}
                        items={formLogic.formState.availableTimeSlots}
                        selectedValue={values.disponibilidad}
                        onValueChange={(item) => setFieldValue('disponibilidad', item.value)}
                        error={errors.disponibilidad}
                        touched={touched.disponibilidad}
                        disabled={
                          formLogic.formState.loadingAvailability ||
                          formLogic.formState.availableTimeSlots.length === 0 ||
                          !formLogic.formState.selectedDate ||
                          !formLogic.formState.selectedClassroom
                        }
                        placeholder={
                          formLogic.formState.loadingAvailability ? "Cargando horarios..." :
                            !formLogic.formState.selectedDate ? "Selecciona una fecha primero" :
                              !formLogic.formState.selectedClassroom ? "Selecciona un salón primero" :
                                formLogic.formState.availableTimeSlots.length === 0 ? "No hay horarios disponibles para esta fecha" :
                                  "Selecciona un horario"
                        }
                      />
                    </>
                  )}

                  {/* Campos Virtual */}
                  {formLogic.isVirtual && (
                    <>
                      <InputHour
                        label="Hora de inicio"
                        placeholder="HH:MM (ej: 09:00)"
                        value={values.horaInicio}
                        onChange={(hora) => setFieldValue('horaInicio', hora)}
                        error={errors.horaInicio}
                        touched={touched.horaInicio}
                        labelIcon={<FontAwesome5 name="clock" size={16} color="black" />}
                      />
                      <SizedBox height={10} />

                      <InputHour
                        label="Hora de fin"
                        placeholder="HH:MM (ej: 11:00)"
                        type="time"
                        value={values.horaFin}
                        onChange={(hora) => setFieldValue('horaFin', hora)}
                        error={errors.horaFin}
                        touched={touched.horaFin}
                        labelIcon={<FontAwesome5 name="clock" size={16} color="black" />}
                        minTime={values.horaInicio}
                      />
                    </>
                  )}
                </ScrollView>

                <View className="w-full bg-background-light justify-center">
                  <GeneralButton
                    title="Crear tutoría"
                    onPress={handleSubmit}
                    disabled={loading}
                  />
                </View>
              </View>
            )}
          </Formik>

          <CreateTutoriaModal
            visible={modalVisible}
            onCancel={closeModal}
            onClose={handleSuccessClose}
            onConfirm={handleConfirm}
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}