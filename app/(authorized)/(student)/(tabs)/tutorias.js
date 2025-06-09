import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from 'react';
import SelectorTabStudent from '../../../../components/SelectorTabStudent';
import { ScrollView } from 'react-native';
import ReservarTutoriaCard from '../../../../components/ReservarTutoriaCard';
import ConfirmReservaModal from '../../../../components/modals/ConfirmReservaModal';
import ConfirmCancelModal from '../../../../components/modals/ConfirmCancelModal';
import { router } from 'expo-router';
import { useTutoriaStore } from '../../../../store/useTutoriasStore';
import { bookingService } from '../../../../service/bookingService';
import SuccessModal from '../../../../components/modals/SuccessModal';
import LoadingIndicator from '../../../../components/LoadingIndicator';

const TutoriasStudent = () => {
  const [selectedTab, setSelectedTab] = useState('Disponibles');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedTutoriaId, setSelectedTutoriaId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [message, setMessage] = useState('')

  const { sesiones, loading, error, loadAvailableTutorings, setError } = useTutoriaStore();

  // Cargar agendadas por el usuario
  const loadBookings = useCallback(async () => {
    try {
      const bookings = await bookingService.getBookingByUserId();
      setUserBookings(bookings);
    } catch (err) {
      console.error('Error al cargar tutorías agendadas:', err);
    }
  }, []);

  useEffect(() => {
    loadAvailableTutorings();
    loadBookings();
  }, [loadAvailableTutorings, loadBookings]);

  const sesionesConEstado = sesiones.map((sesion) => {
    const booking = userBookings.find((b) => b.scheduleId === sesion.id);
    if (booking) {
      return { 
        ...sesion, 
        status: 'Agendada',
        idAgendado: booking.bookingId
      };
    }
    return { ...sesion, status: 'Disponible' };
  });

  const filteredSessions = sesionesConEstado.filter((s) => {
    if (selectedTab === 'Disponibles') return s.status === 'Disponible';
    if (selectedTab === 'Agendadas') return s.status === 'Agendada';
    return false;
  });

  const handleOnJoin = (session) => {
    setSelectedSession(session);
    setSelectedTutoriaId(session.id);

    if (session.status === 'Disponible') {
      setModalVisible(true);
    } else if (session.status === 'Agendada') {
      setModalCancel(true);
    }
  };

  const handleBooking = async () => {
    if (!selectedTutoriaId) {
      Alert.alert('Error', 'No se ha seleccionado una tutoría válida');
      return;
    }

    try {
      await bookingService.postBookingByUserId(selectedTutoriaId);
      setModalVisible(false);
      setSuccess(true);
      setMessage("Tutoría agendada exitosamente!")
      await loadAvailableTutorings();
      await loadBookings();
    } catch (err) {
      console.error('Error al agendar tutoría:', err);
      Alert.alert('Error', 'No se pudo agendar la tutoría');
    } finally {
      setSelectedSession(null);
      setSelectedTutoriaId(null);
    }
  };

  const handleCancel = async () => {
    console.log('ID de la sesión:', selectedTutoriaId);
    console.log('ID del agendado:', selectedSession?.idAgendado);
    
    if (!selectedSession?.idAgendado) {
      Alert.alert('Error', 'No se ha seleccionado una tutoría válida para cancelar');
      return;
    }

    try {
      await bookingService.deleteBookingByUserId(selectedSession.idAgendado);
      
      await loadAvailableTutorings();
      await loadBookings();
      setSuccess(true);
      setMessage("Tutoría cancelada exitosamente!")
    } catch (err) {
      console.error('Error al cancelar tutoría:', err);
    } finally {
      setModalCancel(false);
      setSelectedSession(null);
      setSelectedTutoriaId(null);
    }
  };

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center">
          <LoadingIndicator size="large" color="#2673DD" />
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

      <SuccessModal
        visible={success}
        onClose={() => setSuccess(false)}
        message={message}
      />

      <ConfirmReservaModal
        visible={modalVisible}
        data={selectedSession}
        onClose={() => {
          setModalVisible(false);
          setSelectedSession(null);
          setSelectedTutoriaId(null);
        }}
        onConfirm={handleBooking}
      />

      <ConfirmCancelModal
        visible={modalCancel}
        data={selectedSession}
        onClose={() => {
          console.log(selectedSession)
          setModalCancel(false);
          setSelectedSession(null);
          setSelectedTutoriaId(null);
        }}
        onConfirm={handleCancel}
      />
    </Screen>
  );
};

export default TutoriasStudent;