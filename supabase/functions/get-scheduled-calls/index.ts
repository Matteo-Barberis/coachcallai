
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      console.log('Making Vapi API calls for scheduled calls...');
      
      // Store all promises for the API calls
      const apiCallPromises = data.map(async (call) => {
        try {
          // Extract template description if template_id exists
          let templateDescription = "Check-in call";
          if (call.template_id) {
            const { data: templateData } = await supabaseClient
              .from('templates')
              .select('description')
              .eq('id', call.template_id)
              .single();
              
            if (templateData) {
              templateDescription = templateData.description;
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
                "call_type": templateDescription,
                "user_goals": call.objectives || "personal goals"
              },
              "maxDurationSeconds": 120,
              "firstMessage": `good morning ${call.full_name || "there"}, how are you today? `
            }
          };
          
          console.log(`Making Vapi API call for user ${call.full_name || call.user_id}:`, JSON.stringify(vapiPayload));
          
          // Make request to Vapi API
          const vapiResponse = await fetch('https://api.vapi.ai/call', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${vapiApiKey}`
            },
            body: JSON.stringify(vapiPayload)
          });
          
          const vapiResult = await vapiResponse.json();
          console.log(`Vapi API response for user ${call.full_name || call.user_id}:`, JSON.stringify(vapiResult));
          
          return {
            userId: call.user_id,
            vapiPayload, // Include the request payload
            vapiResponse: vapiResult
          };
        } catch (callError) {
          console.error(`Error making Vapi API call for user ${call.full_name || call.user_id}:`, callError);
          return {
            userId: call.user_id,
            error: callError.message
          };
        }
      });
      
      // Wait for all API calls to complete
      const apiResults = await Promise.all(apiCallPromises);
      console.log('All Vapi API calls completed:', JSON.stringify(apiResults));
      
      // Add the API results to the response data
      data.forEach(call => {
        const apiResult = apiResults.find(result => result.userId === call.user_id);
        call.vapiCallPayload = apiResult ? apiResult.vapiPayload : null; // Add the request payload
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
