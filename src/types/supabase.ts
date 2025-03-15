
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
