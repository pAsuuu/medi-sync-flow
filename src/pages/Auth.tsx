
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, User, Mail } from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';
import { cn } from '@/lib/utils';
import { useSignUp } from '@/hooks/useSignUp';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { LoginForm } from '@/components/auth/LoginForm';
import { CompanyInviteForm } from '@/components/auth/CompanyInviteForm';
import { ProfileForm } from '@/components/auth/ProfileForm';
import { LoadingScreen } from '@/components/auth/LoadingScreen';

const Auth = () => {
  const {
    step,
    setStep,
    invitationCode,
    setInvitationCode,
    loading,
    companyData,
    profileData,
    setProfileData,
    verifyInvitationCode,
    handleProfileSubmit
  } = useSignUp();

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [processingAuth, setProcessingAuth] = useState(false);
  
  const navigate = useNavigate();
  const { session } = useAuth();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const handleAuthRedirect = async () => {
      if (session && !processingAuth) {
        const redirectTo = searchParams.get('redirect') || '/';
        console.log("User is authenticated, redirecting to:", redirectTo);
        navigate(redirectTo);
        return;
      }
      
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get('access_token') || hashParams.get('error')) {
        console.log("Auth callback detected");
        setProcessingAuth(true);
        
        try {
          const { data, error } = await supabase.auth.getSession();
          console.log("Auth callback result:", data, error);
          
          if (error) {
            throw error;
          }
          
          if (data?.session) {
            console.log("Session obtained from URL");
            toast({
              title: "Connexion réussie",
              description: "Vous êtes maintenant connecté",
            });
            
            const redirectTo = searchParams.get('redirect') || '/';
            navigate(redirectTo);
          }
        } catch (error: any) {
          console.error("Auth callback error:", error);
          toast({
            title: "Erreur d'authentification",
            description: error.message || "Échec de l'authentification",
            variant: "destructive",
          });
        } finally {
          setProcessingAuth(false);
        }
      }
    };
    
    handleAuthRedirect();
  }, [session, navigate, searchParams, processingAuth]);

  if (processingAuth) {
    return <LoadingScreen />;
  }

  const getHeaderIcon = () => {
    if (mode === 'login') {
      return (
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-6 w-6 text-primary" />
        </div>
      );
    }
    if (step === 'company') {
      return (
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Building className="h-6 w-6 text-primary" />
        </div>
      );
    }
    return (
      <UserAvatar 
        name={`${profileData.firstName} ${profileData.lastName}`} 
        size="lg"
        className="h-16 w-16 transform transition-all duration-300"
      />
    );
  };

  const getHeaderTitle = () => {
    if (mode === 'login') return 'Connexion';
    if (step === 'company') return 'Bienvenue';
    return `Rejoindre ${companyData?.name}`;
  };

  const getHeaderDescription = () => {
    if (mode === 'login') return 'Entrez votre email pour recevoir un lien de connexion';
    if (step === 'company') return 'Entrez le code d\'invitation de votre entreprise';
    return 'Complétez votre profil pour continuer';
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
            {getHeaderIcon()}
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {getHeaderTitle()}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {getHeaderDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'login' ? (
            <LoginForm onModeChange={() => setMode('signup')} />
          ) : step === 'company' ? (
            <CompanyInviteForm
              invitationCode={invitationCode}
              setInvitationCode={setInvitationCode}
              loading={loading}
              onSubmit={verifyInvitationCode}
              onModeChange={() => setMode('login')}
            />
          ) : (
            <ProfileForm
              profileData={profileData}
              setProfileData={setProfileData}
              loading={loading}
              onSubmit={handleProfileSubmit}
              onBack={() => setStep('company')}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
