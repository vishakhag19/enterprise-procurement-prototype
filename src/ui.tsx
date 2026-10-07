import {
  Box,
  Button,
  Chip,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import { STATUS_META, StatusKind, space, INK, PANEL_BORDER, panelSurface, shape, m3, meter, shellChrome, CARD_SELECTION_BG } from './designSystem'

/** Shared control size — every Primary / Secondary / Ghost button matches */
const btnBaseSx = {
  flexShrink: 0,
  minHeight: 40,
  height: 40,
  py: 0,
  px: 6,
  fontSize: '0.875rem',
  fontWeight: 650,
  lineHeight: 1.25,
  boxSizing: 'border-box',
} as const

/**
 * Desktop tab chrome matching Compare: fixed header, scroll body, fixed footer.
 * Header/footer children sit in a full-width row with vertical centering.
 */
export function MainPane({
  header,
  footer,
  children,
  map,
  headerSx,
  footerSx,
}: {
  header: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  map?: React.ReactNode
  headerSx?: Record<string, unknown>
  footerSx?: Record<string, unknown>
}) {
  const barSx = {
    px: space.section,
    py: space.related,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  } as const

  const barInnerSx = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.related,
  } as const

  return (
    <Box sx={{ display: 'flex', height: '100%', gap: space.tight, overflow: 'hidden' }}>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          ...shellChrome,
          bgcolor: m3.surfaceContainerLowest,
        }}
      >
        <Box sx={{ ...barSx, borderBottom: `1px solid ${PANEL_BORDER}`, ...headerSx }}>
          <Box sx={barInnerSx}>{header}</Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            p: space.section,
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {children}
        </Box>

        {footer != null && (
          <Box sx={{ ...barSx, borderTop: `1px solid ${PANEL_BORDER}`, ...footerSx }}>
            <Box sx={barInnerSx}>{footer}</Box>
          </Box>
        )}
      </Box>
      {map}
    </Box>
  )
}

export function StatusChip({ kind }: { kind: StatusKind }) {
  const meta = STATUS_META[kind]
  return (
    <Chip
      size="small"
      label={meta.label}
      sx={{
        height: 24,
        fontSize: 11,
        fontWeight: 650,
        letterSpacing: '0.02em',
        textTransform: kind === 'primary-issue' || kind.startsWith('confidence') ? 'uppercase' : 'none',
        color: meta.fg,
        bgcolor: meta.bg === 'transparent' ? 'transparent' : meta.bg,
        border: meta.border === 'transparent' ? 'none' : `1px solid ${meta.border}`,
        '& .MuiChip-label': { px: 2.5 },
      }}
    />
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      component="p"
      sx={{
        display: 'block',
        mb: space.tight,
        color: m3.onSurfaceVariant,
      }}
    >
      {children}
    </Typography>
  )
}

export function DashPaper({
  children,
  sx,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode
  sx?: object
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        // MD3 large card: 16dp padding + unified hairline chrome
        p: space.related,
        ...panelSurface,
        boxShadow: 'none',
        ...sx,
      }}
    >
      {children}
    </Paper>
  )
}

/** Open data strip — surface-container tonal band */
export function DataStrip({ children, sx }: { children: React.ReactNode; sx?: object }) {
  return (
    <Box
      sx={{
        // MD3 list row: 16dp vertical + horizontal
        py: space.related,
        px: space.related,
        borderBottom: `1px solid ${PANEL_BORDER}`,
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export function PrimaryBtn(props: React.ComponentProps<typeof Button> & { fullWidth?: boolean }) {
  const { children, fullWidth, sx, ...rest } = props
  return (
    <Button variant="contained" color="primary" fullWidth={fullWidth} sx={{ ...btnBaseSx, ...sx }} {...rest}>
      {children}
    </Button>
  )
}

/** Outlined brand secondary — same height as PrimaryBtn */
export function SecondaryBtn(props: React.ComponentProps<typeof Button> & { fullWidth?: boolean }) {
  const { children, fullWidth, sx, ...rest } = props
  return (
    <Button variant="outlined" color="primary" fullWidth={fullWidth} sx={{ ...btnBaseSx, ...sx }} {...rest}>
      {children}
    </Button>
  )
}

export function GhostBtn(props: React.ComponentProps<typeof Button>) {
  const { children, sx, ...rest } = props
  return (
    <Button variant="text" color="primary" sx={{ ...btnBaseSx, minWidth: 0, px: 3, ...sx }} {...rest}>
      {children}
    </Button>
  )
}

export function SupplyBar({
  firm,
  atRisk,
  total,
}: {
  firm: number
  atRisk: number
  total: number
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        height: meter.height,
        borderRadius: `${meter.radius}px`,
        overflow: 'hidden',
        bgcolor: meter.track,
      }}
    >
      <Box sx={{ width: `${(firm / total) * 100}%`, bgcolor: m3.primary }} />
      <Box sx={{ width: `${(atRisk / total) * 100}%`, bgcolor: m3.secondary }} />
    </Box>
  )
}

export function WeekRail({
  weeks,
}: {
  weeks: { n: number; committed: number; target: number; delta: number; issue: boolean }[]
}) {
  const maxBar = Math.max(...weeks.map(w => w.target))
  return (
    <Stack spacing={0}>
      {weeks.map((w, i) => {
        const pct = (w.committed / maxBar) * 100
        const tPct = (w.target / maxBar) * 100
        const isLast = i === weeks.length - 1
        return (
          <Box
            key={w.n}
            sx={{
              // MD3: 16dp row padding; full-bleed bg to card edges
              py: space.related,
              px: space.related,
              borderBottom: isLast ? 'none' : `1px solid ${PANEL_BORDER}`,
              bgcolor: w.issue ? m3.errorContainer : 'transparent',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: space.tight }}>
              <Stack direction="row" spacing={space.tight} sx={{ alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ color: w.issue ? m3.onErrorContainer : m3.onSurface }}>
                  Week {w.n}
                </Typography>
                {w.issue && <StatusChip kind="primary-issue" />}
              </Stack>
              <Stack direction="row" spacing={space.compact} sx={{ alignItems: 'baseline' }}>
                <Typography variant="subtitle2" sx={{ color: w.issue ? m3.onErrorContainer : m3.onSurface, fontVariantNumeric: 'tabular-nums' }}>
                  {w.committed.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums', color: w.issue ? m3.onErrorContainer : m3.onSurfaceVariant }}>
                  / {w.target.toLocaleString()} t
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: w.issue ? m3.error : w.delta >= 0 ? m3.success : m3.error,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {w.delta > 0 ? `+${w.delta}` : w.delta} t
                </Typography>
              </Stack>
            </Stack>
            <Box sx={{ position: 'relative', height: meter.height, bgcolor: meter.track, borderRadius: `${meter.radius}px` }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${Math.min(pct, 100)}%`,
                  bgcolor: w.issue ? m3.error : w.delta >= 0 ? m3.primary : m3.outline,
                  borderRadius: `${meter.radius}px`,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: -3,
                  bottom: -3,
                  left: `${Math.min(tPct, 100)}%`,
                  width: 2,
                  bgcolor: INK,
                  opacity: 0.45,
                }}
              />
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}

export function ThresholdControl({
  label,
  value,
  display,
  min,
  max,
  onChange,
  modified = false,
  marks,
}: {
  label: string
  value: number
  display: string
  min: number
  max: number
  onChange: (v: number) => void
  modified?: boolean
  marks: [string, string]
}) {
  return (
    <Box
      sx={{
        p: space.related,
        bgcolor: modified ? CARD_SELECTION_BG : m3.surfaceContainerLow,
        borderRadius: `${shape.lg}px`,
        border: `1px solid ${modified ? m3.primary : PANEL_BORDER}`,
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" sx={{ color: m3.onSurface, fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ color: modified ? m3.primaryInk : m3.onSurface, fontVariantNumeric: 'tabular-nums' }}
        >
          {display}
        </Typography>
      </Stack>
      <Slider min={min} max={max} value={value} onChange={(_: Event, v: number | number[]) => onChange(v as number)} />
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>{marks[0]}</Typography>
        <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>{marks[1]}</Typography>
      </Stack>
    </Box>
  )
}

export function TradeoffBars({
  coverage,
  visits,
  maxVisits = 10,
}: {
  coverage: number
  visits: number
  maxVisits?: number
}) {
  return (
    <Stack spacing={space.related} sx={{ mt: 0 }}>
      <Box>
        <Stack direction="row" sx={{ justifyContent: 'space-between', mb: space.tight }}>
          <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>Week 3 coverage</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: m3.onSurface, fontVariantNumeric: 'tabular-nums' }}>
            {coverage}%
          </Typography>
        </Stack>
        <Box sx={{ height: meter.height, bgcolor: meter.track, borderRadius: `${meter.radius}px`, overflow: 'hidden' }}>
          <Box sx={{ width: `${Math.min(coverage, 100)}%`, height: '100%', bgcolor: m3.primary, borderRadius: `${meter.radius}px` }} />
        </Box>
      </Box>
      <Box>
        <Stack direction="row" sx={{ justifyContent: 'space-between', mb: space.tight }}>
          <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>Verification load</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: m3.onSurface, fontVariantNumeric: 'tabular-nums' }}>
            {visits} visit{visits === 1 ? '' : 's'}
          </Typography>
        </Stack>
        <Box sx={{ height: meter.height, bgcolor: meter.track, borderRadius: `${meter.radius}px`, overflow: 'hidden' }}>
          <Box
            sx={{
              width: `${Math.min((visits / maxVisits) * 100, 100)}%`,
              height: '100%',
              bgcolor: m3.secondary,
              borderRadius: `${meter.radius}px`,
            }}
          />
        </Box>
      </Box>
    </Stack>
  )
}
