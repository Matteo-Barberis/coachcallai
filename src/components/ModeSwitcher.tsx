
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { ChevronDown } from 'lucide-react';

const ModeSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const modes = [
    { key: 'custom', label: 'CUSTOM', path: '/' },
    { key: 'accountability', label: 'ACCOUNTABILITY', path: '/accountability' },
    { key: 'mindfulness', label: 'MINDFULNESS', path: '/mindfulness' }
  ];

  const getCurrentMode = () => {
    if (location.pathname === '/mindfulness') return 'mindfulness';
    if (location.pathname === '/accountability') return 'accountability';
    return 'custom';
  };

  const currentMode = getCurrentMode();

  const getUnderlineColor = (mode) => {
    if (mode === 'mindfulness') return 'bg-purple-600';
    if (mode === 'accountability') return 'bg-blue-600';
    return theme.progressBg; // Uses theme color for custom mode
  };

  return (
    <div className="mb-8">
      {/* Simple indicator */}
      <div className="flex items-center justify-center mb-3">
        <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          <span>3 Modes Available</span>
          <ChevronDown className="w-3 h-3" />
        </div>
      </div>
      
      {/* Mode switcher */}
      <div className="flex items-center space-x-8 text-sm font-medium text-gray-500">
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => navigate(mode.path)}
            className={`relative pb-2 transition-colors hover:text-gray-700 ${
              currentMode === mode.key ? 'text-gray-900' : ''
            }`}
          >
            {mode.label}
            {currentMode === mode.key && (
              <div 
                className={`absolute bottom-0 left-0 right-0 h-0.5 ${getUnderlineColor(mode.key)}`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSwitcher;
