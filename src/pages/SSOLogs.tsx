
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { fetchSSOLogs } from '@/services/onboardingService';

interface SSOMLog {
  id: string;
  eventType: string;
  userAgent: string;
  ipAddress: string;
  companyName: string;
  timestamp: string;
  metadata: any;
}

export default function SSOLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState<SSOMLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const data = await fetchSSOLogs();
        setLogs(data);
      } catch (error) {
        console.error("Erreur lors du chargement des logs SSO", error);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => 
    searchQuery === '' ||
    log.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-3xl font-bold tracking-tight">Logs SSO</h1>
      </div>

      <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher dans les logs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Chargement des logs...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 
                "Aucun log ne correspond à votre recherche" : 
                "Aucun log SSO disponible"
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Journaux d'activité SSO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left text-sm font-medium">Événement</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Entreprise</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">IP</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">User Agent</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Date/Heure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b">
                        <td className="px-4 py-2 text-sm">{log.eventType}</td>
                        <td className="px-4 py-2 text-sm">{log.companyName}</td>
                        <td className="px-4 py-2 text-sm font-mono">{log.ipAddress}</td>
                        <td className="max-w-xs truncate px-4 py-2 text-xs">
                          {log.userAgent}
                        </td>
                        <td className="px-4 py-2 text-sm">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
