
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { AuthHeader } from '@/components/auth/AuthHeader';

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
  const { toast } = useToast();
  
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 px-4 py-6">
      <Card className={cn(
        "w-full max-w-md shadow-xl transition-all duration-300",
        "border-primary/10 bg-card/95 backdrop-blur-sm",
        "transform hover:shadow-2xl hover:-translate-y-1"
      )}>
        <CardHeader>
          <AuthHeader 
            mode={mode}
            step={step}
            profileData={profileData}
            companyName={companyData?.name}
          />
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

