/**
 * WhatsApp Webhook Handler
 * 
 * This edge function handles incoming WhatsApp messages and provides AI-powered responses.
 * 
 * Main functionality:
 * - Validates WhatsApp webhook verification requests
 * - Processes incoming user messages from WhatsApp
 * - Checks user subscription status and trial validity
 * - Generates personalized AI responses using OpenAI based on user's assistant and conversation history
 * - Detects and stores user achievements mentioned in messages
 * - Analyzes message importance for summary processing
 * - Sends responses back to users via WhatsApp API
 * - Stores all messages (incoming and outgoing) in the database
 * - Handles "/call" command to trigger instant calls
 */

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
    // Note: WhatsApp sends phone numbers WITHOUT the + prefix, but our DB has them WITH the + prefix
    // We need to add a + to compare correctly or remove the + from the DB value when comparing
    const formattedPhoneNumber = `+${from}`;
    console.log(`Looking for user with phone number: ${formattedPhoneNumber}`);
    
    const { data: profiles, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id, full_name, current_mode_id, subscription_status, trial_start_date, user_summary, timezone')
      .filter('phone', 'ilike', `%${from}%`) // Use ilike and % to find the number ignoring the + prefix
      .maybeSingle();

    if (profileError) {
      console.error('Error finding user profile:', profileError);
    }

    const userId = profiles?.id;
    const userName = profiles?.full_name || 'User';
    const currentModeId = profiles?.current_mode_id;
    const subscriptionStatus = profiles?.subscription_status;
    const trialStartDate = profiles?.trial_start_date;
    const userSummary = profiles?.user_summary;
    const userTimezone = profiles?.timezone || 'GMT';
    
    // Define default message for when user is not found or inactive
    const defaultMessage = "Sorry, it appears your phone number is either not registered in our system or doesn't have an active subscription. Please visit our website to register or reactivate your subscription.";
    
    // Store the incoming message in the database regardless of user status
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

    // Check if trial is still valid (within 7 days from trial_start_date)
    let isTrialValid = false;
    if (subscriptionStatus === 'trial' && trialStartDate) {
      const trialStart = new Date(trialStartDate);
      const currentDate = new Date();
      const trialDurationDays = 7;
      
      // Calculate difference in days
      const diffTime = currentDate.getTime() - trialStart.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      isTrialValid = diffDays < trialDurationDays;
      console.log(`Trial started on: ${trialStartDate}, days elapsed: ${diffDays}, trial valid: ${isTrialValid}`);
    }

    // Check if user exists and has an active subscription or valid trial
    if (!userId || (subscriptionStatus !== 'active' && !(subscriptionStatus === 'trial' && isTrialValid))) {
      console.log(`User not found or subscription not valid. User ID: ${userId}, Subscription Status: ${subscriptionStatus}, Trial valid: ${isTrialValid}`);
      
      // Call WhatsApp API to send the default message
      const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
      if (!phoneNumberId) {
        console.error('WHATSAPP_PHONE_NUMBER_ID is not set in environment variables');
        throw new Error('WHATSAPP_PHONE_NUMBER_ID is not set in environment variables');
      }
      
      const whatsappApiUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
      
      console.log(`Sending default message to ${from} via WhatsApp API`);
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
              body: defaultMessage
            }
          })
        });
        
        const responseData = await response.json();
        console.log('WhatsApp API response:', JSON.stringify(responseData));
        
        if (!response.ok) {
          console.error('Error sending WhatsApp message:', responseData);
        } else {
          console.log('Successfully sent WhatsApp default reply');
        }
      } catch (error) {
        console.error('Error calling WhatsApp API:', error);
      }
      
      // Store the outgoing default message in the database
      const { error: replyInsertError } = await supabaseClient
        .from('whatsapp_messages')
        .insert({
          user_id: userId || null,
          content: defaultMessage,
          type: 'system'
        });

      if (replyInsertError) {
        console.error('Error inserting reply message:', replyInsertError);
      } else {
        console.log('Successfully saved default reply message to database');
      }
      
      return new Response(
        JSON.stringify({ status: 'success', message: 'Default message sent' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Check if this is a "/call" command
    if (messageContent.trim() === '/call') {
      console.log(`User ${userId} requested instant call via /call command`);
      
      try {
        // Fetch the last 5 WhatsApp messages for this user to create context
        console.log(`Fetching last 5 WhatsApp messages for context creation`);
        const { data: recentMessages, error: messagesError } = await supabaseClient
          .from('whatsapp_messages')
          .select('content, type, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (messagesError) {
          console.error('Error fetching recent messages:', messagesError);
        }

        // Format the context from recent messages
        let callContext = '';
        if (recentMessages && recentMessages.length > 0) {
          console.log(`Found ${recentMessages.length} recent messages for context`);
          const contextMessages = recentMessages
            .reverse() // Get chronological order
            .map(msg => {
              const sender = msg.type === 'user' ? userName : 'Assistant';
              return `${sender}: ${msg.content}`;
            })
            .join('\n');
          
          callContext = `CONTEXT:\nYou are calling the user because they requested it during your recent WhatsApp conversation. Refer to the last 5 WhatsApp messages to understand the context, and continue the discussion or assist the user based on what was being talked about.\n\nRecent conversation:\n${contextMessages}`;
          console.log(`Created call context: ${callContext}`);
        } else {
          console.log('No recent messages found for context');
          callContext = 'CONTEXT:\nYou are calling the user because they requested it during your recent WhatsApp conversation.';
        }

        // Get current time in user's timezone
        const now = new Date();
        const localOptions = { timeZone: userTimezone };
        const localTimeString = now.toLocaleTimeString('en', localOptions);
        
        console.log(`Current time in user timezone ${userTimezone}: ${localTimeString}`);
        
        // Parse hours and minutes from local time
        const timeMatch = localTimeString.match(/(\d+):(\d+):(\d+) (AM|PM)/);
        
        if (!timeMatch) {
          console.error(`Failed to parse local time: ${localTimeString} for timezone ${userTimezone}`);
          throw new Error('Failed to parse current time');
        }
        
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const ampm = timeMatch[4];
        
        // Convert to 24-hour format
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        
        // Create time string for database (HH:MM:SS format)
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        
        console.log(`Creating scheduled call for time: ${timeString} in timezone ${userTimezone}`);
        
        // Create scheduled call record with context
        const { data: scheduledCall, error: scheduleError } = await supabaseClient
          .from('scheduled_calls')
          .insert({
            user_id: userId,
            time: timeString,
            mode_id: currentModeId,
            specific_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
            context: callContext
          })
          .select()
          .single();
          
        if (scheduleError) {
          console.error('Error creating scheduled call:', scheduleError);
          throw new Error(`Failed to create scheduled call: ${scheduleError.message}`);
        }
        
        console.log(`Successfully created scheduled call with ID: ${scheduledCall.id} and context`);
        
        // Call the get-scheduled-calls function to trigger the call with the specific call ID
        console.log('Calling get-scheduled-calls function to trigger instant call...');
        
        const { data: callResult, error: callError } = await supabaseClient.functions.invoke('get-scheduled-calls', {
          body: { callId: scheduledCall.id }
        });
        
        if (callError) {
          console.error('Error calling get-scheduled-calls function:', callError);
          throw new Error(`Failed to trigger call: ${callError.message}`);
        }
        
        console.log('Get-scheduled-calls function response:', callResult);
        
        // Check the response status to determine what message to send
        let confirmationMessage = "Perfect! I'm setting up your call right now. You should receive a call within the next few minutes.";
        
        if (callResult?.status && !callResult.status.success) {
          if (callResult.status.reason === 'weekly_limit_exceeded') {
            const limitInfo = callResult.status.limit_exceeded_users?.[0];
            if (limitInfo) {
              confirmationMessage = `Sorry, you've reached your weekly call limit of ${limitInfo.maxCalls} calls. You currently have ${limitInfo.currentCalls} calls this week. Your limit resets on Monday.`;
            } else {
              confirmationMessage = "Sorry, you've reached your weekly call limit. Your limit resets on Monday.";
            }
            console.log('Call not triggered due to weekly limit exceeded');
          } else {
            confirmationMessage = "Sorry, I encountered an issue setting up your call. Please try again in a moment.";
            console.log('Call not triggered for other reason:', callResult.status.reason);
          }
        } else {
          console.log('Call successfully triggered');
        }
        
        const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
        const whatsappApiUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
        
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
                body: confirmationMessage
              }
            })
          });
          
          const responseData = await response.json();
          console.log('WhatsApp API response for call confirmation:', JSON.stringify(responseData));
          
          if (!response.ok) {
            console.error('Error sending WhatsApp confirmation message:', responseData);
          } else {
            console.log('Successfully sent WhatsApp call confirmation');
          }
        } catch (error) {
          console.error('Error sending WhatsApp confirmation:', error);
        }
        
        // Store the confirmation message in the database
        const { error: confirmationInsertError } = await supabaseClient
          .from('whatsapp_messages')
          .insert({
            user_id: userId,
            content: confirmationMessage,
            type: 'system'
          });

        if (confirmationInsertError) {
          console.error('Error inserting confirmation message:', confirmationInsertError);
        } else {
          console.log('Successfully saved confirmation message to database');
        }
        
        return new Response(
          JSON.stringify({ status: 'success', message: 'Call request processed' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
        
      } catch (callSetupError) {
        console.error('Error setting up instant call:', callSetupError);
        
        // Send error message to user
        const errorMessage = "Sorry, I encountered an issue setting up your call. Please try again in a moment.";
        
        const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
        const whatsappApiUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
        
        try {
          await fetch(whatsappApiUrl, {
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
                body: errorMessage
              }
            })
          });
        } catch (error) {
          console.error('Error sending error message:', error);
        }
        
        return new Response(
          JSON.stringify({ status: 'error', message: 'Failed to set up call' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200, // Still return 200 to acknowledge receipt
          }
        );
      }
    }

    // If we get to this point, user exists and has an active subscription or valid trial, and it's not a /call command

    // Fetch assistant information from mode preferences based on user's current mode
    let assistantName = "Coach";
    let assistantPersonality = "";
    let assistantId = null;
    
    if (currentModeId) {
      // Get assistant_id from mode_preferences for the user's current mode
      const { data: modePreferenceData, error: modePreferenceError } = await supabaseClient
        .from('mode_preferences')
        .select('assistant_id')
        .eq('user_id', userId)
        .eq('mode_id', currentModeId)
        .maybeSingle();
        
      if (modePreferenceError) {
        console.error('Error fetching mode preference:', modePreferenceError);
      } else if (modePreferenceData && modePreferenceData.assistant_id) {
        assistantId = modePreferenceData.assistant_id;
        console.log(`Found assistant ID ${assistantId} from mode preferences for mode ${currentModeId}`);
        
        // Get assistant details
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
      } else {
        console.log(`No mode preference found for user ${userId} and mode ${currentModeId}, using default assistant`);
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

    // Define our function for OpenAI to call with updated schema to include achievements
    const functions = [
      {
        name: "generateCoachingResponse",
        description: "Generate a coaching response to the user and identify any achievements mentioned",
        parameters: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "The message to send back to the user"
            },
            achievements: {
              type: "array",
              description: "List of achievements mentioned in the user's LAST message only",
              items: {
                type: "object",
                properties: {
                  description: {
                    type: "string",
                    description: "Description of the achievement"
                  },
                  type: {
                    type: "string",
                    description: "Type of achievement: 'achievement' (small achievement), 'milestone', or 'breakthrough'",
                    enum: ["achievement", "milestone", "breakthrough"]
                  }
                },
                required: ["description", "type"]
              }
            }
          },
          required: ["message"]
        }
      }
    ];

    // Fetch the coaching prompt from the database
    const { data: promptData, error: promptError } = await supabaseClient
      .from('system_prompts')
      .select('prompt_text')
      .eq('name', 'whatsapp_coaching_response')
      .maybeSingle();

    if (promptError) {
      console.error('Error fetching whatsapp_coaching_response prompt:', promptError);
    }

    let prompt = `
Your name is: ${assistantName}. ${assistantPersonality ? `Your personality: ${assistantPersonality}.` : ''} 
The user name is: ${userName}. You are messaging the user on WhatsApp, this is the last message sent by the user: "${messageContent}". 

User Summary (what you know about the user from past conversations):
${userSummary || 'No summary available yet'}

This is the conversation you are having so far:

${conversationHistoryText}

Based on the history of the conversation and the last user message, I want you to:
1. Return a WhatsApp message reply that is aligned with your personality.
2. Identify any achievements the user mentions in their LAST message only (not from previous messages in the conversation history).

VERY IMPORTANT: Only identify achievements that the user EXPLICITLY mentions they have COMPLETED or ACCOMPLISHED in their LAST message. Do not infer achievements from goals or plans.

Types of achievements:
- "achievement": Small wins or regular progress (e.g., "I went for a run today")
- "milestone": Significant progress markers (e.g., "I completed my first 5K race")
- "breakthrough": Major transformative accomplishments (e.g., "I finally qualified for the marathon after years of training")

Don't write super long messages — it's WhatsApp, so keep it easy to read. If you detect achievements, still keep your reply natural without explicitly mentioning that you're recording them.

If the user asks about your capabilities, say:
I automatically check in with you about 3 times a day to support your progress.
You set your coaching goals and schedule calls from the website.
If you want to talk right away, just type /call in the chat, and I’ll call you.
You can message me on WhatsApp anytime you want.
You can track your progress and achievements on your dashboard.
If you want to delete your account, you’ll need to contact support through the website.


`;

    // Use database prompt if available, otherwise use fallback
    if (promptData && promptData.prompt_text) {
      prompt = promptData.prompt_text
        .replace('${assistantName}', assistantName)
        .replace('${assistantPersonality}', assistantPersonality ? `Your personality: ${assistantPersonality}.` : '')
        .replace('${userName}', userName)
        .replace('${messageContent}', messageContent)
        .replace('${userSummary}', userSummary || 'No summary available yet')
        .replace('${conversationHistoryText}', conversationHistoryText);
      console.log('Using database prompt for coaching response');
    } else {
      console.log('Using fallback prompt for coaching response');
    }

    console.log('Sending prompt to ChatGPT:', prompt);

    // Generate personalized response using ChatGPT with function calling
    let replyMessage = "Thank you for your message! Our AI coach will respond shortly."; // Default fallback
    let achievements = [];

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
              
              // Extract achievements if available
              if (functionArgs.achievements && Array.isArray(functionArgs.achievements)) {
                achievements = functionArgs.achievements;
                console.log('Detected achievements:', JSON.stringify(achievements));
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

    // Store any detected achievements in the database
    if (userId && achievements.length > 0) {
      console.log(`Storing ${achievements.length} achievements for user ${userId}`);
      
      const achievementPromises = achievements.map(achievement => {
        return supabaseClient
          .from('user_achievements')
          .insert({
            user_id: userId,
            description: achievement.description,
            type: achievement.type,
            achievement_date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
          });
      });
      
      try {
        const achievementResults = await Promise.all(achievementPromises);
        const errors = achievementResults.filter(result => result.error).map(result => result.error);
        
        if (errors.length > 0) {
          console.error('Errors storing some achievements:', errors);
        } else {
          console.log('Successfully stored all achievements');
        }
      } catch (achievementError) {
        console.error('Error storing achievements:', achievementError);
      }
    }

    // Analyze message importance using OpenAI with function calling
    let isImportant = 0; // Default to not important
    if (userId && messageContent !== '[Media message]') {
      console.log('Analyzing message importance...');
      
      // Fetch the user_text_analyze prompt from database
      const { data: promptData, error: promptError } = await supabaseClient
        .from('system_prompts')
        .select('prompt_text')
        .eq('name', 'user_text_analyze')
        .maybeSingle();

      if (promptError) {
        console.error('Error fetching user_text_analyze prompt:', promptError);
      }

      let importancePrompt = `Analyze the user's message and decide whether it contains meaningful personal information that should be remembered to help an AI assistant have more personal, continuous, or emotionally intelligent conversations in the future. Ignore generic, shallow, or impersonal messages.

user last message: ${messageContent}

Return one of:

"1" if it contains anything personal, emotional, identity-revealing, or memory-worthy

"0" if it doesn't`;

      // Use database prompt if available, otherwise use fallback
      if (promptData && promptData.prompt_text) {
        importancePrompt = promptData.prompt_text.replace('${messageContent}', messageContent);
        console.log('Using database prompt for importance analysis');
      } else {
        console.log('Using fallback prompt for importance analysis');
      }

      // Define function for importance analysis
      const importanceFunctions = [
        {
          name: "analyzeMessageImportance",
          description: "Analyze if a message contains important personal information",
          parameters: {
            type: "object",
            properties: {
              is_important: {
                type: "integer",
                description: "1 if the message contains meaningful personal information, 0 if it doesn't",
                enum: [0, 1]
              }
            },
            required: ["is_important"]
          }
        }
      ];

      try {
        const importanceResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                content: importancePrompt 
              }
            ],
            functions: importanceFunctions,
            function_call: { name: "analyzeMessageImportance" },
            max_tokens: 10,
            temperature: 0,
          }),
        });

        if (importanceResponse.ok) {
          const importanceData = await importanceResponse.json();
          console.log('Importance analysis response:', JSON.stringify(importanceData));
          
          if (importanceData.choices && importanceData.choices.length > 0) {
            const functionCall = importanceData.choices[0].message.function_call;
            
            if (functionCall && functionCall.name === 'analyzeMessageImportance') {
              try {
                const functionArgs = JSON.parse(functionCall.arguments);
                if (typeof functionArgs.is_important === 'number') {
                  isImportant = functionArgs.is_important;
                  console.log(`Message importance analyzed: ${isImportant}`);
                } else {
                  console.error('Invalid is_important value:', functionArgs.is_important);
                }
              } catch (parseError) {
                console.error('Error parsing importance function arguments:', parseError);
              }
            } else {
              console.error('Function call not found in importance response');
            }
          }
        } else {
          console.error('Error from OpenAI importance analysis:', await importanceResponse.text());
        }
      } catch (importanceError) {
        console.error('Error analyzing message importance:', importanceError);
      }

      // Update the message importance in the database
      const { error: updateError } = await supabaseClient
        .from('whatsapp_messages')
        .update({ is_important: isImportant })
        .eq('user_id', userId)
        .eq('content', messageContent)
        .eq('type', 'user')
        .order('created_at', { ascending: false })
        .limit(1);

      if (updateError) {
        console.error('Error updating message importance:', updateError);
      } else {
        console.log(`Successfully updated message importance to ${isImportant}`);
      }
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
