
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
    titleGradient: 'bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent',
    gradient: 'bg-gradient-to-r from-gray-700 to-gray-600',
    primary: 'text-gray-700',
    border: 'border-gray-700',
    bg: 'bg-gray-50',
    hover: 'hover:bg-gray-50',
    light: 'bg-gray-50',
    lightText: 'text-gray-700',
    progressBg: 'bg-gray-700',
    darkGradient: 'bg-gradient-to-r from-gray-800 to-gray-700',
    hoverPrimary: 'hover:text-gray-800'
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
