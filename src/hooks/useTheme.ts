
import { useLocation } from "react-router-dom";
import { themes, type ThemeKey, type ThemeColors } from "@/config/themes";

export const useTheme = (): ThemeColors => {
  const location = useLocation();
  
  const getCurrentTheme = (): ThemeKey => {
    if (location.pathname === '/mindfulness') {
      return 'mindfulness';
    } else if (location.pathname === '/accountability') {
      return 'accountability';
    } else {
      return 'custom';
    }
  };

  return themes[getCurrentTheme()];
};
