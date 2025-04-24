
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { OnboardingCard, OnboardingData } from '@/components/OnboardingCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sample data - in a real app, this would come from an API
const mockOnboardings: OnboardingData[] = [
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
  {
    id: 'OB-2023-004',
    clientName: 'Clinique Saint-Pierre',
    itrCompany: 'MedicalSoft',
    products: ['WEDA', 'MediSoft'],
    createdDate: '2023-12-01',
    scheduledDate: '2023-12-18',
    status: 'completed',
    contactPerson: 'Dr. Petit',
    assignedTo: 'Lucas Bernard',
  },
  {
    id: 'OB-2023-005',
    clientName: 'Cabinet Dr. Rousseau',
    itrCompany: 'HealthTech Innovations',
    products: ['Hellodoc'],
    createdDate: '2023-12-08',
    status: 'rejected',
    contactPerson: 'Dr. Rousseau',
  },
  {
    id: 'OB-2023-006',
    clientName: 'Centre Médical des Lilas',
    itrCompany: 'MediComputers',
    products: ['PatientFlow', 'MedicalOne'],
    createdDate: '2023-12-03',
    scheduledDate: '2023-12-22',
    status: 'scheduled',
    contactPerson: 'Dr. Lambert',
    assignedTo: 'Emma Martin',
  },
];

export default function Onboardings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');

  // Apply filters
  const filteredOnboardings = mockOnboardings.filter((onboarding) => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      onboarding.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      onboarding.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' || onboarding.status === statusFilter;

    // Company filter
    const matchesCompany = companyFilter === 'all' || onboarding.itrCompany === companyFilter;

    return matchesSearch && matchesStatus && matchesCompany;
  });

  const handleOnboardingClick = (id: string) => {
    navigate(`/onboardings/${id}`);
    toast({
      title: 'Onboarding ouvert',
      description: `Vous consultez l'onboarding ${id}`,
    });
  };

  // Get unique ITR companies for filter dropdown
  const uniqueCompanies = Array.from(new Set(mockOnboardings.map((ob) => ob.itrCompany)));

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Onboardings</h1>
        <Button onClick={() => navigate('/onboardings/create')}>
          <Plus className="mr-2 h-4 w-4" /> Nouvel onboarding
        </Button>
      </div>

      <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un onboarding..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtres:</span>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="inprogress">En cours</SelectItem>
              <SelectItem value="scheduled">Planifié</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="rejected">Rejeté</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={companyFilter}
            onValueChange={setCompanyFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Entreprise ITR" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {uniqueCompanies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredOnboardings.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Aucun onboarding ne correspond à vos critères de recherche
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCompanyFilter('all');
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOnboardings.map((onboarding) => (
            <OnboardingCard
              key={onboarding.id}
              onboarding={onboarding}
              onClick={() => handleOnboardingClick(onboarding.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
