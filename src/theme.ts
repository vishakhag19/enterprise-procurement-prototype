import { createTheme } from '@mui/material/styles'

/** Material UI theme for ITC Procurement Decision Support.
 *  Web kit: @mui/material (MaterialDesignInXamlToolkit is WPF-only).
 *  Font: Manrope · Accent: #0BAFAF
 *
 *  Spacing follows Material’s 8dp grid (theme.spacing(1) === 8px):
 *  - Related items / tight: 1 (8)
 *  - Within card / control groups: 2 (16)
 *  - Section gaps / page padding: 3 (24)
 *  - Large screen gutters: 4 (32)
 */
export const ACCENT = '#0BAFAF'
export const SURFACE = '#F0F1F3'
export const SIDEBAR_BG = '#0B1F1F'

/** Layout rhythm tokens (theme spacing units). */
export const space = {
  tight: 1, // 8px — label↔control, chip gaps
  related: 2, // 16px — inside cards, list item stacks
  section: 3, // 24px — between sections, page padding
  gutter: 4, // 32px — large screen gutters
} as const

export const theme = createTheme({
  cssVariables: true,
  spacing: 8,
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
  shape: { borderRadius: 8 },
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
          // Material button: 8 vertical, 16–24 horizontal
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 8,
          paddingBottom: 8,
          minHeight: 40,
        },
        sizeSmall: {
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 4,
          paddingBottom: 4,
          minHeight: 32,
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
        sizeSmall: { height: 24 },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: 'none',
          backgroundImage: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 16,
          '&:last-child': { paddingBottom: 16 },
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
    MuiToolbar: {
      styleOverrides: {
        dense: {
          minHeight: 48,
          paddingLeft: 24,
          paddingRight: 24,
          gap: 16,
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
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 16,
          paddingRight: 16,
          '&.Mui-selected': {
            backgroundColor: 'rgba(11,175,175,0.16)',
            '&:hover': { backgroundColor: 'rgba(11,175,175,0.22)' },
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { padding: '16px 24px' },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { padding: 24 },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: { padding: '8px 24px 16px', gap: 8 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Manrope", system-ui, sans-serif',
          borderColor: 'rgba(15, 32, 43, 0.08)',
          padding: '12px 16px',
        },
        head: {
          fontWeight: 650,
          backgroundColor: '#F7F8F9',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: ACCENT, padding: '12px 0' },
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
        paper: { borderRadius: 8 },
      },
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  },
})
