
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

export interface CompanyData {
  id: string;
  name: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export const useSignUp = () => {
  const [step, setStep] = useState<'company' | 'profile'>('company');
  const [invitationCode, setInvitationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [profileData, setProfileData] = useState<ProfileFormData>({
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
      const company = await authService.verifyInvitationCode(invitationCode);
      
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

      const userData = await authService.registerUser({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        companyId: companyData.id
      });

      toast({
        title: "Compte créé avec succès",
        description: "Vous allez être connecté automatiquement.",
      });
      
      // Attendre un délai avant de tenter la connexion
      setTimeout(async () => {
        try {
          await authService.signIn(profileData.email, `${profileData.email}-${Date.now()}-${Math.random().toString(36).substring(2)}`);
          navigate('/');
        } catch (signInError) {
          toast({
            title: "Connexion automatique impossible",
            description: "Veuillez vous connecter manuellement dans quelques instants.",
          });
          navigate('/auth');
        }
      }, 3000);
      
    } catch (error: any) {
      let errorMessage = error.message || "Une erreur s'est produite";
      
      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    invitationCode,
    setInvitationCode,
    loading,
    companyData,
    profileData,
    setProfileData,
    verifyInvitationCode,
    handleProfileSubmit
  };
};
