import { useEffect, useState, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { API_CONFIG, STORAGE_KEYS } from '../../services/api/config';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
  speed?: number;
  heading?: number;
}

interface DriverInfo {
  id: string;
  name: string;
  phoneNumber: string;
  vehicleType?: string;
  vehiclePlate?: string;
  rating?: number;
  avatarUrl?: string;
}

interface TrackingStatus {
  orderId: string;
  status: string;
  estimatedArrival?: Date;
  distanceRemaining?: number;
}

export function useLocationTracking(orderId: string) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [driverLocation, setDriverLocation] = useState<LocationData | null>(null);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
  const [status, setStatus] = useState<TrackingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const startTracking = useCallback(async () => {
    if (!orderId || isConnecting || isConnected) return;

    setIsConnecting(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!accessToken) {
        throw new Error('احراز هویت انجام نشده است');
      }

      const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_CONFIG.SIGNALR_HUB_URL}/location-tracking`, {
          accessTokenFactory: () => accessToken,
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
        })
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount >= maxReconnectAttempts) {
              setError('اتصال برقرار نشد. لطفاً صفحه را رفرش کنید.');
              return null;
            }
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          },
        })
        .build();

      hubConnection.on('Connected', (data: any) => {
        console.log('✅ SignalR Connected:', data);
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttempts.current = 0;
      });

      hubConnection.on('OrderTrackingStarted', (data: any) => {
        console.log('📍 Tracking Started:', data);
        setStatus({
          orderId: data.orderId,
          status: data.status,
          estimatedArrival: data.estimatedArrival ? new Date(data.estimatedArrival) : undefined,
          distanceRemaining: data.distanceRemaining,
        });
        if (data.driver) {
          setDriverInfo({
            id: data.driver.id,
            name: data.driver.name,
            phoneNumber: data.driver.phoneNumber,
            vehicleType: data.driver.vehicleType,
            vehiclePlate: data.driver.vehiclePlate,
            rating: data.driver.rating,
            avatarUrl: data.driver.avatarUrl,
          });
        }
      });

      hubConnection.on('OrderTrackingStopped', (data: any) => {
        console.log('⏹️ Tracking Stopped:', data);
        setIsConnected(false);
      });

      hubConnection.on('LocationUpdated', (data: any) => {
        console.log('📍 Location Update:', data);
        setDriverLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy,
          timestamp: new Date(data.timestamp),
          speed: data.speed,
          heading: data.heading,
        });
        if (data.estimatedArrival) {
          setStatus((prev) => ({
            ...prev!,
            estimatedArrival: new Date(data.estimatedArrival),
            distanceRemaining: data.distanceRemaining,
          }));
        }
      });

      hubConnection.on('DriverAssigned', (data: any) => {
        console.log('👤 Driver Assigned:', data);
        setDriverInfo({
          id: data.driver.id,
          name: data.driver.name,
          phoneNumber: data.driver.phoneNumber,
          vehicleType: data.driver.vehicleType,
          vehiclePlate: data.driver.vehiclePlate,
          rating: data.driver.rating,
          avatarUrl: data.driver.avatarUrl,
        });
      });

      hubConnection.on('OrderStatusChanged', (data: any) => {
        console.log('🔄 Status Changed:', data);
        setStatus((prev) => ({
          ...prev!,
          status: data.newStatus,
        }));
      });

      hubConnection.on('Error', (errorMessage: string) => {
        console.error('❌ SignalR Error:', errorMessage);
        setError(errorMessage);
      });

      hubConnection.onreconnecting((error) => {
        console.warn('⚠️ SignalR Reconnecting...', error);
        setIsConnected(false);
        reconnectAttempts.current++;
      });

      hubConnection.onreconnected((connectionId) => {
        console.log('✅ SignalR Reconnected:', connectionId);
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        if (orderId) {
          hubConnection.invoke('StartTracking', orderId).catch((err) => {
            console.error('خطا در شروع مجدد ردیابی:', err);
          });
        }
      });

      hubConnection.onclose((error) => {
        console.log('🔌 SignalR Disconnected:', error);
        setIsConnected(false);
        setIsConnecting(false);
        if (error) {
          setError('اتصال قطع شد');
        }
      });

      await hubConnection.start();
      console.log('🚀 SignalR Connection Started');

      await hubConnection.invoke('StartTracking', orderId);
      console.log('📍 Tracking Started for Order:', orderId);

      setConnection(hubConnection);
    } catch (err) {
      console.error('❌ SignalR Connection Error:', err);
      setError('خطا در برقراری ارتباط');
      setIsConnecting(false);
      setIsConnected(false);
    }
  }, [orderId, isConnecting, isConnected]);

  const stopTracking = useCallback(async () => {
    if (connection && orderId) {
      try {
        await connection.invoke('StopTracking', orderId);
        await connection.stop();
        setConnection(null);
        setIsConnected(false);
        setDriverLocation(null);
        setStatus(null);
      } catch (err) {
        console.error('خطا در توقف ردیابی:', err);
      }
    }
  }, [connection, orderId]);

  const updateDriverLocation = useCallback(
    async (location: { latitude: number; longitude: number; accuracy?: number }) => {
      if (connection && isConnected && orderId) {
        try {
          await connection.invoke('UpdateLocation', orderId, location.latitude, location.longitude, location.accuracy);
        } catch (err) {
          console.error('خطا در ارسال موقعیت:', err);
        }
      }
    },
    [connection, isConnected, orderId]
  );

  useEffect(() => {
    if (orderId) {
      startTracking();
    }

    return () => {
      if (connection) {
        stopTracking();
      }
    };
  }, [orderId]);

  return {
    isConnected,
    isConnecting,
    driverLocation,
    driverInfo,
    status,
    error,
    startTracking,
    stopTracking,
    updateDriverLocation,
  };
}
