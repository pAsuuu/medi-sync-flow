
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  companyId: string;
}

/**
 * Service d'authentification pour gérer l'inscription et la connexion des utilisateurs
 */
export const authService = {
  /**
   * Vérifie un code d'invitation d'entreprise
   * @param invitationCode Code d'invitation à vérifier
   * @returns Informations sur l'entreprise si le code est valide
   */
  async verifyInvitationCode(invitationCode: string) {
    console.log("Verifying invitation code:", invitationCode);
    
    const { data: company, error } = await supabase
      .from('itr_companies')
      .select('id, name')
      .eq('invitation_code', invitationCode)
      .single();

    if (error) {
      console.error("Error verifying invitation code:", error);
      throw new Error('Code d\'invitation invalide');
    }
      
    if (!company) {
      throw new Error('Entreprise non trouvée');
    }

    return company;
  },

  /**
   * Envoie un magic link pour l'authentification
   * @param profileData Données du profil utilisateur
   * @returns Résultat de l'envoi du magic link
   */
  async sendMagicLink(profileData: ProfileData) {
    console.log("Sending magic link to:", profileData.email, "with profile data:", {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      itr_company_id: profileData.companyId
    });
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email: profileData.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth?redirect=/`,
        data: {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          itr_company_id: profileData.companyId
        }
      }
    });

    if (error) {
      console.error("Error sending magic link:", error);
      throw error;
    }

    console.log("Magic link sent successfully");
    return data;
  },

  /**
   * Vérifie si l'utilisateur est déjà connecté
   */
  async getSession() {
    console.log("Getting current session");
    const { data } = await supabase.auth.getSession();
    console.log("Session data:", data.session ? "Session exists" : "No session");
    return data.session;
  },

  /**
   * Processus de login avec Magic Link pour un utilisateur existant
   */
  async loginWithMagicLink(email: string) {
    console.log("Logging in with magic link:", email);
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth?redirect=/`,
      }
    });

    if (error) {
      console.error("Error sending login magic link:", error);
      throw error;
    }

    console.log("Login magic link sent successfully");
    return data;
  }
};
