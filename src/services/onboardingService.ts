
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type OnboardingFormData = {
  clientName: string;
  itrCompany: string;
  contactEmail: string;
  contactPhone: string;
  trainer?: string;
  bdcDate: Date;
  products: string[];
  numDoctors: number;
  numParamedical: number;
  numSecretaries: number;
  isMsp: boolean;
  obFeesActivated: boolean;
  preferredDate?: Date;
  comments?: string;
};

export async function createOnboarding(data: OnboardingFormData) {
  try {
    const { error } = await supabase
      .from('onboardings')
      .insert({
        client_name: data.clientName,
        itr_company_id: data.itrCompany,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        contact_person: data.trainer || 'Non défini',
        products: data.products,
        doctor_count: data.numDoctors,
        paramedical_count: data.numParamedical,
        secretary_count: data.numSecretaries,
        is_msp: data.isMsp,
        ob_fees_activated: data.obFeesActivated,
        desired_date: data.preferredDate ? data.preferredDate.toISOString() : null,
        comments: data.comments || null,
        status: 'pending'
      });

    if (error) {
      throw error;
    }
    
    toast({
      title: "Onboarding créé",
      description: `L'onboarding pour ${data.clientName} a été créé avec succès.`
    });
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la création de l'onboarding:", error);
    
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la création de l'onboarding.",
      variant: "destructive"
    });
    
    return false;
  }
}

export async function fetchOnboardings() {
  try {
    const { data, error } = await supabase
      .from('onboardings')
      .select(`
        *,
        itr_companies (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(onboarding => ({
      id: onboarding.id,
      clientName: onboarding.client_name,
      itrCompany: onboarding.itr_companies?.name || 'Non défini',
      products: onboarding.products,
      createdDate: onboarding.created_at.substring(0, 10),
      scheduledDate: onboarding.scheduled_date ? onboarding.scheduled_date.substring(0, 10) : undefined,
      status: onboarding.status,
      contactPerson: onboarding.contact_person,
      assignedTo: onboarding.assigned_to
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des onboardings:", error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la récupération des onboardings.",
      variant: "destructive"
    });
    return [];
  }
}

export async function fetchCompanies() {
  try {
    const { data, error } = await supabase
      .from('itr_companies')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des entreprises:", error);
    return [];
  }
}
