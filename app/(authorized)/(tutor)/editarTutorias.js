import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import SizedBox from '../../../components/SizedBox';
import InputField from '../../../components/InputField';
import InputDate from '../../../components/InputDate';
import InputHour from '../../../components/InputHour';
import GeneralButton from '../../../components/GeneralButton';
import DropdownInput from '../../../components/DropdownInput';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { Formik } from 'formik';
import * as yup from 'yup';
import { generalInfoService } from '../../../service/generalInfoService';
import { scheduleService } from '../../../service/scheduleService';

const DAYS_MAP = {
  0: 'DOMINGO', 1: 'LUNES', 2: 'MARTES', 3: 'MIERCOLES',
  4: 'JUEVES', 5: 'VIERNES', 6: 'SABADO'
};

// Validation schemas
const baseSchema = {
  materia: yup.string().required("El campo materia es requerido"),
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

const EditTutoriaModal = ({ visible, onClose, tutoriaId, onSuccess }) => {
  // Base data
  const [subjects, setSubjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [tutoriaData, setTutoriaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Dynamic filtering data
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(null);
  const [filteredClassrooms, setFilteredClassrooms] = useState([]);
  const [filteredAvailabilities, setFilteredAvailabilities] = useState([]);

  // Load data when modal opens
  useEffect(() => {
    if (visible && tutoriaId) {
      loadData();
    } else {
      resetState();
    }
  }, [visible, tutoriaId]);

  const resetState = () => {
    setSelectedDayOfWeek(null);
    setFilteredClassrooms([]);
    setFilteredAvailabilities([]);
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const [subjectsData, blocksData, tutoriaDetails] = await Promise.all([
        generalInfoService.getInfo('materias'),
        generalInfoService.getInfo('bloques'),
        scheduleService.getScheduleById(tutoriaId)
      ]);

      // Set subjects
      setSubjects(subjectsData.map(subject => ({
        label: subject.subjectName,
        value: subject.subjectId.toString()
      })));

      // Set blocks
      setBlocks(blocksData.map(block => ({
        label: `${block.blockName} (${block.section})`,
        value: block.blockId.toString(),
        data: block
      })));

      // Set tutoria data
      setTutoriaData(tutoriaDetails);
      console.log(tutoriaData)

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get day of week from date string
  const getDayOfWeekFromDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return DAYS_MAP[date.getDay()];
  };

  // Format date from API response (2025-06-20T00:00:00 -> DD-MM-YYYY)
  const formatDateFromAPI = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format time from API (12:30:00 -> 12:30)
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5);
  };

  // Format date for API (DD-MM-YYYY -> YYYY-MM-DDTHH:mm:ss)
  const formatDateForAPI = (dateString, timeString = '00:00') => {
    const [day, month, year] = dateString.split('-');
    const [hours, minutes] = timeString.split(':');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours}:${minutes}:00`;
  };

  const getInitialValues = () => {
    if (!tutoriaData || !subjects.length) return {};

    const baseValues = {
      materia: tutoriaData.subjectId.toString(),
      descripcion: tutoriaData.description || '',
      fecha: formatDateFromAPI(tutoriaData.scheduleDate),
    };

    if (tutoriaData.type === 'VIRTUAL') {
      return {
        ...baseValues,
        horaInicio: formatTime(tutoriaData.startTime),
        horaFin: formatTime(tutoriaData.endTime),
      };
    } else {
      return {
        ...baseValues,
        bloque: '',
        salon: '',
        disponibilidad: '',
      };
    }
  };

  const isVirtual = tutoriaData?.type === 'VIRTUAL';
  const validationSchema = isVirtual ? virtualSchema : presencialSchema;

  // Handle date change
  const handleDateChange = (date, setFieldValue) => {
    setFieldValue('fecha', date);

    // Calculate day of week
    const dayOfWeek = getDayOfWeekFromDate(date);
    setSelectedDayOfWeek(dayOfWeek);

    // Reset dependent fields
    setFieldValue('bloque', '');
    setFieldValue('salon', '');
    setFieldValue('disponibilidad', '');
    setFilteredClassrooms([]);
    setFilteredAvailabilities([]);
  };

  // Handle block change
  const handleBlockChange = (item, setFieldValue) => {
    setFieldValue('bloque', item.value);

    // Reset dependent fields
    setFieldValue('salon', '');
    setFieldValue('disponibilidad', '');
    setFilteredAvailabilities([]);

    // Filter classrooms for selected block
    const blockData = blocks.find(b => b.value === item.value)?.data;
    if (blockData?.classrooms) {
      const classrooms = blockData.classrooms
        .filter(classroom => classroom.description?.toUpperCase() !== "VIRTUAL")
        .map(classroom => ({
          label: `${classroom.location} - ${classroom.description}`,
          value: classroom.classroomId.toString(),
          data: classroom
        }));

      setFilteredClassrooms(classrooms);
    }
  };

  // Handle classroom change
  const handleClassroomChange = (item, setFieldValue) => {
    setFieldValue('salon', item.value);
    setFieldValue('disponibilidad', '');

    // Filter availabilities for selected classroom and day
    const classroomData = filteredClassrooms.find(c => c.value === item.value)?.data;
    if (classroomData?.availabilities && selectedDayOfWeek) {
      const availabilities = classroomData.availabilities
        .filter(availability => availability.dayOfWeek === selectedDayOfWeek)
        .map(availability => ({
          label: `${availability.startTime.slice(0, 5)} - ${availability.endTime.slice(0, 5)}`,
          value: availability.availabilityId.toString(),
          data: availability
        }))
        .sort((a, b) => a.data.startTime.localeCompare(b.data.startTime));

      setFilteredAvailabilities(availabilities);
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const baseData = {
        subjectId: parseInt(values.materia),
        description: values.descripcion,
        type: tutoriaData.type,
      };

      let updateData;

      if (isVirtual) {
        updateData = {
          ...baseData,
          scheduleDate: formatDateForAPI(values.fecha),
          startTime: values.horaInicio + ':00',
          endTime: values.horaFin + ':00',
        };
      } else {
        const selectedAvailability = filteredAvailabilities.find(avail =>
          avail.value === values.disponibilidad
        );

        if (!selectedAvailability) {
          console.error('No se encontró la disponibilidad seleccionada');
          return;
        }

        const availData = selectedAvailability.data;
        const [startHours, startMinutes] = availData.startTime.split(':');

        updateData = {
          ...baseData,
          availabilityId: parseInt(values.disponibilidad),
          scheduleDate: formatDateForAPI(values.fecha, `${startHours}:${startMinutes}`),
        };
      }

      console.log('Updating tutoria with data:', updateData);

      await scheduleService.updateSchedule(tutoriaData.scheduleId, updateData);

      onSuccess?.('Tutoría actualizada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error updating tutoria:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!tutoriaId) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <TouchableOpacity onPress={onClose}>
              <FontAwesome5 name="times" size={24} color="#666" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-blue-500">
              Editar Tutoría {isVirtual ? 'Virtual' : 'Presencial'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="mt-2 text-gray-500">Cargando datos...</Text>
            </View>
          ) : (
            <Formik
              initialValues={getInitialValues()}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              {({ handleSubmit, setFieldValue, values, errors, touched }) => {

                useEffect(() => {
                  if (tutoriaData && tutoriaData.type === 'PRESENCIAL' && blocks.length > 0) {
                    const dateString = formatDateFromAPI(tutoriaData.scheduleDate);
                    if (dateString) {
                      const dayOfWeek = getDayOfWeekFromDate(dateString);
                      setSelectedDayOfWeek(dayOfWeek);

                      // Encontrar el bloque que contiene el classroomId de la tutoría
                      const targetBlock = blocks.find(block =>
                        block.data.classrooms?.some(classroom =>
                          classroom.classroomId === tutoriaData.classroomId
                        )
                      );

                      if (targetBlock) {
                        // Establecer el valor del bloque
                        setFieldValue('bloque', targetBlock.value);

                        // Filtrar aulas para este bloque
                        const classrooms = targetBlock.data.classrooms
                          .filter(classroom => classroom.description?.toUpperCase() !== "VIRTUAL")
                          .map(classroom => ({
                            label: `${classroom.location} - ${classroom.description}`,
                            value: classroom.classroomId.toString(),
                            data: classroom
                          }));

                        setFilteredClassrooms(classrooms);

                        // Establecer el valor del salón
                        setFieldValue('salon', tutoriaData.classroomId.toString());

                        // Encontrar el aula específica
                        const targetClassroom = targetBlock.data.classrooms.find(
                          classroom => classroom.classroomId === tutoriaData.classroomId
                        );

                        if (targetClassroom && dayOfWeek) {
                          // Filtrar disponibilidades para este día
                          const availabilities = targetClassroom.availabilities
                            .filter(availability => availability.dayOfWeek === dayOfWeek)
                            .map(availability => ({
                              label: `${availability.startTime.slice(0, 5)} - ${availability.endTime.slice(0, 5)}`,
                              value: availability.availabilityId.toString(),
                              data: availability
                            }));

                          setFilteredAvailabilities(availabilities);

                          // Encontrar la disponibilidad que coincide con el horario de la tutoría
                          const formattedStartTime = formatTime(tutoriaData.startTime);
                          const formattedEndTime = formatTime(tutoriaData.endTime);

                          const targetAvailability = targetClassroom.availabilities.find(avail =>
                            avail.dayOfWeek === dayOfWeek &&
                            formatTime(avail.startTime) === formattedStartTime &&
                            formatTime(avail.endTime) === formattedEndTime
                          );

                          if (targetAvailability) {
                            setFieldValue('disponibilidad', targetAvailability.availabilityId.toString());
                          }
                        }
                      }
                    }
                  }
                }, [tutoriaData, blocks, setFieldValue]);

                return (
                  <View className="flex-1">
                    <ScrollView
                      className="flex-1 px-4 py-6"
                      showsVerticalScrollIndicator={false}
                    >
                      {/* Subject - Paso 1 */}
                      <DropdownInput
                        label="Materia"
                        labelIcon={<FontAwesome5 name="book" size={16} color="black" />}
                        items={subjects}
                        selectedValue={values.materia}
                        onValueChange={(item) => setFieldValue('materia', item.value)}
                        error={errors.materia}
                        touched={touched.materia}
                        placeholder="Selecciona una materia"
                      />
                      <SizedBox height={16} />

                      {/* Description - Paso 2 */}
                      <InputField
                        label="Descripción de la tutoría"
                        placeholder="Describe brevemente el tema o contenido de la tutoría"
                        value={values.descripcion}
                        onChangeText={(text) => setFieldValue('descripcion', text)}
                        error={errors.descripcion}
                        touched={touched.descripcion}
                        labelIcon={<FontAwesome5 name="file-alt" size={16} color="black" />}
                        multiline={true}
                        numberOfLines={3}
                      />
                      <SizedBox height={16} />

                      {/* Date - Paso 3 */}
                      <InputDate
                        label="Fecha de la tutoría"
                        placeholder="DD-MM-AAAA (ej: 11-06-2025)"
                        type="date"
                        value={values.fecha}
                        onChange={(date) => handleDateChange(date, setFieldValue)}
                        error={errors.fecha}
                        touched={touched.fecha}
                        labelIcon={<FontAwesome5 name="calendar-alt" size={16} color="black" />}
                      />
                      {selectedDayOfWeek && (
                        <Text className="text-sm text-gray-600 mt-1">
                          Día seleccionado: {selectedDayOfWeek}
                        </Text>
                      )}
                      <SizedBox height={16} />

                      {/* Virtual fields */}
                      {isVirtual && (
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
                          <SizedBox height={16} />

                          <InputHour
                            label="Hora de fin"
                            placeholder="HH:MM (ej: 11:00)"
                            value={values.horaFin}
                            onChange={(hora) => setFieldValue('horaFin', hora)}
                            error={errors.horaFin}
                            touched={touched.horaFin}
                            labelIcon={<FontAwesome5 name="clock" size={16} color="black" />}
                            minTime={values.horaInicio}
                          />
                        </>
                      )}

                      {/* Presencial fields */}
                      {!isVirtual && (
                        <>
                          {/* Block - Paso 4 */}
                          <DropdownInput
                            label="Bloque"
                            labelIcon={<Entypo name="location-pin" size={18} color="black" />}
                            items={blocks}
                            selectedValue={values.bloque}
                            onValueChange={(item) => handleBlockChange(item, setFieldValue)}
                            error={errors.bloque}
                            touched={touched.bloque}
                            disabled={!selectedDayOfWeek}
                            placeholder={!selectedDayOfWeek ? "Selecciona una fecha primero" : "Selecciona un bloque"}
                          />
                          <SizedBox height={16} />

                          {/* Classroom - Paso 5 */}
                          <DropdownInput
                            label="Salón"
                            labelIcon={<Entypo name="home" size={18} color="black" />}
                            items={filteredClassrooms}
                            selectedValue={values.salon}
                            onValueChange={(item) => handleClassroomChange(item, setFieldValue)}
                            error={errors.salon}
                            touched={touched.salon}
                            disabled={!values.bloque || filteredClassrooms.length === 0}
                            placeholder={!values.bloque ? "Selecciona un bloque primero" : "Selecciona un salón"}
                          />
                          <SizedBox height={16} />

                          {/* Availability - Paso 6 */}
                          <DropdownInput
                            label="Disponibilidad"
                            labelIcon={<FontAwesome5 name="clock" size={16} color="black" />}
                            items={filteredAvailabilities}
                            selectedValue={values.disponibilidad}
                            onValueChange={(item) => setFieldValue('disponibilidad', item.value)}
                            error={errors.disponibilidad}
                            touched={touched.disponibilidad}
                            disabled={!values.salon || filteredAvailabilities.length === 0}
                            placeholder={
                              !values.salon ? "Selecciona un salón primero" :
                                filteredAvailabilities.length === 0 ? `No hay horarios disponibles para ${selectedDayOfWeek}` :
                                  "Selecciona un horario"
                            }
                          />
                        </>
                      )}
                    </ScrollView>

                    {/* Footer buttons */}
                    <View className="px-4 py-6 border-t border-gray-200">
                      <View className="flex-row gap-4">
                        <View className="flex-1">
                          <GeneralButton
                            title="Cancelar"
                            onPress={onClose}
                            variant="outline"
                            disabled={saving}
                          />
                        </View>
                        <View className="flex-1">
                          <GeneralButton
                            title={saving ? "Guardando..." : "Guardar cambios"}
                            onPress={handleSubmit}
                            disabled={saving}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                )
              }}
            </Formik>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditTutoriaModal;