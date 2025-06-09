import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import NotificationCard from '../../../../components/NotificationCard';
import { useSSENotifications } from '../../../../store/useSSENotifications';
import Feather from '@expo/vector-icons/Feather';

export default function NotificacionesStudent() {
  const [selectedTab, setSelectedTab] = useState("Todas");

  const {
    notifications,
    isConnected,
    error,
    markAsRead,
    clearNotifications,
    unreadCount,
  } = useSSENotifications();

  // Filtrar notificaciones según la pestaña seleccionada
  const filteredNotifications = selectedTab === "Todas"
    ? notifications
    : notifications.filter(notification => !notification.leida);

  // Manejar clic en notificación
  const handleNotificationPress = (notification) => {
    if (!notification.leida) {
      markAsRead(notification.id);
    }
    // TODO: Implementar lógica de navegación específica
  };

  // Renderizar el header con título y badge
  const renderHeader = () => (
    <View className="flex-row justify-between items-center">
      <GeneralTitle
        label="Notificaciones"
        type="primary"
        className="!text-blue-500 mt-4"
      />
      <View className="flex-row items-center mt-4">
        <View
          className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
        />
        <Text className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? 'Conectado' : 'Desconectado'}
        </Text>
      </View>
    </View>
  );

  // // Renderizar indicador de conexión y controles
  // const renderConnectionStatus = () => (
  //   <View className="flex-row items-center justify-between mb-4 mt-2">
  //     {/* {unreadCount > 0 && (
  //       <View className="bg-red-500 rounded-full px-2 py-1 mt-4">
  //         <Text className="text-white text-xs font-bold">
  //           {unreadCount}
  //         </Text>
  //       </View>
  //     )} */}
  //     {notifications.length > 0 && (
  //       <TouchableOpacity
  //         onPress={clearNotifications}
  //         className="bg-gray-200 px-3 py-1 rounded"
  //       >
  //         <Text className="text-xs text-gray-600">
  //           Limpiar
  //         </Text>
  //       </TouchableOpacity>
  //     )}
  //   </View>
  // );

  // Renderizar mensaje de error
  const renderError = () => {
    if (!error) return null;

    return (
      <View className="bg-red-100 p-3 rounded mb-4">
        <Text className="text-red-600 text-sm">
          {error}
        </Text>
      </View>
    );
  };

  // Renderizar lista de notificaciones
  const renderNotificationsList = () => {
    if (notifications.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <Feather name="bell-off" size={40} color="#6b7280" />
          <Text className="text-gray-500 text-base">
            {isConnected ? 'No hay notificaciones' : 'Conectando...'}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredNotifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            onPress={() => handleNotificationPress(notification)}
            activeOpacity={0.7}
          >
            <NotificationCard data={notification} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <Screen>
      <View className="w-full flex-1 px-4">
        {renderHeader()}
        {/* {renderConnectionStatus()} */}
        {renderError()}

        <View className="flex-1 mt-5">
          {renderNotificationsList()}
        </View>
      </View>
    </Screen>
  );
}