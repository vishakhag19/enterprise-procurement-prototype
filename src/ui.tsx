import {
  Box,
  Button,
  Chip,
  Paper,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import { STATUS_META, StatusKind, semantic, space, INK, INK_MUTED, PAPER, RULE, ACCENT } from './designSystem'

export function StatusChip({ kind }: { kind: StatusKind }) {
  const m = STATUS_META[kind]
  return (
    <Chip
      size="small"
      label={m.label}
      sx={{
        height: 22,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: m.fg,
        bgcolor: m.bg,
        border: m.border === 'transparent' ? 'none' : `1px solid ${m.border}`,
        '& .MuiChip-label': { px: 1 },
      }}
    />
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={{ display: 'block', mb: space.tight, color: INK_MUTED, letterSpacing: '0.14em' }}
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
        p: space.related,
        bgcolor: PAPER,
        borderRadius: 1,
        border: 'none',
        ...sx,
      }}
    >
      {children}
    </Paper>
  )
}

/** Open data strip — no card chrome; for operational density */
export function DataStrip({ children, sx }: { children: React.ReactNode; sx?: object }) {
  return (
    <Box
      sx={{
        py: space.related,
        borderBottom: `1px solid ${RULE}`,
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

export function SecondaryBtn(props: React.ComponentProps<typeof Button> & { fullWidth?: boolean }) {
  const { children, fullWidth, sx, ...rest } = props
  return (
    <Button variant="outlined" color="inherit" fullWidth={fullWidth} sx={{ flexShrink: 0, ...sx }} {...rest}>
      {children}
    </Button>
  )
}

export function GhostBtn(props: React.ComponentProps<typeof Button>) {
  const { children, sx, ...rest } = props
  return (
    <Button variant="text" color="primary" sx={{ flexShrink: 0, minWidth: 0, px: 1, ...sx }} {...rest}>
      {children}
    </Button>
  )
}

/** Horizontal supply composition — firm / at-risk / gap */
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
    <Box sx={{ display: 'flex', height: 10, borderRadius: 1, overflow: 'hidden', bgcolor: 'rgba(12,21,32,0.06)' }}>
      <Box sx={{ width: `${(firm / total) * 100}%`, bgcolor: semantic.firm }} />
      <Box sx={{ width: `${(atRisk / total) * 100}%`, bgcolor: semantic.atRisk }} />
    </Box>
  )
}

/** Week position as one continuous rail (not separate cards) */
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
              py: 1.5,
              px: space.section,
              borderBottom: isLast ? 'none' : `1px solid ${RULE}`,
              bgcolor: w.issue ? 'rgba(168,72,50,0.12)' : 'transparent',
              boxShadow: w.issue ? `inset 3px 0 0 ${semantic.alert}` : 'none',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ color: INK }}>
                  Week {w.n}
                </Typography>
                {w.issue && <StatusChip kind="primary-issue" />}
              </Stack>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline' }}>
                <Typography variant="subtitle2" sx={{ color: INK, fontVariantNumeric: 'tabular-nums' }}>
                  {w.committed.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  / {w.target.toLocaleString()} t
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: w.delta >= 0 ? semantic.canopyHigh : semantic.alert, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
                >
                  {w.delta > 0 ? `+${w.delta}` : w.delta} t
                </Typography>
              </Stack>
            </Stack>
            <Box sx={{ position: 'relative', height: 6, bgcolor: 'rgba(12,21,32,0.06)', borderRadius: 1 }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${Math.min(pct, 100)}%`,
                  bgcolor: w.issue ? semantic.alert : w.delta >= 0 ? semantic.firm : semantic.gap,
                  borderRadius: 1,
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
                  opacity: 0.55,
                }}
              />
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}

/** Constraint threshold control — enterprise planning feel */
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
        bgcolor: modified ? semantic.warnSoft : 'rgba(12,21,32,0.02)',
        borderRadius: 1,
        borderLeft: modified ? `3px solid ${semantic.canopyMed}` : `3px solid transparent`,
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" sx={{ color: INK, fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ color: modified ? semantic.canopyMed : INK, fontVariantNumeric: 'tabular-nums' }}
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

/** Tradeoff spark — coverage vs verification visits */
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
    <Stack spacing={1} sx={{ mt: 1 }}>
      <Box>
        <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption">Week 3 coverage</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: INK }}>
            {coverage}%
          </Typography>
        </Stack>
        <Box sx={{ height: 4, bgcolor: 'rgba(12,21,32,0.08)', borderRadius: 1 }}>
          <Box sx={{ width: `${coverage}%`, height: '100%', bgcolor: ACCENT, borderRadius: 1 }} />
        </Box>
      </Box>
      <Box>
        <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption">Verification load</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: INK }}>
            {visits} visit{visits === 1 ? '' : 's'}
          </Typography>
        </Stack>
        <Box sx={{ height: 4, bgcolor: 'rgba(12,21,32,0.08)', borderRadius: 1 }}>
          <Box
            sx={{
              width: `${(visits / maxVisits) * 100}%`,
              height: '100%',
              bgcolor: semantic.atRisk,
              borderRadius: 1,
            }}
          />
        </Box>
      </Box>
    </Stack>
  )
}
