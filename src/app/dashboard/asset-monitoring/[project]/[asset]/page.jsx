"use client"
import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip
} from "recharts"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

// Time range options
const timeRanges = [
  { value: "live", label: "Live Feed" },
  { value: "1", label: "1 min ago to now" },
  { value: "3", label: "3 min ago to now" },
  { value: "6", label: "6 min ago to now" },
  { value: "10", label: "10 min ago to now" },
  { value: "15", label: "15 min ago to now" },
  { value: "20", label: "20 min ago to now" }
]

export default function AssetMonitoringPage() {
  const params = useParams()
  const { project, asset } = params
  const [selectedTimeRange, setSelectedTimeRange] = useState("live")
  const [assetData, setAssetData] = useState(null)
  const [chartData, setChartData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [eventSources, setEventSources] = useState({})

  // Debug function
  const logChartUpdate = (sensorId, data) => {
    console.log('Chart Update:', {
      sensorId,
      dataPoints: data.length,
      latestPoint: data[data.length - 1],
      allData: data
    });
  };

  // Fetch asset data
  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        console.log('Fetching asset data...');
        const response = await fetch('http://localhost:4000/api/project-assets')
        const data = await response.json()
        const currentAsset = data.project.assets.find(
          a => a.assetName.toLowerCase().replace(/\s+/g, '-') === asset
        )
        if (currentAsset) {
          console.log('Found asset:', currentAsset);
          console.log('Asset sensors:', currentAsset.sensors.map(s => ({ id: s._id, name: s.tagName })));
          setAssetData(currentAsset)
        } else {
          console.error('Asset not found in response:', data);
          setError('Asset not found')
        }
      } catch (err) {
        console.error('Error fetching asset data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAssetData()
  }, [asset])

  // Handle historical data
  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!assetData || selectedTimeRange === 'live') return

      try {
        console.log('Fetching historical data for timeRange:', selectedTimeRange);
        const promises = assetData.sensors.map(async sensor => {
          const response = await fetch(
            `http://localhost:4000/api/sensor-values?sensorId=${sensor._id}&timeRange=${selectedTimeRange}`
          )
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json()
          return { sensorId: sensor._id, data: data.data }
        })

        const results = await Promise.all(promises)
        const newChartData = {}
        results.forEach(({ sensorId, data }) => {
          newChartData[sensorId] = data.map(point => ({
            time: new Date(point.timestamp).toISOString().substr(11, 8),
            value: point.value
          }))
        })
        setChartData(newChartData)
        console.log('Historical chart data loaded:', newChartData)
      } catch (err) {
        console.error('Error fetching historical data:', err)
        setError(err.message)
      }
    }

    fetchHistoricalData()
  }, [assetData, selectedTimeRange])

  // Handle live data using SSE
  useEffect(() => {
    // Clean up function for event sources
    const cleanupEventSources = () => {
      console.log('Cleaning up event sources');
      Object.entries(eventSources).forEach(([sensorId, es]) => {
        console.log(`Closing event source for sensor ${sensorId}`);
        es.close();
      });
      setEventSources({});
      // Clear chart data when switching from live mode
      if (selectedTimeRange !== 'live') {
        setChartData({});
      }
    };

    if (!assetData || selectedTimeRange !== 'live') {
      cleanupEventSources();
      return;
    }

    console.log('Setting up SSE connections for sensors:', assetData.sensors);
    const newEventSources = {};

    assetData.sensors.forEach(sensor => {
      console.log(`Setting up EventSource for sensor ${sensor.tagName} (${sensor._id})`);
      const eventSource = new EventSource(
        `http://localhost:4000/api/live/sensor/67979100abd6c6c5f21d7479`
      );

      eventSource.onopen = () => {
        console.log(`SSE connection opened for sensor ${sensor.tagName}`);
      };

      eventSource.onerror = (error) => {
        console.error(`SSE error for sensor ${sensor.tagName}:`, error);
        // Attempt to reconnect after error
        setTimeout(() => {
          if (eventSource.readyState === EventSource.CLOSED) {
            console.log(`Attempting to reconnect for sensor ${sensor.tagName}`);
            eventSource.close();
            delete newEventSources[sensor._id];
          }
        }, 1000);
      };

      eventSource.onmessage = event => {
        console.log(`Raw SSE message for ${sensor.tagName}:`, event.data);
        
        try {
          if (event.data === ':ok' || event.data === ':ping') {
            console.log(`Received control message for ${sensor.tagName}:`, event.data);
            return;
          }
          
          const data = JSON.parse(event.data);
          console.log(`Parsed data for sensor ${sensor.tagName}:`, data);
          
          setChartData(prev => {
            const sensorData = prev[sensor._id] || [];
            const newPoint = {
              time: new Date(data.timestamp).toISOString().substr(11, 8),
              value: data.value
            };
            
            // Keep last 60 points
            const updatedData = [...(sensorData.length >= 60 ? sensorData.slice(-59) : sensorData), newPoint];
            console.log(`Updated chart data for ${sensor.tagName}:`, {
              previousPoints: sensorData.length,
              newPoints: updatedData.length,
              latestPoint: newPoint
            });
            
            return {
              ...prev,
              [sensor._id]: updatedData
            };
          });
        } catch (err) {
          console.error(`Error processing SSE data for ${sensor.tagName}:`, err);
        }
      };

      newEventSources[sensor._id] = eventSource;
    });

    setEventSources(newEventSources);

    // Cleanup on unmount or when dependencies change
    return cleanupEventSources;
  }, [assetData, selectedTimeRange]);

  // Render charts
  const renderCharts = () => {
    if (!assetData?.sensors) return null;

    return assetData.sensors.map(sensor => {
      const data = chartData[sensor._id] || [];
      console.log(`Rendering chart for ${sensor.tagName}:`, {
        dataPoints: data.length,
        latestPoint: data[data.length - 1]
      });

      return (
        <Card key={sensor._id} className="col-span-1">
          <CardHeader>
            <CardTitle>{sensor.tagName}</CardTitle>
          </CardHeader>
          <CardContent>
            {data.length > 0 ? (
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      label={{ 
                        value: sensor.unit,
                        angle: -90,
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' }
                      }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            )}
          </CardContent>
        </Card>
      );
    });
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
          <SelectTrigger>
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <Card key={n}>
              <CardHeader>
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderCharts()}
        </div>
      )}
    </div>
  );
}
