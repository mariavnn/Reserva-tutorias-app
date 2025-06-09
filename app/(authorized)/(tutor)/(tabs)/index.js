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

export default function HomeTutor() {
  const [refreshing, setRefreshing] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTutoriaId, setSelectedTutoriaId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { loadUserTutorings, tutoriasProfesor, loading } = useTutoriaStore();

  useEffect(() => {
    loadUserTutorings();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUserTutorings().then(() => setRefreshing(false));
  }, [loadUserTutorings]);

  const handleDelete = async () => {
    try {
      await scheduleService.deleteSchedule(selectedId);
      setSuccessMessage('Tutoría eliminada exitosamente');
      setSuccessVisible(true);
      setConfirmVisible(false);
      loadUserTutorings();
    } catch (error) {
      console.error('Error al eliminar la tutoría', error);
    }
  };

  const handleEdit = (tutoria) => {
    setSelectedTutoriaId(tutoria.id);
    setEditVisible(true);
  };

  const handleEditSuccess = (message) => {
    setSuccessMessage(message);
    setSuccessVisible(true);
    setEditVisible(false);
    loadUserTutorings();
  };

  const handleCloseEdit = () => {
    setEditVisible(false);
    setSelectedTutoriaId(null);
  };

  return (
    <Screen>
      <View className="w-full">
        <GeneralTitle
          label="Mis Tutorías"
          type='primary'
          className='!text-blue-500 mt-4'
        />
        <SizedBox height={10} />
        <ScrollView
          className="w-full py-5"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {tutoriasProfesor.length === 0 ? (
            <View className="flex-1 w-full justify-center">
              <Text className="text-gray-500 text-center text-lg">
                No tienes tutorías disponibles por el momento
              </Text>
            </View>
          ) : (
            tutoriasProfesor.map((tutoria) => (
              <TutoriasCard
                key={tutoria.id}
                tutoriaInfo={tutoria}
                onDelete={() => {
                  setSelectedId(tutoria.id);
                  setConfirmVisible(true);
                }}
                onEdit={() => handleEdit(tutoria)}
              />
            ))
          )}
        </ScrollView>

        {/* Delete Confirmation Modal */}
        <ConfirmModal2
          visible={confirmVisible}
          onClose={() => setConfirmVisible(false)}
          onConfirm={handleDelete}
          message="¿Estás seguro que deseas eliminar esta tutoría?"
        />

        {/* Success Modal */}
        <SuccessModal
          visible={successVisible}
          onClose={() => setSuccessVisible(false)}
          message={successMessage}
        />

        {/* Edit Modal */}
        <EditarTutoriaTutor
          visible={editVisible}
          onClose={handleCloseEdit}
          tutoriaId={selectedTutoriaId}
          onSuccess={handleEditSuccess}
        />
      </View>
    </Screen>
  );
}