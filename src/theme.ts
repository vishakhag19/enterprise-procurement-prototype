import { createTheme } from '@mui/material/styles'

/** Material UI theme for ITC Procurement Decision Support.
 *  Accent inspired by Material Design guidance; web kit is @mui/material
 *  (the linked MaterialDesignInXamlToolkit is WPF-only). */
export const ACCENT = '#0BAFAF'

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: ACCENT,
      dark: '#089090',
      light: '#3DC9C9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1A2332',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F0F1F3',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#15202B',
      secondary: '#5B6B7A',
    },
    success: { main: '#0F9F6E' },
    warning: { main: '#D97706' },
    error: { main: '#DC2626' },
    info: { main: '#0BAFAF', dark: '#089090' },
    divider: 'rgba(15, 32, 43, 0.12)',
  },
  typography: {
    fontFamily: '"Manrope", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 650 },
    h6: { fontWeight: 650 },
    button: { fontWeight: 650, textTransform: 'none' as const, letterSpacing: '0.01em' },
    overline: { fontWeight: 700, letterSpacing: '0.12em' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: false },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 650,
          paddingInline: 18,
          paddingBlock: 8,
        },
        contained: {
          boxShadow: '0 1px 2px rgba(11, 175, 175, 0.28)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(11, 175, 175, 0.35)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, letterSpacing: '0.04em' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Manrope", system-ui, -apple-system, sans-serif',
        },
      },
    },
  },
})
