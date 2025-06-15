import { useState } from "react";
import { availabilityService } from "../../service/availabilityService";
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage'

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
    selectedBlock: null,
    selectedClassroom: null,
    selectedDate: null,
    availableClassrooms: [],
    availableTimeSlots: [],
    loadingAvailability: false
  });

  const getIsVirtual = (currentModality) => currentModality === 'VIRTUAL';

  const getInitialValues = (modalidad = '') => ({
    materia: '',
    modalidad: modalidad,
    descripcion: '',
    fecha: '',
    ...(modalidad === 'VIRTUAL'
      ? { horaInicio: '', horaFin: '' }
      : { bloque: '', salon: '', disponibilidad: '' }
    )
  });

  const getValidationSchema = (modalidad) =>
    getIsVirtual(modalidad) ? virtualSchema : presencialSchema;

  const updateFormState = (updates) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const handleModalityChange = (item, setFieldValue, values) => {
    const newModality = item.value;
    setFieldValue('modalidad', newModality);

    // Limpiar campos según nueva modalidad
    if (newModality === 'VIRTUAL') {
      setFieldValue('bloque', '');
      setFieldValue('salon', '');
      setFieldValue('disponibilidad', '');
    } else {
      setFieldValue('horaInicio', '');
      setFieldValue('horaFin', '');
    }

    updateFormState({
      selectedBlock: null,
      selectedClassroom: null,
      availableClassrooms: [],
      availableTimeSlots: []
    });
  };

  const handleBlockChange = (item, setFieldValue) => {
    const blockData = blocks.find(block => block.blockId === item.value);

    setFieldValue('bloque', item.value);
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
    setFieldValue('salon', item.value);
    setFieldValue('disponibilidad', '');

    const selectedClassroom = formState.availableClassrooms.find(classroom => classroom.value === item.value);

    updateFormState({
      selectedClassroom: selectedClassroom,
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

    if (!getIsVirtual && formState.selectedClassroom) {
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
    const subjectId = values.materia;

    const baseData = {
      subjectId,
      userId,
      description: values.descripcion,
      type: values.modalidad,
      scheduleDate: formatDate(values.fecha, 'submit'),
    };

    if (values.modalidad === "VIRTUAL") {
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

  const resetData = () => {
    setFormState({
      modalidad: null,
      selectedBlock: null,
      selectedClassroom: null,
      selectedDate: null,
      availableClassrooms: [],
      availableTimeSlots: [],
      loadingAvailability: false
    });
  };

  return {
    formState,
    getIsVirtual,
    getInitialValues,
    getValidationSchema,
    handleModalityChange,
    handleBlockChange,
    handleClassroomChange,
    handleDateChange,
    buildTutoriaData,
    resetData,
    formatDate
  };
};

export default useFormLogic;