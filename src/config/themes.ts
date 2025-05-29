
export const themes = {
  mindfulness: {
    titleGradient: 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
    gradient: 'bg-gradient-to-r from-purple-600 to-pink-600',
    primary: 'text-purple-600',
    border: 'border-purple-600',
    bg: 'bg-purple-50',
    hover: 'hover:bg-purple-50',
    light: 'bg-purple-50',
    lightText: 'text-purple-600',
    progressBg: 'bg-purple-600',
    darkGradient: 'bg-gradient-to-r from-purple-700 to-pink-700',
    hoverPrimary: 'hover:text-purple-700'
  },
  custom: {
    titleGradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
    gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    primary: 'text-blue-600',
    border: 'border-blue-600',
    bg: 'bg-blue-50',
    hover: 'hover:bg-blue-50',
    light: 'bg-blue-50',
    lightText: 'text-blue-600',
    progressBg: 'bg-blue-600',
    darkGradient: 'bg-gradient-to-r from-blue-700 to-indigo-700',
    hoverPrimary: 'hover:text-blue-700'
  },
  accountability: {
    titleGradient: 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent',
    gradient: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    primary: 'text-indigo-600',
    border: 'border-indigo-600',
    bg: 'bg-indigo-50',
    hover: 'hover:bg-indigo-50',
    light: 'bg-indigo-50',
    lightText: 'text-indigo-600',
    progressBg: 'bg-indigo-600',
    darkGradient: 'bg-gradient-to-r from-indigo-700 to-purple-700',
    hoverPrimary: 'hover:text-indigo-700'
  }
} as const;

export type ThemeKey = keyof typeof themes;
export type ThemeColors = typeof themes[ThemeKey];
