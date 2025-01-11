"use client"

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAssetData } from '@/hooks/useAssetData';
import { useSensorData } from '@/hooks/useSensorData';
import { Skeleton } from '@/components/ui/skeleton';

// Time range options
const timeRanges = [
  { value: "live", label: "Live Feed" },
  { value: "1", label: "1 min ago to now" },
  { value: "2", label: "2 min ago to now" },
  { value: "6", label: "6 min ago to now" },
  { value: "10", label: "10 min ago to now" },
  { value: "15", label: "15 min ago to now" },
  { value: "20", label: "20 min ago to now" },
];

function SensorChart({ sensor, timeRange }) {
  const { data, loading, error } = useSensorData(sensor.id, timeRange);

  if (loading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <ChartContainer
      config={{
        value: { label: "Value", color: "hsl(var(--chart-1))" },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            name={sensor.name}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export default function AssetMonitoringPage() {
  const params = useParams();
  const { project, asset } = params;
  const [selectedTimeRange, setSelectedTimeRange] = useState("live");
  const { assetData, sensors, loading, error } = useAssetData(project, asset);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-8 w-1/4 mb-6" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Asset Monitoring - {assetData?.name}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Component Charts</span>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={sensors[0]?.id.toString()} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
              {sensors.map((sensor) => (
                <TabsTrigger key={sensor.id} value={sensor.id.toString()}>
                  {sensor.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {sensors.map((sensor) => (
              <TabsContent key={sensor.id} value={sensor.id.toString()}>
                <Card>
                  <CardHeader>
                    <CardTitle>{sensor.name} Readings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SensorChart sensor={sensor} timeRange={selectedTimeRange} />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
