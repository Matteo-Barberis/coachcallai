
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
    const { sessionId, userId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    if (!userId) {
      throw new Error("User ID is required for subscription verification");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Session retrieved:", session.id);

    let priceId = null;
    let subscriptionVerified = false;

    // Verify this is a valid subscription checkout
    if (session.mode === "subscription" && session.subscription) {
      // Get subscription details to confirm it's valid
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      
      if (subscription.status === "active" || subscription.status === "trialing") {
        subscriptionVerified = true;
        
        // Get the first price ID from the subscription
        priceId = subscription.items.data[0]?.price.id;
        
        if (priceId) {
          // Find matching subscription plan in our database
          const { data: planData, error: planError } = await supabaseAdmin
            .from("subscription_plans")
            .select("id")
            .eq("stripe_price_id", priceId)
            .single();
          
          if (planError) {
            console.error("Error finding subscription plan:", planError);
          } else if (planData) {
            // Update user's subscription status now that we've verified it
            const { error: updateError } = await supabaseAdmin
              .from("profiles")
              .update({
                subscription_status: "active",
                subscription_plan_id: planData.id,
                trial_start_date: null // End trial when subscription starts
              })
              .eq("id", userId);
            
            if (updateError) {
              console.error("Error updating user profile:", updateError);
            } else {
              console.log(`Updated subscription for user ${userId} to plan ${planData.id}`);
            }
          }
        }
      }
    }

    if (!priceId && session.line_items) {
      // If not available directly, try line items in the session
      priceId = session.line_items.data[0]?.price.id;
    } else if (!priceId) {
      // Fetch line items separately if not included in the session
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
      console.log("Line items fetched separately");
      
      if (lineItems.data.length > 0) {
        priceId = lineItems.data[0].price.id;
      }
    }
    
    return new Response(
      JSON.stringify({ 
        priceId: priceId,
        sessionId: session.id,
        subscriptionVerified: subscriptionVerified
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
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
