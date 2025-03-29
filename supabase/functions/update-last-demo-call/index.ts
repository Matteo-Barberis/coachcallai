
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_npm

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  console.log("Edge function called: update-last-demo-call");
  
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const vapiApiKey = Deno.env.get("VAPI_API_KEY") || "";
    
    // Create Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Get request body
    const { userId } = await req.json();
    
    if (!userId) {
      console.error("No user ID provided");
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Updating last_demo_call_at for user: ${userId}`);
    
    // Fetch user profile to get phone number and assistant_id
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(`
        phone,
        assistant_id,
        assistants!inner (
          vapi_assistant_id
        )
      `)
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if profile has phone number and assistant ID
    if (!profileData.phone) {
      console.error("User has no phone number");
      return new Response(
        JSON.stringify({ error: "User has no phone number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!profileData.assistant_id || !profileData.assistants.vapi_assistant_id) {
      console.error("User has no selected coach or coach has no Vapi assistant ID");
      return new Response(
        JSON.stringify({ error: "No coach selected or coach has no Vapi assistant ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const vapiAssistantId = profileData.assistants.vapi_assistant_id;
    const userPhone = profileData.phone;
    
    // Update the last_demo_call_at field to the current timestamp
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update({ last_demo_call_at: new Date().toISOString() })
      .eq('id', userId)
      .select();
      
    if (updateError) {
      console.error("Error updating profile:", updateError);
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Updated successfully:", updateData);
    
    // Make a request to Vapi API to initiate a call
    console.log(`Initiating test call to ${userPhone} with assistant ID ${vapiAssistantId}`);
    
    try {
      const vapiResponse = await fetch("https://api.vapi.ai/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${vapiApiKey}`
        },
        body: JSON.stringify({
          assistant_id: vapiAssistantId,
          phone_number: userPhone,
          assistant_overrides: {
            model: {
              messages: [
                {
                  content: "You are an AI coach, you are calling a user just to confirm that you can call them successfully and they can receive calls, and to inform them that this is just a test call and it won't last more than 30 seconds, and that if they want to schedule a proper call with you to do it from the dashboard",
                  role: "system"
                }
              ]
            },
            first_message: "Hey there! Can you hear me?"
          }
        })
      });
      
      const vapiData = await vapiResponse.json();
      
      if (!vapiResponse.ok) {
        console.error("Error from Vapi API:", vapiData);
        // We still return success to the client as the database was updated
        return new Response(
          JSON.stringify({ success: true, data: updateData, vapiError: vapiData }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log("Vapi call initiated successfully:", vapiData);
      
      return new Response(
        JSON.stringify({ success: true, data: updateData, vapiCall: vapiData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
      
    } catch (vapiError) {
      console.error("Error calling Vapi API:", vapiError);
      // We still return success to the client as the database was updated
      return new Response(
        JSON.stringify({ success: true, data: updateData, vapiError: vapiError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
