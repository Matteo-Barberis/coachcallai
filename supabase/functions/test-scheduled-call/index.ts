
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Default test user ID
const DEFAULT_TEST_USER = "c5efe2e1-9065-407c-a4bb-4207cfcc608f";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting test-scheduled-call function...');
    
    // Parse request body if any
    let userId = DEFAULT_TEST_USER;
    
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      if (body && body.userId) {
        userId = body.userId;
      }
    }
    
    console.log(`Using test user ID: ${userId}`);

    // Create Supabase client with service role key for admin privileges
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    console.log(`Using Supabase URL: ${supabaseUrl}`);
    
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);
    console.log('Supabase client created successfully');

    // Verify the user exists and get their current mode_id
    console.log(`Verifying user ${userId} exists and fetching their current mode_id...`);
    const { data: userData, error: userError } = await supabaseClient
      .from('profiles')
      .select('id, full_name, phone, current_mode_id')
      .eq('id', userId)
      .single();
      
    if (userError || !userData) {
      console.error('User not found:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }
    
    console.log(`Found test user: ${userData.full_name || userId}`);
    
    if (!userData.phone) {
      console.error('Test user does not have a phone number set');
      return new Response(
        JSON.stringify({ error: 'Test user does not have a phone number set' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Get the user's current mode_id
    const modeId = userData.current_mode_id;
    console.log(`User's current mode_id: ${modeId || 'None'}`);
    
    // Find a random template that matches the user's mode_id
    let templateId = null;
    
    if (modeId) {
      console.log(`Looking for templates matching mode_id: ${modeId}`);
      const { data: templatesData, error: templatesError } = await supabaseClient
        .from('templates')
        .select('id')
        .eq('mode_id', modeId);
        
      if (templatesError) {
        console.error('Error fetching templates:', templatesError);
      } else if (templatesData && templatesData.length > 0) {
        // Select a random template from the matching ones
        const randomIndex = Math.floor(Math.random() * templatesData.length);
        templateId = templatesData[randomIndex].id;
        console.log(`Selected random template with ID: ${templateId}`);
      } else {
        console.log(`No templates found for mode_id: ${modeId}, will proceed without template`);
      }
    } else {
      console.log('User has no current mode_id set, proceeding without mode-specific template');
    }

    // Create a scheduled call for the current time
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 8); // HH:MM:SS format
    
    console.log(`Creating test scheduled call for user ${userId} at time ${currentTime} on date ${now.toISOString().substring(0, 10)}`);
    
    const scheduleCallData = {
      user_id: userId,
      time: currentTime,
      specific_date: now.toISOString().substring(0, 10), // YYYY-MM-DD format
      execution_timestamp: now.toISOString(), // Store the exact execution time
      mode_id: modeId, // Set the mode_id from the user's profile
      template_id: templateId // Set the template_id if one was found
    };
    
    // Log the data being used to create the scheduled call
    console.log('Creating scheduled call with data:', JSON.stringify(scheduleCallData));
    
    const { data: scheduleData, error: scheduleError } = await supabaseClient
      .from('scheduled_calls')
      .insert(scheduleCallData)
      .select()
      .single();
      
    if (scheduleError) {
      console.error('Error creating scheduled call:', scheduleError);
      return new Response(
        JSON.stringify({ error: scheduleError.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    console.log(`Successfully created scheduled call with ID: ${scheduleData.id}`);

    // Now trigger the get-scheduled-calls function to execute the call
    console.log('Triggering get-scheduled-calls function...');
    
    const functionResponse = await fetch(`${supabaseUrl}/functions/v1/get-scheduled-calls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`
      }
    });
    
    if (!functionResponse.ok) {
      const errorText = await functionResponse.text();
      console.error('Error from get-scheduled-calls function:', errorText);
      return new Response(
        JSON.stringify({ error: 'Error executing scheduled call', details: errorText }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    const functionResult = await functionResponse.json();
    console.log('Successfully executed get-scheduled-calls function');
    
    // Check if our scheduled call was processed
    const processedCall = functionResult.data?.find(call => call.id === scheduleData.id);
    
    // Return the complete result
    return new Response(
      JSON.stringify({
        message: 'Test scheduled call created and executed',
        scheduleCallId: scheduleData.id,
        wasProcessed: !!processedCall,
        scheduleCallData: scheduleData,
        functionResult,
        userModeId: modeId,
        selectedTemplateId: templateId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Unexpected error in test-scheduled-call function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
