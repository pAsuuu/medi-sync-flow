
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
   * Crée un nouveau compte utilisateur
   * @param profileData Données du profil utilisateur
   * @returns Données de l'utilisateur créé
   */
  async registerUser(profileData: ProfileData) {
    // Générer un mot de passe sécurisé unique
    const tempPassword = `${profileData.email}-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    console.log("Tentative de création de compte avec les données:", {
      email: profileData.email,
      itr_company_id: profileData.companyId,
      first_name: profileData.firstName,
      last_name: profileData.lastName
    });

    // Étape 1: Créer le compte utilisateur
    const { data, error } = await supabase.auth.signUp({
      email: profileData.email,
      password: tempPassword,
      options: {
        data: {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          itr_company_id: profileData.companyId
        }
      }
    });

    if (error) {
      // Gérer les cas d'erreurs spécifiques
      if (error.message.includes('User already registered')) {
        throw new Error("Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.");
      }
      throw error;
    }

    if (!data.user) {
      throw new Error("Erreur lors de la création du compte");
    }

    // Étape 2: Créer manuellement l'entrée de profil
    try {
      await supabase.from('profiles').insert({
        id: data.user.id,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        itr_company_id: profileData.companyId
      });
    } catch (profileError) {
      console.log("Erreur lors de l'insertion manuelle du profil:", profileError);
      // Nous continuons même si cette étape échoue car le trigger pourrait l'avoir déjà créé
    }

    return data;
  },

  /**
   * Connecte un utilisateur avec son email et mot de passe
   * @param email Email de l'utilisateur
   * @param password Mot de passe de l'utilisateur
   */
  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
  },

  /**
   * Vérifie si l'utilisateur est déjà connecté
   */
  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
};
