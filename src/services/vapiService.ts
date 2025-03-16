
import { supabase } from "@/integrations/supabase/client";

export type VapiRequestOptions = {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
};

/**
 * Makes a request to the Vapi API via our secure Supabase Edge Function
 */
export async function callVapi(options: VapiRequestOptions) {
  try {
    const { endpoint, method = 'GET', body } = options;
    
    const { data, error } = await supabase.functions.invoke('vapi-proxy', {
      body: {
        endpoint,
        method,
        body,
      },
    });

    if (error) {
      console.error('Error calling Vapi API:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Exception calling Vapi API:', error);
    return { data: null, error };
  }
}

/**
 * Test function to check if the Vapi API key is working
 */
export async function testVapiConnection() {
  return callVapi({
    endpoint: 'assistants',
    method: 'GET',
  });
}
