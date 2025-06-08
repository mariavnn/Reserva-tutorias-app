import { View, Text, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import SizedBox from '../../../../components/SizedBox'
import InputField from '../../../../components/InputField'
import InputDate from '../../../../components/InputDate'
import InputHour from '../../../../components/InputHour'
import { Platform } from 'react-native'
import GeneralButton from '../../../../components/GeneralButton'
import DropdownInput from '../../../../components/DropdownInput'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { Formik } from 'formik';
import * as yup from 'yup';
import useCreateTutoriaStore from '../../../../store/useCreateTutoriaStore'
import CreateTutoriaModal from '../../../../components/modals/CreateTutorialModal'
import { useRouter } from 'expo-router'
import { generalInfoService } from '../../../../service/generalInfoService'
import { scheduleService } from '../../../../service/scheduleService'

// Esquemas de validación separados
const crearTutoriaPresencialSchema = yup.object().shape({
  materia: yup.string().required("El campo materia es requerido"),
  modalidad: yup.string().required("La modalidad es requerida"),
  descripcion: yup.string().required("La descripción es requerida"),
  fecha: yup.string().required("La fecha es requerida"),
  bloque: yup.string().required("El bloque es requerido"),
  salon: yup.string().required("El salón es requerido"),
  disponibilidad: yup.string().required("La disponibilidad es requerida"),
});

const crearTutoriaVirtualSchema = yup.object().shape({
  materia: yup.string().required("El campo materia es requerido"),
  modalidad: yup.string().required("La modalidad es requerida"),
  descripcion: yup.string().required("La descripción es requerida"),
  fecha: yup.string().required("La fecha es requerida"),
  horaInicio: yup.string().required("La hora de inicio es requerida"),
  horaFin: yup
    .string()
    .required("La hora de fin es requerida")
    .test(
      'is-greater',
      'La hora de fin debe ser posterior a la de inicio',
      function (value) {
        const { horaInicio } = this.parent;
        return !horaInicio || !value || horaInicio < value;
      }
    ),
});

// Función para obtener el día de la semana en español desde una fecha
const getDayOfWeekFromDate = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString + 'T00:00:00');
  const dayIndex = date.getDay(); // 0 = domingo, 1 = lunes, etc.

  const dayMap = {
    0: 'DOMINGO',
    1: 'LUNES',
    2: 'MARTES',
    3: 'MIERCOLES',
    4: 'JUEVES',
    5: 'VIERNES',
    6: 'SABADO'
  };

  return dayMap[dayIndex];
};

export default function CrearTutoriasTutor() {
  const { setTutoriaData } = useCreateTutoriaStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedModality, setSelectedModality] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableClassrooms, setAvailableClassrooms] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isVirtual = selectedModality === 'VIRTUAL';

  const tiposModalidad = [
    { label: 'Presencial', value: 'PRESENCIAL' },
    { label: 'Virtual', value: 'VIRTUAL' },
  ];

  const route = useRouter();

  const getInitialValues = () => {
    if (isVirtual) {
      return {
        materia: '',
        modalidad: '',
        descripcion: '',
        fecha: '',
        horaInicio: '',
        horaFin: '',
      };
    } else {
      return {
        materia: '',
        modalidad: '',
        descripcion: '',
        fecha: '',
        bloque: '',
        salon: '',
        disponibilidad: '',
      };
    }
  };

  const getValidationSchema = () => {
    return isVirtual ? crearTutoriaVirtualSchema : crearTutoriaPresencialSchema;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const subjects = await generalInfoService.getInfo('materias');

        const formattedSubjects = subjects.map(subject => ({
          label: subject.subjectName,
          value: subject.subjectId
        }));

        setAvailableSubjects(formattedSubjects);

        // Solo cargar bloques si es presencial
        if (!isVirtual && selectedModality === 'PRESENCIAL') {
          const blocks = await generalInfoService.getInfo('bloques');
          const formattedBlocks = blocks.map(block => ({
            label: `${block.blockName} (${block.section})`,
            value: block.blockId.toString(),
            data: block
          }));
          setAvailableBlocks(formattedBlocks);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedModality, isVirtual]);

  const handleModalityChange = (selectedModalityItem, setFieldValue, values) => {
    const currentMateria = values.materia;
    const currentDescripcion = values.descripcion;
    const currentFecha = values.fecha;

    setSelectedModality(selectedModalityItem.value);
    setFieldValue('modalidad', selectedModalityItem.value);

    // Mantener valores comunes
    setFieldValue('materia', currentMateria);
    setFieldValue('descripcion', currentDescripcion);
    setFieldValue('fecha', currentFecha);

    // Resetear campos específicos
    if (selectedModalityItem.value === 'VIRTUAL') {
      setFieldValue('bloque', '');
      setFieldValue('salon', '');
      setFieldValue('disponibilidad', '');
    } else {
      setFieldValue('horaInicio', '');
      setFieldValue('horaFin', '');
    }

    // Reset states
    setSelectedBlock(null);
    setSelectedClassroom(null);
    setAvailableTimeSlots([]);
    setAvailableClassrooms([]);
  };
  const handleBlockChange = (selectedBlock, setFieldValue) => {
    setSelectedBlock(selectedBlock.data);
    setFieldValue('bloque', selectedBlock.label);

    // Resetear campos dependientes
    setFieldValue('salon', '');
    setFieldValue('disponibilidad', '');
    setSelectedClassroom(null);
    setAvailableTimeSlots([]);

    // Obtener salones del bloque seleccionado (excluyendo virtuales)
    const classrooms = selectedBlock.data.classrooms
      .filter(classroom =>
        classroom.availabilities.length > 0 &&
        classroom.description.toUpperCase() !== "VIRTUAL"
      )
      .map(classroom => ({
        label: `${classroom.location} - ${classroom.description}`,
        value: classroom.classroomId,
        data: classroom
      }));

    setAvailableClassrooms(classrooms);
  };

  const handleClassroomChange = (selectedClassroom, setFieldValue) => {
    setSelectedClassroom(selectedClassroom);
    setFieldValue('salon', selectedClassroom.label);

    // Resetear campos dependientes
    setFieldValue('disponibilidad', '');
    setAvailableTimeSlots([]);

    // Actualizar horarios si ya hay una fecha seleccionada
    if (selectedDate) {
      updateAvailableTimeSlots(selectedClassroom, selectedDate);
    }
  };

  const handleDateChange = (date, setFieldValue) => {
    setSelectedDate(date);
    setFieldValue('fecha', date);

    // Resetear disponibilidad
    setFieldValue('disponibilidad', '');
    setAvailableTimeSlots([]);

    // Actualizar horarios si ya hay un salón seleccionado (para presencial)
    if (!isVirtual && selectedClassroom) {
      updateAvailableTimeSlots(selectedClassroom, date);
    }
  };

  const updateAvailableTimeSlots = (classroom, date) => {
    if (!classroom?.data?.availabilities || !date) {
      setAvailableTimeSlots([]);
      return;
    }

    // Obtener el día de la semana de la fecha seleccionada
    const dayOfWeek = getDayOfWeekFromDate(date);

    if (!dayOfWeek) {
      setAvailableTimeSlots([]);
      return;
    }

    // Filtrar horarios disponibles para el día calculado
    const filteredTimeSlots = classroom.data.availabilities
      .filter(availability => {
        return !availability.occupied &&
          availability.dayOfWeek === dayOfWeek;
      })
      .map(availability => ({
        label: `${availability.startTime.slice(0, 5)} - ${availability.endTime.slice(0, 5)}`,
        value: availability.availabilityId.toString(),
        data: availability
      }))
      .sort((a, b) => {
        return a.data.startTime.localeCompare(b.data.startTime);
      });

    setAvailableTimeSlots(filteredTimeSlots);
  };

  const closeModal = () => {
    setModalVisible(false);
    route.back();
  }

  const buildTutoriaData = (values) => {
    // Función para formatear fecha correctamente
    const formatDate = (dateString, timeString = '00:00') => {
      const [day, month, year] = dateString.split('-');
      const [hours, minutes] = timeString.split(':');

      // Asegurar formato YYYY-MM-DD con ceros a la izquierda
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      return `${formattedDate}T${hours}:${minutes}:00`;
    };

    if (isVirtual) {
      const tutoriaVirtualData = {
        subjectId: availableSubjects.find(s => s.label === values.materia)?.value,
        description: values.descripcion,
        type: values.modalidad,
        scheduleDate: formatDate(values.fecha),
        startTime: values.horaInicio + ':00',
        endTime: values.horaFin + ':00',
      };

      console.log('Datos de tutoría virtual a enviar:', JSON.stringify(tutoriaVirtualData, null, 2));
      return tutoriaVirtualData;
    } else {
      const selectedTimeSlot = availableTimeSlots.find(slot =>
        slot.label === values.disponibilidad
      )?.data;

      const [startHours, startMinutes] = selectedTimeSlot?.startTime?.split(':') || ['00', '00'];

      const tutoriaPresencialData = {
        availabilityId: selectedTimeSlot?.availabilityId,
        subjectId: availableSubjects.find(s => s.label === values.materia)?.value,
        description: values.descripcion,
        type: values.modalidad,
        scheduleDate: formatDate(values.fecha, `${startHours}:${startMinutes}`),
      };

      console.log('Datos de tutoría presencial a enviar:', JSON.stringify(tutoriaPresencialData, null, 2));
      return tutoriaPresencialData;
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Screen>
        <View className="w-full">
          <GeneralTitle
            label={"Registrar Nueva Tutoria"}
            type='primary'
            className='!text-blue-500 mt-4 !text-2xl'
          />
          <SizedBox height={8} />
          <Text className="text-gray-500 text-md">
            Completa los detalles para crear una nueva sesión de tutorías
          </Text>

          <SizedBox height={24} />
          <Formik
            initialValues={getInitialValues()}
            validationSchema={getValidationSchema()}
            enableReinitialize={true}
            // onSubmit={values => {
            //   console.log('Valores del formulario:', values);
            //   const tutoriaData = buildTutoriaData(values);
            //   setTutoriaData(tutoriaData);
            //   setModalVisible(true);
            // }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const tutoriaData = buildTutoriaData(values);
                const completeData = {
                  ...tutoriaData,
                  userId: await AsyncStorage.getItem('UserId')
                };

                // Hacer el POST directamente
                const response = await scheduleService.postSchedule(completeData);
                console.log('Tutoría creada:', response);

                // Mostrar modal de éxito
                setModalVisible(true);
                setSubmitting(false);
              } catch (error) {
                console.error('Error al crear tutoría:', error);
                alert('Error al crear tutoría: ' + error.message);
                setSubmitting(false);
              }
            }}
          >
            {({ handleSubmit, setFieldValue, values, errors, touched }) => (
              <View className="w-full h-[79%]">
                <ScrollView className="mb-4" contentContainerStyle={{ paddingBottom: 10, flexGrow: 1 }}>
                  {/* Selección de Modalidad */}
                  <DropdownInput
                    label={"Modalidad"}
                    labelIcon={<FontAwesome5 name="laptop" size={16} color="black" />}
                    items={tiposModalidad}
                    selectedValue={tiposModalidad.find(m => m.value === values.modalidad)?.label}
                    onValueChange={(item) => handleModalityChange(item, setFieldValue, values)}
                    error={errors.modalidad}
                    touched={touched.modalidad}
                  />
                  <SizedBox height={10} />

                  {/* Selección de Materia */}
                  <DropdownInput
                    label={"Materia"}
                    labelIcon={<FontAwesome5 name="book" size={16} color="black" />}
                    items={availableSubjects}
                    selectedValue={values.materia}
                    onValueChange={(item) => setFieldValue('materia', item.label)}
                    error={errors.materia}
                    touched={touched.materia}
                  />
                  <SizedBox height={10} />

                  {/* Descripción de la tutoría */}
                  <InputField
                    label={"Descripción de la tutoría"}
                    placeholder="Describe brevemente el tema o contenido de la tutoría"
                    value={values.descripcion}
                    onChangeText={(text) => setFieldValue('descripcion', text)}
                    error={errors.descripcion}
                    touched={touched.descripcion}
                    labelIcon={<FontAwesome5 name="file-alt" size={16} color="black" />}
                    multiline={true}
                    numberOfLines={3}
                  />
                  <SizedBox height={10} />

                  {/* Selección de Fecha */}
                  <InputDate
                    label={"Fecha de la tutoría"}
                    placeholder="DD-MM-AAAA (ej: 11-06-2025)"
                    type='date'
                    value={values.fecha}
                    onChange={(date) => handleDateChange(date, setFieldValue)}
                    error={errors.fecha}
                    touched={touched.fecha}
                    labelIcon={<FontAwesome5 name="calendar-alt" size={16} color="black" />}
                  />
                  <SizedBox height={10} />

                  {/* Campos para modalidad PRESENCIAL */}
                  {!isVirtual && (
                    <>
                      {/* Selección de Bloque */}
                      <DropdownInput
                        label={"Bloque"}
                        labelIcon={<Entypo name="location-pin" size={18} color="black" />}
                        items={availableBlocks}
                        selectedValue={values.bloque}
                        onValueChange={(item) => handleBlockChange(item, setFieldValue)}
                        error={errors.bloque}
                        touched={touched.bloque}
                        disabled={isLoading}
                        placeholder={isLoading ? "Cargando bloques..." : "Selecciona un bloque"}
                      />
                      <SizedBox height={10} />

                      {/* Selección de Salón */}
                      <DropdownInput
                        label={"Salón"}
                        labelIcon={<Entypo name="home" size={18} color="black" />}
                        items={availableClassrooms}
                        selectedValue={values.salon}
                        onValueChange={(item) => handleClassroomChange(item, setFieldValue)}
                        error={errors.salon}
                        touched={touched.salon}
                        disabled={!selectedBlock || availableClassrooms.length === 0}
                        placeholder={!selectedBlock ? "Selecciona un bloque primero" : "Selecciona un salón"}
                      />
                      <SizedBox height={10} />

                      {/* Selección de Horario - Presencial */}
                      <DropdownInput
                        label={"Horario disponible"}
                        labelIcon={<FontAwesome5 name="clock" size={16} color="black" />}
                        items={availableTimeSlots}
                        selectedValue={values.disponibilidad}
                        onValueChange={(item) => setFieldValue('disponibilidad', item.label)}
                        error={errors.disponibilidad}
                        touched={touched.disponibilidad}
                        disabled={availableTimeSlots.length === 0 || !selectedDate || !selectedClassroom}
                        placeholder={
                          !selectedDate
                            ? "Selecciona una fecha primero"
                            : !selectedClassroom
                              ? "Selecciona un salón primero"
                              : availableTimeSlots.length === 0
                                ? "No hay horarios disponibles para esta fecha"
                                : "Selecciona un horario"
                        }
                      />
                    </>
                  )}

                  {/* Campos para modalidad VIRTUAL */}
                  {isVirtual && (
                    <>
                      {/* Hora de Inicio - Virtual */}
                      <InputHour
                        label={"Hora de inicio"}
                        placeholder="HH:MM (ej: 09:00)"
                        value={values.horaInicio}
                        onChange={(hora) => setFieldValue('horaInicio', hora)}
                        error={errors.horaInicio}
                        touched={touched.horaInicio}
                        labelIcon={<FontAwesome5 name="clock" size={16} color="black" />}
                      />
                      <SizedBox height={10} />

                      {/* Hora de Fin - Virtual */}
                      <InputHour
                        label={"Hora de fin"}
                        placeholder="HH:MM (ej: 11:00)"
                        type='time'
                        value={values.horaFin}
                        onChange={(hora) => setFieldValue('horaFin', hora)}
                        error={errors.horaFin}
                        touched={touched.horaFin}
                        labelIcon={<FontAwesome5 name="clock" size={16} color="black" />}
                        minTime={values.horaInicio} // Pasar hora inicio como mínimo
                      />
                    </>
                  )}

                </ScrollView>

                <View className="w-full bg-background-light justify-center">
                  <GeneralButton
                    title={"Crear tutoría"}
                    onPress={handleSubmit}
                  />
                </View>
              </View>
            )}
          </Formik>

          {modalVisible && (
            <CreateTutoriaModal
              visible={modalVisible}
              onClose={closeModal}
              onConfirm={() => {
                setModalVisible(false);
              }}
            />
          )}
        </View>
      </Screen>
    </KeyboardAvoidingView>
  )
}