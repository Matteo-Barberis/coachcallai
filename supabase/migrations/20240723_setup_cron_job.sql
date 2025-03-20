
-- Enable the required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the function to run every 15 minutes
SELECT cron.schedule(
  'execute-scheduled-calls-every-15-minutes',
  '*/15 * * * *', -- Run every 15 minutes
  $$
  WITH timed_calls AS (
    -- For recurring weekday calls
    SELECT 
        sc.id,
        sc.user_id,
        sc.time,
        sc.weekday,
        sc.specific_date,
        sc.template_id,
        p.timezone,
        CASE 
            WHEN sc.weekday = EXTRACT(DOW FROM CURRENT_TIMESTAMP) THEN
                ((CURRENT_DATE + sc.time) AT TIME ZONE p.timezone)::timestamptz
            WHEN sc.weekday = EXTRACT(DOW FROM (CURRENT_TIMESTAMP - INTERVAL '1 day')) THEN
                ((CURRENT_DATE - INTERVAL '1 day' + sc.time) AT TIME ZONE p.timezone)::timestamptz
            ELSE
                ((CURRENT_DATE + INTERVAL '1 day' + sc.time) AT TIME ZONE p.timezone)::timestamptz
        END as execution_timestamp
    FROM scheduled_calls sc
    JOIN profiles p ON p.id = sc.user_id
    WHERE 
        weekday IN (
            EXTRACT(DOW FROM (CURRENT_TIMESTAMP - INTERVAL '1 day')),
            EXTRACT(DOW FROM CURRENT_TIMESTAMP),
            EXTRACT(DOW FROM (CURRENT_TIMESTAMP + INTERVAL '1 day'))
        )
        AND specific_date IS NULL

    UNION

    -- For specific date calls
    SELECT 
        sc.id,
        sc.user_id,
        sc.time,
        sc.weekday,
        sc.specific_date,
        sc.template_id,
        p.timezone,
        ((sc.specific_date + sc.time) AT TIME ZONE p.timezone)::timestamptz as execution_timestamp
    FROM scheduled_calls sc
    JOIN profiles p ON p.id = sc.user_id
    WHERE 
        specific_date IN (
            CURRENT_DATE - INTERVAL '1 day',
            CURRENT_DATE,
            CURRENT_DATE + INTERVAL '1 day'
        )
  )
  SELECT
    CASE WHEN COUNT(*) > 0 THEN
      net.http_post(
          url:='https://pwiqicyfwvwwgqbxhmvv.supabase.co/functions/v1/schedule-calls',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aXFpY3lmd3Z3d2dxYnhobXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODg2NzUsImV4cCI6MjA1NzQ2NDY3NX0.y862wSmbJoMnApF0lPwr4x828w4hzwLc-QfHem26lok"}'::jsonb,
          body:='{}'::jsonb
      )
    ELSE NULL END
  FROM timed_calls tc
  JOIN profiles p ON p.id = tc.user_id
  WHERE 
    execution_timestamp BETWEEN 
    CURRENT_TIMESTAMP - INTERVAL '10 minutes' 
    AND 
    CURRENT_TIMESTAMP + INTERVAL '10 minutes';
  $$
);
