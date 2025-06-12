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
import { availabilityService } from '../../../../service/availabilityService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFormDataStore } from '../../../../store/useFormTutoriaStore'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Feather from '@expo/vector-icons/Feather'
import { useTutoriaStore } from '../../../../store/useTutoriasStore'


const MODALITY_OPTIONS = [
  { label: 'Presencial', value: 'PRESENCIAL' },
  { label: 'Virtual', value: 'VIRTUAL' },
];

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

const useFormLogic = (subjects, blocks) => {
  const [formState, setFormState] = useState({
    modalidad: null,
    selectedBlock: null,
    selectedClassroom: null,
    selectedDate: null,
    availableClassrooms: [],
    availableTimeSlots: [],
    loadingAvailability: false
  });

  const isVirtual = formState.modalidad === 'VIRTUAL';

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

    const commonValues = {
      materia: values.materia,
      descripcion: values.descripcion,
      fecha: values.fecha,
      modalidad: newModality
    };

    const initialValues = {
      materia: commonValues.materia,
      modalidad: commonValues.modalidad,
      descripcion: commonValues.descripcion,
      fecha: commonValues.fecha,
      horaInicio: '',
      horaFin: '',
      bloque: '',
      salon: '',
      disponibilidad: ''
    };

    Object.keys(initialValues).forEach(key => {
      setFieldValue(key, initialValues[key]);
    });

    updateFormState({
      modalidad: newModality,
      selectedBlock: null,
      selectedClassroom: null,
      selectedDate: commonValues.fecha || null,
      availableClassrooms: [],
      availableTimeSlots: [],
      loadingAvailability: false
    });
  };

  const handleBlockChange = (item, setFieldValue) => {
    const blockData = blocks.find(block => block.blockId === item.value);

    setFieldValue('bloque', item.label);
    setFieldValue('salon', '');
    setFieldValue('disponibilidad', '');

    const classrooms = blockData.classrooms.map(classroom => ({
      label: `${classroom.location}${classroom.description ? ` - ${classroom.description}` : ''}`,
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

  const formatDate = (dateString, tipo) => {
    const [day, month, year] = dateString.split('-');

    const formattedDay = day.padStart(2, '0');
    const formattedMonth = month.padStart(2, '0');
    if (tipo === 'submit')
      return `${year}-${formattedMonth}-${formattedDay}`;

    return `${formattedDay}-${formattedMonth}-${year}`;
  };

  const handleClassroomChange = (item, setFieldValue) => {
    setFieldValue('salon', item.label);
    setFieldValue('disponibilidad', '');

    updateFormState({
      selectedClassroom: item,
      availableTimeSlots: []
    });

    if (formState.selectedDate) {
      loadAvailabilityForClassroom(item.value, formState.selectedDate);
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
      loadAvailabilityForClassroom(formState.selectedClassroom.value, date);
    }
  };

  const loadAvailabilityForClassroom = async (classroomId, date) => {
    try {
      updateFormState({ loadingAvailability: true });
      const formattedDate = formatDate(date);

      const availabilityData = await availabilityService.getAvailabilityFilter(classroomId, formattedDate);
      console.log(availabilityData)
      if (Array.isArray(availabilityData)) {
        const timeSlots = availabilityData.map(availability => ({
          label: `${availability.horaInicio.slice(0, 5)} - ${availability.horaFin.slice(0, 5)} (${availability.diaSemana})`,
          value: availability.idDisponibilidad.toString(),
          data: availability
        }));

        updateFormState({
          availableTimeSlots: timeSlots,
          loadingAvailability: false
        });
      } else {
        updateFormState({
          availableTimeSlots: [],
          loadingAvailability: false
        });
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      updateFormState({
        availableTimeSlots: [],
        loadingAvailability: false
      });
    }
  };

  const buildTutoriaData = async (values) => {
    const userId = await AsyncStorage.getItem('UserId');
    const subjectId = subjects.find(s => s.label === values.materia)?.value;

    const baseData = {
      subjectId,
      userId,
      description: values.descripcion,
      type: values.modalidad,
      scheduleDate: formatDate(values.fecha, 'submit'),
    };

    if (isVirtual) {
      return {
        ...baseData,
        startTime: values.horaInicio + ':00',
        endTime: values.horaFin + ':00',
      };
    } else {
      const selectedTimeSlot = formState.availableTimeSlots
        .find(slot => slot.value === values.disponibilidad);

      if (!selectedTimeSlot) {
        throw new Error('Horario disponible no encontrado');
      }

      return {
        ...baseData,
        availabilityId: parseInt(selectedTimeSlot.value),
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
  const { loadTutoring } = useTutoriaStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const router = useRouter();
  const { setTutoriaData } = useCreateTutoriaStore();

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

  const closeModal = () => {
    setModalVisible(false);
  };

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
      setConfirmLoading(true);
      const tutoriaData = await formLogic.buildTutoriaData(formValues);
      console.log(tutoriaData)
      await scheduleService.postSchedule(tutoriaData);
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
    loadTutoring();
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
                    disabled={isSubmitting || confirmLoading}
                  />
                </View>
              </View>
            )}
          </Formik>

          <CreateTutoriaModal
            visible={modalVisible}
            onClose={closeModal}
            onConfirm={handleConfirm}
            loading={confirmLoading}
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}