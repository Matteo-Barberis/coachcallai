
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables for Supabase");
    }
    
    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the user ID from the request
    const { user_id } = await req.json();
    
    if (!user_id) {
      throw new Error("User ID is required");
    }

    console.log(`Updating last_demo_call_at for user: ${user_id}`);

    // Update the last_demo_call_at timestamp for the user
    const { error, data } = await supabase
      .from('profiles')
      .update({ last_demo_call_at: new Date().toISOString() })
      .eq('id', user_id)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("Update successful:", data);

    // Return a success response
    return new Response(
      JSON.stringify({ success: true, message: "Demo call timestamp updated" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error updating last demo call:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
