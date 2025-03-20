
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Constants
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const VAPI_API_KEY = Deno.env.get("VAPI_API_KEY") || "";
const VAPI_API_ENDPOINT = "https://api.vapi.ai/call";
const VAPI_ASSISTANT_ID = "3990f3ad-880c-4d8c-95bf-42d72a90ac14";
const VAPI_PHONE_NUMBER_ID = "879b5957-ead7-443a-9cb1-bd94e4160327";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Create a Supabase client with the service role key
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    console.log("Starting scheduled calls check...");
    
    // Using exactly the query provided
    const { data: calls, error } = await supabase.from('scheduled_calls').select(`
      *,
      profiles!inner(*)
    `).filter('execution_timestamp', 'gte', `${new Date(Date.now() - 10 * 60 * 1000).toISOString()}`)
      .filter('execution_timestamp', 'lte', `${new Date(Date.now() + 10 * 60 * 1000).toISOString()}`);
    
    if (error) {
      console.error("Error fetching scheduled calls:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch scheduled calls" }), { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    console.log(`Found ${calls?.length || 0} calls to be executed`);
    
    // Process each call
    const results = [];
    
    if (calls && calls.length > 0) {
      for (const call of calls) {
        try {
          // Get template information
          let templateDescription = "coaching call";
          
          if (call.template_id) {
            const { data: template } = await supabase
              .from("templates")
              .select("description")
              .eq("id", call.template_id)
              .single();
              
            if (template) {
              templateDescription = template.description;
            }
          }
          
          // Prepare the call payload
          const callPayload = {
            assistantId: VAPI_ASSISTANT_ID,
            customer: {
              number: call.profiles.phone || "+447871958501" // Fallback to default if no phone number
            },
            phoneNumberId: VAPI_PHONE_NUMBER_ID,
            assistantOverrides: {
              variableValues: {
                name: call.profiles.full_name || "User",
                call_type: templateDescription,
                user_goals: call.profiles.objectives || "Improve your life"
              },
              maxDurationSeconds: 120,
              firstMessage: `good morning ${call.profiles.full_name || "User"}, how are you today?`
            }
          };
          
          // Make the API call to Vapi
          console.log(`Initiating call for user: ${call.profiles.full_name || "Unknown"}, template: ${templateDescription}`);
          
          const vapiResponse = await fetch(VAPI_API_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${VAPI_API_KEY}`
            },
            body: JSON.stringify(callPayload)
          });
          
          const vapiData = await vapiResponse.json();
          
          // Check response
          if (vapiResponse.ok) {
            console.log(`Call successfully scheduled for ${call.profiles.full_name || "User"}, Vapi response:`, vapiData);
            
            // Update execution_timestamp in database
            await supabase
              .from("scheduled_calls")
              .update({ execution_timestamp: new Date().toISOString() })
              .eq("id", call.id);
              
            results.push({
              success: true,
              user: call.profiles.full_name || "Unknown user",
              callId: vapiData.id || "N/A", 
              scheduledCallId: call.id
            });
          } else {
            console.error(`Failed to schedule call for ${call.profiles.full_name || "User"}:`, vapiData);
            results.push({
              success: false,
              user: call.profiles.full_name || "Unknown user",
              error: vapiData,
              scheduledCallId: call.id
            });
          }
        } catch (callError) {
          console.error(`Error processing call for user ${call.user_id}:`, callError);
          results.push({
            success: false,
            user: call.profiles.full_name || "Unknown user",
            error: callError.message,
            scheduledCallId: call.id
          });
        }
      }
    }
    
    return new Response(JSON.stringify({ 
      message: "Scheduled calls process completed",
      callsProcessed: calls?.length || 0,
      results 
    }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
    
  } catch (err) {
    console.error("Error in schedule-calls function:", err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
