
export const themes = {
  mindfulness: {
    titleGradient: 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
    gradient: 'bg-gradient-to-r from-purple-600 to-pink-600',
    darkGradient: 'bg-gradient-to-r from-purple-700 to-pink-700',
    primary: 'text-purple-600',
    border: 'border-purple-600',
    bg: 'bg-purple-50',
    hover: 'hover:bg-purple-50',
    hoverGradient: 'hover:from-purple-700 hover:to-pink-700',
    light: 'bg-purple-50',
    lightText: 'text-purple-600',
    progressBg: 'bg-purple-600'
  },
  custom: {
    titleGradient: 'bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent',
    gradient: 'bg-gradient-to-r from-orange-600 to-amber-600',
    darkGradient: 'bg-gradient-to-r from-orange-700 to-amber-700',
    primary: 'text-orange-600',
    border: 'border-orange-600',
    bg: 'bg-orange-50',
    hover: 'hover:bg-orange-50',
    hoverGradient: 'hover:from-orange-700 hover:to-amber-700',
    light: 'bg-orange-50',
    lightText: 'text-orange-600',
    progressBg: 'bg-orange-600'
  },
  accountability: {
    titleGradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent',
    gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    darkGradient: 'bg-gradient-to-r from-blue-700 to-indigo-700',
    primary: 'text-blue-600',
    border: 'border-blue-600',
    bg: 'bg-blue-50',
    hover: 'hover:bg-blue-50',
    hoverGradient: 'hover:from-blue-700 hover:to-indigo-700',
    light: 'bg-blue-50',
    lightText: 'text-blue-600',
    progressBg: 'bg-blue-600'
  }
} as const;

export type ThemeKey = keyof typeof themes;
export type ThemeColors = typeof themes[ThemeKey];
