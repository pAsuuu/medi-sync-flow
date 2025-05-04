
import React, { useState, useEffect } from 'react';
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
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchOnboardings } from '@/services/onboardingService';

export default function Onboardings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [onboardings, setOnboardings] = useState<OnboardingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOnboardings = async () => {
      setLoading(true);
      try {
        const data = await fetchOnboardings();
        setOnboardings(data);
      } catch (error) {
        console.error("Erreur lors du chargement des onboardings", error);
      } finally {
        setLoading(false);
      }
    };

    loadOnboardings();
  }, []);

  // Apply filters
  const filteredOnboardings = onboardings.filter((onboarding) => {
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
  const uniqueCompanies = Array.from(new Set(onboardings.map((ob) => ob.itrCompany)));

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

      {loading ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Chargement des onboardings...</p>
        </div>
      ) : filteredOnboardings.length === 0 ? (
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
