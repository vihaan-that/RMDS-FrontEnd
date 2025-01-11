'use client';

import { useState, useEffect, useCallback } from 'react';
import { sensorApi } from '@/lib/api';

export function useSensorData(sensorId, timeRange) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let sensorData;
      
      if (timeRange === 'live') {
        sensorData = await sensorApi.getLiveData(sensorId);
      } else {
        sensorData = await sensorApi.getSensorData(sensorId, timeRange);
      }
      
      setData(sensorData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sensorId, timeRange]);

  useEffect(() => {
    fetchData();

    if (timeRange === 'live') {
      const interval = setInterval(fetchData, 10000); // Poll every 10 seconds for live data
      return () => clearInterval(interval);
    }
  }, [fetchData, timeRange]);

  return { data, loading, error, refetch: fetchData };
}
