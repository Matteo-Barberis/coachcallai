
import { useLocation } from "react-router-dom";
import { themes, type ThemeKey, type ThemeColors } from "@/config/themes";

// Define the neutral brand theme for non-mode pages
const neutralBrandTheme: ThemeColors = {
  titleGradient: 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent',
  gradient: 'bg-gradient-to-r from-gray-800 to-gray-600',
  primary: 'text-gray-800',
  border: 'border-gray-800',
  bg: 'bg-gray-50',
  hover: 'hover:bg-gray-50',
  light: 'bg-gray-50',
  lightText: 'text-gray-800',
  progressBg: 'bg-gray-800',
  darkGradient: 'bg-gradient-to-r from-gray-900 to-gray-700',
  hoverPrimary: 'hover:text-gray-900'
};

export type ThemeWithBrand = ThemeColors & {
  brandPrimary: string;
};

export const useTheme = (): ThemeWithBrand => {
  const location = useLocation();
  
  const getCurrentTheme = (): ThemeKey | null => {
    if (location.pathname === '/mindfulness') {
      return 'mindfulness';
    } else if (location.pathname === '/accountability') {
      return 'accountability';
    } else if (location.pathname === '/custom') {
      return 'custom';
    } else {
      return null; // Use neutral brand theme
    }
  };

  const themeKey = getCurrentTheme();
  const baseTheme = themeKey ? themes[themeKey] : neutralBrandTheme;

  return {
    ...baseTheme,
    brandPrimary: 'text-gray-800' // Consistent brand color for navbar/UI chrome
  };
};
