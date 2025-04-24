
import { useState } from 'react';
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

export default function SSOLogs() {
  const [selectedCompany, setSelectedCompany] = useState<string>('all');

  const { data: companies } = useQuery({
    queryKey: ['itr-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('itr_companies')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const { data: logs, isLoading } = useQuery({
    queryKey: ['sso-logs', selectedCompany],
    queryFn: async () => {
      let query = supabase
        .from('sso_logs')
        .select(`
          *,
          itr_companies (
            name
          ),
          profiles (
            email,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedCompany !== 'all') {
        query = query.eq('itr_company_id', selectedCompany);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Logs SSO</h1>
        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
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
              {logs?.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.created_at), 'Pp', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {log.profiles?.first_name} {log.profiles?.last_name}
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {log.profiles?.email}
                    </span>
                  </TableCell>
                  <TableCell>{log.itr_companies?.name}</TableCell>
                  <TableCell>{log.event_type}</TableCell>
                  <TableCell>{log.ip_address}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {log.user_agent}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
