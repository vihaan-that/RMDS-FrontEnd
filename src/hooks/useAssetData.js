'use client';

import { useState, useEffect } from 'react';
import { assetApi, sensorApi } from '@/lib/api';

export function useAssetData(projectId, assetId) {
  const [assetData, setAssetData] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [assetDetails, sensorList] = await Promise.all([
          assetApi.getAssetDetails(projectId, assetId),
          sensorApi.getSensors(projectId, assetId)
        ]);
        console.log(`The sensors list obtained is:`, sensorList); //debug
        setAssetData(assetDetails);
        setSensors(sensorList);
        console.log(sensorsList);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (projectId && assetId) {
      fetchData();
    }
  }, [projectId, assetId]);

  return { assetData, sensors, loading, error };
}
