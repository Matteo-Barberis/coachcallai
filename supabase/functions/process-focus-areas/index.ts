
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// Immediate logging at the top level of the file
console.log(`[${new Date().toISOString()}] Edge function file loaded`);

// Define focus areas analysis function schema
const focusAreasAnalysisFunction = {
  name: "analyze_focus_areas",
  description: "Analyze coaching call transcripts to identify key focus areas and their importance",
  parameters: {
    type: "object",
    properties: {
      keywords: {
        type: "array",
        items: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "The keyword or focus area identified"
            },
            value: {
              type: "integer",
              description: "A value from 1-10 indicating the importance or frequency of this focus area"
            },
            trend: {
              type: "string",
              enum: ["up", "down", "stable"],
              description: "The trend of this focus area compared to previous calls"
            }
          },
          required: ["text", "value"]
        }
      }
    },
    required: ["keywords"]
  }
};

// Function to interact with OpenAI's API with function calling
async function analyzeWithGPT(transcript: string, summary: string, existingKeywords: any[]) {
  console.log(`[${new Date().toISOString()}] Starting OpenAI API call for focus areas...`);
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error(`[${new Date().toISOString()}] Error: OPENAI_API_KEY is not set`);
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }

  try {
    console.log(`[${new Date().toISOString()}] Preparing OpenAI API request with transcript length: ${transcript?.length || 0}, summary length: ${summary?.length || 0}`);
    console.log(`[${new Date().toISOString()}] Existing keywords: ${JSON.stringify(existingKeywords)}`);
    
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
            content: `You are a focus area analyzer for a coaching application. 
            Your job is to analyze coaching call transcripts and identify key focus areas, topics, and themes
            that are important to the user.
            
            Provide keywords that represent the key areas of focus in the coaching relationship.
            For each keyword:
            1. Assign a value (1-10) indicating its importance based on frequency and emphasis in the conversation
            2. If previous keywords are provided, indicate a trend (up, down, stable) compared to before
            
            Examples of good focus area keywords:
            - "Meditation" (specific practice)
            - "Work-life balance" (broad goal)
            - "Morning routine" (specific habit)
            - "Anxiety management" (specific challenge)
            - "Goal setting" (process-oriented)
            
            Keep keywords concise (1-3 words) and focus on the most meaningful topics.`
          },
          {
            role: 'user',
            content: `Analyze the following coaching call data and identify key focus areas.
            
            Previous Focus Areas: ${JSON.stringify(existingKeywords || [])}
            
            Call Summary: ${summary || 'No summary available'}
            
            Call Transcript: ${transcript || 'No transcript available'}`
          }
        ],
        functions: [focusAreasAnalysisFunction],
        function_call: { name: "analyze_focus_areas" },
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

    console.log(`[${new Date().toISOString()}] Processing OpenAI API response...`);
    const data = await response.json();
    console.log(`[${new Date().toISOString()}] OpenAI API Response:`, JSON.stringify(data));
    
    // Extract the keywords array from function call arguments
    if (data.choices && 
        data.choices[0].message && 
        data.choices[0].message.function_call) {
      try {
        const functionCallArgs = JSON.parse(data.choices[0].message.function_call.arguments);
        console.log(`[${new Date().toISOString()}] Successfully parsed function call arguments`);
        return functionCallArgs.keywords || [];
      } catch (parseError) {
        console.error(`[${new Date().toISOString()}] Error parsing function call arguments:`, parseError);
        throw new Error('Failed to parse keywords from OpenAI response');
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
  console.log(`[${new Date().toISOString()}] Starting process-focus-areas function...`);
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

    console.log(`[${new Date().toISOString()}] Fetching unprocessed call logs for keywords...`);
    
    // Get all unprocessed call logs for keywords
    const { data: unprocessedLogs, error: fetchError } = await supabaseClient
      .from('call_logs')
      .select('id, call_summary, call_transcript, scheduled_call_id')
      .eq('processed_keywords', false)
      .not('call_summary', 'is', null);

    if (fetchError) {
      console.error(`[${new Date().toISOString()}] Error fetching unprocessed call logs:`, fetchError);
      throw fetchError;
    }

    console.log(`[${new Date().toISOString()}] Found ${unprocessedLogs?.length || 0} unprocessed call logs for keywords`);
    
    console.log(`[${new Date().toISOString()}] Memory usage after fetching logs: ${JSON.stringify(Deno.memoryUsage())}`);
    
    if (!unprocessedLogs || unprocessedLogs.length === 0) {
      console.log(`[${new Date().toISOString()}] No unprocessed call logs found for keywords, exiting function`);
      return { message: 'No unprocessed call logs found for keywords' };
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
          console.error(`[${new Date().toISOString()}] Error details:`, JSON.stringify(scheduledCallError));
          continue;
        }

        const userId = scheduledCall?.user_id;
        if (!userId) {
          console.error(`[${new Date().toISOString()}] No user_id found for scheduled call ${log.scheduled_call_id}`);
          continue;
        }
        console.log(`[${new Date().toISOString()}] Found user_id: ${userId} for call log ${log.id}`);

        // Get existing focus areas for the user
        const { data: userProfile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('focus_areas')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error(`[${new Date().toISOString()}] Error fetching user profile for ${userId}:`, profileError);
          continue;
        }

        const existingFocusAreas = userProfile?.focus_areas || [];
        console.log(`[${new Date().toISOString()}] Existing focus areas for user ${userId}:`, JSON.stringify(existingFocusAreas));

        // Analyze transcript with ChatGPT
        console.log(`[${new Date().toISOString()}] Sending call log ${log.id} to GPT for focus area analysis...`);
        
        // Will send full data to OpenAI API
        const focusAreas = await analyzeWithGPT(
          log.call_transcript || '', 
          log.call_summary || '', 
          existingFocusAreas
        );
        
        console.log(`[${new Date().toISOString()}] Received ${focusAreas?.length || 0} focus areas from GPT analysis for log ${log.id}`);
        if (focusAreas?.length) {
          console.log(`[${new Date().toISOString()}] First focus area: ${JSON.stringify(focusAreas[0])}`);
        }

        // Update user's focus areas in profile
        if (focusAreas && focusAreas.length > 0) {
          console.log(`[${new Date().toISOString()}] Updating focus areas for user ${userId}...`);
          
          const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({ focus_areas: focusAreas })
            .eq('id', userId);

          if (updateError) {
            console.error(`[${new Date().toISOString()}] Error updating focus areas for user ${userId}:`, updateError);
            console.error(`[${new Date().toISOString()}] Error details:`, JSON.stringify(updateError));
          } else {
            console.log(`[${new Date().toISOString()}] Successfully updated focus areas for user ${userId}`);
            results.push({
              user_id: userId,
              keywords: focusAreas
            });
          }
        } else {
          console.log(`[${new Date().toISOString()}] No focus areas found for call log ${log.id}`);
        }

        // Mark log as processed for keywords
        console.log(`[${new Date().toISOString()}] Marking call log ${log.id} as processed for keywords...`);
        
        const { error: updateLogError } = await supabaseClient
          .from('call_logs')
          .update({ processed_keywords: true })
          .eq('id', log.id);

        if (updateLogError) {
          console.error(`[${new Date().toISOString()}] Error marking call log ${log.id} as processed for keywords:`, updateLogError);
        } else {
          console.log(`[${new Date().toISOString()}] Successfully marked call log ${log.id} as processed for keywords`);
        }
        
        console.log(`[${new Date().toISOString()}] Completed processing for call log ${log.id}`);
        console.log(`[${new Date().toISOString()}] Memory usage after processing log: ${JSON.stringify(Deno.memoryUsage())}`);
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Error processing call log ${log.id}:`, error);
        console.error(`[${new Date().toISOString()}] Error stack:`, error.stack);
      }
    }

    console.log(`[${new Date().toISOString()}] Process-focus-areas function completed successfully`);
    console.log(`[${new Date().toISOString()}] Final memory usage: ${JSON.stringify(Deno.memoryUsage())}`);
    
    return { 
      message: `Processed ${unprocessedLogs.length} call logs for keywords`, 
      focusAreas: results 
    };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Fatal error in process-focus-areas function:`, error);
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
