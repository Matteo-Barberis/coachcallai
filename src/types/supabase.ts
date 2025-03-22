
export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  objectives: string | null;
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
};
