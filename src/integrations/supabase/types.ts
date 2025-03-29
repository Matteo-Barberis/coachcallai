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
          name: string
          personality_id: string | null
          vapi_assistant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          personality_id?: string | null
          vapi_assistant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          personality_id?: string | null
          vapi_assistant_id?: string
        }
        Relationships: [
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
          processed_keywords: boolean | null
          response: Json | null
          scheduled_call_id: string | null
          status: string | null
          vapi_call_id: string | null
        }
        Insert: {
          call_summary?: string | null
          call_transcript?: string | null
          created_at?: string | null
          id?: string
          payload?: Json | null
          processed_by_ai?: boolean | null
          processed_keywords?: boolean | null
          response?: Json | null
          scheduled_call_id?: string | null
          status?: string | null
          vapi_call_id?: string | null
        }
        Update: {
          call_summary?: string | null
          call_transcript?: string | null
          created_at?: string | null
          id?: string
          payload?: Json | null
          processed_by_ai?: boolean | null
          processed_keywords?: boolean | null
          response?: Json | null
          scheduled_call_id?: string | null
          status?: string | null
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
      personalities: {
        Row: {
          behavior: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          behavior: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          behavior?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          assistant_id: string | null
          avatar_url: string | null
          created_at: string
          focus_areas: Json | null
          full_name: string | null
          id: string
          is_onboarding: boolean
          last_demo_call_at: string | null
          objectives: string | null
          phone: string | null
          phone_verification_code: string | null
          phone_verification_expires_at: string | null
          phone_verified: boolean | null
          stripe_customer_id: string | null
          subscription_status: string | null
          timezone: string
          updated_at: string
        }
        Insert: {
          assistant_id?: string | null
          avatar_url?: string | null
          created_at?: string
          focus_areas?: Json | null
          full_name?: string | null
          id: string
          is_onboarding?: boolean
          last_demo_call_at?: string | null
          objectives?: string | null
          phone?: string | null
          phone_verification_code?: string | null
          phone_verification_expires_at?: string | null
          phone_verified?: boolean | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          timezone?: string
          updated_at?: string
        }
        Update: {
          assistant_id?: string | null
          avatar_url?: string | null
          created_at?: string
          focus_areas?: Json | null
          full_name?: string | null
          id?: string
          is_onboarding?: boolean
          last_demo_call_at?: string | null
          objectives?: string | null
          phone?: string | null
          phone_verification_code?: string | null
          phone_verification_expires_at?: string | null
          phone_verified?: boolean | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "assistants"
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
            foreignKeyName: "scheduled_calls_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
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
          type: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
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
          timezone: string
          execution_timestamp: string
          profile_id: string
          avatar_url: string
          created_at: string
          full_name: string
          objectives: string
          phone: string
          phone_verification_code: string
          phone_verification_expires_at: string
          phone_verified: boolean
          updated_at: string
        }[]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
