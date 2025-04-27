
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

      // Approche directe: enregistrer les données de profil dans localStorage pour utilisation ultérieure
      const userData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        companyId: companyData.id,
        companyName: companyData.name
      };
      
      localStorage.setItem('user_profile_data', JSON.stringify(userData));
      
      // Utiliser une méthode de création simplifiée pour le magic link
      const { error } = await supabase.auth.signInWithOtp({
        email: profileData.email,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            itr_company_id: companyData.id
          }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre boîte de réception et cliquer sur le lien pour vous connecter.",
      });
      
      // Rediriger après un court délai
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
      
    } catch (error: any) {
      let errorMessage = error.message || "Une erreur s'est produite";
      console.error("Erreur complète:", error);
      
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
