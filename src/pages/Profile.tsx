import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/UserAvatar';
import { Settings, Bell, Calendar, Mail, Shield, GraduationCap, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export default function Profile() {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: 'Profil mis à jour',
      description: 'Vos modifications ont été enregistrées avec succès',
    });
  };

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations de profil</CardTitle>
                <CardDescription>Gérez vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                  <UserAvatar name="John Doe" size="lg" />
                  <div>
                    <Button size="sm">Changer l'avatar</Button>
                    <p className="mt-1 text-xs text-muted-foreground">
                      JPG, GIF ou PNG. 1MB max.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Input id="role" defaultValue="Responsable éditeur" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input id="company" defaultValue="MediSoft" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    Enregistrer les modifications
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mot de passe</CardTitle>
                <CardDescription>Mettez à jour votre mot de passe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Mettre à jour le mot de passe</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Configurez les notifications que vous souhaitez recevoir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      <Bell className="mt-0.5 h-5 w-5" />
                      <div>
                        <h4 className="font-medium">Nouveaux onboardings</h4>
                        <p className="text-sm text-muted-foreground">
                          Soyez notifié lorsqu'un nouvel onboarding est créé
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Email</Badge>
                      <Badge>Application</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      <Calendar className="mt-0.5 h-5 w-5" />
                      <div>
                        <h4 className="font-medium">Planification</h4>
                        <p className="text-sm text-muted-foreground">
                          Soyez notifié des événements planifiés et des changements de calendrier
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Email</Badge>
                      <Badge>Application</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      <GraduationCap className="mt-0.5 h-5 w-5" />
                      <div>
                        <h4 className="font-medium">Formations</h4>
                        <p className="text-sm text-muted-foreground">
                          Recevez des notifications concernant vos formations et certifications
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge>Email</Badge>
                      <Badge>Application</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    Enregistrer les préférences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Vos certifications</CardTitle>
                <CardDescription>Consultez et gérez vos certifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Certification WEDA</h3>
                    <Badge>Niveau 3</Badge>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Obtenue le 15/10/2023 • Valide jusqu'au 15/10/2025
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Voir le certificat
                      </Button>
                      <Button size="sm">Partager</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Certification Hellodoc</h3>
                    <Badge variant="secondary">Niveau 2</Badge>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Obtenue le 20/11/2023 • Valide jusqu'au 20/11/2025
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Voir le certificat
                      </Button>
                      <Button size="sm">Partager</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-dashed p-4">
                  <div className="flex flex-col items-center justify-center space-y-2 py-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Nouvelle certification</h3>
                    <p className="text-center text-sm text-muted-foreground">
                      Commencez une formation pour obtenir une nouvelle certification
                    </p>
                    <Button>Explorer les formations</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
