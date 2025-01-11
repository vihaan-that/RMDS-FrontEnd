import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor } from 'lucide-react';

// Mock data for projects and their assets
const projectsData = {
  'project-1': {
    name: 'Project 1',
    assets: [
      { id: 1, name: 'Asset 1', status: 'Operational' },
      { id: 2, name: 'Asset 2', status: 'Maintenance' },
      { id: 3, name: 'Asset 3', status: 'Offline' },
    ],
  },
  'project-2': {
    name: 'Project 2',
    assets: [
      { id: 1, name: 'Asset 1', status: 'Operational' },
      { id: 2, name: 'Asset 2', status: 'Operational' },
      { id: 3, name: 'Asset 3', status: 'Maintenance' },
    ],
  },
};

export default function ProjectPage({ params }) {
  const projectData = projectsData[params.project];

  if (!projectData) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {projectData.name} Assets
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectData.assets.map((asset) => (
          <Card key={asset.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{asset.name}</span>
                <Monitor className="h-5 w-5 text-gray-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Status:{' '}
                <span
                  className={`font-semibold ${
                    asset.status === 'Operational'
                      ? 'text-green-600'
                      : asset.status === 'Maintenance'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {asset.status}
                </span>
              </p>
              <Button asChild className="w-full">
                <Link
                  href={`/dashboard/asset-monitoring/${params.project}/${asset.name
                    .toLowerCase()
                    .replace(' ', '-')}`}
                >
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
