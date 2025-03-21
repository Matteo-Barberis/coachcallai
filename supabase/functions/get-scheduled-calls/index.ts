
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Toggle to skip actual API calls to Vapi
const SKIP_VAPI_API_CALLS = true;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
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
    
    // Get Vapi API Key from environment
    const vapiApiKey = Deno.env.get('VAPI_API_KEY');
    if (!vapiApiKey) {
      console.error('VAPI_API_KEY not found in environment variables');
    }
    
    // For each call, make a request to the Vapi API
    if (data && data.length > 0 && vapiApiKey) {
      console.log('Processing scheduled calls...');
      console.log(`SKIP_VAPI_API_CALLS mode is: ${SKIP_VAPI_API_CALLS ? 'ENABLED' : 'DISABLED'}`);
      
      // Store all promises for the API calls
      const apiCallPromises = data.map(async (call) => {
        try {
          // Extract template name and description if template_id exists
          let templateName = "Check-in call";
          let templateDescription = "Check-in call";
          let greeting = `good morning {{name}}, how are you today? `;
          
          if (call.template_id) {
            // Get template data
            const { data: templateData } = await supabaseClient
              .from('templates')
              .select('name, description')
              .eq('id', call.template_id)
              .single();
              
            if (templateData) {
              templateName = templateData.name;
              templateDescription = templateData.description;
            }
            
            // Fetch a random greeting for this template
            const { data: greetingData, error: greetingError } = await supabaseClient
              .from('greetings')
              .select('greeting_text')
              .eq('template_id', call.template_id)
              .order('created_at', { ascending: false })
              .limit(20);  // Limit to most recent 20 greetings
            
            if (greetingError) {
              console.error(`Error fetching greetings for template ${call.template_id}:`, greetingError);
            } else if (greetingData && greetingData.length > 0) {
              // Select a random greeting from the results
              const randomIndex = Math.floor(Math.random() * greetingData.length);
              greeting = greetingData[randomIndex].greeting_text;
              console.log(`Selected random greeting: "${greeting}" for template ${templateName}`);
            } else {
              console.log(`No greetings found for template ${call.template_id}, using default`);
            }
          }
          
          // Prepare Vapi API call payload
          const vapiPayload = {
            "assistantId": "3990f3ad-880c-4d8c-95bf-42d72a90ac14",
            "customer": {
              "number": call.phone
            },
            "phoneNumberId": "879b5957-ead7-443a-9cb1-bd94e4160327",
            "assistantOverrides": {
              "variableValues": {
                "name": call.full_name || "there",
                "call_type": templateName,
                "call_description": templateDescription,
                "user_goals": call.objectives || "personal goals"
              },
              "maxDurationSeconds": 120,
              "firstMessage": greeting
            }
          };
          
          console.log(`Processing call ${call.id} for user ${call.full_name || call.user_id}:`);
          console.log(`Template: ${templateName} - ${templateDescription}`);
          console.log(`Greeting: ${greeting}`);
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
          } else {
            console.log(`SKIPPED actual Vapi API call for call ${call.id} (test mode)`);
            vapiResult = { status: "TEST_MODE", message: "API call was skipped due to test mode" };
          }
          
          return {
            callId: call.id, // Use call.id instead of user_id for mapping
            vapiPayload, 
            vapiResponse: vapiResult
          };
        } catch (callError) {
          console.error(`Error processing call ${call.id} for user ${call.full_name || call.user_id}:`, callError);
          return {
            callId: call.id, // Use call.id for mapping errors too
            error: callError.message
          };
        }
      });
      
      // Wait for all API calls to complete
      const apiResults = await Promise.all(apiCallPromises);
      console.log('All call processing completed:', JSON.stringify(apiResults));
      
      // Add the API results to the response data, matching by call.id instead of user_id
      data.forEach(call => {
        const apiResult = apiResults.find(result => result.callId === call.id);
        call.vapiCallPayload = apiResult ? apiResult.vapiPayload : null;
        call.vapiCallResult = apiResult ? apiResult.vapiResponse : null;
        call.vapiCallError = apiResult && apiResult.error ? apiResult.error : null;
      });
    }
    
    // Return the data
    return new Response(
      JSON.stringify({ data }),
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
