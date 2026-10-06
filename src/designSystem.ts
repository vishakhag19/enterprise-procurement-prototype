/**
 * SatSure-adjacent geospatial procurement design system.
 * Domain: satellite + field evidence for commodity procurement — not generic SaaS.
 *
 * Spacing: Material 8dp grid (theme.spacing)
 * Surfaces: terrain canvas → open data strips → map plane (primary visual)
 * Color: ink / canopy / signal-teal / earth-alert — avoid template blue/green/red kits
 */

export const ACCENT = '#0BAFAF'
export const SIDEBAR_BG = '#071416'

/** Terrain canvas — cool sage-stone, not flat SaaS grey */
export const SURFACE = '#E4E9E6'
export const PAPER = '#FBFCFA'
export const INK = '#0C1520'
export const INK_MUTED = '#5A6A64'
export const RULE = 'rgba(12, 21, 32, 0.10)'

export const space = {
  tight: 1, // 8
  related: 2, // 16
  section: 3, // 24
  gutter: 4, // 32
} as const

/** Semantic supply / evidence / risk — domain language, not “success/error” */
export const semantic = {
  firm: '#1F3D38', // committed canopy
  atRisk: '#9A7B2F', // dry-season amber
  gap: '#8A9390', // unfilled void
  canopyHigh: '#2F6B52',
  canopyMed: '#9A7B2F',
  canopyLow: '#A84832',
  evidenceFresh: '#2F6B52',
  evidenceAging: '#9A7B2F',
  evidenceMissing: '#A84832',
  signal: ACCENT,
  alert: '#A84832',
  alertSoft: '#F3E6E1',
  okSoft: '#E3EEE8',
  warnSoft: '#F3EDE0',
  mapWater: '#7BA8B0',
  mapParcel: '#5C6B4A',
  mapParcelSel: ACCENT,
} as const

/** Label taxonomy — one chip language across the product */
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
  'confidence-high': { label: 'HIGH', fg: semantic.canopyHigh, bg: semantic.okSoft, border: 'transparent' },
  'confidence-medium': { label: 'MEDIUM', fg: semantic.canopyMed, bg: semantic.warnSoft, border: 'transparent' },
  'confidence-low': { label: 'LOW', fg: semantic.canopyLow, bg: semantic.alertSoft, border: 'transparent' },
  'evidence-current': { label: 'Evidence current', fg: semantic.canopyHigh, bg: 'transparent', border: semantic.canopyHigh },
  'evidence-aging': { label: 'Evidence aging', fg: semantic.canopyMed, bg: 'transparent', border: semantic.canopyMed },
  'evidence-missing': { label: 'Evidence missing', fg: semantic.canopyLow, bg: 'transparent', border: semantic.canopyLow },
  'candidate-strong': { label: 'Strong candidate', fg: '#0A6E6E', bg: '#D9F2F2', border: 'transparent' },
  'visit-required': { label: 'Field visit required', fg: '#1F4A6E', bg: '#E4EEF5', border: 'transparent' },
  'concentration-risk': { label: 'Concentration risk', fg: semantic.alert, bg: semantic.alertSoft, border: 'transparent' },
  'outside-harvest': { label: 'Outside harvest window', fg: INK_MUTED, bg: 'rgba(12,21,32,0.06)', border: 'transparent' },
  verified: { label: 'Verified', fg: semantic.canopyHigh, bg: semantic.okSoft, border: 'transparent' },
  'primary-issue': { label: 'Primary issue', fg: '#FFFFFF', bg: semantic.alert, border: 'transparent' },
  'constraint-pass': { label: 'Pass', fg: semantic.canopyHigh, bg: semantic.okSoft, border: 'transparent' },
  'constraint-fail': { label: 'Fails constraint', fg: semantic.alert, bg: semantic.alertSoft, border: 'transparent' },
}

export const typographyScale = {
  display: { size: '2.75rem', weight: 700, tracking: '-0.03em', line: 1.05 },
  title: { size: '1.375rem', weight: 700, tracking: '-0.02em', line: 1.2 },
  subtitle: { size: '0.9375rem', weight: 650, tracking: '-0.01em', line: 1.35 },
  body: { size: '0.8125rem', weight: 500, tracking: '0', line: 1.5 },
  meta: { size: '0.6875rem', weight: 500, tracking: '0.01em', line: 1.4 },
  overline: { size: '0.625rem', weight: 700, tracking: '0.14em', line: 1.3 },
  dataLg: { size: '2rem', weight: 700, tracking: '-0.02em', line: 1 },
  dataMd: { size: '1.25rem', weight: 700, tracking: '-0.01em', line: 1 },
  dataSm: { size: '0.8125rem', weight: 700, tracking: '0', line: 1.2 },
} as const
