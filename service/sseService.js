import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import EventSource from 'react-native-sse';
import apiClient from './apiClient';
import { API_URL } from '../constants/API';

class SSEService {
  constructor() {
    this.eventSource = null;
    this.reconnectTimeout = null;
    this.eventListeners = [];
    this.isConnected = false;
    this.userID = null;
    this.callbacks = {
      onConnectionChange: null,
      onNotificationReceived: null,
      onError: null,
    };

    this.initializeAppStateListener();
  }

  // Métodos de configuración de callbacks
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // Obtener userID desde AsyncStorage
  async fetchUserId() {
    try {
      const userId = await AsyncStorage.getItem('UserId');
      if (userId !== this.userID) {
        this.userID = userId;
      }
      return userId;
    } catch (error) {
      console.error('Error al obtener el UserId:', error);
      this.handleError('No se pudo obtener el ID de usuario');
      return null;
    }
  }

  // Gestión de event listeners
  addEventListener(eventSource, type, handler) {
    eventSource.addEventListener(type, handler);
    this.eventListeners.push({ type, handler });
  }

  removeAllEventListeners() {
    this.eventListeners.forEach(({ type, handler }) => {
      this.eventSource?.removeEventListener(type, handler);
    });
    this.eventListeners = [];
  }

  // Conectar a SSE
  async connect() {
    const userId = await this.fetchUserId();
    const token = await AsyncStorage.getItem('authToken');
    if (!userId || !token) {
      console.warn('No se puede conectar: userId o token faltantes');
      return;
    }

    this.disconnect(); 

    try {
      const eventSource = new EventSource(`${API_URL}/notificacion/conectar/${userId}/${token}`,
        { debug: true }
      );

      this.eventSource = eventSource;

      this.setupEventHandlers();

    } catch (error) {
      console.error('❌ Error al crear conexión SSE:', error);
      this.handleConnectionChange(false);
      this.handleError(error.message);
    }
  }

  // Configurar manejadores de eventos
  setupEventHandlers() {
    const onOpen = (event) => {
      this.handleConnectionChange(true);
      this.handleError(null);
      this.clearReconnectTimeout();
    };

    const onTutoriaRecordatorio = (event) => {
      try {
        let notificationData;

        try {
          notificationData = JSON.parse(event.data);
        } catch {
          notificationData = {
            id: Date.now(),
            message: event.data,
            type: event.type || 'generic'
          };
        }

        this.callbacks.onNotificationReceived?.(notificationData);

      } catch (error) {
        console.error('❌ Error al procesar notificación:', error);
      }
    };

    const onError = (event) => {
      //console.error('❌ Error en SSE:', event.message);
      this.handleConnectionChange(false);
      this.handleError(event.message || 'Error en la conexión SSE');
      this.scheduleReconnect();
    };

    const onHeartbeat = () => {
      this.handleConnectionChange(true);
      this.handleError(null);
    };

    const onConnectionEstablished = () => {
    };

    // Agregar listeners
    this.addEventListener(this.eventSource, 'open', onOpen);
    this.addEventListener(this.eventSource, 'tutoria-recordatorio', onTutoriaRecordatorio);
    this.addEventListener(this.eventSource, 'conexion-establecida', onConnectionEstablished);
    this.addEventListener(this.eventSource, 'heartbeat', onHeartbeat);
    this.addEventListener(this.eventSource, 'error', onError);
  }

  // Desconectar SSE
  disconnect() {
    if (this.eventSource) {
      this.removeAllEventListeners();
      this.eventSource.close();
      this.eventSource = null;
    }

    this.clearReconnectTimeout();
    this.handleConnectionChange(false);
  }

  // Programar reconexión con backoff exponencial
  scheduleReconnect() {
    const delay = Math.min(
      (this.reconnectTimeout ? this.reconnectTimeout.delay * 2 : 1000),
      30000
    );

    this.reconnectTimeout = {
      timer: setTimeout(() => this.connect(), delay),
      delay
    };
  }

  // Limpiar timeout de reconexión
  clearReconnectTimeout() {
    if (this.reconnectTimeout?.timer) {
      clearTimeout(this.reconnectTimeout.timer);
      this.reconnectTimeout = null;
    }
  }

  // Manejar cambios de conexión
  handleConnectionChange(connected) {
    this.isConnected = connected;
    this.callbacks.onConnectionChange?.(connected);
  }

  // Manejar errores
  handleError(error) {
    this.callbacks.onError?.(error);
  }

  // Listener para cambios de estado de la app
  initializeAppStateListener() {
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && !this.isConnected && this.userID) {
        this.connect();
      }
    });
  }

  // // Métodos de API para notificaciones
  // async markAsRead(notificationId) {
  //   try {
  //     const response = await apiClient.patch(`/notificacion/${notificationId}/leer`);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error al marcar notificación como leída:', error);
  //     throw error;
  //   }
  // }

  async checkConnectionStatus() {
    if (!this.userID) return false;

    try {
      const response = await apiClient.get(`/notificacion/conectado/${this.userID}`);
      return response.data.conectado;
    } catch (error) {
      console.error('Error verificando estado de conexión:', error);
      return false;
    }
  }

  async getConnectedUsers() {
    try {
      const response = await apiClient.get('/notificacion/conectados');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuarios conectados:', error);
      return null;
    }
  }

  // Limpiar recursos
  destroy() {
    this.disconnect();
    this.appStateSubscription?.remove();
  }

  // Getters
  getConnectionStatus() {
    return this.isConnected;
  }

  getUserId() {
    return this.userID;
  }
}

// Singleton instance
const sseService = new SSEService();
export default sseService;
