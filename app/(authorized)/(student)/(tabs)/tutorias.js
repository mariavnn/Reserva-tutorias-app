import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import SearchBar from '../../../../components/SearchBar';
import { useState } from 'react';
import SelectorTabStudent from '../../../../components/SelectorTabStudent';
import { ScrollView } from 'react-native';
import ReservarTutoriaCard from '../../../../components/ReservarTutoriaCard';
import ConfirmReservaModal from '../../../../components/modals/ConfirmReservaModal';
import ConfirmCancelModal from '../../../../components/modals/ConfirmCancelModal';
import { router } from 'expo-router';
import { scheduleService } from '../../../../service/scheduleService';
import { useTutorStore } from '../../../../store/useTutorStore';

const TutoriasStudent = () => {
  const [selectedTab, setSelectedTab] = useState('Disponibles');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapToSessionCardData = (horarios = []) =>
    horarios
      .slice() // para no mutar el array original
      .sort((a, b) => new Date(a.fechaHorario) - new Date(b.fechaHorario))
      .map((horario) => ({
        id: horario.idHorario,
        title: `${horario.materia.nombreMateria}`,
        tutor: `Tutor ${horario.usuario.nombre} ${horario.usuario.apellido}`,
        description: horario.descripcion,
        starTime: horario.horaInicio.substring(0, 5),
        endTime: horario.horaFin.substring(0, 5),
        current: horario.agendados?.length ?? 0,
        max: 5,
        status: horario.modo === 'DISPONIBLE' ? 'Disponible' : 'Agendada',
        mode: horario.tipo,
        date: horario.fechaHorario,
        location: horario.salon
          ? `${horario.salon.descripcion ? horario.salon.descripcion + ' - ' : ''}${horario.salon.ubicacion} (${horario.salon.bloque?.seccion})`
          : null,
      }));


  const loadAvailableTutorings = useCallback(async () => {
    setLoading(true);
    try {
      const { message, data } = await scheduleService.getScheduleWithFilters({
        subjectIds: [4, 2, 5, 6, 1],
        mode: 'DISPONIBLE',
      });
      setSessions(mapToSessionCardData(data));
      console.log(message, data);
    } catch (err) {
      console.error('Error al cargar tutorías:', err);
      setError('Error al cargar las tutorías disponibles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTab === 'Disponibles') {
      loadAvailableTutorings();
    }
    // Aquí podrías cargar agendadas o historial en el futuro
  }, [selectedTab, loadAvailableTutorings]);

  const filteredSessions = sessions.filter((session) => {
    if (selectedTab === 'Disponibles') return session.status === 'Disponible';
    if (selectedTab === 'Agendadas') return session.status === 'Agendada';
    return false; // Para el caso de 'Historial'
  });

  const handleOnJoin = (data) => {
    setSelectedSession(data);
    if (data.status === 'Disponible') {
      setModalVisible(true);
    } else if (data.status === 'Agendada') {
      setModalCancel(true);
    }
  };

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2673DD" />
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500">{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError(null);
              loadAvailableTutorings();
            }}
            className="mt-4 bg-blue-500 px-4 py-2 rounded"
          >
            <Text className="text-white">Reintentar</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="w-full flex-1 px-4">
        {/* Título y botón de tutores */}
        <View className="w-full flex-row justify-between items-center">
          <GeneralTitle label="Tutorías" type="primary" className="!text-blue-500 mt-4" />
          <TouchableOpacity
            onPress={() => router.push('/(authorized)/(student)/tutoresDisponibles')}
            className="justify-center items-center mt-3"
          >
            <FontAwesome6 name="users" size={20} color="#2673DD" />
            <Text className="text-center text-blue-500">Tutores</Text>
          </TouchableOpacity>
        </View>

        {/* Buscador y tabs */}
        {/* <SearchBar /> */}
        <SelectorTabStudent
          tabs={['Disponibles', 'Agendadas', 'Historial']}
          selectedTab={selectedTab}
          onSelect={setSelectedTab}
        />

        {/* Lista de tutorías */}
        <View className="flex-1">
          {filteredSessions.length === 0 ? (
            <View className="flex-1 justify-center items-center mt-10">
              <Text className="text-gray-500">No hay tutorías {selectedTab.toLowerCase()}</Text>
            </View>
          ) : (
            <ScrollView>
              {filteredSessions.map((session) => (
                <ReservarTutoriaCard
                  key={session.id}
                  data={session}
                  onJoin={() => handleOnJoin(session)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>

      {/* Modales */}
      <ConfirmReservaModal
        visible={modalVisible}
        data={selectedSession}
        onClose={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          // Aquí puedes actualizar el estado o recargar
        }}
      />

      <ConfirmCancelModal
        visible={modalCancel}
        data={selectedSession}
        onClose={() => setModalCancel(false)}
        onConfirm={() => {
          setSessions((prev) => prev.filter((s) => s.id !== selectedSession.id));
          setModalCancel(false);
        }}
      />
    </Screen>
  );
};

export default TutoriasStudent;