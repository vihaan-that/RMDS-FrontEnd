
"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { CalendarIcon, Mail, FileText, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function ReportGenerationPage() {
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [startTime, setStartTime] = useState("00:00")
  const [endTime, setEndTime] = useState("23:59")
  const [reportContent, setReportContent] = useState(null)

  const generateReport = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates")
      return
    }
    // In a real application, you would fetch data based on the selected timeframe
    // and generate a report. For this example, we'll just set some mock content.
    setReportContent(`Report generated for timeframe:
    From: ${format(startDate, "PPP")} ${startTime}
    To: ${format(endDate, "PPP")} ${endTime}
    
    This is where the actual report content would go, based on the data
    fetched for the selected timeframe.`)
  }

  const mailReport = () => {
    if (!reportContent) {
      alert("Please generate a report first")
      return
    }
    // In a real application, you would implement the mailing functionality here
    alert("Report has been mailed (This is a mock action)")
  }

  const clearSearch = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setStartTime("00:00")
    setEndTime("23:59")
    setReportContent(null)
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Report Generation
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Timeframe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={generateReport}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button onClick={mailReport} variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Mail Report
            </Button>
            <Button onClick={clearSearch} variant="ghost">
              <X className="mr-2 h-4 w-4" />
              Clear Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportContent && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Report</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">
              {reportContent}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
