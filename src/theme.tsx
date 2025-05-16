import React, { useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const baseTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 600 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: {
      styleOverrides: { root: { borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' } },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: { main: '#2563EB', light: '#60A5FA', dark: '#1D4ED8', contrastText: '#FFFFFF' },
    secondary: { main: '#7C3AED', light: '#A78BFA', dark: '#5B21B6', contrastText: '#FFFFFF' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#1E293B', secondary: '#64748B' },
    error: { main: '#DC2626', light: '#FCA5A5', dark: '#B91C1C' },
    warning: { main: '#D97706', light: '#FCD34D', dark: '#B45309' },
    success: { main: '#059669', light: '#6EE7B7', dark: '#047857' },
    info: { main: '#0284C7', light: '#7DD3FC', dark: '#0369A1' },
    divider: 'rgba(0, 0, 0, 0.06)',
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: { main: '#3B82F6', light: '#60A5FA', dark: '#2563EB', contrastText: '#FFFFFF' },
    secondary: { main: '#8B5CF6', light: '#A78BFA', dark: '#7C3AED', contrastText: '#FFFFFF' },
    background: { default: '#181F2A', paper: '#232B3B' },
    text: { primary: '#F1F5F9', secondary: '#94A3B8' },
    error: { main: '#EF4444', light: '#FCA5A5', dark: '#DC2626' },
    warning: { main: '#F59E0B', light: '#FCD34D', dark: '#D97706' },
    success: { main: '#10B981', light: '#6EE7B7', dark: '#059669' },
    info: { main: '#0EA5E9', light: '#7DD3FC', dark: '#0284C7' },
    divider: 'rgba(255, 255, 255, 0.06)',
  },
});

export type ColorMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ColorMode;
  toggleColorMode: () => void;
  setMode: (mode: ColorMode) => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  mode: 'system',
  toggleColorMode: () => {},
  setMode: () => {},
});

export const useThemeContext = () => React.useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const storedMode = localStorage.getItem('themeMode') as ColorMode | null;
  const [mode, setMode] = useState<ColorMode>(storedMode || 'system');
  const [systemIsDark, setSystemIsDark] = useState<boolean>(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const actualMode = useMemo(() => {
    if (mode === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return mode;
  }, [mode, systemIsDark]);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => {
      if (prevMode === 'light') return 'dark';
      if (prevMode === 'dark') return 'system';
      return 'light';
    });
  };

  const theme = useMemo(() => (actualMode === 'dark' ? darkTheme : lightTheme), [actualMode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode, setMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 