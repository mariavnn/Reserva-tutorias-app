import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Screen } from '../../../../components/Screen'
import GeneralTitle from '../../../../components/GeneralTitle'
import NotificationCard from '../../../../components/NotificationCard'
import { useNotifications } from '../../../../store/hooks/useNotifications'
import Feather from '@expo/vector-icons/Feather'

export default function NotificacionesStudent() {
  const [selectedTab, setSelectedTab] = useState("Todas")

  const {
    notifications,
    isConnected,
    error,
    unreadCount,
    markAsRead,
    clearNotifications,
    clearError,
    unreadNotifications,
    readNotifications,
  } = useNotifications()

  // Filtrar notificaciones según la pestaña seleccionada
  const filteredNotifications = selectedTab === "Todas"
    ? notifications
    : unreadNotifications

  // Manejar clic en notificación
  const handleNotificationPress = async (notification) => {
    try {
      if (!notification.leida) {
        await markAsRead(notification.id)
      }
      // TODO: Implementar lógica de navegación específica
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error)
    }
  }

  // Manejar limpieza de notificaciones
  const handleClearNotifications = () => {
    clearNotifications()
  }

  // Manejar limpieza de errores
  const handleClearError = () => {
    clearError()
  }

  // Renderizar el header con título y badge
  const renderHeader = () => (
    <View className="flex-row justify-between items-center">
      <View className="flex-row items-center">
        <GeneralTitle
          label="Notificaciones"
          type="primary"
          className="!text-blue-500 mt-4"
        />
        {unreadCount > 0 && (
          <View className="bg-red-500 rounded-full px-2 ml-2 mt-4 min-w-[20px] h-5 justify-center items-center">
            <Text className="text-white text-xs font-bold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center mt-4">
        <View
          className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
        />
        <Text className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? 'Conectado' : 'Desconectado'}
        </Text>
      </View>
    </View>
  )

  // Renderizar pestañas de filtro
  const renderTabs = () => (
    <View className="flex-row bg-gray-100 rounded-lg p-1 mt-4">
      {['Todas'].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setSelectedTab(tab)}
          className={`flex-1 py-2 px-4 rounded-md ${selectedTab === tab
              ? 'bg-white shadow-sm'
              : 'bg-transparent'
            }`}
        >
          <Text className={`text-center text-sm font-medium ${selectedTab === tab
              ? 'text-blue-600'
              : 'text-gray-600'
            }`}>
            {tab}
            {tab === 'Sin leer' && unreadCount > 0 && (
              <Text className="text-red-500"> ({unreadCount})</Text>
            )}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderButtons = () => (
    <View className={'flex-row bg-gray-100 rounded-lg p-1 mt-4 gap-2'}>
      <View className={`flex-1 py-2 px-4 rounded-md bg-white shadow-sm`}>
        <Text className={`text-center text-sm font-medium text-blue-600`}>
          {'Todas'}
        </Text>
      </View>
      <View className="flex-row justify-end">
        <TouchableOpacity
          onPress={handleClearNotifications}
          className="bg-gray-200 py-2 px-4 rounded-md"
        >
          <Text className="text-xs text-gray-600 font-medium">
            Limpiar todas
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )


  // Renderizar controles de acciones
  const renderActionControls = () => {
    if (notifications.length === 0) return null

    return (
      <View className="flex-row justify-end mt-3">
        <TouchableOpacity
          onPress={handleClearNotifications}
          className="bg-gray-200 px-3 py-1 rounded-md"
        >
          <Text className="text-xs text-gray-600 font-medium">
            Limpiar todas
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Renderizar mensaje de error
  const renderError = () => {
    if (!error) return null

    return (
      <TouchableOpacity
        onPress={handleClearError}
        className="bg-red-100 p-3 rounded-lg mb-4 mt-2"
      >
        <View className="flex-row items-center">
          <Feather name="alert-circle" size={16} color="#dc2626" />
          <Text className="text-red-600 text-sm ml-2 flex-1">
            {error}
          </Text>
          <Text className="text-red-400 text-xs">
            Toca para cerrar
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  // Renderizar estado vacío
  const renderEmptyState = () => {
    const isFiltered = selectedTab === 'Sin leer'
    const hasNotifications = notifications.length > 0

    let message = 'No hay notificaciones'
    let icon = 'bell-off'

    if (!isConnected) {
      message = 'Conectando...'
      icon = 'wifi-off'
    } else if (isFiltered && hasNotifications) {
      message = 'No hay notificaciones sin leer'
      icon = 'check-circle'
    }

    return (
      <View className="flex-1 justify-center items-center">
        <Feather name={icon} size={48} color="#9ca3af" />
        <Text className="text-gray-500 text-base mt-3 text-center">
          {message}
        </Text>
        {!isConnected && (
          <Text className="text-gray-400 text-sm mt-1 text-center">
            Esperando conexión al servidor
          </Text>
        )}
      </View>
    )
  }

  // Renderizar lista de notificaciones
  const renderNotificationsList = () => {
    if (filteredNotifications.length === 0) {
      return renderEmptyState()
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {filteredNotifications.map((notification, index) => (
          <View
            key={notification.id}
            onPress={() => handleNotificationPress(notification)}
            activeOpacity={0.7}
            className={`${index === filteredNotifications.length - 1 ? 'mb-4' : ''}`}
          >
            <NotificationCard data={notification} />
          </View>
        ))}
      </ScrollView>
    )
  }

  // Renderizar estadísticas rápidas (opcional)
  const renderQuickStats = () => {
    if (notifications.length === 0) return null

    const readCount = readNotifications.length
    const totalCount = notifications.length

    return (
      <View className="flex-row justify-center mt-2 mb-1">
        <Text className="text-xs text-gray-500">
          {totalCount} total • {unreadCount} sin leer • {readCount} leídas
        </Text>
      </View>
    )
  }

  return (
    <Screen>
      <View className="w-full flex-1 px-4">
        {renderHeader()}
        {/* {renderError()} */}
        {renderButtons()}
        {/* {renderTabs()} */}
        {/* {renderActionControls()} */}
        {/* {renderQuickStats()} */}

        <View className="flex-1 mt-3">
          {renderNotificationsList()}
        </View>
      </View>
    </Screen>
  )
}