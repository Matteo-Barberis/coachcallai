
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

  const getBadgeStyles = (modeName: string) => {
    switch (modeName.toLowerCase()) {
      case 'mindfulness':
        return 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700';
      case 'accountability':
        return 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700';
      case 'custom':
        return 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700';
      default:
        return 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700';
    }
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
          className={`ml-3 cursor-pointer transition-colors ${getBadgeStyles(modeName)}`}
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
