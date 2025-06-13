import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import GeneralTitle from '../../../../components/GeneralTitle'
import SizedBox from '../../../../components/SizedBox'
import TutoriasCard from '../../../../components/tutoriasCard'
import { Screen } from '../../../../components/Screen'
import { scheduleService } from '../../../../service/scheduleService'
import SuccessModal from '../../../../components/modals/SuccessModal'
import ConfirmModal2 from '../../../../components/modals/ConfirmModal2'
import EditarTutoriaTutor from '../editarTutorias'
import { useTutoriaStore } from '../../../../store/useTutoriasStore'
import LoadingIndicator from '../../../../components/LoadingIndicator'
import SelectorTabStudent from '../../../../components/SelectorTabStudent'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function HomeTutor() {
  const [refreshing, setRefreshing] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTutoriaId, setSelectedTutoriaId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { loadTutoring, loading, activos, finalizados } = useTutoriaStore();
  const [selectedTab, setSelectedTab] = useState('Activos');

  useEffect(() => {
    loadTutoring();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTutoring().then(() => setRefreshing(false));
  }, [loadTutoring]);

  const getSessionsByTab = () => {
    switch (selectedTab) {
      case 'Activos':
        return activos;
      case 'Historial':
        return finalizados;
      default:
        return [];
    }
  };

  const filteredTutorias = getSessionsByTab();

  const handleDelete = async () => {
    try {
      await scheduleService.deleteSchedule(selectedId);
      setSuccessMessage('Tutoría eliminada exitosamente');
      setSuccessVisible(true);
      setConfirmVisible(false);
      loadTutoring();
    } catch (error) {
      console.error('Error al eliminar la tutoría', error);
    }
  };

  const handleEdit = (tutoria) => {
    setSelectedTutoriaId(tutoria.idHorario);
    setEditVisible(true);
  };

  const handleEditSuccess = (message) => {
    setSuccessMessage(message);
    setSuccessVisible(true);
    setEditVisible(false);
    loadTutoring();
  };

  const handleCloseEdit = () => {
    setEditVisible(false);
    setSelectedTutoriaId(null);
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

  return (
    <Screen>
      <View className="w-full flex-1">
        <GeneralTitle
          label="Mis Tutorías"
          type='primary'
          className='!text-blue-500 mt-4'
        />
        <SelectorTabStudent
          tabs={['Activos', 'Historial']}
          selectedTab={selectedTab}
          onSelect={setSelectedTab}
        />
        <SizedBox height={5} />
        <ScrollView
          className="w-full"
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredTutorias.length === 0 ? (
            <View className="flex-1 w-full items-center mt-48">
              <MaterialCommunityIcons name="file-cancel-outline" size={45} color="gray" />
              <Text className="text-gray-500 text-center text-lg">
                No tienes tutorías creadas por el momento
              </Text>
            </View>
          ) : (
            filteredTutorias.map((activo) => (
              <TutoriasCard
                key={activo.idHorario}
                tutoriaInfo={activo}
                onDelete={() => {
                  setSelectedId(activo.idHorario);
                  setConfirmVisible(true);
                }}
                onEdit={() => handleEdit(activo)}
              />
            ))
          )}
        </ScrollView>

      </View>

      <SuccessModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        message={successMessage}
      />

      <ConfirmModal2
        visible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        onConfirm={handleDelete}
        message="¿Estás seguro que deseas eliminar esta tutoría?"
      />

      <EditarTutoriaTutor
        visible={editVisible}
        onClose={handleCloseEdit}
        tutoriaId={selectedTutoriaId}
        onSuccess={handleEditSuccess}
      />
    </Screen>
  );
}