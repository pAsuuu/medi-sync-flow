
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SSOLogs() {
  const [selectedCompany, setSelectedCompany] = useState<string>('all');

  const { data: companies, isLoading: loadingCompanies } = useQuery({
    queryKey: ['itr-companies'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('itr_companies')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error("Erreur lors de la récupération des entreprises:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer la liste des entreprises",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  const { data: logs, isLoading: loadingLogs } = useQuery({
    queryKey: ['sso-logs', selectedCompany],
    queryFn: async () => {
      try {
        let query = supabase
          .from('sso_logs')
          .select(`
            id,
            created_at,
            event_type,
            ip_address,
            user_agent,
            itr_companies (
              name
            ),
            user_id,
            metadata
          `)
          .order('created_at', { ascending: false });

        if (selectedCompany !== 'all') {
          query = query.eq('itr_company_id', selectedCompany);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        
        // Get user profile information in a separate query
        if (data && data.length > 0) {
          const userIds = data.map(log => log.user_id).filter(id => id);
          
          let profilesMap = {};
          
          if (userIds.length > 0) {
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('id, first_name, last_name, email')
              .in('id', userIds);
              
            if (!profilesError && profilesData) {
              // Create a map of profiles by ID for quick lookup
              profilesMap = profilesData.reduce((acc, profile) => {
                acc[profile.id] = profile;
                return acc;
              }, {});
            } else if (profilesError) {
              console.error("Erreur lors du chargement des profils:", profilesError);
            }
          }
          
          // Merge profile data with logs
          return data.map(log => ({
            ...log,
            profile: log.user_id ? profilesMap[log.user_id] : null
          }));
        }
        
        return data.map(log => ({ ...log, profile: null }));
      } catch (error) {
        console.error("Erreur lors de la récupération des logs SSO:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les logs SSO",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  const isLoading = loadingCompanies || loadingLogs;

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Logs SSO</h1>
        <Select value={selectedCompany} onValueChange={setSelectedCompany} disabled={isLoading}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Filtrer par entreprise" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les entreprises</SelectItem>
            {companies?.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des connexions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : logs && logs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Navigateur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.created_at), 'Pp', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {log.profile ? 
                        <>
                          {log.profile.first_name} {log.profile.last_name}
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {log.profile.email}
                          </span>
                        </> 
                        : 
                        <span className="text-muted-foreground">
                          Utilisateur inconnu
                        </span>
                      }
                    </TableCell>
                    <TableCell>{log.itr_companies?.name || "—"}</TableCell>
                    <TableCell>{log.event_type}</TableCell>
                    <TableCell>{log.ip_address || "—"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {log.user_agent || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">Aucun log SSO trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
