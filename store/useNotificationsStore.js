import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import sseService from '../service/sseService';

const useNotificationsStore = create(
  subscribeWithSelector((set, get) => ({
    // Estado
    notifications: [],
    isConnected: false,
    error: null,
    isInitialized: false,

    // Acciones
    initialize: () => {
      const state = get();
      
      if (state.isInitialized) {
        console.log('Store ya inicializado');
        return;
      }

      // Configurar callbacks del servicio SSE
      sseService.setCallbacks({
        onConnectionChange: (connected) => {
          set({ isConnected: connected });
        },
        onNotificationReceived: (notification) => {
          set((state) => {
            // const exists = state.notifications.some(n => 
            //   n.id === notification.id ||
            //   (n.message === notification.message && n.type === notification.type)
            // );
            
            // if (exists) return state;
            
            return {
              notifications: [notification, ...state.notifications]
            };
          });
        },
        onError: (error) => {
          set({ error });
        }
      });

      // Inicializar conexión
      sseService.connect();
      
      set({ isInitialized: true });
    },

    connect: () => {
      sseService.connect();
    },

    disconnect: () => {
      sseService.disconnect();
    },

    addNotification: (notification) => {
      set((state) => {
        const exists = state.notifications.some(n => n.id === notification.id);
        if (exists) return state;
        
        return {
          notifications: [notification, ...state.notifications]
        };
      });
    },

    removeNotification: (notificationId) => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== notificationId)
      }));
    },

    // markAsRead: async (notificationId) => {
    //   try {
    //     await sseService.markAsRead(notificationId);
        
    //     set((state) => ({
    //       notifications: state.notifications.map(notification =>
    //         notification.id === notificationId
    //           ? { ...notification, leida: true }
    //           : notification
    //       )
    //     }));
    //   } catch (error) {
    //     console.error('Error al marcar notificación como leída:', error);
    //     set({ error: error.message });
    //   }
    // },

    markAllAsRead: async () => {
      const { notifications } = get();
      const unreadNotifications = notifications.filter(n => !n.leida);
      
      try {
        // Marcar todas como leídas en paralelo
        await Promise.all(
          unreadNotifications.map(notification => 
            sseService.markAsRead(notification.id)
          )
        );
        
        set((state) => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            leida: true
          }))
        }));
      } catch (error) {
        console.error('Error al marcar todas las notificaciones como leídas:', error);
        set({ error: error.message });
      }
    },

    clearNotifications: () => {
      set({ notifications: [] });
    },

    clearError: () => {
      set({ error: null });
    },

    // Métodos de utilidad
    checkConnectionStatus: async () => {
      try {
        const isConnected = await sseService.checkConnectionStatus();
        set({ isConnected });
        return isConnected;
      } catch (error) {
        console.error('Error verificando estado de conexión:', error);
        set({ error: error.message });
        return false;
      }
    },

    getConnectedUsers: async () => {
      try {
        const connectedUsers = await sseService.getConnectedUsers();
        return connectedUsers;
      } catch (error) {
        console.error('Error obteniendo usuarios conectados:', error);
        set({ error: error.message });
        return null;
      }
    },

    // Cleanup
    cleanup: () => {
      sseService.destroy();
      set({ 
        notifications: [], 
        isConnected: false, 
        error: null, 
        isInitialized: false 
      });
    },

    // Getters computados
    getUnreadCount: () => {
      const { notifications } = get();
      return notifications.filter(n => !n.leida).length;
    },

    getUnreadNotifications: () => {
      const { notifications } = get();
      return notifications.filter(n => !n.leida);
    },

    getReadNotifications: () => {
      const { notifications } = get();
      return notifications.filter(n => n.leida);
    },

    getNotificationById: (id) => {
      const { notifications } = get();
      return notifications.find(n => n.id === id);
    }
  }))
);

export default useNotificationsStore;