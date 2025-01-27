"use client"
import React, { useState } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
    header: 'Value',
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.value} {row.original.unit}
      </Badge>
    ),
  },
  {
    accessorKey: 'sNumber',
    header: 'S#',
  },
];

const timeFrameOptions = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function LiveDataTable({ data }) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [timeFrame, setTimeFrame] = useState('hourly');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const table = useReactTable({
    data,
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
        pageSize: 10,
      },
    },
  });

  const handleRowClick = (row) => {
    setSelectedRow(row.original);
    setIsDialogOpen(true);
  };

  const getChartData = () => {
    if (!selectedRow) return [];
    const historicalData = selectedRow.historicalData[timeFrame];
    const currentDate = new Date();
    
    return historicalData.map((value, index) => {
      let time;
      switch (timeFrame) {
        case 'hourly':
          time = new Date(currentDate - (historicalData.length - 1 - index) * 60 * 60 * 1000);
          return { time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), value };
        case 'daily':
          time = new Date(currentDate - (historicalData.length - 1 - index) * 24 * 60 * 60 * 1000);
          return { time: time.toLocaleDateString([], { month: 'short', day: 'numeric' }), value };
        case 'weekly':
          time = new Date(currentDate - (historicalData.length - 1 - index) * 7 * 24 * 60 * 60 * 1000);
          return { time: `Week ${index + 1}`, value };
        case 'monthly':
          time = new Date(currentDate.getFullYear(), currentDate.getMonth() - (historicalData.length - 1 - index), 1);
          return { time: time.toLocaleDateString([], { month: 'short', year: 'numeric' }), value };
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Live Plant Data</h1>
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
                onClick={() => handleRowClick(row)}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedRow?.tagName} - {selectedRow?.description}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                {timeFrameOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `${value}${selectedRow?.unit}`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}${selectedRow?.unit}`, selectedRow?.tagName]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Current Value: {selectedRow?.value} {selectedRow?.unit}</p>
            <p>Sensor Number: {selectedRow?.sNumber}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
