import { createTheme } from '@mui/material/styles'

/** Material UI theme for ITC Procurement Decision Support.
 *  Web kit: @mui/material (MaterialDesignInXamlToolkit is WPF-only).
 *  Font: Manrope · Accent: #0BAFAF */
export const ACCENT = '#0BAFAF'
export const SURFACE = '#F0F1F3'
export const SIDEBAR_BG = '#0B1F1F'

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
      default: SURFACE,
      paper: '#FFFFFF',
    },
    text: {
      primary: '#15202B',
      secondary: '#5B6B7A',
    },
    success: { main: '#0F9F6E' },
    warning: { main: '#D97706' },
    error: { main: '#DC2626' },
    info: { main: ACCENT, dark: '#089090' },
    divider: 'rgba(15, 32, 43, 0.08)',
  },
  typography: {
    fontFamily: '"Manrope", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1.5rem' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 650 },
    h6: { fontWeight: 650, fontSize: '1rem' },
    subtitle1: { fontWeight: 650 },
    subtitle2: { fontWeight: 650 },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.75rem', color: '#5B6B7A' },
    caption: { fontSize: '0.6875rem', color: '#5B6B7A' },
    button: { fontWeight: 650, textTransform: 'none' as const, letterSpacing: '0.01em' },
    overline: { fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.625rem' },
  },
  shape: { borderRadius: 10 },
  shadows: [
    'none',
    '0 1px 2px rgba(15, 32, 43, 0.04)',
    '0 2px 8px rgba(15, 32, 43, 0.06)',
    '0 8px 24px rgba(15, 32, 43, 0.12)',
    '0 12px 32px rgba(15, 32, 43, 0.16)',
    ...Array(20).fill('0 8px 24px rgba(15, 32, 43, 0.12)'),
  ] as unknown as import('@mui/material/styles').ThemeOptions['shadows'] extends infer S ? S : never,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Manrope", system-ui, -apple-system, sans-serif',
          backgroundColor: SURFACE,
          color: '#15202B',
        },
        '.font-data': {
          fontFamily: '"Manrope", system-ui, sans-serif',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 700,
        },
      },
    },
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
        outlined: {
          borderColor: 'rgba(11,175,175,0.45)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, letterSpacing: '0.04em' },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: 'none',
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#15202B',
          borderBottom: '1px solid rgba(15, 32, 43, 0.08)',
          boxShadow: `inset 0 -2px 0 ${ACCENT}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: SIDEBAR_BG,
          color: '#FFFFFF',
          borderRight: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Manrope", system-ui, sans-serif',
          borderColor: 'rgba(15, 32, 43, 0.08)',
        },
        head: {
          fontWeight: 650,
          backgroundColor: '#F7F8F9',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: ACCENT, padding: '10px 0' },
        thumb: { width: 16, height: 16 },
        track: { height: 2 },
        rail: { height: 2, opacity: 0.35 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, height: 8, backgroundColor: 'rgba(15,32,43,0.08)' },
        bar: { borderRadius: 4 },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 12 },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          '&.Mui-selected': {
            backgroundColor: 'rgba(11,175,175,0.16)',
            '&:hover': { backgroundColor: 'rgba(11,175,175,0.22)' },
          },
        },
      },
    },
  },
})
