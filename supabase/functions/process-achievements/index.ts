
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// Function to interact with OpenAI's API with proper JSON schema
async function analyzeWithGPT(transcript: string, summary: string) {
  console.log(`[${new Date().toISOString()}] Starting OpenAI API call...`);
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error(`[${new Date().toISOString()}] Error: OPENAI_API_KEY is not set`);
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }

  try {
    console.log(`[${new Date().toISOString()}] Preparing OpenAI API request with transcript length: ${transcript?.length || 0}, summary length: ${summary?.length || 0}`);
    
    console.log(`[${new Date().toISOString()}] Sending request to OpenAI API...`);
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
            Exclude any achievements that are simply being repeated, acknowledged again, or mentioned as past events.`
          },
          {
            role: 'user',
            content: `Analyze the following coaching call data and identify any new achievements the user reports completing recently.
            
            Call Summary: ${summary || 'No summary available'}
            
            Call Transcript: ${transcript || 'No transcript available'}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { 
          type: "json_object",
          schema: {
            type: "object",
            properties: {
              achievements: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["achievement", "milestone", "breakthrough"],
                      description: "The type of achievement detected"
                    },
                    description: {
                      type: "string",
                      description: "Short description of a small daily achievement, significant milestone, or major breakthrough"
                    }
                  },
                  required: ["type", "description"]
                }
              }
            },
            required: ["achievements"]
          }
        }
      }),
    });

    console.log(`[${new Date().toISOString()}] OpenAI API response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`[${new Date().toISOString()}] OpenAI API Error:`, errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    console.log(`[${new Date().toISOString()}] Processing OpenAI API response...`);
    const data = await response.json();
    console.log(`[${new Date().toISOString()}] OpenAI API Response:`, JSON.stringify(data));
    
    // Extract the achievements array
    const content = data.choices[0].message.content;
    console.log(`[${new Date().toISOString()}] Parsing content from OpenAI response...`);
    const parsedContent = JSON.parse(content);
    console.log(`[${new Date().toISOString()}] Successfully parsed OpenAI response`);
    return parsedContent.achievements || [];
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error calling OpenAI API:`, error);
    throw error;
  }
}

// Main function to process achievements
export async function main() {
  console.log(`[${new Date().toISOString()}] Starting process-achievements function...`);
  console.log(`[${new Date().toISOString()}] Memory usage: ${JSON.stringify(Deno.memoryUsage())}`);
  
  try {
    console.log(`[${new Date().toISOString()}] Checking for service role key...`);
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
      console.error(`[${new Date().toISOString()}] Error: SUPABASE_SERVICE_ROLE_KEY is not set`);
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
    }
    
    console.log(`[${new Date().toISOString()}] Creating Supabase client...`);
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    );

    console.log(`[${new Date().toISOString()}] Fetching unprocessed call logs...`);
    
    // Get all unprocessed call logs
    const { data: unprocessedLogs, error: fetchError } = await supabaseClient
      .from('call_logs')
      .select('id, call_summary, call_transcript, scheduled_call_id')
      .eq('processed_by_ai', false)
      .is('call_summary', 'not.null')  // Only process logs with summaries
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error(`[${new Date().toISOString()}] Error fetching unprocessed call logs:`, fetchError);
      throw fetchError;
    }

    console.log(`[${new Date().toISOString()}] Found ${unprocessedLogs?.length || 0} unprocessed call logs`);
    console.log(`[${new Date().toISOString()}] Memory usage after fetching logs: ${JSON.stringify(Deno.memoryUsage())}`);
    
    if (!unprocessedLogs || unprocessedLogs.length === 0) {
      console.log(`[${new Date().toISOString()}] No unprocessed call logs found, exiting function`);
      return { message: 'No unprocessed call logs found' };
    }

    const results = [];

    // Process each log
    for (const [index, log] of unprocessedLogs.entries()) {
      try {
        console.log(`[${new Date().toISOString()}] Processing call log ${index + 1}/${unprocessedLogs.length}, ID: ${log.id}`);
        console.log(`[${new Date().toISOString()}] Summary length: ${log.call_summary?.length || 0}, Transcript length: ${log.call_transcript?.length || 0}`);

        // Get user_id from scheduled_call
        console.log(`[${new Date().toISOString()}] Fetching scheduled call data for call ID: ${log.scheduled_call_id}`);
        const { data: scheduledCall, error: scheduledCallError } = await supabaseClient
          .from('scheduled_calls')
          .select('user_id')
          .eq('id', log.scheduled_call_id)
          .single();

        if (scheduledCallError) {
          console.error(`[${new Date().toISOString()}] Error fetching scheduled call for log ${log.id}:`, scheduledCallError);
          continue;
        }

        const userId = scheduledCall.user_id;
        if (!userId) {
          console.error(`[${new Date().toISOString()}] No user_id found for scheduled call ${log.scheduled_call_id}`);
          continue;
        }
        console.log(`[${new Date().toISOString()}] Found user_id: ${userId} for call log ${log.id}`);

        // Analyze transcript with ChatGPT
        console.log(`[${new Date().toISOString()}] Sending call log ${log.id} to GPT for analysis...`);
        const achievements = await analyzeWithGPT(log.call_transcript || '', log.call_summary || '');
        console.log(`[${new Date().toISOString()}] Received ${achievements.length} achievements from GPT analysis for log ${log.id}`);
        console.log(`[${new Date().toISOString()}] Memory usage after GPT analysis: ${JSON.stringify(Deno.memoryUsage())}`);

        // Store achievements
        if (achievements && achievements.length > 0) {
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
          
          for (const [achievementIndex, achievement] of achievements.entries()) {
            console.log(`[${new Date().toISOString()}] Processing achievement ${achievementIndex + 1}/${achievements.length} for log ${log.id}`);
            console.log(`[${new Date().toISOString()}] Achievement data: ${JSON.stringify(achievement)}`);
            
            // Insert achievement
            console.log(`[${new Date().toISOString()}] Inserting achievement into database...`);
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
              console.error(`[${new Date().toISOString()}] Error inserting achievement:`, insertError);
            } else {
              console.log(`[${new Date().toISOString()}] Successfully inserted achievement: ${JSON.stringify(insertedAchievement)}`);
              results.push(insertedAchievement);
            }
          }
        } else {
          console.log(`[${new Date().toISOString()}] No achievements found for call log ${log.id}`);
        }

        // Mark log as processed
        console.log(`[${new Date().toISOString()}] Marking call log ${log.id} as processed...`);
        const { error: updateError } = await supabaseClient
          .from('call_logs')
          .update({ processed_by_ai: true })
          .eq('id', log.id);

        if (updateError) {
          console.error(`[${new Date().toISOString()}] Error marking call log ${log.id} as processed:`, updateError);
        } else {
          console.log(`[${new Date().toISOString()}] Successfully marked call log ${log.id} as processed`);
        }
        
        console.log(`[${new Date().toISOString()}] Completed processing for call log ${log.id}`);
        console.log(`[${new Date().toISOString()}] Memory usage after processing log: ${JSON.stringify(Deno.memoryUsage())}`);
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Error processing call log ${log.id}:`, error);
      }
    }

    console.log(`[${new Date().toISOString()}] Process-achievements function completed successfully`);
    console.log(`[${new Date().toISOString()}] Final memory usage: ${JSON.stringify(Deno.memoryUsage())}`);
    
    return { 
      message: `Processed ${unprocessedLogs.length} call logs`, 
      achievements: results 
    };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Fatal error in process-achievements function:`, error);
    return { error: error.message };
  }
}
