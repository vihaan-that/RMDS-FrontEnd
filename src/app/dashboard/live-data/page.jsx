import { promises as fs } from 'fs';
import path from 'path';
import LiveDataTable from '@/components/live-data-table';
import  data  from '@/utils/data.json';

export default async function LiveDataPage() {
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Live Plant Data</h1>
      <LiveDataTable data={data.components} />
    </div>
  );
}


