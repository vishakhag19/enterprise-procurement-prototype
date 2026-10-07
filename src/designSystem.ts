/**
 * Material Design 3 (Material You) tokens seeded from #0BAFAF.
 * Color roles follow Google’s M3 system: primary/container, surface tiers, outline.
 */

export const ACCENT = '#0BAFAF'

/** M3 tonal palette from accent seed */
export const m3 = {
  primary: '#006A6A',
  onPrimary: '#FFFFFF',
  primaryContainer: '#9EF2F1',
  onPrimaryContainer: '#002020',
  /**
   * Seed / brand highlight (#0BAFAF). Decorative only — never body text or
   * filled-button fill (fails WCAG AA). Prefer `primary` + `onPrimary` for actions.
   */
  primaryBrand: ACCENT,
  /** Hover/pressed companion for brand chrome (still not for small text) */
  primaryBrandDark: '#089090',
  /** Darker primary for pressed/hover state layers on filled buttons */
  primaryPressed: '#004F4F',

  secondary: '#4A6363',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#CCE8E7',
  onSecondaryContainer: '#051F1F',

  tertiary: '#4B607C',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#D2E4FF',
  onTertiaryContainer: '#041C35',

  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',

  warning: '#7D5700',
  onWarning: '#FFFFFF',
  warningContainer: '#FFDEAD',
  onWarningContainer: '#271900',

  success: '#006B5F',
  onSuccess: '#FFFFFF',
  successContainer: '#9EF2E3',
  onSuccessContainer: '#00201C',

  surface: '#F4FBFA',
  surfaceDim: '#D5DBDA',
  surfaceBright: '#F4FBFA',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#EFF5F4',
  surfaceContainer: '#E9EFEE',
  surfaceContainerHigh: '#E3E9E8',
  surfaceContainerHighest: '#DEE4E3',
  onSurface: '#161D1D',
  onSurfaceVariant: '#3F4948',

  outline: '#6F7978',
  outlineVariant: '#BEC9C8',
  scrim: '#000000',
  shadow: '#000000',
  inverseSurface: '#2B3231',
  inverseOnSurface: '#ECF2F1',
  inversePrimary: '#80D5D4',
} as const

// Fix typo above - I accidentally broke tertiaryContainer
export const SIDEBAR_BG = m3.surfaceContainerLow
export const SURFACE = m3.surface
export const PAPER = m3.surfaceContainerLowest
export const INK = m3.onSurface
export const INK_MUTED = m3.onSurfaceVariant

/**
 * MD3 shape scale (dp). Cards/panels use `lg` (16).
 * @see https://m3.material.io/styles/shape/corner-radius-scale
 */
export const shape = {
  /** 4 — extra-small */
  xs: 4,
  /** 8 — small (chips, dense embeds) */
  sm: 8,
  /** 12 — medium (text fields, default theme) */
  md: 12,
  /** 16 — large (cards, section panels) */
  lg: 16,
  /** 28 — extra-large (dialogs, sheets) */
  xl: 28,
  /** Full pill */
  full: 9999,
} as const

/** Single hairline for panel chrome + internal panel dividers */
export const PANEL_BORDER = 'rgba(22, 29, 29, 0.08)'
export const PANEL_BORDER_WIDTH = 1
/** @deprecated alias — use PANEL_BORDER for all panel hairlines */
export const RULE = PANEL_BORDER
export const ACCENT_SOFT = m3.primaryContainer
export const ACCENT_DARK = m3.primaryBrandDark

/** Shared card/section panel surface chrome (px strings — safe in MUI `sx`) */
export const panelSurface = {
  border: `${PANEL_BORDER_WIDTH}px solid ${PANEL_BORDER}`,
  borderRadius: `${shape.lg}px`,
  bgcolor: m3.surfaceContainerLowest,
} as const

/** Full-height side pane edge (no radius — flush to viewport) */
export const paneEdgeLeft = {
  borderLeft: `${PANEL_BORDER_WIDTH}px solid ${PANEL_BORDER}`,
} as const
export const paneEdgeRight = {
  borderRight: `${PANEL_BORDER_WIDTH}px solid ${PANEL_BORDER}`,
} as const
export const paneHairlineTop = {
  borderTop: `${PANEL_BORDER_WIDTH}px solid ${PANEL_BORDER}`,
} as const
export const paneHairlineBottom = {
  borderBottom: `${PANEL_BORDER_WIDTH}px solid ${PANEL_BORDER}`,
} as const

/**
 * Material Design 3 spacing — theme.spacing unit = 4dp.
 * xs 1=4 · sm 2=8 · md 3=12 · lg 4=16 · xl 6=24 · xxl 8=32
 */
export const space = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
  xxl: 8,
  /** 8dp — icon/chip gaps, tight stacks */
  tight: 2,
  /** 16dp — card padding, list padding, related gaps */
  related: 4,
  /** 24dp — pane padding, section gaps, dialogs */
  section: 6,
  /** 32dp — major layout gutters */
  gutter: 8,
  /** 12dp — nav item outer margin */
  compact: 3,
} as const

/** Domain semantics mapped onto M3 roles (AA-safe for text/UI where used as meaning) */
export const semantic = {
  firm: m3.primary,
  atRisk: m3.warning,
  /** Was outlineVariant (1.7:1) — use on-surface-variant for legends/text */
  gap: m3.onSurfaceVariant,
  canopyHigh: m3.success,
  canopyMed: m3.warning,
  canopyLow: m3.error,
  evidenceFresh: m3.success,
  evidenceAging: m3.warning,
  evidenceMissing: m3.error,
  signal: m3.primary,
  alert: m3.error,
  alertSoft: m3.errorContainer,
  okSoft: m3.successContainer,
  warnSoft: m3.warningContainer,
  accentSoft: m3.primaryContainer,
  mapWater: m3.tertiary,
  mapParcel: m3.secondary,
  mapParcelSel: m3.primary,
  mapOther: m3.outline,
  mapOtherFill: m3.surfaceContainerHighest,
  mapAttribution: m3.onSurfaceVariant,
} as const

export type StatusKind =
  | 'confidence-high'
  | 'confidence-medium'
  | 'confidence-low'
  | 'evidence-current'
  | 'evidence-aging'
  | 'evidence-missing'
  | 'candidate-strong'
  | 'visit-required'
  | 'concentration-risk'
  | 'outside-harvest'
  | 'verified'
  | 'primary-issue'
  | 'constraint-pass'
  | 'constraint-fail'

export const STATUS_META: Record<
  StatusKind,
  { label: string; fg: string; bg: string; border: string }
> = {
  'confidence-high': { label: 'HIGH', fg: m3.onSuccessContainer, bg: m3.successContainer, border: 'transparent' },
  'confidence-medium': { label: 'MEDIUM', fg: m3.onWarningContainer, bg: m3.warningContainer, border: 'transparent' },
  'confidence-low': { label: 'LOW', fg: m3.onErrorContainer, bg: m3.errorContainer, border: 'transparent' },
  'evidence-current': { label: 'Evidence current', fg: m3.success, bg: 'transparent', border: m3.success },
  'evidence-aging': { label: 'Evidence aging', fg: m3.warning, bg: 'transparent', border: m3.warning },
  'evidence-missing': { label: 'Evidence missing', fg: m3.error, bg: 'transparent', border: m3.error },
  'candidate-strong': { label: 'Strong candidate', fg: m3.onPrimaryContainer, bg: m3.primaryContainer, border: 'transparent' },
  'visit-required': { label: 'Field visit required', fg: m3.onTertiaryContainer, bg: m3.tertiaryContainer, border: 'transparent' },
  'concentration-risk': { label: 'Concentration risk', fg: m3.onErrorContainer, bg: m3.errorContainer, border: 'transparent' },
  'outside-harvest': { label: 'Outside harvest window', fg: m3.onSurfaceVariant, bg: m3.surfaceContainerHigh, border: 'transparent' },
  verified: { label: 'Verified', fg: m3.onSuccessContainer, bg: m3.successContainer, border: 'transparent' },
  'primary-issue': { label: 'Primary issue', fg: m3.onError, bg: m3.error, border: 'transparent' },
  'constraint-pass': { label: 'Pass', fg: m3.onSuccessContainer, bg: m3.successContainer, border: 'transparent' },
  'constraint-fail': { label: 'Fails constraint', fg: m3.onErrorContainer, bg: m3.errorContainer, border: 'transparent' },
}

export const typographyScale = {
  display: { size: '2.75rem', weight: 700, tracking: '-0.03em', line: 1.05 },
  title: { size: '1.375rem', weight: 700, tracking: '-0.02em', line: 1.2 },
  subtitle: { size: '0.9375rem', weight: 650, tracking: '-0.01em', line: 1.35 },
  body: { size: '0.875rem', weight: 500, tracking: '0', line: 1.5 },
  meta: { size: '0.75rem', weight: 500, tracking: '0.01em', line: 1.4 },
  overline: { size: '0.6875rem', weight: 700, tracking: '0.08em', line: 1.3 },
  dataLg: { size: '2rem', weight: 700, tracking: '-0.02em', line: 1 },
  dataMd: { size: '1.25rem', weight: 700, tracking: '-0.01em', line: 1 },
  dataSm: { size: '0.875rem', weight: 700, tracking: '0', line: 1.2 },
} as const
