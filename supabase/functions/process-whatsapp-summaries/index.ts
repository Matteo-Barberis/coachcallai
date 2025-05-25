
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

    // Get users who have more than 5 important unprocessed messages
    console.log(`[${new Date().toISOString()}] Finding users with 5+ important unprocessed messages...`);
    
    const { data: usersWithMessages, error: usersError } = await supabaseClient
      .from('whatsapp_messages')
      .select('user_id')
      .eq('is_important', true)
      .eq('summary_processed', false)
      .not('user_id', 'is', null);

    if (usersError) {
      console.error(`[${new Date().toISOString()}] Error fetching users with messages:`, usersError);
      throw usersError;
    }

    if (!usersWithMessages || usersWithMessages.length === 0) {
      console.log(`[${new Date().toISOString()}] No users with unprocessed important messages found`);
      return { message: 'No users with unprocessed important messages found' };
    }

    // Count messages per user and filter those with 5+
    const userMessageCounts = usersWithMessages.reduce((acc, msg) => {
      acc[msg.user_id] = (acc[msg.user_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eligibleUsers = Object.entries(userMessageCounts)
      .filter(([_, count]) => count >= 5)
      .map(([userId, _]) => userId);

    console.log(`[${new Date().toISOString()}] Found ${eligibleUsers.length} users with 5+ important unprocessed messages`);

    if (eligibleUsers.length === 0) {
      console.log(`[${new Date().toISOString()}] No users with 5+ important unprocessed messages found`);
      return { message: 'No users with 5+ important unprocessed messages found' };
    }

    const results = [];

    // Process each eligible user
    for (const [index, userId] of eligibleUsers.entries()) {
      try {
        console.log(`[${new Date().toISOString()}] Processing user ${index + 1}/${eligibleUsers.length}, ID: ${userId}`);

        // Get user's current summary
        const { data: userProfile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('user_summary')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error(`[${new Date().toISOString()}] Error fetching user profile for ${userId}:`, profileError);
          continue;
        }

        // Get user's important unprocessed messages (max 40)
        const { data: messages, error: messagesError } = await supabaseClient
          .from('whatsapp_messages')
          .select('id, content, created_at')
          .eq('user_id', userId)
          .eq('is_important', true)
          .eq('summary_processed', false)
          .order('created_at', { ascending: false })
          .limit(40);

        if (messagesError) {
          console.error(`[${new Date().toISOString()}] Error fetching messages for user ${userId}:`, messagesError);
          continue;
        }

        if (!messages || messages.length === 0) {
          console.log(`[${new Date().toISOString()}] No unprocessed messages found for user ${userId}`);
          continue;
        }

        console.log(`[${new Date().toISOString()}] Found ${messages.length} unprocessed messages for user ${userId}`);

        // Combine messages into a single content block
        const messageContent = messages
          .reverse() // Show chronological order
          .map(msg => `[${msg.created_at}] ${msg.content}`)
          .join('\n\n');

        console.log(`[${new Date().toISOString()}] Combined message content length: ${messageContent.length}`);

        // Analyze with GPT
        console.log(`[${new Date().toISOString()}] Sending messages to GPT for user summary analysis...`);
        
        const updatedSummary = await analyzeWithGPT(
          promptData.prompt_text,
          userProfile?.user_summary || '',
          messageContent
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
            continue;
          }

          console.log(`[${new Date().toISOString()}] Successfully updated user summary for user ${userId}`);

          // Mark messages as processed
          const messageIds = messages.map(msg => msg.id);
          console.log(`[${new Date().toISOString()}] Marking ${messageIds.length} messages as processed...`);

          const { error: markProcessedError } = await supabaseClient
            .from('whatsapp_messages')
            .update({ summary_processed: true })
            .in('id', messageIds);

          if (markProcessedError) {
            console.error(`[${new Date().toISOString()}] Error marking messages as processed:`, markProcessedError);
          } else {
            console.log(`[${new Date().toISOString()}] Successfully marked ${messageIds.length} messages as processed`);
          }

          results.push({
            user_id: userId,
            messages_processed: messages.length,
            summary_updated: true
          });
        } else {
          console.log(`[${new Date().toISOString()}] No summary update needed for user ${userId}`);
          results.push({
            user_id: userId,
            messages_processed: messages.length,
            summary_updated: false
          });
        }

        console.log(`[${new Date().toISOString()}] Completed processing for user ${userId}`);
        console.log(`[${new Date().toISOString()}] Memory usage after processing user: ${JSON.stringify(Deno.memoryUsage())}`);
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Error processing user ${userId}:`, error);
        console.error(`[${new Date().toISOString()}] Error stack:`, error.stack);
      }
    }

    console.log(`[${new Date().toISOString()}] Process-whatsapp-summaries function completed successfully`);
    console.log(`[${new Date().toISOString()}] Final memory usage: ${JSON.stringify(Deno.memoryUsage())}`);
    
    return { 
      message: `Processed WhatsApp messages for ${eligibleUsers.length} users`, 
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
