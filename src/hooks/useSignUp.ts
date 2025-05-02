
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
      console.log("Verifying invitation code:", invitationCode);
      const company = await authService.verifyInvitationCode(invitationCode);
      
      console.log("Company found:", company);
      setCompanyData(company);
      setStep('profile');
      toast({
        title: "Entreprise identifiée",
        description: `Bienvenue chez ${company.name}`,
      });
    } catch (error: any) {
      console.error("Erreur lors de la vérification du code d'invitation:", error);
      toast({
        title: "Erreur",
        description: error.message || "Code d'invitation invalide",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData) {
      toast({
        title: "Erreur",
        description: "Les données de l'entreprise sont manquantes",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      // Valider les données
      if (!profileData.firstName || !profileData.lastName || !profileData.email) {
        throw new Error('Veuillez remplir tous les champs');
      }

      console.log("Submitting profile data:", profileData);
      console.log("Company data:", companyData);

      // Enregistrer les données de profil dans localStorage pour utilisation ultérieure
      const userData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        companyId: companyData.id,
        companyName: companyData.name
      };
      
      localStorage.setItem('user_profile_data', JSON.stringify(userData));
      
      // Envoyer le magic link avec les données du profil
      await authService.sendMagicLink({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        companyId: companyData.id
      });

      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre boîte de réception et cliquer sur le lien pour vous connecter.",
      });
      
    } catch (error: any) {
      console.error("Erreur complète:", error);
      
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
