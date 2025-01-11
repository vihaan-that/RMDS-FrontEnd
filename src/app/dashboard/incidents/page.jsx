"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import { AlertTriangle, AlertOctagon, AlertCircle } from "lucide-react"

// Mock data for incidents
const incidents = [
  {
    id: 1,
    KpiId: "KPI001",
    Kpi: "Efficiency",
    startDate: "2023-01-01",
    endDate: "2023-01-05",
    VariableName: "Temp",
    Equipment: "Boiler",
    System: "Steam",
    Priority: "P1",
    Severity: "S2",
    Owner: "John Doe"
  },
  {
    id: 2,
    KpiId: "KPI002",
    Kpi: "Output",
    startDate: "2023-02-01",
    endDate: "2023-02-03",
    VariableName: "Pressure",
    Equipment: "Turbine",
    System: "Power",
    Priority: "P2",
    Severity: "S1",
    Owner: "Jane Smith"
  },
  {
    id: 3,
    KpiId: "KPI003",
    Kpi: "Availability",
    startDate: "2023-03-01",
    endDate: "2023-03-10",
    VariableName: "Vibration",
    Equipment: "Generator",
    System: "Electrical",
    Priority: "P3",
    Severity: "S3",
    Owner: "Bob Johnson"
  },
  {
    id: 4,
    KpiId: "KPI004",
    Kpi: "Reliability",
    startDate: "2023-04-01",
    endDate: "2023-04-05",
    VariableName: "Flow",
    Equipment: "Pump",
    System: "Water",
    Priority: "P1",
    Severity: "S1",
    Owner: "Alice Brown"
  },
  {
    id: 5,
    KpiId: "KPI005",
    Kpi: "Emissions",
    startDate: "2023-05-01",
    endDate: "2023-05-07",
    VariableName: "NOx",
    Equipment: "SCR",
    System: "Emissions",
    Priority: "P2",
    Severity: "S2",
    Owner: "Charlie Davis"
  }
]

// Helper function to get color and icon based on priority or severity
const getStyle = value => {
  switch (value) {
    case "P1":
    case "S1":
      return { color: "bg-red-600 text-white", icon: AlertOctagon }
    case "P2":
    case "S2":
      return { color: "bg-amber-500 text-white", icon: AlertTriangle }
    case "P3":
    case "S3":
      return { color: "bg-green-500 text-white", icon: AlertCircle }
    default:
      return { color: "", icon: null }
  }
}

// Calculate priority and severity distributions
const priorityData = [
  { name: "P1", value: incidents.filter(i => i.Priority === "P1").length },
  { name: "P2", value: incidents.filter(i => i.Priority === "P2").length },
  { name: "P3", value: incidents.filter(i => i.Priority === "P3").length }
]

const severityData = [
  { name: "S1", value: incidents.filter(i => i.Severity === "S1").length },
  { name: "S2", value: incidents.filter(i => i.Severity === "S2").length },
  { name: "S3", value: incidents.filter(i => i.Severity === "S3").length }
]

const COLORS = ["#dc2626", "#f59e0b", "#10b981"]

export default function IncidentsPage() {
  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Incident Management Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-xl">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                P1: { label: "P1 - Critical", color: "#dc2626" },
                P2: { label: "P2 - High", color: "#f59e0b" },
                P3: { label: "P3 - Normal", color: "#10b981" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-xl">Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                S1: { label: "S1 - Critical", color: "#dc2626" },
                S2: { label: "S2 - Major", color: "#f59e0b" },
                S3: { label: "S3 - Minor", color: "#10b981" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-xl">Active Incidents</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-200">
              <TableRow>
                <TableHead className="font-bold">KPI ID</TableHead>
                <TableHead className="font-bold">KPI</TableHead>
                <TableHead className="font-bold">Start Date</TableHead>
                <TableHead className="font-bold">End Date</TableHead>
                <TableHead className="font-bold">Variable Name</TableHead>
                <TableHead className="font-bold">Equipment</TableHead>
                <TableHead className="font-bold">System</TableHead>
                <TableHead className="font-bold">Priority</TableHead>
                <TableHead className="font-bold">Severity</TableHead>
                <TableHead className="font-bold">Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map(incident => {
                const priorityStyle = getStyle(incident.Priority)
                const severityStyle = getStyle(incident.Severity)
                return (
                  <TableRow key={incident.id} className="hover:bg-gray-100">
                    <TableCell>{incident.KpiId}</TableCell>
                    <TableCell>{incident.Kpi}</TableCell>
                    <TableCell>{incident.startDate}</TableCell>
                    <TableCell>{incident.endDate}</TableCell>
                    <TableCell>{incident.VariableName}</TableCell>
                    <TableCell>{incident.Equipment}</TableCell>
                    <TableCell>{incident.System}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityStyle.color}`}
                      >
                        {priorityStyle.icon && (
                          <priorityStyle.icon className="mr-1 h-4 w-4" />
                        )}
                        {incident.Priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${severityStyle.color}`}
                      >
                        {severityStyle.icon && (
                          <severityStyle.icon className="mr-1 h-4 w-4" />
                        )}
                        {incident.Severity}
                      </span>
                    </TableCell>
                    <TableCell>{incident.Owner}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
