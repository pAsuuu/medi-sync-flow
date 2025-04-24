export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      certifications: {
        Row: {
          created_at: string
          id: string
          level: number
          name: string
          product_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number
          name: string
          product_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          name?: string
          product_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_time: string
          id: string
          onboarding_id: string | null
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time: string
          id?: string
          onboarding_id?: string | null
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_time?: string
          id?: string
          onboarding_id?: string | null
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_onboarding_id_fkey"
            columns: ["onboarding_id"]
            isOneToOne: false
            referencedRelation: "onboardings"
            referencedColumns: ["id"]
          },
        ]
      }
      itr_companies: {
        Row: {
          created_at: string
          id: string
          invitation_code: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          invitation_code: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          invitation_code?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      onboardings: {
        Row: {
          assigned_to: string | null
          client_name: string
          comments: string | null
          contact_email: string | null
          contact_person: string
          contact_phone: string | null
          created_at: string
          created_by: string | null
          desired_date: string | null
          doctor_count: number | null
          id: string
          is_msp: boolean | null
          itr_company_id: string | null
          ob_fees_activated: boolean | null
          paramedical_count: number | null
          products: string[]
          scheduled_date: string | null
          secretary_count: number | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_name: string
          comments?: string | null
          contact_email?: string | null
          contact_person: string
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          desired_date?: string | null
          doctor_count?: number | null
          id?: string
          is_msp?: boolean | null
          itr_company_id?: string | null
          ob_fees_activated?: boolean | null
          paramedical_count?: number | null
          products?: string[]
          scheduled_date?: string | null
          secretary_count?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_name?: string
          comments?: string | null
          contact_email?: string | null
          contact_person?: string
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          desired_date?: string | null
          doctor_count?: number | null
          id?: string
          is_msp?: boolean | null
          itr_company_id?: string | null
          ob_fees_activated?: boolean | null
          paramedical_count?: number | null
          products?: string[]
          scheduled_date?: string | null
          secretary_count?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboardings_itr_company_id_fkey"
            columns: ["itr_company_id"]
            isOneToOne: false
            referencedRelation: "itr_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          itr_company_id: string | null
          last_name: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          itr_company_id?: string | null
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          itr_company_id?: string | null
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_itr_company_id_fkey"
            columns: ["itr_company_id"]
            isOneToOne: false
            referencedRelation: "itr_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      sso_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          itr_company_id: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          itr_company_id?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          itr_company_id?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sso_logs_itr_company_id_fkey"
            columns: ["itr_company_id"]
            isOneToOne: false
            referencedRelation: "itr_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_certifications: {
        Row: {
          certification_id: string | null
          created_at: string
          expiry_date: string
          id: string
          received_date: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          certification_id?: string | null
          created_at?: string
          expiry_date?: string
          id?: string
          received_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          certification_id?: string | null
          created_at?: string
          expiry_date?: string
          id?: string
          received_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_certifications_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
