import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import EventSource from 'react-native-sse';
import { API_URL } from '../constants/API';

export const useSSENotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [userID, setUserID] = useState(null);
  const eventListenersRef = useRef([]);

  // Efecto para debuggear cambios en userID
  useEffect(() => {
    console.log('userID actualizado:', userID);
  }, [userID]);

  const fetchUserId = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('UserId');
      if (userId !== userID) {
        setUserID(userId);
      }
    } catch (error) {
      console.error('Error al obtener el UserId:', error);
      setError('No se pudo obtener el ID de usuario');
    }
  }, [userID]);

  const addEventListener = useCallback((eventSource, type, handler) => {
    eventSource.addEventListener(type, handler);
    eventListenersRef.current.push({ type, handler });
  }, []);

  const removeAllEventListeners = useCallback((eventSource) => {
    eventListenersRef.current.forEach(({ type, handler }) => {
      eventSource?.removeEventListener(type, handler);
    });
    eventListenersRef.current = [];
  }, []);

  const connectToSSE = useCallback(() => {
    if (!userID) {
      console.warn('No se puede conectar a SSE sin userId');
      return;
    }

    disconnectSSE(); // Limpiar conexión existente

    try {
      const eventSource = new EventSource(
        `${API_URL}/notificacion/conectar/${userID}`,
        { debug: true } // Habilitar debug para ver logs detallados
      );

      eventSourceRef.current = eventSource;

      // Manejadores de eventos
      const onOpen = (event) => {
        console.log('✅ Conexión SSE establecida', event);
        setIsConnected(true);
        setError(null);
        clearTimeout(reconnectTimeoutRef.current);
      };

      // const onTutoriaRecordatorio = (event) => {
      //   try {
      //     const notificationData = JSON.parse(event.data);
      //     console.log('📧 Nueva notificación:', notificationData);

      //     setNotifications(prev => {
      //       const exists = prev.some(n => n.id === notificationData.id);
      //       return exists ? prev : [notificationData, ...prev];
      //     });
      //   } catch (parseError) {
      //     console.error('❌ Error al parsear notificación:', parseError);
      //   }
      // };

      const onTutoriaRecordatorio = (event) => {
        try {
          let notificationData;

          // Intenta parsear como JSON, si falla, usa el texto directo
          try {
            notificationData = JSON.parse(event.data);
          } catch {
            notificationData = {
              id: Date.now(), // Genera un ID temporal si no viene en el texto plano
              message: event.data,
              type: event.type || 'generic'
            };
          }

          console.log('📧 Nueva notificación:', notificationData);

          setNotifications(prev => {
            const exists = prev.some(n =>
              n.id === notificationData.id ||
              (n.message === notificationData.message && n.type === notificationData.type)
            );
            return exists ? prev : [notificationData, ...prev];
          });
        } catch (error) {
          console.error('❌ Error al procesar notificación:', error);
        }
      };

      const onError = (event) => {
        console.error('❌ Error en SSE:', event.message);
        setIsConnected(false);
        setError(event.message || 'Error en la conexión SSE');

        // Reconexión con backoff exponencial
        const delay = Math.min(
          (reconnectTimeoutRef.current ? reconnectTimeoutRef.current.delay * 2 : 1000),
          30000 // Máximo 30 segundos
        );

        reconnectTimeoutRef.current = {
          timer: setTimeout(connectToSSE, delay),
          delay
        };
      };

      // Agregar listeners
      addEventListener(eventSource, 'open', onOpen);
      addEventListener(eventSource, 'tutoria-recordatorio', onTutoriaRecordatorio);
      addEventListener(eventSource, 'conexion-establecida', () => {
        console.log('✅ Conexión confirmada por servidor');
      });
      addEventListener(eventSource, 'heartbeat', () => {
        setIsConnected(true);
        setError(null);
      });
      addEventListener(eventSource, 'error', onError);

    } catch (error) {
      console.error('❌ Error al crear conexión SSE:', error);
      setIsConnected(false);
      setError(error.message);
    }
  }, [userID, disconnectSSE, addEventListener]);

  const disconnectSSE = useCallback(() => {
    if (eventSourceRef.current) {
      removeAllEventListeners(eventSourceRef.current);
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current?.timer) {
      clearTimeout(reconnectTimeoutRef.current.timer);
      reconnectTimeoutRef.current = null;
    }

    setIsConnected(false);
    console.log('🔌 Conexión SSE cerrada');
  }, [removeAllEventListeners]);

  // const loadInitialNotifications = useCallback(async () => {
  //   if (!userID) return;

  //   try {
  //     const response = await fetch(
  //       `${API_URL}/notificacion/usuario/${userID}`
  //     );

  //     if (response.ok) {
  //       const initialNotifications = await response.json();
  //       setNotifications(initialNotifications);
  //     } else {
  //       console.warn('No se pudieron cargar las notificaciones iniciales');
  //     }
  //   } catch (error) {
  //     console.error('Error al cargar notificaciones iniciales:', error);
  //   }
  // }, [userID, API_URL]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await fetch(
        `${API_URL}/notificacion/${notificationId}/leer`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, leida: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  }, [API_URL]);

  const checkConnectionStatus = useCallback(async () => {
    if (!userID) return false;

    try {
      const response = await fetch(
        `${API_URL}/tutorias/api/notificacion/conectado/${userID}`
      );

      if (response.ok) {
        const data = await response.json();
        return data.conectado;
      }
      return false;
    } catch (error) {
      console.error('Error verificando estado de conexión:', error);
      return false;
    }
  }, [userID, API_URL]);

  const getConnectedUsers = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/notificacion/conectados`
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo usuarios conectados:', error);
      return null;
    }
  }, [API_URL]);

  // Efecto para conexión inicial y cambios de userID
  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    if (userID) {
      //loadInitialNotifications();
      connectToSSE();
    }

    return () => {
      disconnectSSE();
    };
  }, [userID, connectToSSE, disconnectSSE]);

  // Efecto para manejar cambios de estado de la app
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active' && !isConnected && userID) {
        console.log('App activa - reconectando SSE');
        connectToSSE();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, [isConnected, userID, connectToSSE]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    isConnected,
    error,
    connectToSSE,
    disconnectSSE,
    markAsRead,
    clearNotifications,
    checkConnectionStatus,
    getConnectedUsers,
    unreadCount: notifications.filter(n => !n.leida).length
  };
};