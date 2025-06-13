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
import DropdownInput from '../../../components/DropdownInput'
import { Formik } from 'formik';
import { scheduleService } from '../../../service/scheduleService';
import { useFormDataStore } from '../../../store/useFormTutoriaStore';
import LoadingIndicator from '../../../components/LoadingIndicator';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import useFormLogic from '../../../store/useFormLogic';

export default function EditTutoriaModal({ visible, onClose, tutoriaId, onSuccess }) {
  const { subjects, blocks } = useFormDataStore()
  const [initialData, setInitialData] = useState(null)
  const [saving, setSaving] = useState(false)

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

  const formLogic = useFormLogic(subjectOptions, blocks)

  // Cargar datos iniciales de la tutoría
  useEffect(() => {
    if (visible && tutoriaId) {
      const loadTutoriaData = async () => {
        try {
          const data = await scheduleService.getScheduleById(tutoriaId)
          setInitialData({
            ...data,
            // Convertir datos para el formulario
            materia: subjects.find(s => s.idMateria === data.subjectId)?.nombreMateria || '',
            modalidad: data.type,
            descripcion: data.description,
            fecha: formLogic.formatDate(data.scheduleDate),
            ...(data.type === 'VIRTUAL'
              ? {
                horaInicio: formatTime(data.startTime),
                horaFin: formatTime(data.endTime)
              }
              : {
                bloque: blocks.find(b =>
                  b.classrooms?.some(c => c.classroomId === data.classroomId)
                )?.blockName || '',
                salon: data.classroomId ? `${data.classroomId}` : '',
                disponibilidad: data.availabilityId ? `${data.availabilityId}` : ''
              }
            )
          })
        } catch (error) {
          console.error('Error loading tutoria data:', error)
        }
      }
      loadTutoriaData()
    } else {
      setInitialData(null)
    }
  }, [visible, tutoriaId])

  const formatTime = (timeString) => {
    if (!timeString) return ''
    return timeString.slice(0, 5)
  }

  const handleSubmit = async (values) => {
    try {
      setSaving(true)
      const tutoriaData = await formLogic.buildTutoriaData(values)

      await scheduleService.saveSchedule(tutoriaData, tutoriaId)

      onSuccess?.('Tutoría actualizada exitosamente')
      onClose()
    } catch (error) {
      console.error('Error updating tutoria:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!initialData) {
    return (
      <Modal visible={visible} onRequestClose={onClose}>
        <View className="flex-1 justify-center items-center">
          <LoadingIndicator size="large" />
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
            validationSchema={formLogic.getValidationSchema()}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ handleSubmit, setFieldValue, values, errors, touched }) => (
              <View className="flex-1">
                <ScrollView
                  className="px-4 py-6"
                  showsVerticalScrollIndicator={false}
                >
                  {/* Modalidad (solo lectura) */}
                  <View className="mb-4">
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
                  <DropdownInput
                    label="Materia"
                    labelIcon={<Feather name="book" size={16} color="black" />}
                    items={subjectOptions}
                    selectedValue={values.materia}
                    onValueChange={(item) => setFieldValue('materia', item.label)}
                    error={errors.materia}
                    touched={touched.materia}
                  />
                  <SizedBox height={16} />

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
                  <SizedBox height={16} />

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
                  <SizedBox height={16} />

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
                      <SizedBox height={16} />

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
                      <DropdownInput
                        label="Bloque"
                        labelIcon={<Feather name="map-pin" size={18} color="black" />}
                        items={blockOptions}
                        selectedValue={values.bloque}
                        onValueChange={(item) => formLogic.handleBlockChange(item, setFieldValue)}
                        error={errors.bloque}
                        touched={touched.bloque}
                      />
                      <SizedBox height={16} />

                      <DropdownInput
                        label="Salón"
                        labelIcon={<FontAwesome6 name="building" size={18} color="black" />}
                        items={formLogic.formState.availableClassrooms}
                        selectedValue={values.salon}
                        onValueChange={(item) => formLogic.handleClassroomChange(item, setFieldValue)}
                        error={errors.salon}
                        touched={touched.salon}
                        disabled={!formLogic.formState.selectedBlock}
                        placeholder={!formLogic.formState.selectedBlock ? "Selecciona un bloque primero" : "Selecciona un salón"}
                      />
                      <SizedBox height={16} />

                      <DropdownInput
                        label="Horario disponible"
                        labelIcon={<FontAwesome6 name="clock" size={16} color="black" />}
                        items={formLogic.formState.availableTimeSlots}
                        selectedValue={values.disponibilidad}
                        onValueChange={(item) => setFieldValue('disponibilidad', item.value)}
                        error={errors.disponibilidad}
                        touched={touched.disponibilidad}
                        disabled={formLogic.formState.availableTimeSlots.length === 0}
                        placeholder={
                          formLogic.formState.availableTimeSlots.length === 0 ?
                            "No hay horarios disponibles" :
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
                        disabled={saving}
                        type="secondary"
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
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}