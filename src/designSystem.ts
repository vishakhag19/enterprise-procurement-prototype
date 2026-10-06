/**
 * Teal-led procurement intelligence palette.
 * Anchor: #0BAFAF. Cool slate surfaces, deep teal ink, coral alert, amber caution.
 */

export const ACCENT = '#0BAFAF'
export const ACCENT_DARK = '#089090'
export const ACCENT_SOFT = '#E0F7F7'
export const SIDEBAR_BG = '#061418'

/** Cool slate canvas — clean, not muddy sage */
export const SURFACE = '#EEF2F3'
export const PAPER = '#FFFFFF'
export const INK = '#0A1A1F'
export const INK_MUTED = '#5B6B72'
export const RULE = 'rgba(10, 26, 31, 0.09)'

export const space = {
  tight: 1, // 8
  related: 2, // 16
  section: 3, // 24
  gutter: 4, // 32
} as const

/** Semantic supply / evidence / risk — keyed off the teal accent family */
export const semantic = {
  firm: '#0D5C5C',
  atRisk: '#C4872A',
  gap: '#B8C0C4',
  canopyHigh: '#0D7A6F',
  canopyMed: '#C4872A',
  canopyLow: '#D1433A',
  evidenceFresh: '#0D7A6F',
  evidenceAging: '#C4872A',
  evidenceMissing: '#D1433A',
  signal: ACCENT,
  alert: '#D1433A',
  alertSoft: '#FDECEA',
  okSoft: '#E6F5F3',
  warnSoft: '#FFF6E5',
  accentSoft: ACCENT_SOFT,
  mapWater: '#7BA8B0',
  mapParcel: '#4A6B62',
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
  'confidence-medium': { label: 'MEDIUM', fg: '#9A6410', bg: semantic.warnSoft, border: 'transparent' },
  'confidence-low': { label: 'LOW', fg: semantic.alert, bg: semantic.alertSoft, border: 'transparent' },
  'evidence-current': { label: 'Evidence current', fg: semantic.canopyHigh, bg: 'transparent', border: semantic.canopyHigh },
  'evidence-aging': { label: 'Evidence aging', fg: '#9A6410', bg: 'transparent', border: semantic.canopyMed },
  'evidence-missing': { label: 'Evidence missing', fg: semantic.alert, bg: 'transparent', border: semantic.alert },
  'candidate-strong': { label: 'Strong candidate', fg: ACCENT_DARK, bg: ACCENT_SOFT, border: 'transparent' },
  'visit-required': { label: 'Field visit required', fg: '#1F5A7A', bg: '#E5F1F7', border: 'transparent' },
  'concentration-risk': { label: 'Concentration risk', fg: semantic.alert, bg: semantic.alertSoft, border: 'transparent' },
  'outside-harvest': { label: 'Outside harvest window', fg: INK_MUTED, bg: 'rgba(10,26,31,0.06)', border: 'transparent' },
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
