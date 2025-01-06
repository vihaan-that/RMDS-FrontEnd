"use client"
import React from 'react'
import dynamic from 'next/dynamic'
const GaugeComponent = dynamic(()=>import('react-gauge-component'),{ssr:false});
export function DataCard({ value, name }) {
  return (
    <div className="flex flex-col">
      <div className="aspect-video rounded-xl bg-muted/50 mb-4">
        
<GaugeComponent
  value={50}
  type="radial"
  labels={{
    tickLabels: {
      type: "inner",
      ticks: [
        { value: 20 },
        { value: 40 },
        { value: 60 },
        { value: 80 },
        { value: 100 }
      ]
    }
  }}
  arc={{
    colorArray: ['#5BE12C','#EA4228'],
    subArcs: [{limit: 10}, {limit: 30}, {}, {}, {}],
    padding: 0.02,
    width: 0.3
  }}
  pointer={{
    elastic: true,
    animationDelay: 0
  }}
/>
      </div>

      <div className="text-center">
        <p className="text-3xl font-bold mb-2">{value}</p>
        <p className="text-sm text-muted-foreground">{name}</p>
      </div>
    </div>
  )
}