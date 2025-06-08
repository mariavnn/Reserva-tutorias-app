import React, { useState, useEffect, useMemo } from 'react';
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

import SizedBox from '../../components/SizedBox'
import InputField from '../../components/InputField'
import InputDate from '../../components/InputDate'
import InputHour from '../../components/InputHour'
import GeneralButton from '../../components/GeneralButton'
import DropdownInput from '../../components/DropdownInput'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { Formik } from 'formik';
import * as yup from 'yup';
import { generalInfoService } from '../../service/generalInfoService'
import { scheduleService } from '../../service/scheduleService'

// Constants
const MODALITIES = {
  PRESENCIAL: 'PRESENCIAL',
  VIRTUAL: 'VIRTUAL'
};

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

// Utility functions
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

const EditTutoriaModal = ({ visible, onClose, tutoriaId, onSuccess }) => {
  const [subjects, setSubjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [tutoriaData, setTutoriaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for presencial mode
  const [formState, setFormState] = useState({
    selectedBlock: null,
    selectedClassroom: null,
    selectedDate: null,
    availableClassrooms: [],
    availableTimeSlots: []
  });

  const isVirtual = tutoriaData?.type === MODALITIES.VIRTUAL;

  // Load initial data
  useEffect(() => {
    if (visible && tutoriaId) {
      loadData();
    }
  }, [visible, tutoriaId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load both initial data and tutoria details in parallel
      const [subjectsData, blocksData, tutoriaDetails] = await Promise.all([
        generalInfoService.getInfo('materias'),
        generalInfoService.getInfo('bloques'),
        scheduleService.getScheduleById(tutoriaId)
      ]);

      // Set subjects
      setSubjects(subjectsData.map(subject => ({
        label: subject.subjectName,
        value: subject.subjectId
      })));

      // Set blocks
      setBlocks(blocksData.map(block => ({
        label: `${block.blockName} (${block.section})`,
        value: block.blockId.toString(),
        data: block
      })));

      // Set tutoria data
      setTutoriaData(tutoriaDetails);
      console.log(tutoriaDetails)

      // If it's presencial mode, load classroom info and availabilities
      if (tutoriaDetails.type === MODALITIES.PRESENCIAL) {
        const classroomInfo = await generalInfoService.getInfoById('salones', tutoriaDetails.classroomId);

        // Format the date from tutoriaDetails to match day of week
        const date = new Date(tutoriaDetails.scheduleDate);
        const daysOfWeek = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
        const dayOfWeek = daysOfWeek[date.getDay()];

        // Find the matching availability
        const matchedAvailability = classroomInfo.availabilities.find(avail =>
          avail.dayOfWeek === dayOfWeek &&
          avail.startTime === tutoriaDetails.startTime &&
          avail.endTime === tutoriaDetails.endTime
        );

       setFormState(prev => ({
          ...prev,
          selectedBlock: classroomInfo.blockId.toString(),
          selectedClassroom: classroomInfo.classroomId.toString(),
          selectedDate: tutoriaDetails.scheduleDate,
          selectedAvailability: matchedAvailability ? matchedAvailability.availabilityId.toString() : null,
          availableClassrooms: [{
            label: classroomInfo.location,
            value: classroomInfo.classroomId.toString()
          }],
          availableTimeSlots: classroomInfo.availabilities
            .filter(avail => avail.dayOfWeek === dayOfWeek)
            .map(avail => ({
              label: `${avail.startTime.slice(0, 5)} - ${avail.endTime.slice(0, 5)}`,
              value: avail.availabilityId.toString()
            }))
        }));
      
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get initial values based on tutoria data from API
  const getInitialValues = () => {
    if (!tutoriaData || !subjects.length) return {};

    // Format date from API response (2025-06-20T00:00:00 -> DD-MM-YYYY)
    const formatDateFromAPI = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const baseValues = {
      materia: tutoriaData.subjectId,
      descripcion: tutoriaData.description || '',
      fecha: formatDateFromAPI(tutoriaData.scheduleDate),
    };

    if (isVirtual) {
      // Format time from API (12:30:00 -> 12:30)
      const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.slice(0, 5); // Remove seconds
      };

      return {
        ...baseValues,
        horaInicio: formatTime(tutoriaData.startTime),
        horaFin: formatTime(tutoriaData.endTime),
      };
    } else {
      return {
        ...baseValues,
        bloque: formState.selectedBlock || '',
        salon: formState.selectedClassroom || '',
        disponibilidad: formState.selectedAvailability || '',
      };
    }
  };

  const validationSchema = isVirtual ? virtualSchema : presencialSchema;

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const subjectId = subjects.find(s => s.label === values.materia)?.value;

      const baseData = {
        subjectId,
        description: values.descripcion,
        type: tutoriaData.type,
        scheduleDate: formatDate(values.fecha),
      };

      let updateData;
      if (isVirtual) {
        updateData = {
          ...baseData,
          startTime: values.horaInicio + ':00',
          endTime: values.horaFin + ':00',
          scheduleDate: formatDate(values.fecha, '00:00')
        };
      } else {
        const selectedTimeSlot = formState.availableTimeSlots
          .find(slot => slot.label === values.disponibilidad)?.data;

        const [startHours, startMinutes] = selectedTimeSlot?.startTime?.split(':') || ['00', '00'];

        updateData = {
          ...baseData,
          availabilityId: selectedTimeSlot?.availabilityId,
          scheduleDate: formatDate(values.fecha, `${startHours}:${startMinutes}`)
        };
      }

      console.log('Updating tutoria with data:', updateData);

      // Call update service
      await scheduleService.updateSchedule(tutoriaData.scheduleId, updateData);

      onSuccess?.('Tutoría actualizada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error updating tutoria:', error);
      // Handle error - maybe show an error message
    } finally {
      setSaving(false);
    }
  };

  // Handle block change for presencial mode
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

    setFormState(prev => ({
      ...prev,
      selectedBlock: blockData,
      selectedClassroom: null,
      availableClassrooms: classrooms,
      availableTimeSlots: []
    }));
  };

  // Handle classroom change for presencial mode
  const handleClassroomChange = (item, setFieldValue) => {
    setFieldValue('salon', item.label);
    setFieldValue('disponibilidad', '');

    setFormState(prev => ({
      ...prev,
      selectedClassroom: item,
      availableTimeSlots: []
    }));

    if (formState.selectedDate) {
      updateAvailableTimeSlots(item, formState.selectedDate);
    }
  };

  // Handle date change
  const handleDateChange = (date, setFieldValue) => {
    setFieldValue('fecha', date);
    setFieldValue('disponibilidad', '');

    setFormState(prev => ({
      ...prev,
      selectedDate: date,
      availableTimeSlots: []
    }));

    if (!isVirtual && formState.selectedClassroom) {
      updateAvailableTimeSlots(formState.selectedClassroom, date);
    }
  };

  // Update available time slots for presencial mode
  const updateAvailableTimeSlots = (classroom, date) => {
    if (!classroom?.data?.availabilities || !date) {
      setFormState(prev => ({ ...prev, availableTimeSlots: [] }));
      return;
    }

    const dayOfWeek = getDayOfWeekFromDate(date);
    if (!dayOfWeek) {
      setFormState(prev => ({ ...prev, availableTimeSlots: [] }));
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

    setFormState(prev => ({ ...prev, availableTimeSlots: timeSlots }));
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
              Editar Tutoría
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
              {({ handleSubmit, setFieldValue, values, errors, touched }) => (
                <View className="flex-1">
                  <ScrollView
                    className="flex-1 px-4 py-6"
                    showsVerticalScrollIndicator={false}
                  >
                    {/* Subject */}
                    <DropdownInput
                      label="Materia"
                      labelIcon={<FontAwesome5 name="book" size={16} color="black" />}
                      items={subjects}
                      selectedValue={values.materia}
                      onValueChange={(item) => setFieldValue('materia', item.label)}
                      error={errors.materia}
                      touched={touched.materia}
                      placeholder="Selecciona una materia"
                    />
                    <SizedBox height={16} />

                    {/* Description */}
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

                    {/* Date */}
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
                    <SizedBox height={16} />

                    {/* Presencial fields */}
                    {!isVirtual && (
                      <>
                        <DropdownInput
                          label="Bloque"
                          labelIcon={<Entypo name="location-pin" size={18} color="black" />}
                          items={blocks}
                          selectedValue={values.bloque}
                          onValueChange={(item) => handleBlockChange(item, setFieldValue)}
                          error={errors.bloque}
                          touched={touched.bloque}
                          placeholder="Selecciona un bloque"
                        />
                        <SizedBox height={16} />

                        <DropdownInput
                          label="Salón"
                          labelIcon={<Entypo name="home" size={18} color="black" />}
                          items={formState.availableClassrooms}
                          selectedValue={values.salon}
                          onValueChange={(item) => handleClassroomChange(item, setFieldValue)}
                          error={errors.salon}
                          touched={touched.salon}
                          disabled={!formState.selectedBlock || formState.availableClassrooms.length === 0}
                          placeholder={!formState.selectedBlock ? "Selecciona un bloque primero" : "Selecciona un salón"}
                        />
                        <SizedBox height={16} />

                        <DropdownInput
                          label="Horario disponible"
                          labelIcon={<FontAwesome5 name="clock" size={16} color="black" />}
                          items={formState.availableTimeSlots}
                          selectedValue={values.disponibilidad}
                          onValueChange={(item) => setFieldValue('disponibilidad', item.label)}
                          error={errors.disponibilidad}
                          touched={touched.disponibilidad}
                          disabled={formState.availableTimeSlots.length === 0 || !formState.selectedDate || !formState.selectedClassroom}
                          placeholder={
                            !formState.selectedDate ? "Selecciona una fecha primero" :
                              !formState.selectedClassroom ? "Selecciona un salón primero" :
                                formState.availableTimeSlots.length === 0 ? "No hay horarios disponibles para esta fecha" :
                                  "Selecciona un horario"
                          }
                        />
                      </>
                    )}

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
                  </ScrollView>

                  {/* Footer buttons */}
                  <View className="px-4 py-6 border-t border-gray-200">
                    <View className="flex-row space-x-3">
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
              )}
            </Formik>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditTutoriaModal;