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
      assistants: {
        Row: {
          created_at: string
          id: string
          mode_id: string | null
          name: string
          personality_id: string | null
          vapi_assistant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mode_id?: string | null
          name: string
          personality_id?: string | null
          vapi_assistant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mode_id?: string | null
          name?: string
          personality_id?: string | null
          vapi_assistant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assistants_mode_id_fkey"
            columns: ["mode_id"]
            isOneToOne: false
            referencedRelation: "modes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_personality"
            columns: ["personality_id"]
            isOneToOne: false
            referencedRelation: "personalities"
            referencedColumns: ["id"]
          },
        ]
      }
      call_logs: {
        Row: {
          call_summary: string | null
          call_transcript: string | null
          created_at: string | null
          id: string
          payload: Json | null
          processed_by_ai: boolean | null
          processed_for_summary: boolean
          processed_keywords: boolean | null
          response: Json | null
          scheduled_call_id: string | null
          status: string | null
          user_id: string | null
          vapi_call_id: string | null
        }
        Insert: {
          call_summary?: string | null
          call_transcript?: string | null
          created_at?: string | null
          id?: string
          payload?: Json | null
          processed_by_ai?: boolean | null
          processed_for_summary?: boolean
          processed_keywords?: boolean | null
          response?: Json | null
          scheduled_call_id?: string | null
          status?: string | null
          user_id?: string | null
          vapi_call_id?: string | null
        }
        Update: {
          call_summary?: string | null
          call_transcript?: string | null
          created_at?: string | null
          id?: string
          payload?: Json | null
          processed_by_ai?: boolean | null
          processed_for_summary?: boolean
          processed_keywords?: boolean | null
          response?: Json | null
          scheduled_call_id?: string | null
          status?: string | null
          user_id?: string | null
          vapi_call_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_logs_scheduled_call_id_fkey"
            columns: ["scheduled_call_id"]
            isOneToOne: false
            referencedRelation: "scheduled_calls"
            referencedColumns: ["id"]
          },
        ]
      }
      greetings: {
        Row: {
          assistant_id: string | null
          created_at: string | null
          greeting_text: string
          id: string
          template_id: string | null
        }
        Insert: {
          assistant_id?: string | null
          created_at?: string | null
          greeting_text: string
          id?: string
          template_id?: string | null
        }
        Update: {
          assistant_id?: string | null
          created_at?: string | null
          greeting_text?: string
          id?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "greetings_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "assistants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "greetings_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      mode_preferences: {
        Row: {
          assistant_id: string | null
          created_at: string
          custom_instructions: string | null
          id: string
          mode_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assistant_id?: string | null
          created_at?: string
          custom_instructions?: string | null
          id?: string
          mode_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assistant_id?: string | null
          created_at?: string
          custom_instructions?: string | null
          id?: string
          mode_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mode_preferences_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "assistants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mode_preferences_mode_id_fkey"
            columns: ["mode_id"]
            isOneToOne: false
            referencedRelation: "modes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mode_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      modes: {
        Row: {
          created_at: string
          description: string | null
          guidelines: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          guidelines?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          guidelines?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      personalities: {
        Row: {
          behavior: string
          behaviour_summary: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          behavior: string
          behaviour_summary?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          behavior?: string
          behaviour_summary?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_mode_id: string | null
          focus_areas: Json | null
          full_name: string | null
          id: string
          is_onboarding: boolean
          last_demo_call_at: string | null
          last_summary_update: string | null
          phone: string | null
          phone_verification_code: string | null
          phone_verification_expires_at: string | null
          phone_verified: boolean | null
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_plan_id: string | null
          subscription_status: string | null
          timezone: string
          trial_start_date: string | null
          updated_at: string
          user_summary: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_mode_id?: string | null
          focus_areas?: Json | null
          full_name?: string | null
          id: string
          is_onboarding?: boolean
          last_demo_call_at?: string | null
          last_summary_update?: string | null
          phone?: string | null
          phone_verification_code?: string | null
          phone_verification_expires_at?: string | null
          phone_verified?: boolean | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_plan_id?: string | null
          subscription_status?: string | null
          timezone?: string
          trial_start_date?: string | null
          updated_at?: string
          user_summary?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_mode_id?: string | null
          focus_areas?: Json | null
          full_name?: string | null
          id?: string
          is_onboarding?: boolean
          last_demo_call_at?: string | null
          last_summary_update?: string | null
          phone?: string | null
          phone_verification_code?: string | null
          phone_verification_expires_at?: string | null
          phone_verified?: boolean | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_plan_id?: string | null
          subscription_status?: string | null
          timezone?: string
          trial_start_date?: string | null
          updated_at?: string
          user_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_mode_id_fkey"
            columns: ["current_mode_id"]
            isOneToOne: false
            referencedRelation: "modes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_calls: {
        Row: {
          created_at: string | null
          execution_timestamp: string | null
          goal_id: string | null
          id: string
          mode_id: string | null
          specific_date: string | null
          template_id: string | null
          time: string
          user_id: string
          weekday: number | null
        }
        Insert: {
          created_at?: string | null
          execution_timestamp?: string | null
          goal_id?: string | null
          id?: string
          mode_id?: string | null
          specific_date?: string | null
          template_id?: string | null
          time: string
          user_id: string
          weekday?: number | null
        }
        Update: {
          created_at?: string | null
          execution_timestamp?: string | null
          goal_id?: string | null
          id?: string
          mode_id?: string | null
          specific_date?: string | null
          template_id?: string | null
          time?: string
          user_id?: string
          weekday?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_template"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_calls_mode_id_fkey"
            columns: ["mode_id"]
            isOneToOne: false
            referencedRelation: "modes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_calls_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json | null
          id: string
          interval: string
          is_active: boolean
          name: string
          price: number
          stripe_price_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          interval: string
          is_active?: boolean
          name: string
          price: number
          stripe_price_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          interval?: string
          is_active?: boolean
          name?: string
          price?: number
          stripe_price_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          message: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_prompts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          prompt_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          prompt_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          prompt_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          created_at: string
          description: string
          id: string
          instructions: string | null
          mode_id: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          instructions?: string | null
          mode_id?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          instructions?: string | null
          mode_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_mode_id_fkey"
            columns: ["mode_id"]
            isOneToOne: false
            referencedRelation: "modes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_date: string
          created_at: string
          description: string
          id: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_date: string
          created_at?: string
          description: string
          id?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_date?: string
          created_at?: string
          description?: string
          id?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_important: boolean | null
          summary_processed: boolean | null
          type: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_important?: boolean | null
          summary_processed?: boolean | null
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_important?: boolean | null
          summary_processed?: boolean | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_scheduled_calls_to_execute: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          time: string
          weekday: number
          specific_date: string
          template_id: string
          mode_id: string
          timezone: string
          execution_timestamp: string
          profile_id: string
          avatar_url: string
          created_at: string
          full_name: string
          phone: string
          phone_verification_code: string
          phone_verification_expires_at: string
          phone_verified: boolean
          updated_at: string
        }[]
      }
      initialize_mode_preferences: {
        Args: { user_id_param: string }
        Returns: undefined
      }
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
