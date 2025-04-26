
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Building, User, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { UserAvatar } from '@/components/UserAvatar';
import { cn } from '@/lib/utils';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 px-4 py-6">
      <Card className={cn(
        "w-full max-w-md shadow-xl transition-all duration-300",
        "border-primary/10 bg-card/95 backdrop-blur-sm",
        "transform hover:shadow-2xl hover:-translate-y-1"
      )}>
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            {step === 'company' ? (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building className="h-6 w-6 text-primary" />
              </div>
            ) : (
              <UserAvatar 
                name={`${profileData.firstName} ${profileData.lastName}`} 
                size="lg"
                className="h-16 w-16 transform transition-all duration-300"
              />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {step === 'company' ? 'Bienvenue' : `Rejoindre ${companyData?.name}`}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {step === 'company' 
              ? 'Entrez le code d\'invitation de votre entreprise'
              : 'Complétez votre profil pour continuer'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'company' ? (
            <form onSubmit={verifyInvitationCode} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="invitationCode" className="text-center block text-base">
                  Code d'invitation
                </Label>
                <div className="flex justify-center">
                  <InputOTP 
                    maxLength={8} 
                    value={invitationCode} 
                    onChange={setInvitationCode}
                    className="gap-2"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="border-primary/20" />
                      <InputOTPSlot index={1} className="border-primary/20" />
                      <InputOTPSlot index={2} className="border-primary/20" />
                      <InputOTPSlot index={3} className="border-primary/20" />
                      <InputOTPSlot index={4} className="border-primary/20" />
                      <InputOTPSlot index={5} className="border-primary/20" />
                      <InputOTPSlot index={6} className="border-primary/20" />
                      <InputOTPSlot index={7} className="border-primary/20" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium transition-all"
                disabled={loading || invitationCode.length !== 8}
              >
                {loading ? 'Vérification...' : 'Continuer'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-base">Prénom</Label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="pl-10 h-11 text-base"
                      required
                      autoFocus
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-base">Nom</Label>
                  <div className="relative">
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="pl-10 h-11 text-base"
                      required
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base">Email professionnel</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 h-11 text-base"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium transition-all"
                disabled={loading}
              >
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
