
-- Function to get calls that need to be executed in the current time window
CREATE OR REPLACE FUNCTION public.get_scheduled_calls_to_execute()
RETURNS TABLE (
    id uuid,
    user_id uuid,
    time time,
    weekday integer,
    specific_date date,
    template_id uuid,
    timezone text,
    execution_timestamp timestamptz,
    full_name text,
    objectives text,
    phone text
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
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
    tc.id,
    tc.user_id,
    tc.time,
    tc.weekday,
    tc.specific_date,
    tc.template_id,
    tc.timezone,
    tc.execution_timestamp,
    p.full_name,
    p.objectives,
    p.phone
FROM timed_calls tc
JOIN profiles p ON p.id = tc.user_id
WHERE 
    execution_timestamp BETWEEN 
    CURRENT_TIMESTAMP - INTERVAL '10 minutes' 
    AND 
    CURRENT_TIMESTAMP + INTERVAL '10 minutes'
    -- To avoid duplicate calls, only include calls that haven't been executed yet
    AND NOT EXISTS (
        SELECT 1 FROM scheduled_calls sc 
        WHERE sc.id = tc.id 
        AND sc.execution_timestamp IS NOT NULL 
        AND sc.execution_timestamp > CURRENT_TIMESTAMP - INTERVAL '12 hours'
    );
$$;
