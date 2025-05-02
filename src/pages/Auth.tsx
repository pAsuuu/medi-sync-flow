
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
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [authError, setAuthError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { session } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Extract error from hash or query params if present
  useEffect(() => {
    console.log("Auth page loaded, checking for errors");
    const parseHashParams = () => {
      // Check hash params first
      if (window.location.hash) {
        console.log("Hash params found:", window.location.hash);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        
        if (error) {
          const errorMessage = errorDescription 
            ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
            : `Erreur d'authentification: ${error}`;
          
          setAuthError(errorMessage);
          console.error("Auth error from hash:", { error, errorDescription, errorMessage });
          
          // Clean the URL
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          
          return true; // Error found in hash
        }
      }
      
      // Check query params if no error in hash
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (error) {
        const errorMessage = errorDescription 
          ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
          : `Erreur d'authentification: ${error}`;
        
        setAuthError(errorMessage);
        console.error("Auth error from query params:", { error, errorDescription, errorMessage });
        
        return true; // Error found in query params
      }
      
      return false; // No errors found
    };
    
    const hasError = parseHashParams();
    if (!hasError) {
      setAuthError(null); // Clear previous errors if none found
    }
  }, [searchParams]);
  
  useEffect(() => {
    const handleAuthRedirect = async () => {
      // If user is already authenticated, redirect to home or specified path
      if (session && !processingAuth) {
        console.log("User is already authenticated, redirecting");
        const redirectTo = searchParams.get('redirect') || '/';
        navigate(redirectTo);
        return;
      }
      
      // Check if this is a redirect from an auth flow
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      if (hashParams.get('access_token') || hashParams.get('error')) {
        console.log("Auth callback detected in hash", hashParams.get('access_token') ? "with token" : "with error");
        setProcessingAuth(true);
        
        try {
          const { data, error } = await supabase.auth.getSession();
          console.log("Getting session after auth callback:", data?.session ? "Session found" : "No session");
          
          if (error) {
            throw error;
          }
          
          if (data?.session) {
            console.log("Valid session obtained, redirecting");
            toast({
              title: "Connexion réussie",
              description: "Vous êtes maintenant connecté",
            });
            
            const redirectTo = searchParams.get('redirect') || '/';
            navigate(redirectTo);
          }
        } catch (error: any) {
          console.error("Auth callback processing error:", error);
          setAuthError(error.message || "Échec de l'authentification");
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
  }, [session, navigate, searchParams, processingAuth, toast]);

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
          {authError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur d'authentification</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
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
