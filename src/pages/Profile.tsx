
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://github.com/shadcn.png" alt="Photo de profil" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Charles Nguyen</CardTitle>
                <p className="text-sm text-muted-foreground">Administrateur</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Email</h3>
                <p className="text-sm">charles.nguyen@exemple.fr</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Entreprise</h3>
                <p className="text-sm">MediSync Central</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Rôle</h3>
                <p className="text-sm">Administrateur</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
