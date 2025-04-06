
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
    const { priceId, userId } = await req.json();
    
    if (!priceId) {
      throw new Error("Price ID is required");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user profile to check if they exist in Stripe
    const { data: profileData, error: profileError } = await supabaseClient
      .from("profiles")
      .select("stripe_customer_id, email, id")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      throw profileError;
    }

    if (!profileData) {
      throw new Error("User profile not found");
    }

    console.log("User profile found:", profileData.id);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get user email (needed if we need to create a new customer)
    const { data: userData, error: userError } = await supabaseClient.auth
      .admin.getUserById(userId);

    if (userError) {
      console.error("Error getting user data:", userError);
      throw userError;
    }

    const userEmail = userData.user?.email;
    if (!userEmail) {
      throw new Error("User email not found");
    }

    // Determine customer ID (create if doesn't exist)
    let customerId = profileData.stripe_customer_id;
    
    if (!customerId) {
      // Create a new customer if one doesn't exist
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          supabase_user_id: userId,
        },
      });
      
      customerId = customer.id;
      
      // Save customer ID to user profile
      await supabaseClient
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", userId);
    }

    // Create checkout session
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-canceled`,
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
        },
      },
    });

    console.log("Checkout session created:", session.id);

    // Return the session URL
    return new Response(
      JSON.stringify({ 
        url: session.url,
        session_id: session.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
