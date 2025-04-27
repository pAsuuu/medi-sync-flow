
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

    return company;
  },

  /**
   * Envoie un magic link pour l'authentification
   * @param profileData Données du profil utilisateur
   * @returns Résultat de l'envoi du magic link
   */
  async sendMagicLink(profileData: ProfileData) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: profileData.email,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          itr_company_id: profileData.companyId
        }
      }
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Vérifie si l'utilisateur est déjà connecté
   */
  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
};
