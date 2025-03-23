
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to interact with OpenAI's API
async function analyzeWithGPT(transcript: string, summary: string): Promise<any[]> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an achievement analyzer for a coaching application. 
            Your job is to analyze coaching call transcripts and identify NEW achievements, breakthroughs, or milestones 
            that the user mentions for the FIRST time in THIS conversation. 
            Only include achievements that are being reported as recently completed.
            Exclude any achievements that are simply being repeated, acknowledged again, or mentioned as past events.
            Respond ONLY with a JSON array with no additional text.`
          },
          {
            role: 'user',
            content: `Analyze the following coaching call data and identify any new achievements the user reports completing recently.
            
            Call Summary: ${summary || 'No summary available'}
            
            Call Transcript: ${transcript || 'No transcript available'}
            
            Return ONLY an array of objects formatted like this:
            [
              {"type": "achievement", "description": "Short description of a small achievement"},
              {"type": "milestone", "description": "Short description of a significant milestone"},
              {"type": "breakthrough", "description": "Short description of a major breakthrough"}
            ]
            
            If no new achievements are mentioned, return an empty array [].`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI API Response:', JSON.stringify(data));
    
    // Extract and parse the content
    const content = data.choices[0].message.content;
    try {
      const parsedContent = JSON.parse(content);
      return parsedContent.achievements || [];
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw content:', content);
      return [];
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if request method is POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    );

    console.log('Fetching unprocessed call logs...');
    
    // Get unprocessed call logs
    const { data: unprocessedLogs, error: fetchError } = await supabaseClient
      .from('call_logs')
      .select('id, call_summary, call_transcript, scheduled_call_id')
      .eq('processed_by_ai', false)
      .is('call_summary', 'not.null')  // Only process logs with summaries
      .order('created_at', { ascending: true })
      .limit(10);  // Process in batches

    if (fetchError) {
      console.error('Error fetching unprocessed call logs:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${unprocessedLogs?.length || 0} unprocessed call logs`);
    
    if (!unprocessedLogs || unprocessedLogs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No unprocessed call logs found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    // Process each log
    for (const log of unprocessedLogs) {
      try {
        console.log(`Processing call log ID: ${log.id}`);

        // Get user_id from scheduled_call
        const { data: scheduledCall, error: scheduledCallError } = await supabaseClient
          .from('scheduled_calls')
          .select('user_id')
          .eq('id', log.scheduled_call_id)
          .single();

        if (scheduledCallError) {
          console.error(`Error fetching scheduled call for log ${log.id}:`, scheduledCallError);
          continue;
        }

        const userId = scheduledCall.user_id;
        if (!userId) {
          console.error(`No user_id found for scheduled call ${log.scheduled_call_id}`);
          continue;
        }

        // Analyze transcript with ChatGPT
        console.log(`Sending call log ${log.id} to GPT for analysis...`);
        const achievements = await analyzeWithGPT(log.call_transcript || '', log.call_summary || '');
        console.log(`Received ${achievements.length} achievements from GPT analysis`);

        // Store achievements
        if (achievements && achievements.length > 0) {
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
          
          for (const achievement of achievements) {
            if (!achievement.type || !achievement.description) {
              console.warn('Invalid achievement format:', achievement);
              continue;
            }
            
            // Check if the achievement type is valid
            if (!['achievement', 'breakthrough', 'milestone'].includes(achievement.type)) {
              console.warn(`Invalid achievement type: ${achievement.type}`);
              continue;
            }

            // Insert achievement
            const { data: insertedAchievement, error: insertError } = await supabaseClient
              .from('user_achievements')
              .insert({
                user_id: userId,
                type: achievement.type,
                description: achievement.description,
                achievement_date: today
              })
              .select();

            if (insertError) {
              console.error('Error inserting achievement:', insertError);
            } else {
              console.log(`Inserted achievement: ${JSON.stringify(insertedAchievement)}`);
              results.push(insertedAchievement);
            }
          }
        }

        // Mark log as processed
        const { error: updateError } = await supabaseClient
          .from('call_logs')
          .update({ processed_by_ai: true })
          .eq('id', log.id);

        if (updateError) {
          console.error(`Error marking call log ${log.id} as processed:`, updateError);
        } else {
          console.log(`Marked call log ${log.id} as processed`);
        }
      } catch (error) {
        console.error(`Error processing call log ${log.id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Processed ${unprocessedLogs.length} call logs`, 
        achievements: results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in process-achievements function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
