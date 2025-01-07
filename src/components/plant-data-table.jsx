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
import { DatePickerWithRange } from '@/components/date-picker-with-range';

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
  const [processedData, setProcessedData] = useState([]);

  // Process data when date range changes
  useEffect(() => {
    if (!rawData?.components) return;

    const processed = rawData.components.map(component => {
      // For demo purposes, we'll use the monthly data for statistics
      // In a real app, you would filter based on the actual date range
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
  }, [rawData, dateRange]);

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
      
      <div className="mb-6">
        <DatePickerWithRange 
          className="w-full"
          value={dateRange}
          onChange={setDateRange}
        />
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
