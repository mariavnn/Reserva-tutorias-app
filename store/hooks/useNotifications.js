import { useEffect } from 'react';
import useNotificationsStore from '../useNotificationsStore';

export const useNotifications = () => {
  const store = useNotificationsStore();

  // Auto-inicializar el store cuando se use el hook
  useEffect(() => {
    store.initialize();
    
    // Cleanup al desmontar
    return () => {
      // Solo hacer cleanup si es necesario (ej: al cerrar la app)
      // store.cleanup();
    };
  }, []);

  return {
    // Estado
    notifications: store.notifications,
    isConnected: store.isConnected,
    error: store.error,
    unreadCount: store.getUnreadCount(),
    
    // Acciones básicas
    //markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    clearNotifications: store.clearNotifications,
    clearError: store.clearError,
    
    // Acciones de conexión
    connect: store.connect,
    disconnect: store.disconnect,
    
    // Métodos de utilidad
    checkConnectionStatus: store.checkConnectionStatus,
    getConnectedUsers: store.getConnectedUsers,
    
    // Getters
    unreadNotifications: store.getUnreadNotifications(),
    readNotifications: store.getReadNotifications(),
    getNotificationById: store.getNotificationById,
  };
};