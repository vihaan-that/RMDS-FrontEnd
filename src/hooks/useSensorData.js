'use client';

import { useState, useEffect, useCallback } from 'react';
import { sensorApi } from '@/lib/api';

export function useSensorData(sensorId, timeRange) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventSource, setEventSource] = useState(null);

  const connectSSE = useCallback(() => {
    try {
      console.log(`Connecting to SSE for sensor ${sensorId}`);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const url = `${API_BASE_URL}/api/live/sensor/${sensorId}`;
      
      // Close any existing connection
      if (eventSource) {
        console.log('Closing existing SSE connection');
        eventSource.close();
      }

      // Create new EventSource
      const newEventSource = new EventSource(url);
      setEventSource(newEventSource);

      // Set up event listeners
      newEventSource.onopen = () => {
        console.log(`SSE connection opened for sensor ${sensorId}`);
        setLoading(false);
        setError(null);
      };

      newEventSource.onmessage = (event) => {
        try {
          if (event.data === ':ok' || event.data === ':ping') {
            console.log(`Received heartbeat for sensor ${sensorId}`);
            return;
          }

          const sensorData = JSON.parse(event.data);
          console.log(`Received sensor data:`, sensorData);
          setData(sensorData);
        } catch (err) {
          console.error('Error processing SSE message:', err);
        }
      };

      newEventSource.addEventListener('sensor-update', (event) => {
        try {
          const sensorData = JSON.parse(event.data);
          console.log(`Received sensor update:`, sensorData);
          setData(sensorData);
        } catch (err) {
          console.error('Error processing sensor update:', err);
        }
      });

      newEventSource.onerror = (err) => {
        console.error(`SSE error for sensor ${sensorId}:`, err);
        setError('Connection lost. Attempting to reconnect...');
        setLoading(true);
      };

    } catch (err) {
      console.error(`Error setting up SSE for sensor ${sensorId}:`, err);
      setError(`Failed to connect: ${err.message}`);
      setLoading(false);
    }
  }, [sensorId]);

  const fetchHistoricalData = useCallback(async () => {
    try {
      setLoading(true);
      const sensorData = await sensorApi.getSensorData(sensorId, timeRange);
      setData(sensorData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sensorId, timeRange]);

  useEffect(() => {
    if (timeRange === 'live') {
      connectSSE();
    } else {
      // Clean up any existing SSE connection
      if (eventSource) {
        console.log('Closing SSE connection due to timeRange change');
        eventSource.close();
        setEventSource(null);
      }
      fetchHistoricalData();
    }

    // Cleanup function
    return () => {
      if (eventSource) {
        console.log('Cleaning up SSE connection');
        eventSource.close();
        setEventSource(null);
      }
    };
  }, [connectSSE, fetchHistoricalData, timeRange, eventSource]);

  return { data, loading, error };
}
