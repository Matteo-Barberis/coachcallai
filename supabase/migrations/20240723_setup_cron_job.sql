
-- Enable the required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the function to run every 15 minutes
SELECT cron.schedule(
  'execute-scheduled-calls-every-15-minutes',
  '*/15 * * * *', -- Run every 15 minutes
  $$
  SELECT
    net.http_post(
        url:='https://pwiqicyfwvwwgqbxhmvv.supabase.co/functions/v1/schedule-calls',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aXFpY3lmd3Z3d2dxYnhobXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODg2NzUsImV4cCI6MjA1NzQ2NDY3NX0.y862wSmbJoMnApF0lPwr4x828w4hzwLc-QfHem26lok"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);
