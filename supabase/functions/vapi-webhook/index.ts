
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
    // Validate the request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405,
        }
      );
    }

    // Verify webhook secret if configured
    const webhookSecret = Deno.env.get('VAPI_WEBHOOK_SECRET');
    if (webhookSecret) {
      const authHeader = req.headers.get('authorization') || '';
      const token = authHeader.replace('Bearer ', '');
      
      if (token !== webhookSecret) {
        console.error('Invalid webhook secret');
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
          }
        );
      }
    }

    // Parse the webhook payload
    const payload = await req.json();
    console.log('Received webhook payload:', JSON.stringify(payload));

    // Extract the required data from the webhook payload
    const message = payload.message;
    if (!message || message.type !== 'end-of-call-report') {
      console.error('Invalid webhook payload format or not an end-of-call report');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook payload' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Extract call information
    const vapiCallId = message.call?.id;
    if (!vapiCallId) {
      console.error('Missing Vapi call ID in the webhook payload');
      return new Response(
        JSON.stringify({ error: 'Missing Vapi call ID' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const callSummary = message.summary || '';
    const endedReason = message.endedReason || 'unknown';
    const recordingUrl = message.recordingUrl || null;
    const transcript = message.transcript || '';
    const messages = message.messages || [];

    console.log(`Processing webhook for Vapi call ID: ${vapiCallId}`);
    console.log(`Call summary: ${callSummary.substring(0, 100)}...`);

    // Create Supabase client with admin privileges using service role key
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    );

    // Find the call log entry with the matching Vapi call ID
    console.log(`Looking for call log with Vapi call ID: ${vapiCallId}`);
    const { data: existingCallLog, error: lookupError } = await supabaseClient
      .from('call_logs')
      .select('id, scheduled_call_id')
      .eq('vapi_call_id', vapiCallId)
      .single();

    if (lookupError) {
      console.error('Error looking up call log:', lookupError);
      return new Response(
        JSON.stringify({ error: `Failed to find call log with Vapi call ID: ${vapiCallId}` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    if (!existingCallLog) {
      console.error(`No call log found with Vapi call ID: ${vapiCallId}`);
      return new Response(
        JSON.stringify({ error: `No call log found with Vapi call ID: ${vapiCallId}` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    console.log(`Found call log with ID: ${existingCallLog.id}`);

    // Update the call log with the summary information
    const { error: updateError } = await supabaseClient
      .from('call_logs')
      .update({
        call_summary: callSummary,
        status: 'completed',
        response: {
          ...message,
          endedReason,
          recordingUrl,
          transcript,
          messages
        }
      })
      .eq('id', existingCallLog.id);

    if (updateError) {
      console.error('Error updating call log:', updateError);
      return new Response(
        JSON.stringify({ error: `Failed to update call log: ${updateError.message}` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    console.log(`Successfully updated call log ${existingCallLog.id} with summary`);
    
    // Return a success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Call summary recorded successfully',
        callLogId: existingCallLog.id,
        scheduledCallId: existingCallLog.scheduled_call_id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Unexpected error in vapi-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
