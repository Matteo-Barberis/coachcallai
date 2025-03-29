
-- Enable the necessary extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any existing cron job with the same name (in case we need to update it)
SELECT cron.unschedule('hourly-scheduled-checkins');

-- Schedule the hourly cron job
SELECT cron.schedule(
  'hourly-scheduled-checkins',
  '0 * * * *',  -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
      url:='https://pwiqicyfwvwwgqbxhmvv.supabase.co/functions/v1/scheduled-checkins',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aXFpY3lmd3Z3d2dxYnhobXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODg2NzUsImV4cCI6MjA1NzQ2NDY3NX0.y862wSmbJoMnApF0lPwr4x828w4hzwLc-QfHem26lok"}'::jsonb,
      body:='{"trigger": "cron"}'::jsonb
    ) as request_id;
  $$
);

-- Verify the scheduled job
SELECT * FROM cron.job WHERE jobname = 'hourly-scheduled-checkins';
