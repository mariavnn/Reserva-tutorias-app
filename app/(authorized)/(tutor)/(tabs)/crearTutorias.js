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
import * as yup from 'yup';
import useCreateTutoriaStore from '../../../../store/useCreateTutoriaStore'
import CreateTutoriaModal from '../../../../components/modals/CreateTutorialModal'
import { useRouter } from 'expo-router'
import { scheduleService } from '../../../../service/scheduleService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFormDataStore } from '../../../../store/useFormTutoriaStore'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Feather from '@expo/vector-icons/Feather'

const MODALITIES = {
  PRESENCIAL: 'PRESENCIAL',
  VIRTUAL: 'VIRTUAL'
};

const DAYS_MAP = {
  0: 'DOMINGO', 1: 'LUNES', 2: 'MARTES', 3: 'MIERCOLES',
  4: 'JUEVES', 5: 'VIERNES', 6: 'SABADO'
};

const MODALITY_OPTIONS = [
  { label: 'Presencial', value: MODALITIES.PRESENCIAL },
  { label: 'Virtual', value: MODALITIES.VIRTUAL },
];

// Esquemas de validación (se mantienen igual)
const baseSchema = {
  materia: yup.string().required("El campo materia es requerido"),
  modalidad: yup.string().required("La modalidad es requerida"),
  descripcion: yup.string().required("La descripción es requerida"),
  fecha: yup.string().required("La fecha es requerida"),
};

const presencialSchema = yup.object().shape({
  ...baseSchema,
  bloque: yup.string().required("El bloque es requerido"),
  salon: yup.string().required("El salón es requerido"),
  disponibilidad: yup.string().required("La disponibilidad es requerida"),
});

const virtualSchema = yup.object().shape({
  ...baseSchema,
  horaInicio: yup.string().required("La hora de inicio es requerida"),
  horaFin: yup
    .string()
    .required("La hora de fin es requerida")
    .test('is-greater', 'La hora de fin debe ser posterior a la de inicio',
      function (value) {
        const { horaInicio } = this.parent;
        return !horaInicio || !value || horaInicio < value;
      }
    ),
});

// Utilidades (se mantienen igual)
const getDayOfWeekFromDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString + 'T00:00:00');
  return DAYS_MAP[date.getDay()];
};

const formatDate = (dateString, timeString = '00:00') => {
  const [day, month, year] = dateString.split('-');
  const [hours, minutes] = timeString.split(':');
  const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  return `${formattedDate}T${hours}:${minutes}:00`;
};

// Hook para manejar lógica de formulario (se mantiene igual)
const useFormLogic = (subjects) => {
  const [formState, setFormState] = useState({
    modalidad: null,
    selectedBlock: null,
    selectedClassroom: null,
    selectedDate: null,
    availableClassrooms: [],
    availableTimeSlots: []
  });

  const isVirtual = formState.modalidad === MODALITIES.VIRTUAL;

  const getInitialValues = () => ({
    materia: '',
    modalidad: '',
    descripcion: '',
    fecha: '',
    ...(isVirtual
      ? { horaInicio: '', horaFin: '' }
      : { bloque: '', salon: '', disponibilidad: '' }
    )
  });

  const getValidationSchema = () => isVirtual ? virtualSchema : presencialSchema;

  const updateFormState = (updates) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const handleModalityChange = (item, setFieldValue, values) => {
    const newModality = item.value;
    const isNewVirtual = newModality === MODALITIES.VIRTUAL;

    // Mantener valores comunes
    const commonValues = {
      materia: values.materia,
      descripcion: values.descripcion,
      fecha: values.fecha,
      modalidad: newModality
    };

    // Establecer todos los valores
    Object.keys(getInitialValues()).forEach(key => {
      setFieldValue(key, commonValues[key] || '');
    });

    // Resetear estado
    updateFormState({
      modalidad: newModality,
      selectedBlock: null,
      selectedClassroom: null,
      availableClassrooms: [],
      availableTimeSlots: []
    });
  };

  const handleBlockChange = (item, setFieldValue) => {
    const blockData = item.data;

    setFieldValue('bloque', item.label);
    setFieldValue('salon', '');
    setFieldValue('disponibilidad', '');

    const classrooms = blockData.classrooms
      .filter(classroom =>
        classroom.availabilities.length > 0 &&
        classroom.description.toUpperCase() !== "VIRTUAL"
      )
      .map(classroom => ({
        label: `${classroom.location} - ${classroom.description}`,
        value: classroom.classroomId,
        data: classroom
      }));

    updateFormState({
      selectedBlock: blockData,
      selectedClassroom: null,
      availableClassrooms: classrooms,
      availableTimeSlots: []
    });
  };

  const handleClassroomChange = (item, setFieldValue) => {
    setFieldValue('salon', item.label);
    setFieldValue('disponibilidad', '');

    updateFormState({
      selectedClassroom: item,
      availableTimeSlots: []
    });

    if (formState.selectedDate) {
      updateAvailableTimeSlots(item, formState.selectedDate);
    }
  };

  const handleDateChange = (date, setFieldValue) => {
    setFieldValue('fecha', date);
    setFieldValue('disponibilidad', '');

    updateFormState({
      selectedDate: date,
      availableTimeSlots: []
    });

    if (!isVirtual && formState.selectedClassroom) {
      updateAvailableTimeSlots(formState.selectedClassroom, date);
    }
  };

  const updateAvailableTimeSlots = (classroom, date) => {
    if (!classroom?.data?.availabilities || !date) {
      updateFormState({ availableTimeSlots: [] });
      return;
    }

    const dayOfWeek = getDayOfWeekFromDate(date);
    if (!dayOfWeek) {
      updateFormState({ availableTimeSlots: [] });
      return;
    }

    const timeSlots = classroom.data.availabilities
      .filter(availability =>
        !availability.occupied && availability.dayOfWeek === dayOfWeek
      )
      .map(availability => ({
        label: `${availability.startTime.slice(0, 5)} - ${availability.endTime.slice(0, 5)}`,
        value: availability.availabilityId.toString(),
        data: availability
      }))
      .sort((a, b) => a.data.startTime.localeCompare(b.data.startTime));

    updateFormState({ availableTimeSlots: timeSlots });
  };

  const buildTutoriaData = (values) => {
    const subjectId = subjects.find(s => s.label === values.materia)?.value;

    const baseData = {
      subjectId,
      description: values.descripcion,
      type: values.modalidad,
      scheduleDate: formatDate(values.fecha),
    };

    if (isVirtual) {
      return {
        ...baseData,
        startTime: values.horaInicio + ':00',
        endTime: values.horaFin + ':00',
        scheduleDate: formatDate(values.fecha, '00:00')
      };
    } else {
      const selectedTimeSlot = formState.availableTimeSlots
        .find(slot => slot.label === values.disponibilidad)?.data;

      const [startHours, startMinutes] = selectedTimeSlot?.startTime?.split(':') || ['00', '00'];

      return {
        ...baseData,
        availabilityId: selectedTimeSlot?.availabilityId,
        scheduleDate: formatDate(values.fecha, `${startHours}:${startMinutes}`)
      };
    }
  };

  return {
    formState,
    isVirtual,
    getInitialValues,
    getValidationSchema,
    handleModalityChange,
    handleBlockChange,
    handleClassroomChange,
    handleDateChange,
    buildTutoriaData
  };
};

export default function CrearTutoriasTutor() {
  const { subjects, blocks, isLoading, loadInitialData } = useFormDataStore();
  const formLogic = useFormLogic(subjects);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const router = useRouter();
  const { setTutoriaData } = useCreateTutoriaStore();

  useEffect(() => {
    loadInitialData();
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = (values) => {
    // Guardar los valores del formulario para mostrarlos en el modal
    setFormValues(values);

    // Preparar los datos para el modal
    const modalData = {
      materia: values.materia,
      descripcion: values.descripcion,
      fecha: values.fecha,
      modalidad: values.modalidad,
      ...(values.modalidad === MODALITIES.VIRTUAL
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
      setConfirmLoading(true);
      const tutoriaData = formLogic.buildTutoriaData(formValues);
      const userId = await AsyncStorage.getItem('UserId');

      const completeData = { ...tutoriaData, userId };

      await scheduleService.postSchedule(completeData);
      handleSuccessClose();
    } catch (error) {
      console.error('Error al crear tutoría:', error);
      setModalVisible(false);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setModalVisible(false);
    loadInitialData();
    router.back();
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
            initialValues={formLogic.getInitialValues()}
            validationSchema={formLogic.getValidationSchema()}
            enableReinitialize={true}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, setFieldValue, values, errors, touched, isSubmitting }) => (
              <View className="w-full h-[79%]">
                <ScrollView
                  className="mb-4"
                  contentContainerStyle={{ paddingBottom: 10, flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Resto del formulario (se mantiene igual) */}
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
                    items={subjects}
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
                  {!formLogic.isVirtual && formLogic.formState.modalidad === MODALITIES.PRESENCIAL && (
                    <>
                      <DropdownInput
                        label="Bloque"
                        labelIcon={<Entypo name="location-pin" size={18} color="black" />}
                        items={blocks}
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
                        onValueChange={(item) => setFieldValue('disponibilidad', item.label)}
                        error={errors.disponibilidad}
                        touched={touched.disponibilidad}
                        disabled={formLogic.formState.availableTimeSlots.length === 0 || !formLogic.formState.selectedDate || !formLogic.formState.selectedClassroom}
                        placeholder={
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
                    disabled={isSubmitting}
                  />
                </View>
              </View>
            )}
          </Formik>

          <CreateTutoriaModal
            visible={modalVisible}
            onClose={closeModal}
            onConfirm={handleConfirm}
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}