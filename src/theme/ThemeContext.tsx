import React, { createContext, useCallback, useContext, useState } from 'react';
import { lightColors, darkColors, lightShadows, darkShadows } from './index';

export type Colors = typeof lightColors;
export type Shadows = typeof lightShadows;

type ThemeCtx = {
  colors: Colors;
  shadows: Shadows;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = useCallback(() => setIsDark(p => !p), []);

  return (
    <ThemeContext.Provider value={{
      colors: isDark ? darkColors : lightColors,
      shadows: isDark ? darkShadows : lightShadows,
      isDark,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
