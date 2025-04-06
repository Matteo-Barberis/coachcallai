
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });
  
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
  
  // Get the signature from the headers
  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    console.error("No stripe signature found");
    return new Response(JSON.stringify({ error: "No stripe signature found" }), {
      status: 400,
    });
  }

  try {
    // Get request body as text for verification
    const body = await req.text();
    
    // Verify webhook signature asynchronously
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    let event;
    
    try {
      // Use the asynchronous version for Deno compatibility
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
      });
    }
    
    console.log(`Event received: ${event.type}`);
    
    // Handle specific events
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session, supabaseAdmin, stripe);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription, supabaseAdmin, stripe);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription, supabaseAdmin);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});

// Handle successful checkout completion
async function handleCheckoutSessionCompleted(session, supabaseAdmin, stripe) {
  try {
    if (session.mode !== "subscription") {
      console.log("Not a subscription checkout session");
      return;
    }
    
    // Get subscription details
    const subscriptionId = session.subscription;
    if (!subscriptionId) {
      console.error("No subscription ID found in session");
      return;
    }
    
    // Get price ID from the subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price.id;
    
    if (!priceId) {
      console.error("No price ID found in subscription");
      return;
    }
    
    // Find matching subscription plan in our database
    const { data: planData, error: planError } = await supabaseAdmin
      .from("subscription_plans")
      .select("id")
      .eq("stripe_price_id", priceId)
      .single();
    
    if (planError) {
      console.error("Error finding subscription plan:", planError);
      return;
    }
    
    // Update the user's subscription status
    const customerId = session.customer;
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId);
    
    if (profilesError) {
      console.error("Error finding user profile:", profilesError);
      return;
    }
    
    if (profiles.length === 0) {
      console.error("No user found with Stripe customer ID:", customerId);
      return;
    }
    
    const userId = profiles[0].id;
    
    // Update user's subscription status and plan ID
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        subscription_status: "active",
        subscription_id: subscriptionId,
        subscription_plan_id: planData.id,
        trial_start_date: null // End trial when subscription starts
      })
      .eq("id", userId);
    
    if (updateError) {
      console.error("Error updating user profile:", updateError);
    } else {
      console.log(`Updated subscription for user ${userId} to plan ${planData.id}`);
    }
  } catch (error) {
    console.error("Error in handleCheckoutSessionCompleted:", error);
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription, supabaseAdmin, stripe) {
  try {
    const status = subscription.status;
    const customerId = subscription.customer;
    const priceId = subscription.items.data[0]?.price.id;
    
    if (!priceId) {
      console.error("No price ID found in updated subscription");
      return;
    }
    
    // Find matching subscription plan in our database
    const { data: planData, error: planError } = await supabaseAdmin
      .from("subscription_plans")
      .select("id")
      .eq("stripe_price_id", priceId)
      .single();
    
    if (planError) {
      console.error("Error finding subscription plan:", planError);
      return;
    }
    
    // Get the user associated with this customer
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId);
    
    if (profilesError) {
      console.error("Error finding user profile:", profilesError);
      return;
    }
    
    if (profiles.length === 0) {
      console.error("No user found with Stripe customer ID:", customerId);
      return;
    }
    
    const userId = profiles[0].id;
    
    // Map Stripe status to our subscription status
    let subscriptionStatus;
    switch (status) {
      case "active":
      case "trialing":
        subscriptionStatus = "active";
        break;
      case "past_due":
        subscriptionStatus = "past_due";
        break;
      case "canceled":
        subscriptionStatus = "canceled";
        break;
      case "unpaid":
        subscriptionStatus = "unpaid";
        break;
      default:
        subscriptionStatus = status;
    }
    
    // Update the user's subscription status
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        subscription_status: subscriptionStatus,
        subscription_id: subscription.id,
        subscription_plan_id: planData.id,
        subscription_end_date: subscription.current_period_end 
          ? new Date(subscription.current_period_end * 1000).toISOString() 
          : null
      })
      .eq("id", userId);
    
    if (updateError) {
      console.error("Error updating user profile:", updateError);
    } else {
      console.log(`Updated subscription for user ${userId} to plan ${planData.id} with status ${subscriptionStatus}`);
    }
  } catch (error) {
    console.error("Error in handleSubscriptionUpdated:", error);
  }
}

// Handle subscription deletions
async function handleSubscriptionDeleted(subscription, supabaseAdmin) {
  try {
    const customerId = subscription.customer;
    
    // Get the user associated with this customer
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId);
    
    if (profilesError) {
      console.error("Error finding user profile:", profilesError);
      return;
    }
    
    if (profiles.length === 0) {
      console.error("No user found with Stripe customer ID:", customerId);
      return;
    }
    
    const userId = profiles[0].id;
    
    // Update the user's subscription status
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        subscription_status: "canceled",
        subscription_id: null,
        subscription_plan_id: null,
        subscription_end_date: null
      })
      .eq("id", userId);
    
    if (updateError) {
      console.error("Error updating user profile:", updateError);
    } else {
      console.log(`Updated subscription status for user ${userId} to canceled`);
    }
  } catch (error) {
    console.error("Error in handleSubscriptionDeleted:", error);
  }
}
