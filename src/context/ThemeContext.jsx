import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { cardRadius, inputRadius } from '../styles/tokens.js';

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  }, []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: mode === 'light' ? '#0D47A1' : '#42a5f5' },
      secondary: { main: '#00838F' },
      background: {
        default: mode === 'light' ? '#f5f7fa' : '#0a1929',
        paper: mode === 'light' ? '#ffffff' : '#132f4c',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      h4: { fontWeight: 600, fontSize: '1.75rem' },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: inputRadius },
    components: {
      MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: inputRadius } } },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: cardRadius,
            boxShadow: mode === 'light' ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
            transition: 'box-shadow 0.2s ease',
            '&:hover': mode === 'light' ? { boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } : {},
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { borderRight: '1px solid', borderColor: mode === 'light' ? 'divider' : 'rgba(255,255,255,0.08)' },
        },
      },
    },
  }), [mode]);

  const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
