
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// Immediate logging at the top level of the file
console.log(`[${new Date().toISOString()}] Edge function file loaded`);

// Define user summary update function schema
const userSummaryUpdateFunction = {
  name: "updateUserSummary",
  description: "Update user summary with meaningful personal information",
  parameters: {
    type: "object",
    properties: {
      updated_summary: {
        type: "string",
        description: "The complete updated summary if it needs to be updated, or empty string if no update needed"
      }
    },
    required: ["updated_summary"]
  }
};

// Function to interact with OpenAI's API with function calling
async function analyzeWithGPT(promptText: string, currentUserSummary: string, messageContent: string) {
  console.log(`[${new Date().toISOString()}] Starting OpenAI API call for user summary update...`);
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error(`[${new Date().toISOString()}] Error: OPENAI_API_KEY is not set`);
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }

  try {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Replace placeholders in the prompt
    const finalPrompt = promptText
      .replace(/\$\{currentUserSummary\}/g, currentUserSummary || 'No summary available')
      .replace(/\$\{messageContent\}/g, messageContent)
      .replace(/\$\{currentDate\}/g, currentDate);

    console.log(`[${new Date().toISOString()}] Prepared prompt with placeholders replaced`);
    
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
            role: 'user',
            content: finalPrompt
          }
        ],
        functions: [userSummaryUpdateFunction],
        function_call: { name: "updateUserSummary" },
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    console.log(`[${new Date().toISOString()}] OpenAI API response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`[${new Date().toISOString()}] OpenAI API Error:`, errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[${new Date().toISOString()}] OpenAI API Response:`, JSON.stringify(data));
    
    // Extract the updated summary from function call arguments
    if (data.choices && 
        data.choices[0].message && 
        data.choices[0].message.function_call) {
      try {
        const functionCallArgs = JSON.parse(data.choices[0].message.function_call.arguments);
        console.log(`[${new Date().toISOString()}] Successfully parsed function call arguments`);
        return functionCallArgs.updated_summary || '';
      } catch (parseError) {
        console.error(`[${new Date().toISOString()}] Error parsing function call arguments:`, parseError);
        throw new Error('Failed to parse summary from OpenAI response');
      }
    } else {
      console.error(`[${new Date().toISOString()}] Unexpected response format from OpenAI API`);
      throw new Error('Unexpected response format from OpenAI API');
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error calling OpenAI API:`, error);
    throw error;
  }
}

// Create a new handler function separate from Deno.serve
export async function main() {
  console.log(`[${new Date().toISOString()}] Starting process-call-summaries function...`);
  console.log(`[${new Date().toISOString()}] Memory usage at start: ${JSON.stringify(Deno.memoryUsage())}`);
  
  try {
    // Log environment check
    console.log(`[${new Date().toISOString()}] Checking for service role key...`);
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
      console.error(`[${new Date().toISOString()}] Error: SUPABASE_SERVICE_ROLE_KEY is not set`);
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
    }
    console.log(`[${new Date().toISOString()}] Service role key found`);
    
    console.log(`[${new Date().toISOString()}] Creating Supabase client...`);
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    console.log(`[${new Date().toISOString()}] Using Supabase URL: ${supabaseUrl}`);
    
    const supabaseClient = createClient(
      supabaseUrl ?? '',
      serviceRoleKey
    );
    console.log(`[${new Date().toISOString()}] Supabase client created successfully`);

    // Fetch the user_summary_update prompt from database
    console.log(`[${new Date().toISOString()}] Fetching user_summary_update prompt from database...`);
    const { data: promptData, error: promptError } = await supabaseClient
      .from('system_prompts')
      .select('prompt_text')
      .eq('name', 'user_summary_update')
      .maybeSingle();

    if (promptError) {
      console.error(`[${new Date().toISOString()}] Error fetching user_summary_update prompt:`, promptError);
      throw promptError;
    }

    if (!promptData || !promptData.prompt_text) {
      console.error(`[${new Date().toISOString()}] user_summary_update prompt not found in database`);
      throw new Error('user_summary_update prompt not found in database');
    }

    console.log(`[${new Date().toISOString()}] Successfully fetched user_summary_update prompt`);

    // Step 1: Get all unprocessed call log IDs (ordered oldest to newest)
    console.log(`[${new Date().toISOString()}] Fetching all unprocessed call log IDs...`);
    const { data: unprocessedLogs, error: fetchError } = await supabaseClient
      .from('call_logs')
      .select('id')
      .eq('processed_for_summary', false)
      .not('call_summary', 'is', null)
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error(`[${new Date().toISOString()}] Error fetching unprocessed call logs:`, fetchError);
      throw fetchError;
    }

    if (!unprocessedLogs || unprocessedLogs.length === 0) {
      console.log(`[${new Date().toISOString()}] No unprocessed call logs found`);
      return { message: 'No call logs to process', results: [] };
    }

    console.log(`[${new Date().toISOString()}] Found ${unprocessedLogs.length} unprocessed call logs to process`);

    const results = [];
    let processedCount = 0;

    // Step 2: Loop through each call log ID
    for (let i = 0; i < unprocessedLogs.length; i++) {
      const logId = unprocessedLogs[i].id;
      console.log(`[${new Date().toISOString()}] Processing call log ${i + 1}/${unprocessedLogs.length}, ID: ${logId}`);

      try {
        // Step 3: Check if this log is still unprocessed (prevents race conditions)
        const { data: currentLog, error: checkError } = await supabaseClient
          .from('call_logs')
          .select('id, call_summary, scheduled_call_id, processed_for_summary')
          .eq('id', logId)
          .eq('processed_for_summary', false)
          .not('call_summary', 'is', null)
          .maybeSingle();

        if (checkError) {
          console.error(`[${new Date().toISOString()}] Error checking call log ${logId}:`, checkError);
          continue;
        }

        if (!currentLog) {
          console.log(`[${new Date().toISOString()}] Call log ${logId} already processed or no longer available, skipping`);
          continue;
        }

        // Get user_id from scheduled_call
        console.log(`[${new Date().toISOString()}] Fetching scheduled call data for call ID: ${currentLog.scheduled_call_id}`);
        
        const { data: scheduledCall, error: scheduledCallError } = await supabaseClient
          .from('scheduled_calls')
          .select('user_id')
          .eq('id', currentLog.scheduled_call_id)
          .single();

        if (scheduledCallError) {
          console.error(`[${new Date().toISOString()}] Error fetching scheduled call for log ${logId}:`, scheduledCallError);
          
          // Mark as processed to avoid infinite retry
          await supabaseClient
            .from('call_logs')
            .update({ processed_for_summary: true })
            .eq('id', logId);
          
          continue;
        }

        const userId = scheduledCall?.user_id;
        if (!userId) {
          console.error(`[${new Date().toISOString()}] No user_id found for scheduled call ${currentLog.scheduled_call_id}`);
          
          // Mark as processed to avoid infinite retry
          await supabaseClient
            .from('call_logs')
            .update({ processed_for_summary: true })
            .eq('id', logId);
          
          continue;
        }
        console.log(`[${new Date().toISOString()}] Found user_id: ${userId} for call log ${logId}`);

        // Get user's current summary
        const { data: userProfile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('user_summary')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error(`[${new Date().toISOString()}] Error fetching user profile for ${userId}:`, profileError);
          
          // Mark as processed to avoid infinite retry
          await supabaseClient
            .from('call_logs')
            .update({ processed_for_summary: true })
            .eq('id', logId);
          
          continue;
        }

        // Analyze call summary with ChatGPT
        console.log(`[${new Date().toISOString()}] Sending call summary to GPT for analysis...`);
        
        const updatedSummary = await analyzeWithGPT(
          promptData.prompt_text,
          userProfile?.user_summary || '',
          currentLog.call_summary || ''
        );

        console.log(`[${new Date().toISOString()}] Received summary update from GPT (length: ${updatedSummary.length})`);

        // Update user summary if we got a non-empty response
        if (updatedSummary && updatedSummary.trim().length > 0) {
          console.log(`[${new Date().toISOString()}] Updating user summary for user ${userId}...`);
          
          const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({ 
              user_summary: updatedSummary.trim(),
              last_summary_update: new Date().toISOString()
            })
            .eq('id', userId);

          if (updateError) {
            console.error(`[${new Date().toISOString()}] Error updating user summary for user ${userId}:`, updateError);
          } else {
            console.log(`[${new Date().toISOString()}] Successfully updated user summary for user ${userId}`);
            results.push({
              user_id: userId,
              call_log_id: logId,
              summary_updated: true
            });
          }
        } else {
          console.log(`[${new Date().toISOString()}] No summary update needed for call log ${logId}`);
          results.push({
            user_id: userId,
            call_log_id: logId,
            summary_updated: false
          });
        }

        // Mark log as processed
        console.log(`[${new Date().toISOString()}] Marking call log ${logId} as processed for summary...`);
        
        const { error: updateLogError } = await supabaseClient
          .from('call_logs')
          .update({ processed_for_summary: true })
          .eq('id', logId);

        if (updateLogError) {
          console.error(`[${new Date().toISOString()}] Error marking call log ${logId} as processed for summary:`, updateLogError);
        } else {
          console.log(`[${new Date().toISOString()}] Successfully marked call log ${logId} as processed for summary`);
          processedCount++;
        }
        
        console.log(`[${new Date().toISOString()}] Completed processing for call log ${logId}`);
        console.log(`[${new Date().toISOString()}] Memory usage after processing log: ${JSON.stringify(Deno.memoryUsage())}`);
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Error processing call log ${logId}:`, error);
        console.error(`[${new Date().toISOString()}] Error stack:`, error.stack);
      }
    }

    console.log(`[${new Date().toISOString()}] Process-call-summaries function completed successfully`);
    console.log(`[${new Date().toISOString()}] Final memory usage: ${JSON.stringify(Deno.memoryUsage())}`);
    
    return { 
      message: `Processed ${processedCount} call logs for summary`, 
      results: results 
    };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Fatal error in process-call-summaries function:`, error);
    console.error(`[${new Date().toISOString()}] Error stack:`, error.stack);
    return { error: error.message };
  }
}

// Add a Deno.serve handler at the bottom
Deno.serve(async (req) => {
  console.log(`[${new Date().toISOString()}] Request received: ${req.method} ${req.url}`);
  
  try {
    const result = await main();
    console.log(`[${new Date().toISOString()}] Request completed successfully`);
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in request handler:`, error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
