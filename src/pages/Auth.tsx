
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [step, setStep] = useState<'company' | 'profile'>('company');
  const [invitationCode, setInvitationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<{ id: string; name: string } | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const verifyInvitationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: company, error } = await supabase
        .from('itr_companies')
        .select('id, name')
        .eq('invitation_code', invitationCode)
        .single();

      if (error) throw error;
      
      if (!company) {
        throw new Error('Code d\'invitation invalide');
      }

      setCompanyData(company);
      setStep('profile');
      toast({
        title: "Entreprise identifiée",
        description: `Bienvenue chez ${company.name}`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData) return;
    setLoading(true);

    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email: profileData.email,
        password: invitationCode + profileData.email, // Création d'un mot de passe unique
        options: {
          data: {
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            itr_company_id: companyData.id
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Compte créé avec succès",
        description: "Veuillez vérifier votre email pour confirmer votre compte.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {step === 'company' ? 'Code d\'entreprise' : 'Création de profil'}
          </CardTitle>
          <CardDescription>
            {step === 'company' 
              ? 'Entrez le code d\'invitation de votre entreprise'
              : `Complétez votre profil pour ${companyData?.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'company' ? (
            <form onSubmit={verifyInvitationCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invitationCode">Code d'invitation</Label>
                <div className="flex gap-2">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <Input
                    id="invitationCode"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    placeholder="Entrez votre code"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Vérification...' : 'Continuer'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Création du compte...' : 'Créer mon compte'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
