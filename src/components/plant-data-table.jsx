"use client"
import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerWithRange } from './date-picker-with-range';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Function to generate time options in 15-minute intervals
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(timeString);
    }
  }
  return options;
};

// Function to calculate statistics for an array of numbers
const calculateStats = (values) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = Math.sqrt(
    values.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / values.length
  );
  
  return {
    max: max.toFixed(2),
    min: min.toFixed(2),
    avg: avg.toFixed(2),
    stdDev: stdDev.toFixed(2)
  };
};

// Enhanced columns definition with statistical values
const columns = [
  {
    accessorKey: 'tagName',
    header: 'Tag Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'value',
    header: 'Current Value',
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.value} {row.original.unit}
      </Badge>
    ),
  },
  {
    accessorKey: 'maxValue',
    header: 'Max Value',
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-blue-50">
        {row.original.maxValue} {row.original.unit}
      </Badge>
    ),
  },
  {
    accessorKey: 'minValue',
    header: 'Min Value',
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-blue-50">
        {row.original.minValue} {row.original.unit}
      </Badge>
    ),
  },
  {
    accessorKey: 'avgValue',
    header: 'Average Value',
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-blue-50">
        {row.original.avgValue} {row.original.unit}
      </Badge>
    ),
  },
  {
    accessorKey: 'stdDev',
    header: 'Std Deviation',
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-blue-50">
        {row.original.stdDev} {row.original.unit}
      </Badge>
    ),
  },
  {
    accessorKey: 'sNumber',
    header: 'S#',
  },
];

export default function PlantDataTable({ rawData }) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 0, 31)
  });
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:45');
  const [processedData, setProcessedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeOptions = generateTimeOptions();

  const handleSubmit = () => {
    if (!rawData?.components) return;
    
    setIsLoading(true);

    try {
      // Create full DateTime objects by combining dates and times
      const startDateTime = new Date(dateRange.from);
      const [startHours, startMinutes] = startTime.split(':');
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));

      const endDateTime = new Date(dateRange.to);
      const [endHours, endMinutes] = endTime.split(':');
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));

      // Validate date range
      if (endDateTime < startDateTime) {
        alert('End date/time must be after start date/time');
        return;
      }

      // Process the data with the new date-time range
      const processed = rawData.components.map(component => {
        // Here you would filter historicalData based on startDateTime and endDateTime
        // For demo purposes, we'll continue using the monthly data
        const stats = calculateStats(component.historicalData.monthly);
        
        return {
          ...component,
          maxValue: stats.max,
          minValue: stats.min,
          avgValue: stats.avg,
          stdDev: stats.stdDev
        };
      });

      setProcessedData(processed);
    } catch (error) {
      console.error('Error processing data:', error);
      alert('Error processing data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDateRange({
      from: new Date(2024, 0, 1),
      to: new Date(2024, 0, 31)
    });
    setStartTime('00:00');
    setEndTime('23:45');
    handleSubmit();
  };

  // Initialize data on component mount
  useEffect(() => {
    handleSubmit();
  }, [rawData]);

  const table = useReactTable({
    data: processedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  // Render the cards at the top of the table
  const renderCards = () => {
    if (!rawData?.cards) return null;
    
    return (
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {rawData.cards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Plant Data Table</h1>
      
      {renderCards()}
      
      <div className="mb-6 space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <DatePickerWithRange 
            className="w-full"
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Start Time</label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={`start-${time}`} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">End Time</label>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select end time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={`end-${time}`} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={handleSubmit}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Data'}
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            disabled={isLoading}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Input
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          placeholder="Filter all columns..."
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-muted/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
