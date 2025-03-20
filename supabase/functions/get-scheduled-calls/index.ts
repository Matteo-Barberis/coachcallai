
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const query = `
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
          tc.*,
          p.*
      FROM timed_calls tc
      JOIN profiles p ON p.id = tc.user_id
      WHERE 
          execution_timestamp BETWEEN 
          CURRENT_TIMESTAMP - INTERVAL '10 minutes' 
          AND 
          CURRENT_TIMESTAMP + INTERVAL '10 minutes';
    `

    // Execute the raw SQL query
    const { data, error } = await supabaseClient.rpc('_', {
      sql: query,
    })

    if (error) {
      console.error('Error executing query:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Return the query results as JSON
    return new Response(
      JSON.stringify({ data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
