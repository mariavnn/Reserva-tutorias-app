// import { View, Text } from 'react-native'
// import React, { useEffect } from 'react'
// import GeneralTitle from '../../../../components/GeneralTitle'
// import SizedBox from '../../../../components/SizedBox'
// import TutoriasCard from '../../../../components/tutoriasCard'
// import { useState } from 'react'
// import { Screen } from '../../../../components/Screen'
// import { ScrollView } from 'react-native'
// import { scheduleService } from '../../../../service/scheduleService'
// import AsyncStorage from '@react-native-async-storage/async-storage'

// export default function HomeTutor() {
//   const [tutorias, setTutorias] = useState([]);

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const userId = await AsyncStorage.getItem('UserId');
//         if (!userId) {
//           console.warn('No se encontró el UserId en AsyncStorage');
//           return;
//         }

//         const response = await scheduleService.getInfo(userId);
//         if (!response || response.length === 0) {
//           setTutorias([]);
//           return;
//         }

//         const formattedTutorias = response.map(tutoria => ({
//           id: tutoria.idHorario,
//           nombreMateria: tutoria.materia?.nombreMateria ?? "Sin nombre",
//           fecha: new Date(tutoria.fechaHorario).toLocaleDateString(), // formato local, o puedes usar toISOString()
//           horario: `${tutoria.horaInicio} - ${tutoria.horaFin}`,
//           descripcion: tutoria.descripcion,
//           ubicacion: `${tutoria.salon?.descripcion ?? ""} - ${tutoria.salon?.ubicacion ?? ""} (${tutoria.salon?.bloque?.seccion ?? ""})`,
//           modo: tutoria.modo,
//           tipo: tutoria.tipo,
//           idUsuario: tutoria.usuario?.idUsuario ?? null,
//           agendados: tutoria.agendados ?? []
//         }));

//         setTutorias(formattedTutorias);
//       } catch (error) {
//         console.error('Error cargando las tutorías:', error);
//       }
//     };

//     loadInitialData();
//   }, []);


//   const handleDelete = (id) => {
//     try {
//       const response = scheduleService.deleteSchedule(id);
//       alert("Se elimino con exito");
//     } catch (error) {
//       console.error('Error al eliminar la tutoria', error);
//     }
//   }

//   return (
//     <Screen>
//       <View className="w-full">
//         <GeneralTitle
//           label={"Mis Tutorias"}
//           type='primary'
//           className='!text-blue-500 mt-4'
//         />
//         <SizedBox height={10} />
//         <ScrollView className="w-full py-5" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
//           {tutorias.length === 0 ? (
//             <View className="flex-1 w-full justify-center">
//               <Text className="text-gray-500 text-center text-lg"> No tienes tutorias disponibles por el momento</Text>
//             </View>
//           ) : (
//             tutorias.map((tutoria) => (
//               <TutoriasCard
//                 key={tutoria.id}
//                 tutoriaInfo={tutoria}
//                 onDelete={() => handleDelete(tutoria.id)}
//               />
//             ))
//           )}
//         </ScrollView>
//       </View>
//     </Screen>
//   )
// }

import { View, Text, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import GeneralTitle from '../../../../components/GeneralTitle'
import SizedBox from '../../../../components/SizedBox'
import TutoriasCard from '../../../../components/tutoriasCard'
import { Screen } from '../../../../components/Screen'
import { scheduleService } from '../../../../service/scheduleService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ConfirmModal from '../../../../components/modals/ConfirmModal'
import SuccessModal from '../../../../components/modals/SuccessModal'
import ConfirmModal2 from '../../../../components/modals/ConfirmModal2'

export default function HomeTutor() {
  const [tutorias, setTutorias] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('UserId');
      if (!userId) return;

      const response = await scheduleService.getInfo(userId);
      const formattedTutorias = (response || []).map(tutoria => ({
        id: tutoria.idHorario,
        nombreMateria: tutoria.materia?.nombreMateria ?? "Sin nombre",
        fecha: new Date(tutoria.fechaHorario).toLocaleDateString(),
        horario: `${tutoria.horaInicio} - ${tutoria.horaFin}`,
        descripcion: tutoria.descripcion,
        ubicacion: `${tutoria.salon?.descripcion ?? ""} - ${tutoria.salon?.ubicacion ?? ""} (${tutoria.salon?.bloque?.seccion ?? ""})`,
        modo: tutoria.modo,
        tipo: tutoria.tipo,
        idUsuario: tutoria.usuario?.idUsuario ?? null,
        agendados: tutoria.agendados ?? []
      }));

      setTutorias(formattedTutorias);
    } catch (error) {
      console.error('Error cargando las tutorías:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, [loadData]);

  const handleDelete = async () => {
    try {
      await scheduleService.deleteSchedule(selectedId);
      setSuccessMessage('Tutoría eliminada exitosamente');
      setSuccessVisible(true);
      setConfirmVisible(false);
      loadData();
    } catch (error) {
      console.error('Error al eliminar la tutoría', error);
    }
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
          {tutorias.length === 0 ? (
            <View className="flex-1 w-full justify-center">
              <Text className="text-gray-500 text-center text-lg">
                No tienes tutorías disponibles por el momento
              </Text>
            </View>
          ) : (
            tutorias.map((tutoria) => (
              <TutoriasCard
                key={tutoria.id}
                tutoriaInfo={tutoria}
                onDelete={() => {
                  setSelectedId(tutoria.id);
                  setConfirmVisible(true);
                }}
                onEdit={() => console.log('Editar', tutoria.id)}
              />
            ))
          )}
        </ScrollView>

        <ConfirmModal2
          visible={confirmVisible}
          onClose={() => setConfirmVisible(false)}
          onConfirm={handleDelete}
          message="¿Estás seguro que deseas eliminar esta tutoría?"
        />

        <SuccessModal 
          visible={successVisible}
          onClose={() => setSuccessVisible(false)}
          message={successMessage}
        />
      </View>
    </Screen>
  );
}