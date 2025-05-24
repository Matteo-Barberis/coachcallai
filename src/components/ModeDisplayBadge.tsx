
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModeDisplayBadgeProps {
  modeId: string | null | undefined;
}

const ModeDisplayBadge = ({ modeId }: ModeDisplayBadgeProps) => {
  const [modeName, setModeName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModeName = async () => {
      if (!modeId) {
        setModeName('Default');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('modes')
          .select('name')
          .eq('id', modeId)
          .single();

        if (error) {
          console.error('Error fetching mode:', error);
          setModeName('Default');
        } else {
          setModeName(data.name);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setModeName('Default');
      } finally {
        setLoading(false);
      }
    };

    fetchModeName();
  }, [modeId]);

  const handleClick = () => {
    navigate('/account');
  };

  if (loading) {
    return (
      <Badge variant="outline" className="ml-3 animate-pulse">
        Loading...
      </Badge>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant="outline" 
          className="ml-3 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleClick}
        >
          {modeName}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>Currently in {modeName} mode • Change in Account Settings</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ModeDisplayBadge;
