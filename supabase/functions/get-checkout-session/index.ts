
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.5.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
    // Parse request body
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Session retrieved:", session.id);

    if (!session.line_items) {
      // Fetch line items separately if not included in the session
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
      console.log("Line items fetched separately");
      
      if (lineItems.data.length > 0) {
        // Return the first price ID in the line items
        return new Response(
          JSON.stringify({ 
            priceId: lineItems.data[0].price.id,
            sessionId: session.id 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }
    } else {
      console.log("Line items available directly in session");
      // Return the price ID from the session
      const priceId = session.line_items.data[0]?.price.id;
      
      return new Response(
        JSON.stringify({ 
          priceId: priceId,
          sessionId: session.id 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Fallback if no price ID could be found
    throw new Error("Could not find price ID in session");
    
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
