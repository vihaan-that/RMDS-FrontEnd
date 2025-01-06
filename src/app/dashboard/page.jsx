"use client"
import React from 'react'
import { DataCard } from '@/components/data-card';
const page = () => {
  return (
    
<div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <DataCard value="95%" name="Efficiency" />
              <div className="aspect-video rounded-xl bg-muted/50"/>
              <DataCard value="10,000 kWh" name="Daily Output" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
)}
export default page

