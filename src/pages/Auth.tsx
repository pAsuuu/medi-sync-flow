
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { UserAvatar } from '@/components/UserAvatar';

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
      // Vérifier le code d'invitation
      const { data: company, error } = await supabase
        .from('itr_companies')
        .select('id, name')
        .eq('invitation_code', invitationCode)
        .single();

      if (error) {
        throw new Error('Code d\'invitation invalide');
      }
      
      if (!company) {
        throw new Error('Entreprise non trouvée');
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
      // Valider les données
      if (!profileData.firstName || !profileData.lastName || !profileData.email) {
        throw new Error('Veuillez remplir tous les champs');
      }

      // Générer un mot de passe sécurisé unique basé sur l'email et un timestamp
      const tempPassword = `${profileData.email}-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      
      // Créer le compte utilisateur
      const { data, error } = await supabase.auth.signUp({
        email: profileData.email,
        password: tempPassword,
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
        description: "Vous pouvez maintenant vous connecter avec votre email.",
      });
      
      // Connecter automatiquement l'utilisateur
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password: tempPassword,
      });
      
      if (signInError) {
        // Si l'authentification échoue, rediriger vers la page d'accueil
        navigate('/');
      } else {
        // Authentifié avec succès
        navigate('/');
      }
    } catch (error: any) {
      let errorMessage = error.message;
      
      // Gérer les erreurs spécifiques
      if (error.message.includes('User already registered')) {
        errorMessage = "Cet email est déjà utilisé. Veuillez vous connecter.";
      } else if (error.message.includes('Database error granting user')) {
        errorMessage = "Erreur lors de l'enregistrement du profil. Veuillez réessayer.";
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            {step === 'company' ? 'Bienvenue' : `Créez votre compte ${companyData?.name}`}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 'company' 
              ? 'Entrez le code d\'invitation de votre entreprise'
              : 'Complétez votre profil pour continuer'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'company' ? (
            <form onSubmit={verifyInvitationCode} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="invitationCode" className="text-center block">
                  Code d'invitation
                </Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={8} value={invitationCode} onChange={setInvitationCode}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading || invitationCode.length !== 8}>
                {loading ? 'Vérification...' : 'Continuer'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="flex justify-center mb-6">
                <UserAvatar 
                  name={`${profileData.firstName} ${profileData.lastName}`} 
                  size="lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                  autoFocus
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
                <Label htmlFor="email">Email professionnel</Label>
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
