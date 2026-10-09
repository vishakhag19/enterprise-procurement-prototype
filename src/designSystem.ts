/**
 * Material Design 3 (Material You) tokens seeded from #0BAFAF.
 * Color roles follow Google’s M3 system: primary/container, surface tiers, outline.
 */

export const ACCENT = '#0BAFAF'

/** Sole UI typeface - no system / Inter / Roboto fallbacks in product surfaces */
export const FONT_FAMILY = '"Manrope"'

/** M3 tonal palette from accent seed #0BAFAF */
export const m3 = {
  /**
   * Brand accent fill - the seed color. Pair with white `onPrimary` on filled
   * controls. Do not use as small body text on white; use `primaryInk`.
   */
  primary: ACCENT,
  /** White label/icon on solid accent fills (buttons, avatar, controls) */
  onPrimary: '#FFFFFF',
  /**
   * Highlight / soft accent surface - ~10% of brand accent on white.
   * Solid `#0BAFAF` stays on interactive fills only (buttons, checks, etc.).
   */
  primaryContainer: '#E6F7F7',
  onPrimaryContainer: '#161D1D',
  /** Alias of primaryContainer (10% accent wash) */
  primarySoft: '#E6F7F7',
  /**
   * AA-safe teal for small text / outlined labels on light surfaces.
   * Prefer this over `primary` whenever the accent is used as text color.
   */
  primaryInk: '#006A6A',
  /** @deprecated alias of primary - kept for older call sites */
  primaryBrand: ACCENT,
  /** Hover/pressed companion for accent fills */
  primaryBrandDark: '#089090',
  /** Pressed/hover layer for filled accent buttons */
  primaryPressed: '#089090',

  /**
   * Structural secondary only - not a domain meaning color.
   * Prefer primary / warning / error / onSurfaceVariant for semantics.
   */
  secondary: '#5B6B6B',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#DCE4E3',
  onSecondaryContainer: '#151D1D',

  /** Geographic / dispersion accent (not muddy teal-gray) */
  tertiary: '#3D6B8A',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#D3E5F5',
  onTertiaryContainer: '#041E2E',

  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',

  /**
   * Caution role - bright amber for verification / uncertainty / aging.
   * Use `warningInk` for small text on white (AA); `warning` for fills/borders.
   */
  warning: '#F0A020',
  warningInk: '#A86B00',
  onWarning: '#FFFFFF',
  warningContainer: '#FFE4A3',
  onWarningContainer: '#3D2800',

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
  /** 4 - extra-small */
  xs: 4,
  /** 8 - small (chips, dense embeds) */
  sm: 8,
  /** 12 - medium (text fields, default theme) */
  md: 12,
  /** 16 - large (cards, section panels) */
  lg: 16,
  /** 28 - extra-large (dialogs, sheets) */
  xl: 28,
  /** Full pill */
  full: 9999,
} as const

/** Single hairline for panel chrome + internal panel dividers */
export const PANEL_BORDER = 'rgba(22, 29, 29, 0.08)'
export const PANEL_BORDER_WIDTH = 1
/** @deprecated alias - use PANEL_BORDER for all panel hairlines */
export const RULE = PANEL_BORDER
export const ACCENT_SOFT = m3.primaryContainer
export const ACCENT_DARK = m3.primaryBrandDark

/**
 * Shared card / list selection wash - Farms-tab selected card color.
 * 10% brand accent (#0BAFAF). Use for every selectable card state.
 */
export const CARD_SELECTION_BG = 'rgba(11, 175, 175, 0.1)'
/** Hover-only wash on unselected cards (half of selection) */
export const CARD_HOVER_BG = 'rgba(11, 175, 175, 0.05)'

/** Shared card/section panel surface chrome (px strings - safe in MUI `sx`) */
export const panelSurface = {
  border: `${PANEL_BORDER_WIDTH}px solid ${PANEL_BORDER}`,
  borderRadius: `${shape.lg}px`,
  bgcolor: m3.surfaceContainerLowest,
} as const

/**
 * App shell chrome - header, left nav, and right panes share the same
 * MD3 large (16dp) radius + hairline. Used with shell inset/gap so corners show.
 */
export const shellChrome = {
  border: `${PANEL_BORDER_WIDTH}px solid ${PANEL_BORDER}`,
  borderRadius: `${shape.lg}px`,
  overflow: 'hidden',
} as const

/** @deprecated - use shellChrome; kept for internal hairlines */
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
 * Material Design 3 spacing - theme.spacing unit = 4dp.
 * Use these tokens in every screen (avoid raw 1/2/4/6 in sx):
 * xs 1=4 · tight/sm 2=8 · compact/md 3=12 · related/lg 4=16 · section/xl 6=24 · gutter/xxl 8=32
 *
 * Layout convention across tabs:
 * - MainPane body padding + section stack gap = `section` (24)
 * - Card / KPI / map chrome padding = `related` (16)
 * - Label → value, chip rows, list item gaps = `tight` (8)
 * - Caption under titles = `xs` (4)
 */
export const space = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 6,
  xxl: 8,
  /** 8dp - icon/chip gaps, tight stacks */
  tight: 2,
  /** 16dp - card padding, list padding, related gaps */
  related: 4,
  /** 24dp - pane padding, section gaps, dialogs */
  section: 6,
  /** 32dp - major layout gutters */
  gutter: 8,
  /** 12dp - nav item outer margin */
  compact: 3,
} as const

/**
 * Domain semantics - locked color meaning across every screen:
 * - teal (primary) = confirmed / selected / actionable
 * - amber (warning) = uncertainty / verification / caution
 * - red (error) = constraint failure / material risk
 * - neutral (outline / onSurfaceVariant) = supporting / inactive
 */
export const semantic = {
  confirmed: m3.primary,
  confirmedInk: m3.primaryInk,
  confirmedSoft: m3.primaryContainer,
  selected: m3.primary,
  actionable: m3.primary,

  uncertainty: m3.warning,
  verification: m3.warning,
  caution: m3.warning,
  cautionInk: m3.warningInk,
  cautionSoft: m3.warningContainer,

  risk: m3.error,
  constraintFail: m3.error,
  riskSoft: m3.errorContainer,

  inactive: m3.outline,
  supporting: m3.onSurfaceVariant,
  supportingSoft: m3.surfaceContainerHighest,

  firm: m3.primary,
  /** At-risk supply uses caution amber */
  atRisk: m3.warning,
  /**
   * Uncommitted remainder in SupplyBar - matches meter track (already visible).
   * Do not invent a fourth “meaning” hue for gap.
   */
  gap: m3.surfaceContainerHighest,
  /** Canopy health uses the same teal/amber/red/neutral model */
  canopyHigh: m3.primary,
  canopyMed: m3.warning,
  canopyLow: m3.error,
  evidenceFresh: m3.primaryInk,
  evidenceAging: m3.warning,
  evidenceMissing: m3.error,
  signal: m3.primary,
  alert: m3.error,
  alertSoft: m3.errorContainer,
  okSoft: m3.primaryContainer,
  warnSoft: m3.warningContainer,
  accentSoft: m3.primaryContainer,
  mapWater: m3.tertiary,
  mapParcel: m3.outline,
  mapParcelSel: m3.primary,
  mapOther: m3.outline,
  mapOtherFill: m3.surfaceContainerHighest,
  mapAttribution: m3.onSurfaceVariant,
} as const

/** Visual identity for the three Scenario Planning strategies */
export type StrategyKey = 'coverage-first' | 'confidence-first' | 'dispersed'

export const STRATEGY_VISUAL: Record<
  StrategyKey,
  {
    accent: string
    accentSoft: string
    ink: string
    tagline: string
    emphasis: 'coverage' | 'confidence' | 'dispersion'
  }
> = {
  'coverage-first': {
    accent: m3.primary,
    accentSoft: m3.primaryContainer,
    ink: m3.primaryInk,
    tagline: 'Maximize supply',
    emphasis: 'coverage',
  },
  'confidence-first': {
    accent: m3.warning,
    accentSoft: m3.warningContainer,
    ink: m3.warningInk,
    tagline: 'Minimize uncertainty',
    emphasis: 'confidence',
  },
  dispersed: {
    accent: m3.tertiary,
    accentSoft: m3.tertiaryContainer,
    ink: m3.onTertiaryContainer,
    tagline: 'Reduce concentration',
    emphasis: 'dispersion',
  },
}

/** Shared meter / progress-strip geometry used by SupplyBar, WeekRail, Plan, etc. */
export const meter = {
  height: 8,
  track: m3.surfaceContainerHighest,
  radius: shape.xs,
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

/**
 * Chip tones stay off card container washes (primary / warning / selection fills).
 * Positive = white + brand outline; caution = white + amber outline;
 * negative = white + error outline; critical = solid error (only solid fill).
 */
const CHIP_POSITIVE = { fg: m3.primaryInk, bg: m3.surfaceContainerLowest, border: m3.primaryInk }
const CHIP_CAUTION = { fg: m3.warningInk, bg: m3.surfaceContainerLowest, border: m3.warning }
const CHIP_NEGATIVE = { fg: m3.error, bg: m3.surfaceContainerLowest, border: m3.error }
const CHIP_CRITICAL = { fg: m3.onError, bg: m3.error, border: 'transparent' }

export const STATUS_META: Record<
  StatusKind,
  { label: string; fg: string; bg: string; border: string }
> = {
  'confidence-high': { label: 'HIGH', ...CHIP_POSITIVE },
  'confidence-medium': { label: 'MEDIUM', ...CHIP_CAUTION },
  'confidence-low': { label: 'LOW', ...CHIP_NEGATIVE },
  'evidence-current': { label: 'Evidence current', ...CHIP_POSITIVE },
  'evidence-aging': { label: 'Evidence aging', ...CHIP_CAUTION },
  'evidence-missing': { label: 'Evidence missing', ...CHIP_NEGATIVE },
  'candidate-strong': { label: 'Strong candidate', ...CHIP_POSITIVE },
  'visit-required': { label: 'Field visit required', ...CHIP_CAUTION },
  'concentration-risk': { label: 'Concentration risk', ...CHIP_NEGATIVE },
  'outside-harvest': { label: 'Outside harvest window', ...CHIP_CAUTION },
  verified: { label: 'Verified', ...CHIP_POSITIVE },
  'primary-issue': { label: 'Primary issue', ...CHIP_CRITICAL },
  'constraint-pass': { label: 'Pass', ...CHIP_POSITIVE },
  'constraint-fail': { label: 'Fails constraint', ...CHIP_NEGATIVE },
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
