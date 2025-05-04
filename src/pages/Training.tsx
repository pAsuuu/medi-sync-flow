
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Training() {
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Formations</h1>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Catalogue de formations</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12">
            <p className="text-center text-muted-foreground">
              Le catalogue des formations sera disponible prochainement
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
