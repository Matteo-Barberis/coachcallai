
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
    // Get the WhatsApp API token and verify token from environment variables
    const whatsappApiToken = Deno.env.get('WHATSAPP_API_TOKEN');
    const whatsappVerifyToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN');
    
    if (!whatsappApiToken) {
      throw new Error('WHATSAPP_API_TOKEN is not set in environment variables');
    }
    
    if (!whatsappVerifyToken) {
      throw new Error('WHATSAPP_VERIFY_TOKEN is not set in environment variables');
    }

    // Handle GET request for webhook verification
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      console.log('Received verification request:');
      console.log(`Mode: ${mode}, Token: ${token}, Challenge: ${challenge}`);

      // Check if mode and token are in the query parameters
      if (mode === 'subscribe' && token === whatsappVerifyToken) {
        if (!challenge) {
          throw new Error('hub.challenge is missing from verification request');
        }
        
        console.log(`Verification successful. Returning challenge: ${challenge}`);
        return new Response(challenge, {
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
          status: 200,
        });
      } else {
        console.error('Failed verification. Token mismatch or invalid mode');
        return new Response('Verification failed', {
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
          status: 403,
        });
      }
    }

    // For POST requests (actual webhook notifications)
    // Parse the incoming webhook payload
    let payload;
    try {
      payload = await req.json();
      console.log('Received WhatsApp webhook payload:', JSON.stringify(payload));
    } catch (e) {
      console.error('Error parsing JSON payload:', e.message);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Create Supabase client with admin privileges using service role key
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    );

    // Check if this is a verification request from WhatsApp
    if (payload.hub?.challenge) {
      console.log('Responding to WhatsApp verification challenge');
      return new Response(
        JSON.stringify({ challenge: payload.hub.challenge }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Extract message information
    if (!payload.entry || !payload.entry[0]?.changes || !payload.entry[0]?.changes[0]?.value?.messages) {
      console.log('No message found in payload');
      return new Response(
        JSON.stringify({ status: 'No message found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Return 200 to acknowledge receipt
        }
      );
    }

    const message = payload.entry[0].changes[0].value.messages[0];
    const messageId = message.id;
    const from = message.from; // Phone number sending the message
    const messageContent = message.text?.body || '[Media message]';
    
    console.log(`Received message from ${from}: ${messageContent}`);

    // Find the user associated with this phone number
    const { data: profiles, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('phone', from)
      .maybeSingle();

    if (profileError) {
      console.error('Error finding user profile:', profileError);
    }

    const userId = profiles?.id;
    
    if (!userId) {
      console.log(`No user found with phone number: ${from}`);
      // We still proceed to store the message with a null user_id
    }

    // Store the incoming message in the database
    const { error: insertError } = await supabaseClient
      .from('whatsapp_messages')
      .insert({
        user_id: userId || null,
        content: messageContent,
        type: 'user' // This is a message from the user
      });

    if (insertError) {
      console.error('Error inserting message:', insertError);
      throw new Error(`Failed to store message: ${insertError.message}`);
    }

    // Send a reply message
    const defaultReply = "Message received. Our AI coach will respond shortly.";
    
    // Call WhatsApp API to send the reply
    const whatsappApiUrl = "https://graph.facebook.com/v17.0/FROM_PHONE_NUMBER_ID/messages"; // Replace FROM_PHONE_NUMBER_ID with your actual phone number ID
    
    // In a real implementation, you would make an API call here using fetch
    // For now, we'll just log the reply message
    console.log(`Would send reply to ${from}: "${defaultReply}"`);
    
    // Store the outgoing message in the database
    const { error: replyInsertError } = await supabaseClient
      .from('whatsapp_messages')
      .insert({
        user_id: userId || null,
        content: defaultReply,
        type: 'system' // This is a message from the system
      });

    if (replyInsertError) {
      console.error('Error inserting reply message:', replyInsertError);
    }

    return new Response(
      JSON.stringify({ status: 'success', message: 'Message processed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
