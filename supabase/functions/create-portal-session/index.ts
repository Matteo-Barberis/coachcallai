
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.16.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { userId, returnUrl } = await req.json();

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Look up the Stripe customer ID for the user from the profiles table
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    // Get the user's Stripe customer ID from the profiles table
    const response = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=stripe_customer_id`, {
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`
      }
    });
    
    const profiles = await response.json();
    
    if (!profiles || profiles.length === 0 || !profiles[0].stripe_customer_id) {
      return new Response(
        JSON.stringify({ 
          error: "No Stripe customer found for this user" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404 
        }
      );
    }

    const customerId = profiles[0].stripe_customer_id;
    
    // Create a Stripe customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${req.headers.get("origin")}/account`,
    });

    // Return the session URL
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error creating portal session:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
