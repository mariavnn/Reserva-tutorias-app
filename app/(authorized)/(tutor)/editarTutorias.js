import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';

import SizedBox from '../../../components/SizedBox';
import InputField from '../../../components/InputField';
import InputDate from '../../../components/InputDate';
import InputHour from '../../../components/InputHour';
import GeneralButton from '../../../components/GeneralButton';
import { Formik } from 'formik';
import { scheduleService } from '../../../service/scheduleService';
import { useFormDataStore } from '../../../store/useFormTutoriaStore';
import LoadingIndicator from '../../../components/LoadingIndicator';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import useFormLogic from '../../../store/hooks/useFormLogic';
import NewDropdown from '../../../components/NewDropdown';
import Entypo from '@expo/vector-icons/Entypo';

export default function EditTutoriaModal({ visible, onClose, tutoriaId, onSuccess }) {
  const { subjects, blocks, loadInitialData, loadTutoriaData, tutoriaData, loading } = useFormDataStore()
  const [initialData, setInitialData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  const [originalValues, setOriginalValues] = useState(null)

  const subjectOptions = useMemo(() =>
    subjects.map(subject => ({
      label: subject.nombreMateria,
      value: subject.idMateria
    })), [subjects]
  );

  const blockOptions = useMemo(() =>
    blocks.map(block => ({
      label: `${block.blockName} (${block.section})`,
      value: block.blockId
    })), [blocks]
  );

  const formLogic = useFormLogic(subjectOptions, blocks)

  const convertirFecha = (fechaOriginal) => {
    const partes = fechaOriginal.split('-');

    const año = partes[0];
    const mes = partes[1];
    const día = partes[2];

    const mesSinCero = mes.startsWith('0') ? mes.substring(1) : mes;

    return `${día}-${mesSinCero}-${año}`;
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    return timeString.slice(0, 5)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!visible || !tutoriaId) {
        setDataLoaded(false);
        setInitialData(null);
        setOriginalValues(null);
        return;
      }

      try {
        setDataLoaded(false);
        setInitialData(null);

        await loadInitialData();
        await loadTutoriaData(tutoriaId);

        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading data:', error);
        setDataLoaded(false);
      }
    };

    fetchData();
  }, [visible, tutoriaId, loadInitialData, loadTutoriaData]);

  
  useEffect(() => {
    if (dataLoaded && tutoriaData && subjects.length > 0 && blocks.length > 0) {

      const initialValues = {
        ...formLogic.getInitialValues(tutoriaData.type), // Pasa la modalidad conocida
        materia: tutoriaData.subjectId,
        descripcion: tutoriaData.description || '',
        fecha: convertirFecha(tutoriaData.scheduleDate),
        // Campos específicos según modalidad
        ...(tutoriaData.type === 'VIRTUAL' ? {
          horaInicio: formatTime(tutoriaData.startTime),
          horaFin: formatTime(tutoriaData.endTime)
        } : {
          bloque: tutoriaData.blockId ?? '',
          salon: tutoriaData.classroomId ?? '',
          disponibilidad: tutoriaData.availabilityId ?? ''
        })
      };

      setInitialData(initialValues);
      setOriginalValues(initialValues);
    }
  }, [dataLoaded, tutoriaData, subjects, blocks]);

  useEffect(() => {
    if (initialData && initialData.modalidad === 'PRESENCIAL') {
      // Verificar si tenemos todos los datos necesarios
      if (initialData.bloque && initialData.salon && initialData.fecha) {
        const selectedBlock = blocks.find(block => block.blockId === initialData.bloque);
        if (selectedBlock) {
          // Forzar la carga de disponibilidades
          formLogic.handleBlockChange({ value: initialData.bloque }, () => { });
          setTimeout(() => {
            formLogic.handleClassroomChange({ value: initialData.salon }, () => { });
            formLogic.handleDateChange(initialData.fecha, () => { });
          }, 300);
        }
      }
    }
  }, [initialData, blocks]);

  const handleSubmit = async (values) => {
    try {
      setSaving(true)

      // Validación adicional
      if (initialData.modalidad === 'PRESENCIAL' && !values.disponibilidad) {
        throw new Error('Debes seleccionar un horario disponible');
      }


      const tutoriaData = await formLogic.buildTutoriaData(values)
      await scheduleService.saveSchedule(tutoriaData, tutoriaId)

      onSuccess?.('Tutoría actualizada exitosamente')
      onClose()
    } catch (error) {
      console.error('Error updating tutoria:', error)
      // Mostrar el error al usuario
      alert(error.message || 'Error al actualizar la tutoría')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = (currentValues) => {
    if (!originalValues) return false;

    const keysToCompare = [
      'materia',
      'descripcion',
      'fecha',
      ...(currentValues.modalidad === 'VIRTUAL'
        ? ['horaInicio', 'horaFin']
        : ['bloque', 'salon', 'disponibilidad']
      )
    ];

    return keysToCompare.some(key => {
      const currentVal = String(currentValues[key] || '');
      const originalVal = String(originalValues[key] || '');
      return currentVal !== originalVal;
    });
  };

  // Mostrar loading mientras se cargan los datos o no hay initialData
  if (loading || !dataLoaded || !initialData) {
    return (
      <Modal visible={visible} onRequestClose={onClose}>
        <View className="flex-1 justify-center items-center">
          <LoadingIndicator size="large" />
          <Text className="mt-4 text-gray-600">Cargando datos de la tutoría...</Text>
        </View>
      </Modal>
    )
  }

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
              <FontAwesome6 name="xmark" size={24} color="#666" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-blue-500">
              Editar Tutoría {initialData.modalidad === 'VIRTUAL' ? 'Virtual' : 'Presencial'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <Formik
            initialValues={initialData}
            onSubmit={handleSubmit}
            validationSchema={formLogic.getValidationSchema(initialData.modalidad)}
            enableReinitialize
          >
            {({ handleSubmit: formikSubmit, setFieldValue, values, errors, touched }) => (
                <View className="flex-1">
                  <ScrollView
                    className="px-4 pt-6"
                    showsVerticalScrollIndicator={false}
                  >
                    {/* Modalidad (solo lectura) */}
                    <View className="">
                      {/* <FontAwesome6 name="laptop" size={16} color="black" /> */}
                      <Text className="text-sm font-medium text-gray-700 mb-1">
                        Modalidad
                      </Text>
                      <View className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                        <Text>
                          {initialData.modalidad === 'VIRTUAL' ? 'Virtual' : 'Presencial'}
                        </Text>
                      </View>
                    </View>

                    {/* Materia */}
                    <NewDropdown
                      label="Materia"
                      value={values.materia}
                      onValueChange={(value) => {
                        setFieldValue('materia', value)
                      }}
                      options={subjectOptions}
                      labelIcon={<Feather name="book" size={16} color="black" />}
                      error={errors.materia && touched.materia ? errors.materia : null}
                      placeholder="Selecciona una materia"
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
                      placeholder="(ej: 11-6-2025)"
                      type="date"
                      value={values.fecha}
                      onChange={(date) => formLogic.handleDateChange(date, setFieldValue)}
                      error={errors.fecha}
                      touched={touched.fecha}
                      labelIcon={<FontAwesome6 name="calendar" size={16} color="black" />}
                    />

                    {/* Campos según modalidad */}
                    {initialData.modalidad === 'VIRTUAL' ? (
                      <>
                        <InputHour
                          label="Hora de inicio"
                          placeholder="HH:MM (ej: 09:00)"
                          value={values.horaInicio}
                          onChange={(hora) => setFieldValue('horaInicio', hora)}
                          error={errors.horaInicio}
                          touched={touched.horaInicio}
                          labelIcon={<FontAwesome6 name="clock" size={16} color="black" />}
                        />

                        <InputHour
                          label="Hora de fin"
                          placeholder="HH:MM (ej: 11:00)"
                          value={values.horaFin}
                          onChange={(hora) => setFieldValue('horaFin', hora)}
                          error={errors.horaFin}
                          touched={touched.horaFin}
                          labelIcon={<FontAwesome6 name="clock" size={16} color="black" />}
                          minTime={values.horaInicio}
                        />
                      </>
                    ) : (
                      <>
                        <NewDropdown
                          label="Bloque"
                          value={values.bloque}
                          onValueChange={(value) => formLogic.handleBlockChange({ value }, setFieldValue)}
                          options={blockOptions}
                          error={errors.bloque && touched.bloque ? errors.bloque : null}
                          labelIcon={<Entypo name="location-pin" size={18} color="black" />}
                          placeholder="Selecciona un bloque"
                        />

                        <NewDropdown
                          label="Salón"
                          value={values.salon}
                          onValueChange={(value) => formLogic.handleClassroomChange({ value }, setFieldValue)}
                          options={formLogic.formState.availableClassrooms}
                          error={errors.salon && touched.salon ? errors.salon : null}
                          disabled={!formLogic.formState.selectedBlock}
                          labelIcon={<Entypo name="home" size={18} color="black" />}
                          placeholder={!formLogic.formState.selectedBlock ? "Selecciona un bloque primero" : "Selecciona un salón"}
                        />

                        <NewDropdown
                          label="Horario disponible"
                          value={values.disponibilidad}
                          onValueChange={(value) => setFieldValue('disponibilidad', value)}
                          options={formLogic.formState.availableTimeSlots}
                          error={errors.disponibilidad && touched.disponibilidad ? errors.disponibilidad : null}
                          disabled={formLogic.formState.availableTimeSlots.length === 0}
                          labelIcon={<FontAwesome6 name="clock" size={16} color="black" />}
                          placeholder={
                            formLogic.formState.availableTimeSlots.length === 0 ?
                              "No hay horarios disponibles" :
                              "Selecciona un horario"
                            // `${initialData.horaInicio} - ${initialData.horaFin} Re-selecciona el salon par ver más disponibilidades`
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
                          disabled={saving}
                          type="secondary"
                        />
                      </View>
                      <View className="flex-1">
                        <GeneralButton
                          title={saving ? "Guardando..." : "Guardar cambios"}
                          onPress={() => formikSubmit()}
                          disabled={saving || !hasChanges(values)}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}