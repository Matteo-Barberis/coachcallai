
import React, { useState, useEffect } from 'react';
import { useSessionContext } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";
import { Phone } from "lucide-react";

interface CallUsageData {
  callsThisWeek: number;
  maxCallsPerWeek: number;
  isOverLimit: boolean;
}

const CallUsageIndicator = () => {
  const { session, userProfile } = useSessionContext();
  const [callUsage, setCallUsage] = useState<CallUsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCallUsage = async () => {
      if (!session?.user.id || !userProfile) return;

      try {
        // Call the database function to get weekly calls count
        const { data: callsThisWeek, error: callError } = await supabase.rpc('get_user_weekly_calls', {
          p_user_id: session.user.id
        });

        if (callError) {
          console.error('Error fetching call count:', callError);
          return;
        }

        console.log('Database function returned calls this week:', callsThisWeek);

        // Determine max calls based on subscription
        let maxCallsPerWeek = 3; // Default for trial

        if (userProfile.subscription_status === 'active' && userProfile.subscription_plan_id) {
          const { data: planLimits, error: limitsError } = await supabase
            .from('subscription_plan_limits')
            .select('max_calls_per_week')
            .eq('subscription_plan_id', userProfile.subscription_plan_id)
            .single();

          if (!limitsError && planLimits) {
            maxCallsPerWeek = planLimits.max_calls_per_week;
          }
        }

        setCallUsage({
          callsThisWeek,
          maxCallsPerWeek,
          isOverLimit: callsThisWeek >= maxCallsPerWeek
        });
      } catch (error) {
        console.error('Error calculating call usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCallUsage();
  }, [session?.user.id, userProfile]);

  if (loading || !callUsage) return null;

  const { callsThisWeek, maxCallsPerWeek, isOverLimit } = callUsage;

  return (
    <Badge 
      variant={isOverLimit ? "destructive" : "secondary"} 
      className="flex items-center gap-1 text-xs"
    >
      <Phone className="h-3 w-3" />
      {callsThisWeek}/{maxCallsPerWeek} calls this week
    </Badge>
  );
};

export default CallUsageIndicator;
