import {
  Box,
  Button,
  Chip,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import { STATUS_META, StatusKind, space, INK, ACCENT, m3 } from './designSystem'

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
        // MD3 card: 16dp content padding
        p: space.related,
        bgcolor: m3.surfaceContainerLowest,
        borderRadius: '16px',
        border: 'none',
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
        borderBottom: `1px solid ${m3.outlineVariant}`,
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
    <Button variant="contained" color="primary" fullWidth={fullWidth} sx={{ flexShrink: 0, ...sx }} {...rest}>
      {children}
    </Button>
  )
}

/** MD3 filled-tonal style */
export function SecondaryBtn(props: React.ComponentProps<typeof Button> & { fullWidth?: boolean }) {
  const { children, fullWidth, sx, ...rest } = props
  return (
    <Button
      variant="contained"
      color="secondary"
      fullWidth={fullWidth}
      sx={{
        flexShrink: 0,
        bgcolor: m3.secondaryContainer,
        color: m3.onSecondaryContainer,
        '&:hover': { bgcolor: m3.secondaryContainer, filter: 'brightness(0.96)' },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Button>
  )
}

export function GhostBtn(props: React.ComponentProps<typeof Button>) {
  const { children, sx, ...rest } = props
  return (
    <Button variant="text" color="primary" sx={{ flexShrink: 0, minWidth: 0, px: 3, ...sx }} {...rest}>
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
    <Box sx={{ display: 'flex', height: 12, borderRadius: 2, overflow: 'hidden', bgcolor: m3.surfaceContainerHighest }}>
      <Box sx={{ width: `${(firm / total) * 100}%`, bgcolor: ACCENT }} />
      <Box sx={{ width: `${(atRisk / total) * 100}%`, bgcolor: m3.warning }} />
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
              borderBottom: isLast ? 'none' : `1px solid ${m3.outlineVariant}`,
              bgcolor: w.issue ? m3.errorContainer : 'transparent',
              boxShadow: w.issue ? `inset 4px 0 0 ${m3.error}` : 'none',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: space.tight }}>
              <Stack direction="row" spacing={space.tight} sx={{ alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ color: INK }}>
                  Week {w.n}
                </Typography>
                {w.issue && <StatusChip kind="primary-issue" />}
              </Stack>
              <Stack direction="row" spacing={space.compact} sx={{ alignItems: 'baseline' }}>
                <Typography variant="subtitle2" sx={{ color: INK, fontVariantNumeric: 'tabular-nums' }}>
                  {w.committed.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  / {w.target.toLocaleString()} t
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: w.delta >= 0 ? m3.success : m3.error,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {w.delta > 0 ? `+${w.delta}` : w.delta} t
                </Typography>
              </Stack>
            </Stack>
            <Box sx={{ position: 'relative', height: 8, bgcolor: m3.surfaceContainerHighest, borderRadius: 2 }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${Math.min(pct, 100)}%`,
                  bgcolor: w.issue ? m3.error : w.delta >= 0 ? ACCENT : m3.outline,
                  borderRadius: 2,
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
        bgcolor: modified ? m3.warningContainer : m3.surfaceContainerLow,
        borderRadius: 3,
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" sx={{ color: INK, fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ color: modified ? m3.warning : INK, fontVariantNumeric: 'tabular-nums' }}
        >
          {display}
        </Typography>
      </Stack>
      <Slider min={min} max={max} value={value} onChange={(_: Event, v: number | number[]) => onChange(v as number)} />
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="caption">{marks[0]}</Typography>
        <Typography variant="caption">{marks[1]}</Typography>
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
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Box>
        <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption">Week 3 coverage</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: INK, fontVariantNumeric: 'tabular-nums' }}>
            {coverage}%
          </Typography>
        </Stack>
        <Box sx={{ height: 6, bgcolor: m3.surfaceContainerHighest, borderRadius: 2 }}>
          <Box sx={{ width: `${coverage}%`, height: '100%', bgcolor: ACCENT, borderRadius: 2 }} />
        </Box>
      </Box>
      <Box>
        <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption">Verification load</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: INK, fontVariantNumeric: 'tabular-nums' }}>
            {visits} visit{visits === 1 ? '' : 's'}
          </Typography>
        </Stack>
        <Box sx={{ height: 6, bgcolor: m3.surfaceContainerHighest, borderRadius: 2 }}>
          <Box
            sx={{
              width: `${(visits / maxVisits) * 100}%`,
              height: '100%',
              bgcolor: m3.warning,
              borderRadius: 2,
            }}
          />
        </Box>
      </Box>
    </Stack>
  )
}
