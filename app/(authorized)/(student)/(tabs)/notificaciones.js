import { View, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import SelectorTabStudent from '../../../../components/SelectorTabStudent';
import NotificationCard from '../../../../components/NotificationCard';

const mockNotifications = [
  {
    id: 1,
    message: "La tutoría de Cálculo con Prof. Martínez ha cambiado a las 15:00",
    timeAgo: "Hace 5 Min",
    read: false,
  },
  {
    id: 2,
    message: "Prof. García ha añadido nuevos horarios para Física",
    timeAgo: "Hace 30 Min",
    read: false,
  },
  {
    id: 3,
    message: "¡Nueva disponibilidad! Prof. López acaba de abrir horarios para mañana",
    timeAgo: "Hace 1 Hora",
    read: true,
  },
  {
    id: 4,
    message: "Tu tutoría de Programación Orientada a Objetos comienza en 15 minutos",
    timeAgo: "Hace 2 Horas",
    read: true,
  },
  {
    id: 5,
    message: "¡Nueva disponibilidad! Prof. Rodríguez acaba de abrir horarios para mañana",
    timeAgo: "Hace 3 Horas",
    read: true,
  },
];


export default function NotificacionesStudent() {
   const [selectedTab, setSelectedTab] = useState("Todas");


  return (
   <Screen>
      <View className='w-full flex-1 px-4'>
          <GeneralTitle
            label={"Notificaciones"}
            type='primary'
            className='!text-blue-500 mt-4'
          />

          <View className="flex-1 mt-5">
            <ScrollView>
              {
                mockNotifications.map((n) => (
                  <NotificationCard
                    key={n.id}
                    data={n}
                  />
                ))
              }

            </ScrollView>
          </View>
      </View>
    </Screen>
  )
}