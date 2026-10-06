import { createTheme } from '@mui/material/styles'
import {
  ACCENT,
  INK,
  INK_MUTED,
  PAPER,
  RULE,
  SIDEBAR_BG,
  SURFACE,
  semantic,
  space,
} from './designSystem'

export { ACCENT, SIDEBAR_BG, SURFACE, PAPER, space, semantic } from './designSystem'

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
      main: INK,
      contrastText: '#ffffff',
    },
    background: {
      default: SURFACE,
      paper: PAPER,
    },
    text: {
      primary: INK,
      secondary: INK_MUTED,
    },
    success: { main: semantic.canopyHigh },
    warning: { main: semantic.canopyMed },
    error: { main: semantic.alert },
    info: { main: ACCENT, dark: '#089090' },
    divider: RULE,
  },
  typography: {
    fontFamily: '"Manrope", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.03em', fontSize: '2.75rem', lineHeight: 1.05 },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1.375rem', lineHeight: 1.2 },
    h3: { fontWeight: 700, fontSize: '1.125rem' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 650 },
    h6: { fontWeight: 650, fontSize: '0.9375rem' },
    subtitle1: { fontWeight: 650, fontSize: '0.9375rem' },
    subtitle2: { fontWeight: 650, fontSize: '0.8125rem' },
    body1: { fontSize: '0.8125rem', fontWeight: 500, lineHeight: 1.5 },
    body2: { fontSize: '0.75rem', fontWeight: 500, color: INK_MUTED, lineHeight: 1.45 },
    caption: { fontSize: '0.6875rem', fontWeight: 500, color: INK_MUTED },
    button: { fontWeight: 650, textTransform: 'none' as const, letterSpacing: '0.01em' },
    overline: {
      fontWeight: 700,
      letterSpacing: '0.14em',
      fontSize: '0.625rem',
      lineHeight: 1.3,
      color: INK_MUTED,
    },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Manrope", system-ui, -apple-system, sans-serif',
          backgroundColor: SURFACE,
          color: INK,
          backgroundImage:
            'radial-gradient(ellipse 100% 70% at 100% 0%, rgba(11,175,175,0.10), transparent 55%), radial-gradient(ellipse 80% 50% at 0% 100%, rgba(13,92,92,0.05), transparent 50%), linear-gradient(180deg, #F3F6F7 0%, #EEF2F3 100%)',
        },
        '.font-data': {
          fontFamily: '"Manrope", system-ui, sans-serif',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 700,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 650,
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
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none', backgroundColor: '#089090' },
        },
                outlined: {
          borderColor: 'rgba(12,21,32,0.22)',
          color: INK,
          '&:hover': { borderColor: ACCENT, backgroundColor: 'rgba(11,175,175,0.06)' },
        },
        text: {
          color: ACCENT,
          fontWeight: 650,
          paddingInline: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, letterSpacing: '0.06em', borderRadius: 4 },
        sizeSmall: { height: 22, fontSize: 10 },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: 'none',
          borderRadius: 6,
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: {
          backgroundColor: PAPER,
          color: INK,
          borderBottom: `1px solid ${RULE}`,
          boxShadow: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        dense: { minHeight: 48, paddingLeft: 24, paddingRight: 24, gap: 16 },
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
            backgroundColor: 'rgba(11,175,175,0.14)',
            '&:hover': { backgroundColor: 'rgba(11,175,175,0.2)' },
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: ACCENT, padding: '14px 0', height: 4 },
        thumb: {
          width: 14,
          height: 14,
          backgroundColor: PAPER,
          border: `2px solid ${ACCENT}`,
          boxShadow: 'none',
          '&:hover, &.Mui-focusVisible': { boxShadow: `0 0 0 6px rgba(11,175,175,0.16)` },
        },
        track: { height: 3, borderRadius: 1 },
        rail: { height: 3, borderRadius: 1, opacity: 1, backgroundColor: 'rgba(12,21,32,0.12)' },
        mark: { display: 'none' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Manrope", system-ui, sans-serif',
          borderColor: RULE,
          padding: '12px 16px',
        },
        head: { fontWeight: 650, backgroundColor: 'rgba(12,21,32,0.03)' },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 8 } },
    },
    MuiDialogTitle: { styleOverrides: { root: { padding: '16px 24px' } } },
    MuiDialogContent: { styleOverrides: { root: { padding: 24 } } },
    MuiStack: { defaultProps: { useFlexGap: true } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 2, height: 6, backgroundColor: 'rgba(12,21,32,0.08)' },
        bar: { borderRadius: 2 },
      },
    },
    MuiTextField: { defaultProps: { size: 'small', variant: 'outlined' } },
  },
})
