
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building, User, Mail, ArrowLeft } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { UserAvatar } from '@/components/UserAvatar';
import { cn } from '@/lib/utils';
import { useSignUp } from '@/hooks/useSignUp';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const {
    step,
    setStep,  // Make sure this is correctly destructured
    invitationCode,
    setInvitationCode,
    loading,
    companyData,
    profileData,
    setProfileData,
    verifyInvitationCode,
    handleProfileSubmit
  } = useSignUp();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: loginEmail,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre boîte de réception et cliquer sur le lien pour vous connecter.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
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
            {mode === 'login' ? (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            ) : step === 'company' ? (
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
            {mode === 'login' ? 'Connexion' : step === 'company' ? 'Bienvenue' : `Rejoindre ${companyData?.name}`}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {mode === 'login' 
              ? 'Entrez votre email pour recevoir un lien de connexion'
              : step === 'company' 
                ? 'Entrez le code d\'invitation de votre entreprise'
                : 'Complétez votre profil pour continuer'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="loginEmail" className="text-base">Email</Label>
                <div className="relative">
                  <Input
                    id="loginEmail"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10 h-11 text-base"
                    placeholder="votre@email.com"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium transition-all"
                  disabled={loginLoading}
                >
                  {loginLoading ? 'Envoi en cours...' : 'Recevoir un lien de connexion'}
                </Button>

                <div className="text-center">
                  <Button 
                    variant="link" 
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-sm"
                  >
                    Nouvelle inscription avec code d'invitation
                  </Button>
                </div>
              </div>
            </form>
          ) : step === 'company' ? (
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
              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium transition-all"
                  disabled={loading || invitationCode.length !== 8}
                >
                  {loading ? 'Vérification...' : 'Continuer'}
                </Button>

                <div className="text-center">
                  <Button 
                    variant="link" 
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sm"
                  >
                    Déjà inscrit ? Se connecter
                  </Button>
                </div>
              </div>
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

              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium transition-all"
                  disabled={loading}
                >
                  {loading ? 'Envoi en cours...' : 'Recevoir un lien de connexion'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setStep('company')}
                >
                  <ArrowLeft className="h-4 w-4" /> Retour
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
