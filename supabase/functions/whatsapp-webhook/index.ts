
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Log immediately when the function is loaded
console.log("WhatsApp webhook function is starting up...");

serve(async (req) => {
  // Log all headers immediately when the function is called
  console.log('Request headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));
  console.log('WhatsApp webhook handler called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the WhatsApp API token and verify token from environment variables
    const whatsappApiToken = Deno.env.get('WHATSAPP_API_TOKEN');
    const whatsappVerifyToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!whatsappApiToken) {
      throw new Error('WHATSAPP_API_TOKEN is not set in environment variables');
    }
    
    if (!whatsappVerifyToken) {
      throw new Error('WHATSAPP_VERIFY_TOKEN is not set in environment variables');
    }

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
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

    // Check if this is a status update notification (not an actual user message)
    if (payload.entry && 
        payload.entry[0]?.changes && 
        payload.entry[0]?.changes[0]?.value?.statuses) {
      console.log('Received status update notification, not processing as a message');
      return new Response(
        JSON.stringify({ status: 'Status update acknowledged' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Return 200 to acknowledge receipt
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
    // Note: WhatsApp sends phone numbers WITHOUT the + prefix, but our DB has them WITH the + prefix
    // We need to add a + to compare correctly or remove the + from the DB value when comparing
    const formattedPhoneNumber = `+${from}`;
    console.log(`Looking for user with phone number: ${formattedPhoneNumber}`);
    
    const { data: profiles, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id, full_name, assistant_id')
      .filter('phone', 'ilike', `%${from}%`) // Use ilike and % to find the number ignoring the + prefix
      .maybeSingle();

    if (profileError) {
      console.error('Error finding user profile:', profileError);
    }

    const userId = profiles?.id;
    const userName = profiles?.full_name || 'User';
    const assistantId = profiles?.assistant_id;
    
    if (!userId) {
      console.log(`No user found with phone number: ${from} (with or without + prefix)`);
      // We still proceed to store the message with a null user_id
    } else {
      console.log(`Found user with ID: ${userId} for phone number: ${from}`);
    }

    // Store the incoming message in the database
    const { data: insertData, error: insertError } = await supabaseClient
      .from('whatsapp_messages')
      .insert({
        user_id: userId || null,
        content: messageContent,
        type: 'user' // This is a message from the user
      });

    if (insertError) {
      console.error('Error inserting message:', insertError);
      throw new Error(`Failed to store message: ${insertError.message}`);
    } else {
      console.log('Successfully saved message to database');
    }

    // Fetch assistant information if we have an assistant_id
    let assistantName = "Coach";
    let assistantPersonality = "";
    
    if (assistantId) {
      // First query: Get the assistant name
      const { data: assistantData, error: assistantError } = await supabaseClient
        .from('assistants')
        .select('name, personality_id')
        .eq('id', assistantId)
        .maybeSingle();
        
      if (assistantError) {
        console.error('Error fetching assistant data:', assistantError);
      } else if (assistantData) {
        assistantName = assistantData.name || "Coach";
        
        // If we have a personality_id, get the personality behavior in a second query
        if (assistantData.personality_id) {
          const { data: personalityData, error: personalityError } = await supabaseClient
            .from('personalities')
            .select('behavior')
            .eq('id', assistantData.personality_id)
            .maybeSingle();
            
          if (personalityError) {
            console.error('Error fetching personality data:', personalityError);
          } else if (personalityData) {
            assistantPersonality = personalityData.behavior || "";
          }
        }
        
        console.log(`Using assistant: ${assistantName} with personality: ${assistantPersonality}`);
      }
    }

    // Fetch last 20 messages for this user to provide context
    let conversationHistory = [];
    if (userId) {
      const { data: messageHistory, error: messageHistoryError } = await supabaseClient
        .from('whatsapp_messages')
        .select('content, type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (messageHistoryError) {
        console.error('Error fetching message history:', messageHistoryError);
      } else if (messageHistory) {
        // Reverse to get chronological order
        conversationHistory = messageHistory.reverse().map(msg => {
          return {
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          };
        });
        console.log(`Retrieved ${conversationHistory.length} previous messages for context`);
      }
    }

    // Format conversation history for the prompt
    const conversationHistoryText = conversationHistory
      .map(msg => `${msg.role === 'user' ? userName : assistantName}: ${msg.content}`)
      .join('\n');

    // Define our function for OpenAI to call
    const functions = [
      {
        name: "generateCoachingResponse",
        description: "Generate a coaching response to the user",
        parameters: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "The message to send back to the user"
            },
          },
          required: ["message"]
        }
      }
    ];

    // Create ChatGPT prompt
    const prompt = `You are a coach responsible of keeping users accountable and motivated on their goals. Your name is: ${assistantName}. ${assistantPersonality ? `Your personality: ${assistantPersonality}.` : ''} The user name is: ${userName}. You are messaging the user on WhatsApp, this is the last message sent by the user: "${messageContent}". This is the conversation you are having so far:\n\n${conversationHistoryText}\n\nBased on the history of the conversation and the last user message, I want you to return a WhatsApp message reply that is helpful, motivational, and aligned with coaching the user toward their goals. Keep it conversational and friendly.`;

    console.log('Sending prompt to ChatGPT:', prompt);

    // Generate personalized response using ChatGPT with function calling
    let replyMessage = "Thank you for your message! Our AI coach will respond shortly."; // Default fallback

    try {
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'user', 
              content: prompt 
            }
          ],
          functions: functions,
          function_call: { name: "generateCoachingResponse" },
          max_tokens: 500,
        }),
      });

      if (openaiResponse.ok) {
        const openaiData = await openaiResponse.json();
        console.log('OpenAI Response:', JSON.stringify(openaiData));
        
        if (openaiData.choices && openaiData.choices.length > 0) {
          const functionCall = openaiData.choices[0].message.function_call;
          
          if (functionCall && functionCall.name === 'generateCoachingResponse') {
            try {
              const functionArgs = JSON.parse(functionCall.arguments);
              if (functionArgs.message) {
                replyMessage = functionArgs.message;
                console.log('Generated structured reply:', replyMessage);
              } else {
                console.error('Missing message in function arguments');
              }
            } catch (parseError) {
              console.error('Error parsing function arguments:', parseError);
            }
          } else {
            // Fallback for when function call format is not returned
            const content = openaiData.choices[0].message.content;
            if (content) {
              replyMessage = content;
              console.log('Generated fallback reply:', replyMessage);
            }
          }
        } else {
          console.error('Invalid response structure from OpenAI:', openaiData);
        }
      } else {
        console.error('Error from OpenAI API:', await openaiResponse.text());
      }
    } catch (openaiError) {
      console.error('Error calling OpenAI API:', openaiError);
    }

    // Call WhatsApp API to send the reply
    const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
    if (!phoneNumberId) {
      console.error('WHATSAPP_PHONE_NUMBER_ID is not set in environment variables');
      throw new Error('WHATSAPP_PHONE_NUMBER_ID is not set in environment variables');
    }
    
    const whatsappApiUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    console.log(`Sending reply to ${from} via WhatsApp API`);
    try {
      const response = await fetch(whatsappApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappApiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: from,
          type: 'text',
          text: {
            body: replyMessage
          }
        })
      });
      
      const responseData = await response.json();
      console.log('WhatsApp API response:', JSON.stringify(responseData));
      
      if (!response.ok) {
        console.error('Error sending WhatsApp message:', responseData);
      } else {
        console.log('Successfully sent WhatsApp reply');
      }
    } catch (error) {
      console.error('Error calling WhatsApp API:', error);
    }
    
    // Store the outgoing message in the database
    const { error: replyInsertError } = await supabaseClient
      .from('whatsapp_messages')
      .insert({
        user_id: userId || null,
        content: replyMessage,
        type: 'system' // This is a message from the system
      });

    if (replyInsertError) {
      console.error('Error inserting reply message:', replyInsertError);
    } else {
      console.log('Successfully saved reply message to database');
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
