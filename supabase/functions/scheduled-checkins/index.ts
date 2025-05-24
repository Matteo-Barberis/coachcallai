
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
import { format } from "https://deno.land/std@0.168.0/datetime/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Time windows for check-ins (in hours and minutes)
const checkInWindows = [
  { type: 'morning', templateId: 'morning_checkin_personal', startHour: 7, startMinute: 45, endHour: 8, endMinute: 45 },
  { type: 'midday', templateId: 'midday_checkin_personal', startHour: 12, startMinute: 45, endHour: 13, endMinute: 15 },
  { type: 'evening', templateId: 'evening_checkin_personal', startHour: 19, startMinute: 30, endHour: 20, endMinute: 45 }
];

// Template message content mapping
const templateMessages = {
  'morning_checkin_personal': 'Good morning! Ready to tackle your goals today? Let me know how I can support you.',
  'midday_checkin_personal': 'Hey, it\'s midday already! How\'s your day going so far? Need any help staying on track?',
  'evening_checkin_personal': 'Good evening! How did your day go?'
};

// Regular text messages for within 24h window (with placeholders for user names)
const regularTextMessages = {
  'morning': 'Good morning {{name}}! Ready to tackle your goals today? Let me know how I can support you.',
  'midday': 'Hey {{name}}, it\'s midday already! How\'s your day going so far? Need any help staying on track?',
  'evening': 'Good evening {{name}}! How did your day go?'
};

// Log immediately when the function is loaded
console.log("Scheduled WhatsApp check-ins function is starting up...");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] Scheduled check-ins function called`);

    // Get the WhatsApp API token from environment variables
    const whatsappApiToken = Deno.env.get('WHATSAPP_API_TOKEN');
    const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
    
    if (!whatsappApiToken) {
      throw new Error('WHATSAPP_API_TOKEN is not set in environment variables');
    }
    
    if (!phoneNumberId) {
      throw new Error('WHATSAPP_PHONE_NUMBER_ID is not set in environment variables');
    }

    // Initialize Supabase client
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    console.log(`[${new Date().toISOString()}] Creating Supabase client with URL: ${supabaseUrl}`);

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get all unique timezones from the database
    console.log(`[${new Date().toISOString()}] Fetching unique timezones from profiles...`);
    
    const { data: timezoneObjects, error: timezonesError } = await supabase
      .from('profiles')
      .select('timezone')
      .not('phone', 'is', null);

    if (timezonesError) {
      console.error(`[${new Date().toISOString()}] Error fetching timezones:`, timezonesError);
      throw new Error(`Failed to fetch timezones: ${timezonesError.message}`);
    }
    
    // Extract unique timezones from the results
    const uniqueTimezones = [...new Set(timezoneObjects.map(obj => obj.timezone))];
    const timezones = uniqueTimezones.map(timezone => ({ timezone }));

    console.log(`[${new Date().toISOString()}] Found ${timezones.length} unique timezones`);
    console.log(`[${new Date().toISOString()}] Timezones found:`, uniqueTimezones);
    
    // Process each timezone
    let messagesSent = 0;
    const processingResults = [];

    for (const timezoneObj of timezones) {
      const timezone = timezoneObj.timezone;
      
      try {
        // Determine current time in this timezone
        const now = new Date();
        const localOptions = { timeZone: timezone };
        
        // Log current time in this timezone
        const localTimeString = now.toLocaleTimeString('en', localOptions);
        console.log(`[${new Date().toISOString()}] Current time in ${timezone}: ${localTimeString}`);
        
        // Parse hours and minutes from local time
        const timeMatch = localTimeString.match(/(\d+):(\d+):(\d+) (AM|PM)/);
        
        if (!timeMatch) {
          console.error(`[${new Date().toISOString()}] Failed to parse local time: ${localTimeString} for timezone ${timezone}`);
          continue;
        }
        
        let hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const ampm = timeMatch[4];
        
        // Convert to 24-hour format
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        
        // Enhanced logging for timezone time
        console.log(`[${new Date().toISOString()}] Current time in ${timezone}: ${hours}:${minutes} (${localTimeString})`);
        
        // Check if current time falls within any check-in window
        for (const window of checkInWindows) {
          const isInWindow = isTimeInWindow(hours, minutes, window.startHour, window.startMinute, window.endHour, window.endMinute);
          
          if (isInWindow) {
            console.log(`[${new Date().toISOString()}] Time in ${timezone} falls within ${window.type} check-in window`);
            
            const { data: users, error: usersError } = await supabase
              .from('profiles')
              .select('id, full_name, phone, timezone')
              .eq('timezone', timezone)
              .not('phone', 'is', null);
            
            if (usersError) {
              console.error(`[${new Date().toISOString()}] Error fetching users for timezone ${timezone}:`, usersError);
              continue;
            }
            
            console.log(`[${new Date().toISOString()}] Found ${users.length} users in timezone ${timezone}`);
            
            // Process each user
            for (const user of users) {
              try {
                // Get user's latest WhatsApp message - only fetch user-type messages
                const { data: latestMessages, error: messagesError } = await supabase
                  .from('whatsapp_messages')
                  .select('created_at')
                  .eq('user_id', user.id)
                  .eq('type', 'user')
                  .order('created_at', { ascending: false })
                  .limit(1);
                
                if (messagesError) {
                  console.error(`[${new Date().toISOString()}] Error fetching messages for user ${user.id}:`, messagesError);
                  continue;
                }
                
                const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
                
                let shouldSendMessage = false;
                let useTemplate = false;
                
                // If the user has message history, check the time window
                if (latestMessages.length > 0) {
                  const latestMessageTime = new Date(latestMessages[0].created_at);
                  
                  if (latestMessageTime > twentyFourHoursAgo) {
                    // Within 24 hours - send regular text message
                    shouldSendMessage = true;
                    useTemplate = false;
                    console.log(`[${new Date().toISOString()}] User ${user.id}'s last message was within 24h, sending regular text message`);
                  } else if (latestMessageTime > fortyEightHoursAgo) {
                    // Between 24-48 hours - send template message
                    shouldSendMessage = true;
                    useTemplate = true;
                    console.log(`[${new Date().toISOString()}] User ${user.id}'s last message was between 24-48h, sending template message`);
                  } else {
                    // Past 48 hours - don't send anything
                    console.log(`[${new Date().toISOString()}] User ${user.id}'s last message was over 48h ago, not sending check-in`);
                  }
                } else {
                  // User has no user-type message history, don't send a check-in
                  console.log(`[${new Date().toISOString()}] User ${user.id} has no user message history, skipping check-in`);
                }
                
                if (shouldSendMessage) {
                  // Format phone number (remove + prefix if present as WhatsApp API doesn't expect it)
                  const phoneNumber = user.phone.startsWith('+') ? user.phone.substring(1) : user.phone;
                  
                  // Get the user's first name or full name to use as parameter
                  const userName = user.full_name ? user.full_name.split(' ')[0] : 'there';
                  
                  let result;
                  let messageContent;
                  
                  if (useTemplate) {
                    // Send WhatsApp template message
                    result = await sendWhatsAppTemplateMessage(
                      phoneNumber,
                      window.templateId,
                      whatsappApiToken,
                      phoneNumberId,
                      userName
                    );
                    messageContent = templateMessages[window.templateId];
                  } else {
                    // Send regular text message
                    const textMessage = regularTextMessages[window.type].replace('{{name}}', userName);
                    result = await sendWhatsAppTextMessage(
                      phoneNumber,
                      textMessage,
                      whatsappApiToken,
                      phoneNumberId
                    );
                    messageContent = textMessage;
                  }
                  
                  if (result.success) {
                    messagesSent++;
                    console.log(`[${new Date().toISOString()}] Successfully sent ${window.type} check-in to ${phoneNumber} using ${useTemplate ? 'template' : 'text'} message`);
                    
                    // Store the sent message in the database as a system message
                    if (messageContent) {
                      const { error: storeMessageError } = await supabase
                        .from('whatsapp_messages')
                        .insert({
                          user_id: user.id,
                          content: messageContent,
                          type: 'system'
                        });
                        
                      if (storeMessageError) {
                        console.error(`[${new Date().toISOString()}] Error storing message for user ${user.id}:`, storeMessageError);
                      } else {
                        console.log(`[${new Date().toISOString()}] Successfully stored message in database for user ${user.id}`);
                      }
                    }
                  } else {
                    console.error(`[${new Date().toISOString()}] Failed to send ${window.type} check-in to ${phoneNumber}: ${result.error}`);
                  }
                  
                  processingResults.push({
                    userId: user.id,
                    phone: phoneNumber,
                    timezone: timezone,
                    template: useTemplate ? window.templateId : 'text_message',
                    result: result.success ? 'sent' : 'failed',
                    error: result.error || null
                  });
                }
              } catch (userError) {
                console.error(`[${new Date().toISOString()}] Error processing user ${user.id}:`, userError);
                processingResults.push({
                  userId: user.id,
                  result: 'error',
                  error: userError.message
                });
              }
            }
          }
        }
      } catch (timezoneError) {
        console.error(`[${new Date().toISOString()}] Error processing timezone ${timezone}:`, timezoneError);
        processingResults.push({
          timezone: timezone,
          result: 'error',
          error: timezoneError.message
        });
      }
    }
    
    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;
    
    console.log(`[${new Date().toISOString()}] Check-ins function completed in ${executionTime}s, sent ${messagesSent} messages`);
    
    return new Response(
      JSON.stringify({
        status: 'success',
        message: `Processed ${timezones.length} timezones, sent ${messagesSent} messages`,
        executionTime: `${executionTime}s`,
        results: processingResults
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in scheduled check-ins function:`, error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

/**
 * Check if a time falls within a specified window
 */
function isTimeInWindow(hours: number, minutes: number, startHour: number, startMinute: number, endHour: number, endMinute: number): boolean {
  const time = hours * 60 + minutes;
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  return time >= startTime && time <= endTime;
}

/**
 * Send a WhatsApp regular text message
 */
async function sendWhatsAppTextMessage(
  to: string,
  message: string,
  whatsappToken: string,
  phoneNumberId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const whatsappApiUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    const response = await fetch(whatsappApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: {
          body: message
        }
      })
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Error sending WhatsApp text message:', responseData);
      return { success: false, error: JSON.stringify(responseData) };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception sending WhatsApp text message:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send a WhatsApp template message
 */
async function sendWhatsAppTemplateMessage(
  to: string,
  templateId: string,
  whatsappToken: string,
  phoneNumberId: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const whatsappApiUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    const response = await fetch(whatsappApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'template',
        template: {
          name: templateId,
          language: {
            code: 'en'
          },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: userName
                }
              ]
            }
          ]
        }
      })
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Error sending WhatsApp template message:', responseData);
      return { success: false, error: JSON.stringify(responseData) };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception sending WhatsApp template message:', error);
    return { success: false, error: error.message };
  }
}
