
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

const ModeSwitcher = () => {
  const location = useLocation();
  const theme = useTheme();
  
  const modes = [
    { id: 'accountability', label: 'ACCOUNTABILITY', path: '/' },
    { id: 'custom', label: 'CHAT', path: '/custom' },
    { id: 'mindfulness', label: 'MINDFULNESS', path: '/mindfulness' }
  ];
  
  const getCurrentMode = () => {
    if (location.pathname === '/mindfulness') return 'mindfulness';
    if (location.pathname === '/custom') return 'custom';
    return 'accountability';
  };
  
  const currentMode = getCurrentMode();
  
  return (
    <div className="flex items-center justify-center space-x-8 py-4">
      {modes.map((mode) => {
        const isActive = mode.id === currentMode;
        return (
          <Link
            key={mode.id}
            to={mode.path}
            className={`relative text-sm font-medium transition-colors ${
              isActive ? theme.primary : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {mode.label}
            {isActive && (
              <div className={`absolute -bottom-1 left-0 right-0 h-0.5 ${theme.progressBg}`} />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default ModeSwitcher;
