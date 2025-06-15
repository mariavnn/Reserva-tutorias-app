import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from 'react';
import SelectorTabStudent from '../../../../components/SelectorTabStudent';
import ReservarTutoriaCard from '../../../../components/ReservarTutoriaCard';
import ConfirmReservaModal from '../../../../components/modals/ConfirmReservaModal';
import ConfirmCancelModal from '../../../../components/modals/ConfirmCancelModal';
import { router } from 'expo-router';
import { useTutoriaStore } from '../../../../store/useTutoriasStore';
import { bookingService } from '../../../../service/bookingService';
import SuccessModal from '../../../../components/modals/SuccessModal';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SizedBox from '../../../../components/SizedBox';

const TutoriasStudent = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Disponibles');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedTutoriaId, setSelectedTutoriaId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const { loading, error, loadTutoring, finalizados, disponibles, agendados } = useTutoriaStore();

  useEffect(() => {
    loadTutoring();
  }, [loadTutoring]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTutoring().then(() => setRefreshing(false));
  }, [loadTutoring]);

  const getSessionsByTab = () => {
    switch (selectedTab) {
      case 'Disponibles':
        return disponibles;
      case 'Agendadas':
        return agendados;
      case 'Historial':
        return finalizados;
      default:
        return [];
    }
  };

  const filteredTutorias = getSessionsByTab();

  const handleOnJoin = (session) => {
    setSelectedSession(session);
    setSelectedTutoriaId(session.idHorario);

    if (selectedTab === 'Disponibles') {
      setModalVisible(true);
    } else if (selectedTab === 'Agendadas') {
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
      setMessage("Tutoría agendada exitosamente!");
      await loadTutoring();
    } catch (err) {
      console.error('Error al agendar tutoría:', err);
      Alert.alert('Error', 'No se pudo agendar la tutoría');
    } finally {
      setSelectedSession(null);
      setSelectedTutoriaId(null);
    }
  };

  const handleCancel = async () => {
    if (!selectedSession?.agendados?.[0]?.id) {
      Alert.alert('Error', 'No se ha seleccionado una tutoría válida para cancelar');
      return;
    }

    try {
      await bookingService.deleteBookingByUserId(selectedSession.agendados[0].id);
      await loadTutoring();
      setSuccess(true);
      setMessage("Tutoría cancelada exitosamente!");
    } catch (err) {
      console.error('Error al cancelar tutoría:', err);
      Alert.alert('Error', 'No se pudo cancelar la tutoría');
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
              loadTutoring();
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
        <SelectorTabStudent
          tabs={['Disponibles', 'Agendadas', 'Historial']}
          selectedTab={selectedTab}
          onSelect={setSelectedTab}
        />
        <SizedBox height={5} />
        <ScrollView
          className="w-full"
          contentContainerStyle={{ paddingBottom: 58, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredTutorias.length === 0 ? (
            <View className="flex-1 w-full items-center mt-48">
              <MaterialCommunityIcons name="file-cancel-outline" size={45} color="gray" />
              <Text className="text-gray-500">No hay tutorías {selectedTab.toLowerCase()}</Text>
            </View>
          ) : (
            filteredTutorias.map((session) => (
              <ReservarTutoriaCard
                key={session.idHorario}
                data={session}
                onJoin={() => handleOnJoin(session)}
                status={selectedTab === 'Agendadas' ? 'Agendada' : selectedTab === 'Historial' ? 'Finalizada' : 'Disponible'}
              />
            ))
          )}
        </ScrollView>
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