import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
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
import { useRouter } from 'expo-router';


const mockSessions = [
  {
    id: 1,
    title: "Consultas de Programación",
    tutor: "Prof. López",
    endTime: "14:30",
    current: 2,
    max: 5,
    status: "Disponibles",
  },
  {
    id: 2,
    title: "Consultas de Ec. Diferenciales",
    tutor: "Prof. Rosita",
    endTime: "16:00",
    current: 4,
    max: 5,
    status: "Disponibles",
  },
  {
    id: 3,
    title: "Álgebra Lineal - Agendada",
    tutor: "Prof. Pérez",
    endTime: "15:00",
    current: 1,
    max: 3,
    status: "Agendadas",
  },
  {
    id: 4,
    title: "Estructuras de Datos",
    tutor: "Prof. Castro",
    endTime: "12:00",
    current: 3,
    max: 5,
    status: "Historial",
  },
  {
    id: 5,
    title: "Lógica Computacional",
    tutor: "Prof. Luque",
    endTime: "13:30",
    current: 5,
    max: 5,
    status: "Historial",
  },
];


export default function TutoriasStudent() {
  const [selectedTab, setSelectedTab] = useState("Disponibles");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState(mockSessions);
  const route = useRouter();

  const filteredSessions = sessions.filter(
    (session) => session.status === selectedTab
  );

  const handleOnJoin = (data) => {
    if(data.status === "Disponibles"){
      setSelectedSession(data);
      setModalVisible(true);
    } else if (data.status === "Agendadas"){
      setModalCancel(true);
      setSelectedSession(data);
    } else {
        return;
    }
  }

  return (
    <Screen>
      <View className='w-full flex-1 px-4'>
          <View className="w-full flex-row justify-between items-center">
            <GeneralTitle
              label={"Tutorias"}
              type='primary'
              className='!text-blue-500 mt-4'
            />

            
            <TouchableOpacity 
              onPress={() => route.push("/(authorized)/(student)/tutoresDisponibles")}
              className="justify-center items-center mt-3"
            >
              <FontAwesome6 name="users" size={20} color="#2673DD" />
              <Text className="text-center text-blue-500">Tutores</Text>
            </TouchableOpacity>
          </View>

          <SearchBar/>
          <SelectorTabStudent
            tabs={["Disponibles", "Agendadas", "Historial"]}
            selectedTab={selectedTab}
            onSelect={setSelectedTab}
          />

          <View>
            <ScrollView>
            {filteredSessions.map((session) => (
              <ReservarTutoriaCard
                key={session.id}
                data={session}
                onJoin={() => {
                  handleOnJoin(session);
                }}
              />
            ))}
            </ScrollView>

          </View>
         
      </View>

      {modalVisible && (
        <ConfirmReservaModal
          visible={modalVisible}
          data={selectedSession}
          onClose={() => setModalVisible(false)}
          onConfirm={() => {
            setModalVisible(false);
          }}
        
        />
      )}

      {modalCancel && (
        <ConfirmCancelModal
          visible={modalCancel}
          data={selectedSession}
          onClose={() => setModalCancel(false)}
          onConfirm={() => {
            console.log("Cancelado:", selectedSession.title);
            setSessions(prev => prev.filter(s => s.id !== selectedSession.id));
            setModalCancel(false);
          }}
        />
      )}
      
    </Screen>
  )
}