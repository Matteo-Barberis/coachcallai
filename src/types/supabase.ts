export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  focus_areas: FocusArea[] | null;
  subscription_status?: string | null;
  subscription_plan_id?: string | null;
  subscription_end_date?: string | null;
  trial_start_date?: string | null;
  current_mode_id?: string | null;
};

export type FocusArea = {
  text: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
};

export type UserObjective = {
  id: string;
  user_id: string;
  objectives: string;
  created_at: string;
  updated_at: string;
};

export type CallLog = {
  id: string;
  scheduled_call_id: string;
  vapi_call_id: string | null;
  call_summary: string | null;
  call_transcript: string | null;
  status: string | null;
  created_at: string | null;
  payload: any | null;
  response: any | null;
  processed_by_ai: boolean;
  processed_keywords: boolean;
  scheduled_calls?: {
    template_id: string | null;
  };
  template?: {
    name: string;
    description: string;
  } | null;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  description: string;
  type: 'achievement' | 'breakthrough' | 'milestone';
  achievement_date: string;
  created_at: string;
  updated_at: string;
};
