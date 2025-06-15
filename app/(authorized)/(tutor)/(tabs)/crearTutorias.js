import { View, Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import SizedBox from '../../../../components/SizedBox'
import InputField from '../../../../components/InputField'
import InputDate from '../../../../components/InputDate'
import InputHour from '../../../../components/InputHour'
import GeneralButton from '../../../../components/GeneralButton'
import NewDropdown from '../../../../components/NewDropdown'
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
import useFormLogic from '../../../../store/hooks/useFormLogic'
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
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState(null);


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

    const selectedMateria = subjectOptions.find(opt => opt.value === values.materia);
    const selectedBloque = blockOptions.find(opt => opt.value === values.bloque);
    const selectedSalon = formLogic.formState.availableClassrooms.find(opt => opt.value === values.salon);
    const selectedDisponibilidad = formLogic.formState.availableTimeSlots.find(opt => opt.value === values.disponibilidad);

    const modalData = {
      materia: selectedMateria?.label || values.materia,
      descripcion: values.descripcion,
      fecha: values.fecha,
      modalidad: values.modalidad,
      ...(values.modalidad === 'VIRTUAL'
        ? {
          horaInicio: values.horaInicio,
          horaFin: values.horaFin
        }
        : {
          bloque: selectedBloque?.label || values.bloque,
          salon: selectedSalon?.label || values.salon,
          disponibilidad: selectedDisponibilidad?.label || values.disponibilidad
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

          <Formik
            innerRef={formikRef}
            initialValues={formLogic.getInitialValues()}
            validationSchema={formLogic.getValidationSchema(modalidadSeleccionada)}
            enableReinitialize={true}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, setFieldValue, values, errors, touched }) => (
              <View className="w-full h-[79%]">
                <ScrollView
                  className=""
                  contentContainerStyle={{ paddingBottom: 10, flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Modalidad */}
                  <NewDropdown
                    label="Modalidad"
                    value={values.modalidad}
                    onValueChange={(value) => {
                      setModalidadSeleccionada(value);
                      formLogic.handleModalityChange({ value }, setFieldValue, values);
                      setFieldValue('modalidad', value);
                    }}
                    options={MODALITY_OPTIONS}
                    labelIcon={<FontAwesome6 name="laptop" size={16} color="black" />}
                    error={errors.modalidad && touched.modalidad ? errors.modalidad : null}
                    placeholder="Selecciona una modalidad"
                  />

                  {/* Materia */}
                  <NewDropdown
                    label="Materia"
                    value={values.materia}
                    onValueChange={(value) => setFieldValue('materia', value)}
                    options={subjectOptions}
                    labelIcon={<Feather name="book" size={16} color="black" />}
                    error={errors.materia && touched.materia ? errors.materia : null}
                    placeholder={isLoading ? "Cargando materias..." : "Selecciona una materia"}
                    disabled={isLoading}
                  />

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

                  {/* Campos Presencial */}
                  {values.modalidad === "PRESENCIAL" && (
                    <>
                      <NewDropdown
                        label="Bloque"
                        value={values.bloque}
                        onValueChange={(value) => {
                          const selectedBlock = blockOptions.find(block => block.value === value);
                          formLogic.handleBlockChange(selectedBlock, setFieldValue);
                          setFieldValue('bloque', value);
                        }}
                        options={blockOptions}
                        labelIcon={<Entypo name="location-pin" size={18} color="black" />}
                        error={errors.bloque && touched.bloque ? errors.bloque : null}
                        placeholder={isLoading ? "Cargando bloques..." : "Selecciona un bloque"}
                        disabled={isLoading}
                      />

                      <NewDropdown
                        label="Salón"
                        value={values.salon}
                        onValueChange={(value) => {
                          const selectedClassroom = formLogic.formState.availableClassrooms.find(classroom => classroom.value === value);
                          formLogic.handleClassroomChange(selectedClassroom, setFieldValue);
                          setFieldValue('salon', value);
                        }}
                        options={formLogic.formState.availableClassrooms}
                        labelIcon={<Entypo name="home" size={18} color="black" />}
                        error={errors.salon && touched.salon ? errors.salon : null}
                        disabled={!values.bloque || formLogic.formState.availableClassrooms.length === 0}
                        placeholder={
                          !values.bloque
                            ? "Selecciona un bloque primero"
                            : formLogic.formState.availableClassrooms.length === 0
                              ? "No hay salones disponibles"
                              : "Selecciona un salón"
                        }
                      />

                      <NewDropdown
                        label="Horario disponible"
                        value={values.disponibilidad}
                        onValueChange={(value) => setFieldValue('disponibilidad', value)}
                        options={formLogic.formState.availableTimeSlots}
                        labelIcon={<FontAwesome5 name="clock" size={16} color="black" />}
                        error={errors.disponibilidad && touched.disponibilidad ? errors.disponibilidad : null}
                        disabled={
                          formLogic.formState.loadingAvailability ||
                          formLogic.formState.availableTimeSlots.length === 0 ||
                          !values.fecha ||
                          !values.salon
                        }
                        placeholder={
                          formLogic.formState.loadingAvailability
                            ? "Cargando horarios..."
                            : !values.fecha
                              ? "Selecciona una fecha primero"
                              : !values.salon
                                ? "Selecciona un salón primero"
                                : formLogic.formState.availableTimeSlots.length === 0
                                  ? "No hay horarios disponibles"
                                  : "Selecciona un horario"
                        }
                      />
                    </>
                  )}

                  {/* Campos Virtual */}
                  {values.modalidad === "VIRTUAL" && (
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