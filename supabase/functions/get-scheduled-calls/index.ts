import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Toggle to skip actual API calls to Vapi
const SKIP_VAPI_API_CALLS = false;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Creating Supabase client with service role key for admin privileges');
    
    // Always use the service role key for admin privileges
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
    }
    
    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    );

    console.log('Fetching scheduled calls to execute...');
    
    // Call the database function
    const { data, error } = await supabaseClient.rpc('get_scheduled_calls_to_execute');
    
    if (error) {
      console.error('Error fetching scheduled calls:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    console.log(`Retrieved ${data?.length || 0} scheduled calls`);
    
    // Filter scheduled calls based on user subscription status
    let filteredData = [];
    if (data && data.length > 0) {
      console.log('Filtering calls based on user subscription status...');
      
      filteredData = await Promise.all(data.map(async (call) => {
        // Get user profile with subscription information and user_summary
        const { data: profileData, error: profileError } = await supabaseClient
          .from('profiles')
          .select('subscription_status, trial_start_date, user_summary')
          .eq('id', call.user_id)
          .single();
          
        if (profileError) {
          console.error(`Error fetching profile data for user ${call.user_id}:`, profileError);
          return null;
        }
        
        const subscriptionStatus = profileData?.subscription_status;
        const trialStartDate = profileData?.trial_start_date;
        const userSummary = profileData?.user_summary || '';
        
        // Check if subscription is active or trial is valid (within 7 days)
        let isValid = subscriptionStatus === 'active';
        
        if (subscriptionStatus === 'trial' && trialStartDate) {
          const trialStart = new Date(trialStartDate);
          const currentDate = new Date();
          const diffTime = currentDate.getTime() - trialStart.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          
          isValid = diffDays < 7; // Trial valid if less than 7 days have passed
          console.log(`User ${call.user_id} trial: Started on ${trialStartDate}, days elapsed: ${diffDays}, valid: ${isValid}`);
        }
        
        if (isValid) {
          console.log(`Including call ${call.id} for user ${call.user_id} with subscription status: ${subscriptionStatus}`);
          // Add user_summary to the call object so it can be used later
          call.user_summary = userSummary;
          return call;
        } else {
          console.log(`Excluding call ${call.id} for user ${call.user_id} with subscription status: ${subscriptionStatus}`);
          return null;
        }
      }));
      
      // Remove null entries (calls that didn't pass the subscription check)
      filteredData = filteredData.filter(call => call !== null);
      
      console.log(`After filtering: ${filteredData.length} scheduled calls will be processed`);
    }
    
    // Get Vapi API Key from environment
    const vapiApiKey = Deno.env.get('VAPI_API_KEY');
    if (!vapiApiKey) {
      console.error('VAPI_API_KEY not found in environment variables');
    }
    
    // For each call, make a request to the Vapi API
    if (filteredData && filteredData.length > 0 && vapiApiKey) {
      console.log('Processing scheduled calls...');
      console.log(`SKIP_VAPI_API_CALLS mode is: ${SKIP_VAPI_API_CALLS ? 'ENABLED' : 'DISABLED'}`);
      
      // Store all promises for the API calls
      const apiCallPromises = filteredData.map(async (call) => {
        try {
          // Validate that the call has a mode_id
          if (!call.mode_id) {
            console.error(`Scheduled call ${call.id} does not have a mode_id - skipping as this is required`);
            return {
              callId: call.id,
              error: 'Scheduled call missing mode_id - this is required for processing'
            };
          }

          // Extract template name and description if template_id exists
          let templateName = "Check-in call";
          let templateDescription = "Check-in call";
          let templateInstructions = ""; 
          let coachingGuidelines = "";
          
          if (call.template_id) {
            // Get template data with full admin access
            console.log(`Fetching template data for template ${call.template_id} using admin privileges`);
            const { data: templateData, error: templateError } = await supabaseClient
              .from('templates')
              .select('name, description, instructions')
              .eq('id', call.template_id)
              .single();
              
            if (templateError) {
              console.error(`Error fetching template data for template ${call.template_id}:`, templateError);
            } else if (templateData) {
              templateName = templateData.name;
              templateDescription = templateData.description;
              templateInstructions = templateData.instructions || "";
              console.log(`SUCCESSFULLY retrieved template: "${templateName}" - "${templateDescription}"`);
              console.log(`Template instructions: "${templateInstructions}"`);
            } else {
              console.log(`No template found for ID ${call.template_id}, using defaults`);
            }
          }
          
          // Use mode_id from the scheduled call
          const modeId = call.mode_id;
          console.log(`Using mode_id from scheduled call: ${modeId}`);
          
          // Fetch the coaching guidelines for the mode
          console.log(`Fetching coaching guidelines for mode ${modeId}`);
          const { data: modeData, error: modeError } = await supabaseClient
            .from('modes')
            .select('guidelines')
            .eq('id', modeId)
            .single();
            
          if (modeError) {
            console.error(`Error fetching mode data for mode ${modeId}:`, modeError);
          } else if (modeData) {
            coachingGuidelines = modeData.guidelines || "";
            console.log(`SUCCESSFULLY retrieved coaching guidelines: "${coachingGuidelines}"`);
          }
          
          // Default assistant ID to use if none found in mode preferences
          const defaultAssistantId = "3990f3ad-880c-4d8c-95bf-42d72a90ac14";
          let assistantId = defaultAssistantId;
          let customInstructions = "";
          
          // Get assistant ID and custom_instructions from mode_preferences
          console.log(`Fetching assistant ID and custom_instructions from mode_preferences for user ${call.user_id} and mode ${modeId}`);
          const { data: preferenceData, error: preferenceError } = await supabaseClient
            .from('mode_preferences')
            .select('assistant_id, custom_instructions')
            .eq('user_id', call.user_id)
            .eq('mode_id', modeId)
            .single();
            
          if (preferenceError) {
            console.error(`Error fetching mode preference for user ${call.user_id} and mode ${modeId}:`, preferenceError);
            console.log(`Using default assistant ID: ${defaultAssistantId}`);
          } else if (preferenceData) {
            if (preferenceData.assistant_id) {
              console.log(`Found assistant ID in mode preferences: ${preferenceData.assistant_id}`);
              assistantId = preferenceData.assistant_id;
            } else {
              console.log(`No assistant found in mode preferences, using default: ${defaultAssistantId}`);
            }
            
            if (preferenceData.custom_instructions) {
              customInstructions = preferenceData.custom_instructions;
              console.log(`Found custom instructions: ${customInstructions}`);
            }
          } else {
            console.log(`No mode preference found, using defaults`);
          }
          
          // Fetch the actual Vapi assistant ID and personality behavior associated with this Supabase assistant ID
          console.log(`Fetching Vapi assistant ID and personality behavior for assistant ${assistantId}`);
          const { data: assistantData, error: assistantError } = await supabaseClient
            .from('assistants')
            .select(`
              vapi_assistant_id,
              name,
              personalities!inner (
                id,
                name,
                behavior
              )
            `)
            .eq('id', assistantId)
            .single();
            
          let vapiAssistantId = "3990f3ad-880c-4d8c-95bf-42d72a90ac14"; // Default Vapi Assistant ID
          let assistantBehavior = "";
          let assistantName = "Coach"; // Default assistant name
          
          if (assistantError) {
            console.error(`Error fetching assistant data for ID ${assistantId}:`, assistantError);
            console.log(`Using default Vapi assistant ID: ${vapiAssistantId}`);
          } else if (assistantData?.vapi_assistant_id) {
            console.log(`Found Vapi assistant ID for ${assistantData.name}: ${assistantData.vapi_assistant_id}`);
            vapiAssistantId = assistantData.vapi_assistant_id;
            assistantName = assistantData.name || "Coach";
            
            // Get the behavior from the personality
            if (assistantData.personalities?.behavior) {
              assistantBehavior = assistantData.personalities.behavior;
              console.log(`Found assistant behavior: ${assistantBehavior}`);
            }
          } else {
            console.log(`No Vapi assistant ID found for assistant ${assistantId}, using default: ${vapiAssistantId}`);
          }
          
          // Prepare Vapi API call payload with empty string as firstMessage
          const vapiPayload = {
            "assistantId": vapiAssistantId,
            "customer": {
              "number": call.phone
            },
            "phoneNumberId": "879b5957-ead7-443a-9cb1-bd94e4160327",
            "assistantOverrides": {
              "variableValues": {
                "name": call.full_name || "there",
                "call_type": templateName,
                "call_description": templateDescription,
                "user_goals": customInstructions || "personal goals",
                "assistant_behaviour": assistantBehavior,
                "template_instructions": templateInstructions,
                "coaching_guidelines": coachingGuidelines,
                "assistant_name": assistantName,
                "user_summary": call.user_summary || ""
              },
              "maxDurationSeconds": 120,
              "firstMessage": "" // Empty string as requested
            }
          };
          
          console.log(`Processing call ${call.id} for user ${call.full_name || call.user_id}:`);
          console.log(`Template: ${templateName} - ${templateDescription}`);
          console.log(`Template Instructions: ${templateInstructions}`);
          console.log(`Coaching Guidelines: ${coachingGuidelines}`);
          console.log(`Custom Instructions: ${customInstructions}`);
          console.log(`User Summary: ${call.user_summary || 'No summary available'}`);
          console.log(`Using empty string as greeting`);
          console.log(`Using Vapi assistant ID: ${vapiAssistantId}`);
          console.log(`Assistant behavior: ${assistantBehavior}`);
          console.log(`Assistant name: ${assistantName}`);
          console.log(`Payload: ${JSON.stringify(vapiPayload)}`);
          
          // Make request to Vapi API only if SKIP_VAPI_API_CALLS is false
          let vapiResult = null;
          
          if (!SKIP_VAPI_API_CALLS) {
            console.log(`Making actual Vapi API call for user ${call.full_name || call.user_id}`);
            const vapiResponse = await fetch('https://api.vapi.ai/call', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${vapiApiKey}`
              },
              body: JSON.stringify(vapiPayload)
            });
            
            vapiResult = await vapiResponse.json();
            console.log(`Vapi API response for call ${call.id}:`, JSON.stringify(vapiResult));
            
            // Log the call to the database
            try {
              // Extract Vapi call ID and status
              const vapiCallId = vapiResult?.id;
              const callStatus = vapiResult?.status || 'unknown';
              
              console.log(`Logging call to database: Scheduled call ID: ${call.id}, Vapi call ID: ${vapiCallId}, Status: ${callStatus}`);
              
              // Insert the call log record
              const { error: logError } = await supabaseClient
                .from('call_logs')
                .insert({
                  user_id: call.user_id,
                  scheduled_call_id: call.id,
                  vapi_call_id: vapiCallId,
                  status: callStatus,
                  payload: vapiPayload,
                  response: vapiResult
                });
                
              if (logError) {
                console.error(`Error logging call to database:`, logError);
              } else {
                console.log(`Successfully logged call to database`);
              }
            } catch (logError) {
              console.error(`Error logging call to database:`, logError);
            }
          } else {
            console.log(`SKIPPED actual Vapi API call for call ${call.id} (test mode)`);
            vapiResult = { status: "TEST_MODE", message: "API call was skipped due to test mode" };
            
            // Log the test call to the database
            try {
              console.log(`Logging test call to database: Scheduled call ID: ${call.id}`);
              
              // Insert the call log record for test mode
              const { error: logError } = await supabaseClient
                .from('call_logs')
                .insert({
                  user_id: call.user_id,
                  scheduled_call_id: call.id,
                  vapi_call_id: 'test-mode-' + Date.now(),
                  status: 'TEST_MODE',
                  payload: vapiPayload,
                  response: vapiResult
                });
                
              if (logError) {
                console.error(`Error logging test call to database:`, logError);
              } else {
                console.log(`Successfully logged test call to database`);
              }
            } catch (logError) {
              console.error(`Error logging test call to database:`, logError);
            }
          }
          
          return {
            callId: call.id,
            vapiPayload, 
            vapiResponse: vapiResult
          };
        } catch (callError) {
          console.error(`Error processing call ${call.id} for user ${call.full_name || call.user_id}:`, callError);
          
          // Log failed call attempt to database
          try {
            console.log(`Logging failed call attempt to database: Scheduled call ID: ${call.id}`);
            
            // Insert the failed call log record
            const { error: logError } = await supabaseClient
              .from('call_logs')
              .insert({
                user_id: call.user_id,
                scheduled_call_id: call.id,
                status: 'error',
                call_summary: callError.message,
                payload: { error: callError.message }
              });
              
            if (logError) {
              console.error(`Error logging failed call to database:`, logError);
            } else {
              console.log(`Successfully logged failed call to database`);
            }
          } catch (logError) {
            console.error(`Error logging failed call to database:`, logError);
          }
          
          return {
            callId: call.id,
            error: callError.message
          };
        }
      });
      
      // Wait for all API calls to complete
      const apiResults = await Promise.all(apiCallPromises);
      console.log('All call processing completed:', JSON.stringify(apiResults));
      
      // Add the API results to the response data, matching by call.id
      filteredData.forEach(call => {
        const apiResult = apiResults.find(result => result.callId === call.id);
        call.vapiCallPayload = apiResult ? apiResult.vapiPayload : null;
        call.vapiCallResult = apiResult ? apiResult.vapiResponse : null;
        call.vapiCallError = apiResult && apiResult.error ? apiResult.error : null;
      });
    }
    
    // Return the filtered data
    return new Response(
      JSON.stringify({ data: filteredData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Unexpected error in get-scheduled-calls function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
