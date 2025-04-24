
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingCard, OnboardingData } from '@/components/OnboardingCard';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { CalendarRange, FileStack, GraduationCap, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sample data - in a real app, this would come from an API
const recentOnboardings: OnboardingData[] = [
  {
    id: 'OB-2023-001',
    clientName: 'Cabinet Dr. Martin',
    itrCompany: 'MediComputers',
    products: ['WEDA', 'PatientFlow'],
    createdDate: '2023-12-10',
    scheduledDate: '2023-12-20',
    status: 'scheduled',
    contactPerson: 'Dr. Martin',
    assignedTo: 'Jean Dupont',
  },
  {
    id: 'OB-2023-002',
    clientName: 'Centre Medical Dubois',
    itrCompany: 'HealthIT Solutions',
    products: ['MediSoft'],
    createdDate: '2023-12-12',
    status: 'pending',
    contactPerson: 'Marie Dubois',
  },
  {
    id: 'OB-2023-003',
    clientName: 'Cabinet Dentaire Lefevre',
    itrCompany: 'DocTech Systems',
    products: ['DocManager', 'PatientFlow'],
    createdDate: '2023-12-05',
    scheduledDate: '2023-12-15',
    status: 'inprogress',
    contactPerson: 'Dr. Lefevre',
    assignedTo: 'Sophie Moreau',
  },
];

const statCards = [
  {
    title: 'Onboardings en attente',
    value: '12',
    description: 'Onboardings en attente de traitement',
    icon: FileStack,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  {
    title: 'Formations planifiées',
    value: '8',
    description: 'Formations prévues cette semaine',
    icon: CalendarRange,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Certifications actives',
    value: '24',
    description: 'Collaborateurs certifiés',
    icon: GraduationCap,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

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
                <span className="text-sm">8</span>
              </div>
              <div className="flex items-center gap-1.5">
                <StatusBadge status="inprogress" />
                <span className="text-sm">5</span>
              </div>
              <div className="flex items-center gap-1.5">
                <StatusBadge status="scheduled" />
                <span className="text-sm">4</span>
              </div>
              <div className="flex items-center gap-1.5">
                <StatusBadge status="completed" />
                <span className="text-sm">12</span>
              </div>
              <div className="flex items-center gap-1.5">
                <StatusBadge status="rejected" />
                <span className="text-sm">2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Onboardings récents</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentOnboardings.map((onboarding) => (
            <OnboardingCard
              key={onboarding.id}
              onboarding={onboarding}
              onClick={() => handleOnboardingClick(onboarding.id)}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => navigate('/onboardings')}>
            Voir tous les onboardings
          </Button>
        </div>
      </div>
    </div>
  );
}
