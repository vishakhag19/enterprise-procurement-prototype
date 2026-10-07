import { createTheme, alpha } from '@mui/material/styles'
import { PANEL_BORDER, PAPER, SIDEBAR_BG, SURFACE, m3, semantic, space } from './designSystem'

export { ACCENT, SIDEBAR_BG, SURFACE, PAPER, PANEL_BORDER, space, semantic, m3 } from './designSystem'

/** Material Design 3 theme — tonal surfaces, MD3 shape, type roles */
export const theme = createTheme({
  cssVariables: true,
  // MD3 baseline grid: 4dp
  spacing: 4,
  shape: { borderRadius: 12 },
  palette: {
    mode: 'light',
    // MD3 color roles: filled actions use primary (#006A6A) + onPrimary — not the seed accent
    primary: {
      main: m3.primary,
      dark: m3.primaryPressed,
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
      main: m3.primary,
      light: m3.primaryContainer,
      dark: m3.primaryPressed,
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
      selected: alpha(m3.primary, 0.12),
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
          borderRadius: 20,
          fontWeight: 650,
          // MD3 label-large button: 24 horizontal, 10 vertical, 40 height
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
          },
          '&.MuiButton-containedPrimary:hover': {
            backgroundColor: m3.primaryPressed,
          },
          '&.MuiButton-containedSecondary': {
            backgroundColor: m3.secondaryContainer,
            color: m3.onSecondaryContainer,
            '&:hover': {
              backgroundColor: alpha(m3.secondary, 0.22),
            },
          },
        },
        outlined: {
          borderColor: m3.outline,
          color: m3.primary,
          '&:hover': {
            borderColor: m3.primary,
            backgroundColor: alpha(m3.primary, 0.08),
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
          border: `1px solid ${PANEL_BORDER}`,
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
          border: `1px solid ${PANEL_BORDER}`,
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
          borderBottom: `1px solid ${PANEL_BORDER}`,
          boxShadow: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        // MD3 top app bar: 64dp tall, 16dp horizontal padding on medium+
        dense: { minHeight: 64, paddingLeft: 16, paddingRight: 16, gap: 8 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          // Compact permanent nav — frees width for content/right panes
          width: 240,
          backgroundColor: m3.surfaceContainerLow,
          color: m3.onSurface,
          borderRight: `1px solid ${PANEL_BORDER}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          // Compact nav destination: 48dp tall, tight insets for 240dp drawer
          minHeight: 48,
          marginInline: 8,
          marginBlock: 0,
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 12,
          paddingRight: 12,
          '&.Mui-selected': {
            backgroundColor: m3.secondaryContainer,
            color: m3.onSecondaryContainer,
            '&:hover': { backgroundColor: alpha(m3.secondary, 0.22) },
            '& .MuiListItemIcon-root': { color: m3.onSecondaryContainer },
            '& .MuiListItemText-primary': { color: m3.onSecondaryContainer, fontWeight: 700 },
          },
          '&:hover': {
            backgroundColor: alpha(m3.onSurface, 0.08),
          },
          '&.Mui-disabled': {
            opacity: 1,
            color: alpha(m3.onSurface, 0.38),
            '& .MuiListItemIcon-root': { color: alpha(m3.onSurface, 0.38) },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 36,
          color: m3.onSurfaceVariant,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: m3.primary, padding: '14px 0', height: 4 },
        thumb: {
          width: 20,
          height: 20,
          backgroundColor: m3.primary,
          border: `2px solid ${m3.surfaceContainerLowest}`,
          boxShadow: 'none',
          '&:hover, &.Mui-focusVisible': {
            boxShadow: `0 0 0 8px ${alpha(m3.primary, 0.16)}`,
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
    MuiTable: {
      defaultProps: { size: 'medium' },
      styleOverrides: {
        root: {
          borderCollapse: 'collapse',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Manrope", "Roboto", system-ui, sans-serif',
          borderColor: m3.outlineVariant,
          // MD3 data table: 16dp inset, ~52dp row with content
          padding: '14px 16px',
          fontSize: '0.875rem',
          lineHeight: 1.45,
        },
        head: {
          fontWeight: 650,
          backgroundColor: m3.surfaceContainerLow,
          color: m3.onSurfaceVariant,
          padding: '12px 16px',
          fontSize: '0.75rem',
          letterSpacing: '0.02em',
          borderBottom: `1px solid ${m3.outlineVariant}`,
        },
        sizeSmall: {
          // Keep MD3 16dp horizontal even when size="small" is used
          padding: '10px 16px',
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          // No divider under the last data row
          '& .MuiTableRow-root:last-of-type .MuiTableCell-root': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': {
            backgroundColor: alpha(m3.onSurface, 0.04),
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          // Avoid outer padding fighting cell insets
          padding: 0,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 28 },
      },
    },
    // MD3 dialog: 24dp padding
    MuiDialogTitle: { styleOverrides: { root: { padding: '24px 24px 16px' } } },
    MuiDialogContent: { styleOverrides: { root: { padding: '0 24px 24px' } } },
    MuiDialogActions: { styleOverrides: { root: { padding: '16px 24px 24px', gap: 8 } } },
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
