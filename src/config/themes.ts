
export const themes = {
  mindfulness: {
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
  },
  custom: {
    titleGradient: 'bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent',
    gradient: 'bg-gradient-to-r from-indigo-600 to-blue-600',
    primary: 'text-indigo-600',
    border: 'border-indigo-600',
    bg: 'bg-indigo-50',
    hover: 'hover:bg-indigo-50',
    light: 'bg-indigo-50',
    lightText: 'text-indigo-600',
    progressBg: 'bg-indigo-600',
    darkGradient: 'bg-gradient-to-r from-indigo-700 to-blue-700',
    hoverPrimary: 'hover:text-indigo-700'
  },
  accountability: {
    titleGradient: 'bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent',
    gradient: 'bg-gradient-to-r from-indigo-600 to-violet-600',
    primary: 'text-indigo-600',
    border: 'border-indigo-600',
    bg: 'bg-indigo-50',
    hover: 'hover:bg-indigo-50',
    light: 'bg-indigo-50',
    lightText: 'text-indigo-600',
    progressBg: 'bg-indigo-600',
    darkGradient: 'bg-gradient-to-r from-indigo-700 to-violet-700',
    hoverPrimary: 'hover:text-indigo-700'
  }
} as const;

export type ThemeKey = keyof typeof themes;
export type ThemeColors = typeof themes[ThemeKey];
