import { createTheme, alpha } from '@mui/material/styles'
import { ACCENT, PAPER, SIDEBAR_BG, SURFACE, m3, semantic, space } from './designSystem'

export { ACCENT, SIDEBAR_BG, SURFACE, PAPER, space, semantic, m3 } from './designSystem'

/** Material Design 3 theme — tonal surfaces, MD3 shape, type roles */
export const theme = createTheme({
  cssVariables: true,
  spacing: 8,
  shape: { borderRadius: 12 },
  palette: {
    mode: 'light',
    primary: {
      main: ACCENT,
      dark: m3.primary,
      light: m3.primaryContainer,
      contrastText: m3.onPrimary,
    },
    secondary: {
      main: m3.secondary,
      light: m3.secondaryContainer,
      dark: m3.onSecondaryContainer,
      contrastText: m3.onSecondary,
    },
    error: {
      main: m3.error,
      light: m3.errorContainer,
      dark: m3.onErrorContainer,
      contrastText: m3.onError,
    },
    warning: {
      main: m3.warning,
      light: m3.warningContainer,
      dark: m3.onWarningContainer,
      contrastText: m3.onWarning,
    },
    success: {
      main: m3.success,
      light: m3.successContainer,
      dark: m3.onSuccessContainer,
      contrastText: m3.onSuccess,
    },
    info: {
      main: ACCENT,
      light: m3.primaryContainer,
      dark: m3.primary,
      contrastText: m3.onPrimary,
    },
    background: {
      default: m3.surface,
      paper: m3.surfaceContainerLowest,
    },
    text: {
      primary: m3.onSurface,
      secondary: m3.onSurfaceVariant,
    },
    divider: m3.outlineVariant,
    action: {
      hover: alpha(m3.onSurface, 0.08),
      selected: alpha(ACCENT, 0.12),
      disabled: alpha(m3.onSurface, 0.38),
      disabledBackground: alpha(m3.onSurface, 0.12),
      focus: alpha(m3.onSurface, 0.12),
    },
  },
  typography: {
    fontFamily: '"Manrope", "Roboto", system-ui, sans-serif',
    // MD3 type scale (mapped onto MUI variants)
    h1: { fontWeight: 700, fontSize: '2.75rem', lineHeight: 1.1, letterSpacing: '-0.02em' }, // display-small
    h2: { fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2, letterSpacing: '-0.01em' }, // headline-medium
    h3: { fontWeight: 650, fontSize: '1.375rem', lineHeight: 1.25 }, // headline-small
    h4: { fontWeight: 650, fontSize: '1.25rem', lineHeight: 1.3 }, // title-large
    h5: { fontWeight: 650, fontSize: '1rem', lineHeight: 1.35 }, // title-medium
    h6: { fontWeight: 650, fontSize: '0.875rem', lineHeight: 1.35 }, // title-small
    subtitle1: { fontWeight: 650, fontSize: '1rem', lineHeight: 1.4 },
    subtitle2: { fontWeight: 650, fontSize: '0.875rem', lineHeight: 1.4 },
    body1: { fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.5, letterSpacing: '0.01em' }, // body-large
    body2: { fontWeight: 500, fontSize: '0.8125rem', lineHeight: 1.45, color: m3.onSurfaceVariant }, // body-medium
    caption: { fontWeight: 500, fontSize: '0.75rem', lineHeight: 1.35, color: m3.onSurfaceVariant }, // body-small
    button: { fontWeight: 650, textTransform: 'none' as const, letterSpacing: '0.01em', fontSize: '0.875rem' },
    overline: {
      fontWeight: 700,
      letterSpacing: '0.08em',
      fontSize: '0.6875rem',
      lineHeight: 1.3,
      color: m3.onSurfaceVariant,
      textTransform: 'uppercase' as const,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Manrope", "Roboto", system-ui, sans-serif',
          backgroundColor: m3.surface,
          color: m3.onSurface,
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 20, // MD3 full corner for buttons
          fontWeight: 650,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 10,
          paddingBottom: 10,
          minHeight: 40,
        },
        sizeSmall: {
          borderRadius: 16,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 6,
          paddingBottom: 6,
          minHeight: 32,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: m3.primaryBrandDark,
          },
        },
        outlined: {
          borderColor: m3.outline,
          color: m3.primary,
          '&:hover': {
            borderColor: m3.primary,
            backgroundColor: alpha(ACCENT, 0.08),
          },
        },
        text: {
          color: m3.primary,
          fontWeight: 650,
          paddingInline: 12,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 650,
          letterSpacing: '0.02em',
          borderRadius: 8, // MD3 chips
        },
        sizeSmall: { height: 24, fontSize: 11 },
        filled: {
          border: 'none',
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: m3.surfaceContainerLowest,
          border: 'none',
          borderRadius: 16, // MD3 medium shape
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: m3.surfaceContainerLowest,
          borderRadius: 16,
          boxShadow: 'none',
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: {
          backgroundColor: m3.surface,
          color: m3.onSurface,
          borderBottom: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        dense: { minHeight: 64, paddingLeft: 24, paddingRight: 24, gap: 16 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: m3.surfaceContainerLow,
          color: m3.onSurface,
          borderRight: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 28, // MD3 nav pill
          marginInline: 12,
          marginBlock: 2,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 16,
          paddingRight: 16,
          '&.Mui-selected': {
            backgroundColor: m3.secondaryContainer,
            color: m3.onSecondaryContainer,
            '&:hover': { backgroundColor: alpha(m3.secondary, 0.22) },
            '& .MuiListItemIcon-root': { color: m3.onSecondaryContainer },
          },
          '&:hover': {
            backgroundColor: alpha(m3.onSurface, 0.06),
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: ACCENT, padding: '14px 0', height: 4 },
        thumb: {
          width: 20,
          height: 20,
          backgroundColor: ACCENT,
          border: `2px solid ${m3.surfaceContainerLowest}`,
          boxShadow: 'none',
          '&:hover, &.Mui-focusVisible': {
            boxShadow: `0 0 0 8px ${alpha(ACCENT, 0.16)}`,
          },
        },
        track: { height: 4, borderRadius: 2 },
        rail: {
          height: 4,
          borderRadius: 2,
          opacity: 1,
          backgroundColor: m3.surfaceContainerHighest,
        },
        mark: { display: 'none' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Manrope", "Roboto", system-ui, sans-serif',
          borderColor: m3.outlineVariant,
          padding: '12px 16px',
        },
        head: {
          fontWeight: 650,
          backgroundColor: m3.surfaceContainerLow,
          color: m3.onSurfaceVariant,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 28 }, // MD3 dialog
      },
    },
    MuiDialogTitle: { styleOverrides: { root: { padding: '24px 24px 8px' } } },
    MuiDialogContent: { styleOverrides: { root: { padding: 24 } } },
    MuiStack: { defaultProps: { useFlexGap: true } },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
          backgroundColor: m3.surfaceContainerHighest,
        },
        bar: { borderRadius: 4 },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: m3.outline,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: m3.outlineVariant },
      },
    },
  },
})
