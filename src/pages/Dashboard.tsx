
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingCard, OnboardingData } from '@/components/OnboardingCard';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { CalendarRange, FileStack, GraduationCap, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchOnboardings } from '@/services/onboardingService';
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recentOnboardings, setRecentOnboardings] = useState<OnboardingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    scheduled: 0,
    inprogress: 0,
    completed: 0,
    rejected: 0,
    trainingsThisWeek: 0,
    activeCertifications: 0
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Récupérer les onboardings récents
        const onboardings = await fetchOnboardings();
        setRecentOnboardings(onboardings.slice(0, 3));
        
        // Calculer les statistiques
        const pendingCount = onboardings.filter(o => o.status === 'pending').length;
        const scheduledCount = onboardings.filter(o => o.status === 'scheduled').length;
        const inProgressCount = onboardings.filter(o => o.status === 'inprogress').length;
        const completedCount = onboardings.filter(o => o.status === 'completed').length;
        const rejectedCount = onboardings.filter(o => o.status === 'rejected').length;
        
        // Récupérer le nombre d'événements cette semaine
        const today = new Date();
        const startOfWeek = new Date();
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const { data: eventsThisWeek } = await supabase
          .from('events')
          .select('count')
          .gte('start_time', startOfWeek.toISOString())
          .lte('start_time', endOfWeek.toISOString());
          
        // Récupérer le nombre de certifications actives
        const { data: certifications } = await supabase
          .from('user_certifications')
          .select('count')
          .gte('expiry_date', new Date().toISOString());
        
        setStats({
          pending: pendingCount,
          scheduled: scheduledCount,
          inprogress: inProgressCount,
          completed: completedCount,
          rejected: rejectedCount,
          trainingsThisWeek: eventsThisWeek?.[0]?.count || 0,
          activeCertifications: certifications?.[0]?.count || 0
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données du tableau de bord", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const statCards = [
    {
      title: 'Onboardings en attente',
      value: stats.pending.toString(),
      description: 'Onboardings en attente de traitement',
      icon: FileStack,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Formations planifiées',
      value: stats.trainingsThisWeek.toString(),
      description: 'Formations prévues cette semaine',
      icon: CalendarRange,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Certifications actives',
      value: stats.activeCertifications.toString(),
      description: 'Collaborateurs certifiés',
      icon: GraduationCap,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
  ];

  const handleCreateOnboarding = () => {
    navigate('/onboardings/create');
  };

  const handleOnboardingClick = (id: string) => {
    navigate(`/onboardings/${id}`);
    toast({
      title: 'Onboarding ouvert',
      description: `Vous consultez l'onboarding ${id}`,
    });
  };

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <Button onClick={handleCreateOnboarding}>
          <Plus className="mr-2 h-4 w-4" /> Nouvel onboarding
        </Button>
      </div>

      {loading ? (
        <div className="mt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Statut des onboardings</CardTitle>
                <CardDescription>Vue d'ensemble des onboardings en cours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status="pending" />
                    <span className="text-sm">{stats.pending}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status="inprogress" />
                    <span className="text-sm">{stats.inprogress}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status="scheduled" />
                    <span className="text-sm">{stats.scheduled}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status="completed" />
                    <span className="text-sm">{stats.completed}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status="rejected" />
                    <span className="text-sm">{stats.rejected}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Onboardings récents</h2>
            {recentOnboardings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                <p className="text-sm text-muted-foreground">Aucun onboarding récent</p>
                <Button variant="outline" className="mt-4" onClick={handleCreateOnboarding}>
                  <Plus className="mr-2 h-4 w-4" /> Créer un premier onboarding
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recentOnboardings.map((onboarding) => (
                  <OnboardingCard
                    key={onboarding.id}
                    onboarding={onboarding}
                    onClick={() => handleOnboardingClick(onboarding.id)}
                  />
                ))}
              </div>
            )}
            {recentOnboardings.length > 0 && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" onClick={() => navigate('/onboardings')}>
                  Voir tous les onboardings
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
