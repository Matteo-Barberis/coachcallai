

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
  console.log(`[${new Date().toISOString()}] Starting process-whatsapp-summaries function...`);
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

    // Step 1: Timeout recovery - Clear any WhatsApp messages stuck in processing for more than 15 minutes
    console.log(`[${new Date().toISOString()}] Starting timeout recovery...`);
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    
    const { data: recoveredMessages, error: recoveryError } = await supabaseClient
      .from('whatsapp_messages')
      .update({ processing_started_at: null })
      .lt('processing_started_at', fifteenMinutesAgo)
      .not('processing_started_at', 'is', null)
      .select('id');

    if (recoveryError) {
      console.error(`[${new Date().toISOString()}] Error during timeout recovery:`, recoveryError);
    } else {
      console.log(`[${new Date().toISOString()}] Recovered ${recoveredMessages?.length || 0} stuck WhatsApp messages from timeout`);
    }

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

    const results = [];
    const processedUsers = new Set();

    // Step 2: Process WhatsApp messages using atomic claiming while maintaining user batching
    console.log(`[${new Date().toISOString()}] Starting atomic WhatsApp message processing...`);
    
    while (true) {
      // Atomically claim the next batch of messages (up to 40 per user)
      const { data: claimedMessages, error: claimError } = await supabaseClient
        .from('whatsapp_messages')
        .update({ processing_started_at: new Date().toISOString() })
        .eq('is_important', true)
        .eq('summary_processed', false)
        .is('processing_started_at', null)
        .not('user_id', 'is', null)
        .limit(40)
        .select('id, content, created_at, user_id');

      if (claimError) {
        console.error(`[${new Date().toISOString()}] Error claiming WhatsApp messages:`, claimError);
        break;
      }

      if (!claimedMessages || claimedMessages.length === 0) {
        console.log(`[${new Date().toISOString()}] No more WhatsApp messages to process`);
        break;
      }

      console.log(`[${new Date().toISOString()}] Claimed ${claimedMessages.length} WhatsApp messages for processing`);

      // Group messages by user
      const messagesByUser = claimedMessages.reduce((acc, msg) => {
        if (!acc[msg.user_id]) {
          acc[msg.user_id] = [];
        }
        acc[msg.user_id].push(msg);
        return acc;
      }, {} as Record<string, typeof claimedMessages>);

      // Process each user's messages
      for (const [userId, userMessages] of Object.entries(messagesByUser)) {
        // Skip if we've already processed this user in this run
        if (processedUsers.has(userId)) {
          console.log(`[${new Date().toISOString()}] Skipping user ${userId}, already processed in this run`);
          
          // Mark these messages as processed without summary update
          await supabaseClient
            .from('whatsapp_messages')
            .update({ 
              summary_processed: true,
              processing_started_at: null 
            })
            .in('id', userMessages.map(m => m.id));
          
          continue;
        }

        // Check if user has at least 5 messages for processing
        if (userMessages.length < 5) {
          console.log(`[${new Date().toISOString()}] User ${userId} has only ${userMessages.length} messages, need at least 5 - releasing claim`);
          
          // Release claim on these messages
          await supabaseClient
            .from('whatsapp_messages')
            .update({ processing_started_at: null })
            .in('id', userMessages.map(m => m.id));
          
          continue;
        }

        console.log(`[${new Date().toISOString()}] Processing ${userMessages.length} messages for user ${userId}`);

        try {
          // Get user's current summary
          const { data: userProfile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('user_summary')
            .eq('id', userId)
            .single();

          if (profileError) {
            console.error(`[${new Date().toISOString()}] Error fetching user profile for ${userId}:`, profileError);
            
            // Mark messages as processed to avoid infinite retry
            await supabaseClient
              .from('whatsapp_messages')
              .update({ 
                summary_processed: true,
                processing_started_at: null 
              })
              .in('id', userMessages.map(m => m.id));
            
            continue;
          }

          // Combine messages into a single content block
          const messageContent = userMessages
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map(msg => `[${msg.created_at}] ${msg.content}`)
            .join('\n\n');

          console.log(`[${new Date().toISOString()}] Combined message content length: ${messageContent.length} for user ${userId}`);

          // Analyze with GPT
          console.log(`[${new Date().toISOString()}] Sending messages to GPT for user summary analysis...`);
          
          const updatedSummary = await analyzeWithGPT(
            promptData.prompt_text,
            userProfile?.user_summary || '',
            messageContent
          );

          console.log(`[${new Date().toISOString()}] Received summary update from GPT (length: ${updatedSummary.length}) for user ${userId}`);

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
            }

            results.push({
              user_id: userId,
              messages_processed: userMessages.length,
              summary_updated: !updateError
            });
          } else {
            console.log(`[${new Date().toISOString()}] No summary update needed for user ${userId}`);
            results.push({
              user_id: userId,
              messages_processed: userMessages.length,
              summary_updated: false
            });
          }

          // Mark messages as processed and clear the processing timestamp
          console.log(`[${new Date().toISOString()}] Marking ${userMessages.length} messages as processed for user ${userId}...`);

          const { error: markProcessedError } = await supabaseClient
            .from('whatsapp_messages')
            .update({ 
              summary_processed: true,
              processing_started_at: null
            })
            .in('id', userMessages.map(m => m.id));

          if (markProcessedError) {
            console.error(`[${new Date().toISOString()}] Error marking messages as processed:`, markProcessedError);
          } else {
            console.log(`[${new Date().toISOString()}] Successfully marked ${userMessages.length} messages as processed for user ${userId}`);
          }

          // Mark this user as processed in this run
          processedUsers.add(userId);

          console.log(`[${new Date().toISOString()}] Completed processing for user ${userId}`);
          console.log(`[${new Date().toISOString()}] Memory usage after processing user: ${JSON.stringify(Deno.memoryUsage())}`);
        } catch (error) {
          console.error(`[${new Date().toISOString()}] Error processing user ${userId}:`, error);
          console.error(`[${new Date().toISOString()}] Error stack:`, error.stack);
          
          // Clear the processing timestamp so these messages can be retried later
          await supabaseClient
            .from('whatsapp_messages')
            .update({ processing_started_at: null })
            .in('id', userMessages.map(m => m.id));
        }
      }
    }

    console.log(`[${new Date().toISOString()}] Process-whatsapp-summaries function completed successfully`);
    console.log(`[${new Date().toISOString()}] Final memory usage: ${JSON.stringify(Deno.memoryUsage())}`);
    
    return { 
      message: `Processed WhatsApp messages for ${processedUsers.size} users`, 
      results: results 
    };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Fatal error in process-whatsapp-summaries function:`, error);
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

