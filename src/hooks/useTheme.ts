
import { useLocation } from "react-router-dom";
import { themes, type ThemeKey, type ThemeColors } from "@/config/themes";

export interface ThemeWithBrand extends ThemeColors {
  brandPrimary: string;
  brandPrimaryHover: string;
}

export const useTheme = (): ThemeWithBrand => {
  const location = useLocation();
  
  const getCurrentTheme = (): ThemeKey => {
    if (location.pathname === '/mindfulness') {
      return 'mindfulness';
    } else if (location.pathname === '/accountability') {
      return 'accountability';
    } else if (location.pathname === '/custom') {
      return 'custom';
    } else {
      return 'custom';
    }
  };

  const getBrandColors = () => {
    const currentTheme = getCurrentTheme();
    
    // Use mode-specific colors on mode pages
    if (location.pathname === '/mindfulness') {
      return {
        brandPrimary: 'bg-purple-600 hover:bg-purple-700',
        brandPrimaryHover: 'hover:bg-purple-700'
      };
    } else if (location.pathname === '/accountability') {
      return {
        brandPrimary: 'bg-indigo-600 hover:bg-indigo-700',
        brandPrimaryHover: 'hover:bg-indigo-700'
      };
    } else if (location.pathname === '/custom') {
      return {
        brandPrimary: 'bg-orange-600 hover:bg-orange-700',
        brandPrimaryHover: 'hover:bg-orange-700'
      };
    } else {
      // Neutral dark gray for other pages
      return {
        brandPrimary: 'bg-gray-800 hover:bg-gray-900',
        brandPrimaryHover: 'hover:bg-gray-900'
      };
    }
  };

  const baseTheme = themes[getCurrentTheme()];
  const brandColors = getBrandColors();

  return {
    ...baseTheme,
    ...brandColors
  };
};
