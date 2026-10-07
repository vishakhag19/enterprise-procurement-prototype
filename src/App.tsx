import { useState } from 'react'
import bhimavaramFieldPhoto from './assets/bhimavaram-field.jpg'
import tanukuFieldPhoto from './assets/tanuku-field.jpg'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'
import AgricultureOutlinedIcon from '@mui/icons-material/AgricultureOutlined'
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined'
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import { alpha } from '@mui/material/styles'
import { space, semantic, m3 } from './theme'
import {
  DashPaper,
  MainPane,
  SectionLabel,
  PrimaryBtn,
  SecondaryBtn,
  GhostBtn,
  StatusChip,
  SupplyBar,
  WeekRail,
  ThresholdControl,
  TradeoffBars,
  DataStrip,
} from './ui'
import type { StatusKind } from './designSystem'
import { CARD_HOVER_BG, CARD_SELECTION_BG, INK, INK_MUTED, PAPER, PANEL_BORDER, panelSurface, shellChrome, shape, meter } from './designSystem'

// ─── Types ──────────────────────────────────────────────────────────────────
type Screen = 'coverage' | 'farms' | 'compare' | 'scenarios' | 'verification' | 'field' | 'findings' | 'plan' | 'alert'
type Conf = 'HIGH' | 'MEDIUM' | 'LOW'
type FarmRole = 'selected' | 'committed' | 'needs-verification' | 'recommended' | 'other' | 'alert'
type MapVariant = 'coverage' | 'investigation' | 'scenario' | 'plan' | 'recovery' | 'default'

// ─── Shared Atoms (domain taxonomy) ──────────────────────────────────────────

function ConfBadge({ level }: { level: Conf }) {
  const kind: StatusKind = level === 'HIGH' ? 'confidence-high' : level === 'MEDIUM' ? 'confidence-medium' : 'confidence-low'
  return <StatusChip kind={kind} />
}

type SignalType = 'STRONG_CANDIDATE' | 'HIGH_SUPPLY_UNCERTAIN' | 'REQUIRES_VERIFICATION' | 'CONCENTRATION_RISK' | 'OUTSIDE_HARVEST'

const SIGNAL_KIND: Record<SignalType, StatusKind> = {
  STRONG_CANDIDATE: 'candidate-strong',
  HIGH_SUPPLY_UNCERTAIN: 'evidence-aging',
  REQUIRES_VERIFICATION: 'visit-required',
  CONCENTRATION_RISK: 'concentration-risk',
  OUTSIDE_HARVEST: 'outside-harvest',
}

function SignalBadge({ type }: { type: SignalType }) {
  return <StatusChip kind={SIGNAL_KIND[type]} />
}

// ─── SVG Region Map ───────────────────────────────────────────────────────────

const FARM_COORDS: Record<string, { x: number; y: number }> = {
  mach:       { x: 203, y: 131 },
  reddy:      { x: 190, y: 124 },
  bhim:       { x: 236, y: 99  },
  tanuku:     { x: 250, y: 80  },
  kv:         { x: 183, y: 118 },
  eluru:      { x: 201, y: 83  },
  guntur:     { x: 144, y: 119 },
  kovvur:     { x: 254, y: 56  },
  raj:        { x: 259, y: 58  },
  godavari:   { x: 273, y: 62  },
  narsapur:   { x: 252, y: 108 },
  palakol:    { x: 254, y: 100 },
  avanigadda: { x: 185, y: 145 },
}

type FarmMapMeta = {
  name: string
  district: string
  supply: number
  harvest: string
  confidence: Conf
  evidence: string
}

const FARM_MAP_META: Record<string, FarmMapMeta> = {
  mach: { name: 'Machilipatnam Edge', district: 'Krishna', supply: 90, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Satellite and field evidence aligned' },
  reddy: { name: 'Reddy Plot', district: 'Krishna', supply: 70, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Recent evidence aligned' },
  bhim: { name: 'Bhimavaram Lot', district: 'West Godavari', supply: 250, harvest: 'Week 3', confidence: 'LOW', evidence: 'Current field evidence missing' },
  tanuku: { name: 'Tanuku Plot', district: 'West Godavari', supply: 160, harvest: 'Week 3', confidence: 'MEDIUM', evidence: 'Field confirmation is 6 weeks old' },
  kv: { name: 'Krishna Valley', district: 'Krishna', supply: 55, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Evidence current' },
  eluru: { name: 'Eluru Farm', district: 'West Godavari', supply: 65, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Evidence current' },
  guntur: { name: 'Guntur Strip', district: 'Guntur', supply: 80, harvest: 'Wk 3–4', confidence: 'MEDIUM', evidence: 'Harvest window outside ideal range' },
  kovvur: { name: 'Kovvur Fields', district: 'West Godavari', supply: 75, harvest: 'Week 3', confidence: 'MEDIUM', evidence: 'Recent field evidence needed' },
  raj: { name: 'Rajahmundry Block', district: 'East Godavari', supply: 110, harvest: 'Week 3', confidence: 'MEDIUM', evidence: 'Field verification required' },
  godavari: { name: 'Godavari Combined Block', district: 'East Godavari', supply: 200, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Monitored by satellite' },
  narsapur: { name: 'Narsapur Farms', district: 'West Godavari', supply: 180, harvest: 'Week 3', confidence: 'MEDIUM', evidence: 'Logistics risk flagged' },
  palakol: { name: 'Palakol Holdings', district: 'West Godavari', supply: 120, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Evidence current' },
  avanigadda: { name: 'Avanigadda Block', district: 'Krishna', supply: 80, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Evidence current' },
}

const DEFAULT_FARM_ROLES: Record<string, FarmRole> = {
  mach: 'selected', reddy: 'selected', bhim: 'needs-verification', tanuku: 'needs-verification',
  kv: 'recommended', eluru: 'recommended', guntur: 'other', kovvur: 'other',
  raj: 'recommended', godavari: 'committed', narsapur: 'committed', palakol: 'committed', avanigadda: 'committed',
}

function RegionMap({
  farmRoles = {},
  highlightIds = [],
  addedIds = [],
  removedIds = [],
  compact = false,
  expanded = false,
  fullscreen = false,
  variant = 'default',
  activeId = null,
  onFarmHover,
  onFarmSelect,
  onViewEvidence,
}: {
  farmRoles?: Record<string, FarmRole>
  highlightIds?: string[]
  addedIds?: string[]
  removedIds?: string[]
  compact?: boolean
  expanded?: boolean
  fullscreen?: boolean
  variant?: MapVariant
  activeId?: string | null
  onFarmHover?: (id: string | null) => void
  onFarmSelect?: (id: string) => void
  onViewEvidence?: (id: string) => void
}) {
  const roles = { ...DEFAULT_FARM_ROLES, ...farmRoles }
  const tooltipId = activeId ?? highlightIds[0] ?? null
  const tooltipMeta = tooltipId ? FARM_MAP_META[tooltipId] : null
  const tooltipPoint = tooltipId ? FARM_COORDS[tooltipId] : null

  function marker(x: number, y: number, role: FarmRole, highlighted: boolean) {
    const hi = highlighted ? 2.25 : undefined
    if (role === 'committed') {
      return <circle cx={x} cy={y} r="4.5" fill={m3.primary} stroke={m3.onSurface} strokeWidth={hi ?? 0.75} />
    }
    if (role === 'needs-verification') {
      return <circle cx={x} cy={y} r="5.5" fill={m3.surfaceContainerLowest} stroke={m3.secondary} strokeWidth={hi ?? 1.5} strokeDasharray="2 1.5" />
    }
    if (role === 'recommended') {
      return <circle cx={x} cy={y} r="5" fill={m3.surfaceContainerLowest} stroke={m3.primary} strokeWidth={hi ?? 1.5} />
    }
    if (role === 'alert') {
      return (
        <g>
          <circle cx={x} cy={y} r="7" fill={m3.error} stroke={m3.onSurface} strokeWidth={hi ?? 1} />
          <text x={x} y={y + 3} textAnchor="middle" fontSize="8" fontWeight="700" fill={m3.onError}>!</text>
        </g>
      )
    }
    return (
      <g>
        {role === 'selected' && (
          <rect
            x={x - 7}
            y={y - 7}
            width="14"
            height="14"
            fill={m3.primaryContainer}
            fillOpacity={0.55}
            stroke={m3.primary}
            strokeWidth="0.75"
            strokeDasharray="2 1"
            transform={`rotate(12 ${x} ${y})`}
          />
        )}
        <circle
          cx={x}
          cy={y}
          r={role === 'selected' ? 5.5 : 3.5}
          fill={role === 'selected' ? m3.primary : semantic.mapOtherFill}
          stroke={highlighted ? m3.primary : role === 'selected' ? m3.primaryPressed : semantic.mapOther}
          strokeWidth={hi ?? (role === 'selected' ? 1.25 : 0.75)}
        />
      </g>
    )
  }

  const viewBox = {
    coverage: '80 0 260 260',
    investigation: '125 20 175 225',
    scenario: '80 0 260 260',
    plan: '80 20 260 170',
    recovery: '150 20 190 150',
    default: '0 0 360 260',
  }[variant]
  const sizeStyle: React.CSSProperties = fullscreen
    ? { width: '100%', height: '100%', maxHeight: 'none', display: 'block' }
    : {
        coverage: expanded
          ? { width: 'calc(100% + 2rem)', marginInline: '-1rem', height: '100%', minHeight: 288, maxHeight: 'none', display: 'block' }
          : { width: '100%', maxHeight: 224, display: 'block' },
        investigation: { width: '100%', height: '100%', maxHeight: 'none', display: 'block' },
        scenario: { width: '100%', height: 208, maxHeight: 208, display: 'block' },
        plan: { width: '100%', height: 192, maxHeight: 192, display: 'block' },
        recovery: { width: '100%', height: 208, maxHeight: 208, display: 'block' },
        default: compact
          ? { width: '100%', maxHeight: 144, display: 'block' }
          : { width: '100%', maxHeight: 224, display: 'block' },
      }[variant]
  const attributionPosition = {
    coverage: { x: 108, y: 244 },
    investigation: { x: 130, y: 240 },
    scenario: { x: 108, y: 244 },
    plan: { x: 220, y: 186 },
    recovery: { x: 154, y: 166 },
    default: { x: 4, y: 256 },
  }[variant]

  return (
    <svg viewBox={viewBox} preserveAspectRatio={variant === 'coverage' || variant === 'investigation' || fullscreen ? 'xMidYMid slice' : 'xMidYMid meet'} style={sizeStyle} role="img" aria-label="Andhra Pradesh procurement geography">
      <rect width="360" height="260" fill={m3.surfaceContainerHigh} />
      <g opacity=".82" style={{ filter: 'grayscale(0.28) saturate(0.55) contrast(1.05) hue-rotate(-8deg)' }}>
        {[184, 185, 186].flatMap((tileX, col) =>
          [115, 116, 117].map((tileY, row) => (
            <image
              key={`${tileX}-${tileY}`}
              href={`https://tile.openstreetmap.org/8/${tileX}/${tileY}.png`}
              x={col * 120}
              y={row * 120 - 30}
              width="120"
              height="120"
              preserveAspectRatio="none"
            />
          ))
        )}
      </g>
      <rect width="360" height="260" fill={m3.onSurface} opacity=".04" />
      {variant === 'recovery' ? (
        <g fontSize="7.5" fontWeight="700" fill={m3.onSurfaceVariant} stroke={m3.surfaceContainerLowest} strokeWidth="2.5" paintOrder="stroke">
          <text x="207" y="145">WEST GODAVARI</text>
          <text x="257" y="34">EAST GODAVARI</text>
        </g>
      ) : variant === 'investigation' ? (
        <g fontSize="7.5" fontWeight="700" fill={m3.onSurfaceVariant} stroke={m3.surfaceContainerLowest} strokeWidth="2.5" paintOrder="stroke">
          <text x="130" y="184">GUNTUR</text>
          <text x="166" y="174">KRISHNA</text>
          <text x="207" y="157">WEST GODAVARI</text>
          <text x="257" y="34">EAST GODAVARI</text>
        </g>
      ) : (
        <g fontSize="7.5" fontWeight="700" fill={m3.onSurfaceVariant} stroke={m3.surfaceContainerLowest} strokeWidth="2.5" paintOrder="stroke">
          <text x="112" y="184">GUNTUR</text>
          <text x="166" y="174">KRISHNA</text>
          <text x="207" y="157">WEST GODAVARI</text>
          <text x="257" y="34">EAST GODAVARI</text>
        </g>
      )}
      <g>
        <rect x={attributionPosition.x} y={attributionPosition.y - 12} width="116" height="13" rx="2" fill={m3.surfaceContainerLowest} opacity=".9" />
        <text x={attributionPosition.x + 4} y={attributionPosition.y - 3} fontSize="6.5" fill={semantic.mapAttribution}>© OpenStreetMap contributors · Approx.</text>
      </g>
      {/* Farm dots */}
      {Object.entries(FARM_COORDS).map(([id, { x, y }]) => {
        const role = roles[id] ?? 'other'
        const displayRole = variant === 'recovery' && id !== 'godavari' && id !== 'raj' ? 'other' : role
        const isHighlighted = highlightIds.includes(id) || activeId === id
        return (
          <g
            key={id}
            style={onFarmSelect ? { cursor: 'pointer' } : undefined}
            onMouseEnter={() => onFarmHover?.(id)}
            onMouseLeave={() => onFarmHover?.(null)}
            onClick={() => onFarmSelect?.(id)}
          >
            <circle cx={x} cy={y} r="11" fill="transparent" />
            {marker(x, y, displayRole, isHighlighted)}
            {addedIds.includes(id) && (
              <g pointerEvents="none">
                <circle cx={x} cy={y} r="9" fill="none" stroke={m3.primary} strokeWidth="1.5" />
                <text x={x - 21} y={y - 10} fontSize="6.5" fontWeight="700" fill={m3.primary} stroke={m3.surfaceContainerLowest} strokeWidth="2" paintOrder="stroke">ADDED</text>
              </g>
            )}
            {removedIds.includes(id) && (
              <g pointerEvents="none">
                <path d={`M ${x - 6} ${y - 6} L ${x + 6} ${y + 6} M ${x + 6} ${y - 6} L ${x - 6} ${y + 6}`} stroke={m3.outline} strokeWidth="1.75" />
                <text x={x + 8} y={y - 7} fontSize="6.5" fontWeight="700" fill={m3.onSurfaceVariant} stroke={m3.surfaceContainerLowest} strokeWidth="2" paintOrder="stroke">REMOVED</text>
              </g>
            )}
          </g>
        )
      })}
      {variant === 'recovery' && (
        <g pointerEvents="none">
          <text x="185" y="45" fontSize="7" fontWeight="700" fill={m3.onSurface} stroke={m3.surfaceContainerLowest} strokeWidth="2" paintOrder="stroke">Rajahmundry recovery</text>
          <text x="280" y="79" fontSize="7" fontWeight="700" fill={m3.error} stroke={m3.surfaceContainerLowest} strokeWidth="2" paintOrder="stroke">Godavari revised</text>
        </g>
      )}
      {tooltipMeta && tooltipPoint && !compact && (
        <g transform={`translate(${variant === 'investigation' ? Math.min(Math.max(tooltipPoint.x + 8, 130), 188) : Math.min(tooltipPoint.x + 12, 224)} ${Math.max(tooltipPoint.y - 58, variant === 'investigation' ? 22 : 8)})`}>
          <rect width="108" height="55" rx={shape.md} fill={m3.surfaceContainerLowest} stroke={PANEL_BORDER} />
          <text x="7" y="12" fontSize="7.5" fontWeight="700" fill={m3.onSurface}>{tooltipMeta.name}</text>
          <text x="7" y="22" fontSize="6.5" fill={m3.onSurfaceVariant}>{tooltipMeta.district}</text>
          <text x="7" y="34" fontSize="7" fontWeight="600" fill={m3.onSurface}>{tooltipMeta.supply} t · {tooltipMeta.harvest}</text>
          <text x="7" y="45" fontSize="6.5" fontWeight="700" fill={m3.onSurfaceVariant}>{tooltipMeta.confidence} confidence</text>
          {onViewEvidence ? (
            <text
              x="103"
              y="51"
              textAnchor="end"
              fontSize="6.5"
              fontWeight="600"
              fill={m3.primary}
              style={{ cursor: 'pointer' }}
              onClick={() => tooltipId && onViewEvidence(tooltipId)}
            >
              View evidence
            </text>
          ) : (
            <text x="7" y="52" fontSize="6" fill={m3.onSurfaceVariant}>{tooltipMeta.evidence}</text>
          )}
        </g>
      )}
    </svg>
  )
}

type LegendItem = { role: FarmRole; label: string }

const DOT_STYLE: Record<FarmRole, React.CSSProperties> = {
  selected: { background: m3.primary, border: `2px solid ${m3.primary}`, boxShadow: `0 0 0 3px ${alpha(m3.primary, 0.1)}` },
  committed: { background: m3.primary, border: `2px solid ${m3.primary}` },
  'needs-verification': { background: m3.surfaceContainerLowest, border: `2px dashed ${m3.secondary}` },
  recommended: { background: m3.surfaceContainerLowest, border: `2px solid ${alpha(m3.primary, 0.35)}` },
  other: { background: semantic.mapOtherFill, border: `1px solid ${semantic.mapOther}` },
  alert: { background: m3.error, border: `2px solid ${m3.error}` },
}

function MapLegend({ items }: { items: LegendItem[] }) {
  return (
    <Stack spacing={space.tight}>
      {items.map(({ role, label }) => (
        <Stack key={label} direction="row" spacing={space.tight} sx={{ alignItems: 'center' }}>
          <Box style={DOT_STYLE[role]} sx={{ width: 10, height: 10, flexShrink: 0, borderRadius: '50%' }} />
          <Typography variant="caption">{label}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}

const DEFAULT_LEGEND: LegendItem[] = [
  { role: 'selected',           label: 'Selected' },
  { role: 'committed',          label: 'Committed' },
  { role: 'needs-verification', label: 'Needs verification' },
  { role: 'recommended',        label: 'Recommended' },
  { role: 'other',              label: 'Other eligible' },
]

function ExpandMapButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      size="small"
      color="primary"
      aria-label="Expand map"
      sx={{ flexShrink: 0 }}
    >
      <OpenInFullIcon fontSize="small" />
    </IconButton>
  )
}

/** Fixed right-rail width — identical on every desktop tab */
const MAP_PANE_WIDTH = 400

function ExpandedMap({
  title,
  variant,
  farmRoles = {},
  addedIds = [],
  removedIds = [],
  activeId = null,
  legend,
  onClose,
}: {
  title: string
  variant: MapVariant
  farmRoles?: Record<string, FarmRole>
  addedIds?: string[]
  removedIds?: string[]
  activeId?: string | null
  legend: LegendItem[]
  onClose: () => void
}) {
  return (
    <Dialog open onClose={onClose} maxWidth="lg" fullWidth slotProps={{ paper: { sx: { height: '78vh', display: 'flex', flexDirection: 'column' } } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: space.related, py: space.related }}>
        <Box>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="caption">Same procurement geography and current marker state</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Close expanded map" size="small"><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ flex: 1, minHeight: 0, p: space.section, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <RegionMap
            fullscreen
            variant={variant}
            farmRoles={farmRoles}
            addedIds={addedIds}
            removedIds={removedIds}
            activeId={activeId}
          />
        </Box>
      </DialogContent>
      <Divider />
      <Box sx={{ px: space.section, py: space.related }}>
        <MapLegend items={legend} />
      </Box>
    </Dialog>
  )
}

/**
 * Shared map chrome for every desktop tab:
 * header (title + subtitle + expand) → map fill → legend → optional footer.
 * Always docked right at MAP_PANE_WIDTH.
 */
function MapPane({
  variant = 'coverage',
  legend = DEFAULT_LEGEND,
  farmRoles,
  addedIds,
  removedIds,
  highlightIds,
  activeId,
  onFarmHover,
  onFarmSelect,
  onViewEvidence,
  footer,
  expandedTitle = 'Week 3 · Supply Geography',
  expanded,
  onExpandedChange,
}: {
  variant?: MapVariant
  legend?: LegendItem[]
  farmRoles?: Record<string, FarmRole>
  addedIds?: string[]
  removedIds?: string[]
  highlightIds?: string[]
  activeId?: string | null
  onFarmHover?: (id: string | null) => void
  onFarmSelect?: (id: string) => void
  onViewEvidence?: (id: string) => void
  footer?: React.ReactNode
  expandedTitle?: string
  expanded?: boolean
  onExpandedChange?: (open: boolean) => void
}) {
  const [internalExpanded, setInternalExpanded] = useState(false)
  const mapExpanded = expanded ?? internalExpanded
  const setMapExpanded = (open: boolean) => {
    onExpandedChange?.(open)
    if (expanded === undefined) setInternalExpanded(open)
  }

  return (
    <>
      <Box
        sx={{
          width: MAP_PANE_WIDTH,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          ...shellChrome,
          bgcolor: PAPER,
        }}
      >
        <Box
          sx={{
            p: space.related,
            borderBottom: `1px solid ${PANEL_BORDER}`,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: space.related,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <SectionLabel>Week 3 · Supply Geography</SectionLabel>
            <Typography variant="body2">AP region · Satellite + field markers</Typography>
          </Box>
          <ExpandMapButton onClick={() => setMapExpanded(true)} />
        </Box>

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <RegionMap
            fullscreen
            variant={variant}
            farmRoles={farmRoles}
            addedIds={addedIds}
            removedIds={removedIds}
            highlightIds={highlightIds}
            activeId={activeId}
            onFarmHover={onFarmHover}
            onFarmSelect={onFarmSelect}
            onViewEvidence={onViewEvidence}
          />
        </Box>

        <Box sx={{ p: space.related, borderTop: `1px solid ${PANEL_BORDER}` }}>
          <MapLegend items={legend} />
        </Box>

        {footer != null && (
          <Box sx={{ p: space.related, borderTop: `1px solid ${PANEL_BORDER}` }}>
            {footer}
          </Box>
        )}
      </Box>

      {mapExpanded && (
        <ExpandedMap
          title={expandedTitle}
          variant={variant}
          farmRoles={farmRoles}
          addedIds={addedIds}
          removedIds={removedIds}
          activeId={activeId}
          legend={legend}
          onClose={() => setMapExpanded(false)}
        />
      )}
    </>
  )
}

const FARM_DECISION_CONTEXT: Record<string, { verification: string; risk: string }> = {
  'Machilipatnam Edge': { verification: 'Not required', risk: 'No material risk identified' },
  'Reddy Plot': { verification: 'Not required', risk: 'No material risk identified' },
  'Bhimavaram Lot': { verification: 'Required', risk: 'Standing stock unverified; potential 20–30% yield variance' },
  'Tanuku Plot': { verification: 'Required', risk: 'Crop condition may have changed since the last field visit' },
  'Krishna Valley': { verification: 'Not required', risk: 'No material risk identified' },
  'Eluru Farm': { verification: 'Not required', risk: 'No material risk identified' },
  'Guntur Strip': { verification: 'Not required', risk: 'Harvest window extends into Week 4' },
  'Kovvur Fields': { verification: 'Required', risk: 'Recent field evidence is unavailable' },
  'Rajahmundry Block': { verification: 'Required', risk: 'Current field evidence is required before committing' },
}

function FarmDecisionPanel({
  farmName,
  onClose,
  onInspectMap,
}: {
  farmName: string
  onClose: () => void
  onInspectMap: (id: string) => void
}) {
  const entry = Object.entries(FARM_MAP_META).find(([, farm]) => farm.name === farmName)
  if (!entry) return null
  const [farmId, farm] = entry
  const context = FARM_DECISION_CONTEXT[farmName] ?? { verification: 'Not required', risk: 'No material risk identified' }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: space.related }}>
        <Box>
          <Typography variant="subtitle1">{farm.name}</Typography>
          <Typography variant="caption">{farm.district} district</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Close farm details" size="small"><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.related }}>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>Expected supply</Typography>
            <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }} variant="subtitle1">{farm.supply} t · {farm.harvest}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>Confidence</Typography>
            <ConfBadge level={farm.confidence} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>Evidence status</Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>{farm.evidence}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>Verification</Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>{context.verification}</Typography>
          </Box>
          <Box sx={{ gridColumn: '1 / -1', borderTop: 1, borderColor: 'divider', pt: space.related }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>Relevant risk</Typography>
            <Typography variant="body2" color="text.primary">{context.risk}</Typography>
          </Box>
        </Box>
        <Button color="primary" onClick={() => onInspectMap(farmId)} sx={{ mt: space.section, px: 0, minWidth: 0 }}>
          Inspect location on map →
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function SatelliteThumbnail({ degraded = false }: { degraded?: boolean }) {
  return (
    <svg viewBox="0 0 180 96" style={{ width: '100%', height: 96, borderRadius: shape.lg, border: `1px solid ${PANEL_BORDER}` }} role="img" aria-label={degraded ? 'Current satellite field condition' : 'Previous satellite field condition'}>
      <rect width="180" height="96" fill="#d8d7c7" />
      <path d="M0 0 H70 L61 43 L0 37 Z" fill={degraded ? '#a9a77e' : '#718b55'} />
      <path d="M73 0 H132 L126 42 L64 42 Z" fill={degraded ? '#b3ad75' : '#809a5c'} />
      <path d="M135 0 H180 V39 L129 42 Z" fill={degraded ? '#9d9a71' : '#68834c'} />
      <path d="M0 41 L61 47 L55 96 H0 Z" fill={degraded ? '#b8ae76' : '#79925a'} />
      <path d="M64 46 L125 46 L119 96 H59 Z" fill={degraded ? '#9f9563' : '#66844b'} />
      <path d="M129 46 L180 42 V96 H123 Z" fill={degraded ? '#b4aa75' : '#759052'} />
      <path d="M0 39 L180 44" stroke="#eee9dc" strokeWidth="3" />
      <path d="M62 0 L57 96 M130 0 L121 96" stroke="#eee9dc" strokeWidth="2" />
      <path d="M12 82 C50 68 87 73 119 58 C143 47 159 51 180 43" fill="none" stroke="#b9d7de" strokeWidth="2" />
      <rect x="7" y="7" width="44" height="15" rx="2" fill="#111827" opacity=".78" />
      <text x="13" y="17" fontSize="7" fill="#ffffff" fontWeight="600">FIELD BOUNDARY</text>
    </svg>
  )
}

function EvidenceModal({ farmId, onClose, recovery = false }: { farmId: string; onClose: () => void; recovery?: boolean }) {
  const farm = FARM_MAP_META[farmId]
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: space.related }}>
        <Box>
          <Typography variant="overline" sx={{ color: m3.primaryInk }}>Satellite + Field Evidence</Typography>
          <Typography variant="subtitle1">{farm.name}</Typography>
          <Typography variant="caption">{farm.district} district · Approximate field location</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Close evidence" size="small"><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, mb: 4 }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'text.secondary' }}>{recovery || farm.confidence === 'LOW' ? 'Previous observation' : 'Satellite observation'}</Typography>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{recovery ? '14 days ago' : farm.confidence === 'LOW' ? 'Current view unavailable' : 'Updated 2 days ago'}</Typography>
              </Box>
              <SatelliteThumbnail />
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', mt: 2 }}>
                {farm.confidence === 'LOW' && !recovery
                  ? <><Box component="strong" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, display: 'inline' }}>NDVI —</Box> · Current reading inconclusive due to cloud cover</>
                  : <><Box component="strong" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, display: 'inline' }}>{recovery ? 'NDVI 0.68' : farmId === 'mach' ? 'NDVI 0.74' : 'NDVI 0.66'}</Box> · Vegetation condition: Healthy</>}
              </Typography>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'text.secondary' }}>{recovery ? 'Current observation' : 'Field evidence'}</Typography>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>{recovery ? 'Updated 2 days ago' : farm.confidence === 'LOW' ? 'Not available' : 'Confirmed recently'}</Typography>
              </Box>
              {recovery ? <SatelliteThumbnail degraded /> : (
                <Box sx={{ height: 96, borderRadius: `${shape.sm}px`, border: `1px dashed ${PANEL_BORDER}`, bgcolor: m3.surfaceContainerLow, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 4, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.75rem', color: m3.onSurfaceVariant }}>{farm.evidence}</Typography>
                </Box>
              )}
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', mt: 2 }}>
                {recovery ? <><Box component="strong" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, display: 'inline' }}>NDVI 0.41</Box> · Canopy condition materially reduced</> : <>Evidence confidence: <Box component="strong" sx={{ fontWeight: 700, display: 'inline' }}>{farm.confidence}</Box></>}
              </Typography>
            </Box>
          </Box>
          <Paper
            elevation={0}
            sx={{
              p: space.related,
              bgcolor: recovery ? m3.errorContainer : CARD_SELECTION_BG,
              color: recovery ? m3.onErrorContainer : m3.onSurface,
            }}
          >
            <Typography
              variant="overline"
              sx={{ display: 'block', mb: 1, color: recovery ? m3.onErrorContainer : m3.primaryInk }}
            >
              Procurement interpretation
            </Typography>
            <Typography variant="body2" sx={{ color: recovery ? m3.onErrorContainer : m3.onSurface }}>
              {recovery
                ? 'Vegetation decline and cloud-corrected canopy analysis indicate lower standing stock. Expected supply was revised from 200 t to 80 t.'
                : `${farm.evidence}. The ${farm.confidence} confidence state summarizes evidence strength, recency, and agreement.`}
            </Typography>
          </Paper>
      </DialogContent>
    </Dialog>
  )
}

// ─── COVERAGE SCREEN ─────────────────────────────────────────────────────────

function CoverageScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const weeks = [
    { n: 1, committed: 918,  target: 900,  delta: +18,   issue: false },
    { n: 2, committed: 960,  target: 1000, delta: -40,   issue: false },
    { n: 3, committed: 580,  target: 1200, delta: -620,  issue: true  },
    { n: 4, committed: 680,  target: 900,  delta: -220,  issue: false },
  ]

  return (
    <MainPane
      header={
        <Box>
          <SectionLabel>Procurement Command Centre</SectionLabel>
          <Typography
            variant="h1"
            sx={{ color: INK, fontSize: { xs: '1.75rem', md: '2rem' } }}
          >
            4,000 t Eucalyptus
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            4-week procurement window · AP Region · Satellite + field evidence
          </Typography>
        </Box>
      }
      footer={
        <>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', flex: 1 }}>
            Week 3 still has a 620 t uncovered gap — investigate candidates next.
          </Typography>
          <PrimaryBtn onClick={() => onNavigate('farms')}>Investigate farms →</PrimaryBtn>
        </>
      }
      map={
        <MapPane
          variant="coverage"
          footer={
            <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>
              620 t gap · candidates highlighted for investigation
            </Typography>
          }
        />
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: space.section }}>
        {/* KPI strip */}
        <Box
          sx={{
            ...panelSurface,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            overflow: 'hidden',
          }}
        >
          {[
            { label: 'Week 3 gap', value: '620 t', sub: '1,200 needed · 580 committed', accent: true },
            { label: 'Firm supply', value: '2,568 t', sub: '64% of 4,000 t target', accent: false },
            { label: 'At risk', value: '570 t', sub: 'Narsapur + Avanigadda', accent: false },
            { label: 'Open gap', value: '862 t', sub: '78% committed overall', accent: false },
          ].map((kpi, i) => (
            <Box
              key={kpi.label}
              sx={{
                p: space.related,
                bgcolor: kpi.accent ? CARD_SELECTION_BG : m3.surfaceContainerLowest,
                borderRight: { md: i < 3 ? `1px solid ${PANEL_BORDER}` : 'none' },
                borderBottom: { xs: i < 2 ? `1px solid ${PANEL_BORDER}` : 'none', md: 'none' },
              }}
            >
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: kpi.accent ? m3.primaryInk : m3.onSurfaceVariant, fontWeight: 650 }}>
                {kpi.label}
              </Typography>
              <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: kpi.accent ? m3.error : INK, lineHeight: 1.1 }}>
                {kpi.value}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: m3.onSurfaceVariant }}>
                {kpi.sub}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Procurement position */}
        <Box sx={{ ...panelSurface, p: space.related }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: space.related }}>
            <SectionLabel>Procurement position</SectionLabel>
            <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, fontSize: '1.125rem', color: INK }}>4,000 t target</Typography>
          </Stack>
          <SupplyBar firm={2568} atRisk={570} total={4000} />
          <Stack direction="row" spacing={4} sx={{ mt: space.related, flexWrap: 'wrap' }}>
            {[
              { label: 'Firm', value: '2,568 t', color: semantic.firm },
              { label: 'At risk', value: '570 t', color: semantic.atRisk },
              { label: 'Open gap', value: '862 t', color: semantic.gap },
            ].map(m => (
              <Stack key={m.label} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: m.color }} />
                <Typography variant="caption">{m.label}</Typography>
                <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: INK }}>{m.value}</Typography>
              </Stack>
            ))}
            <Typography variant="caption" sx={{ ml: { md: 'auto' }, color: INK_MUTED }}>78% committed</Typography>
          </Stack>
        </Box>

        {/* Two-column dashboard: weeks + decisions */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
            gap: space.section,
            alignItems: 'start',
          }}
        >
          <Box>
            <SectionLabel>Weekly position</SectionLabel>
            <Box sx={{ ...panelSurface, overflow: 'hidden' }}>
              <WeekRail weeks={weeks} />
            </Box>
          </Box>

          <Box>
            <SectionLabel>Needs a decision</SectionLabel>
            <Stack spacing={0} sx={{ ...panelSurface, overflow: 'hidden' }}>
              <Box sx={{ p: space.related, bgcolor: CARD_SELECTION_BG, color: m3.onSurface }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1 }}>
                  <StatusChip kind="primary-issue" />
                  <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>GIS investigation</Typography>
                </Stack>
                <Typography variant="subtitle2" sx={{ color: m3.onSurface }}>Week 3 supply gap: 620 t</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: m3.onSurfaceVariant }}>
                  Candidates highlighted on the map. Resolve before committing strategy.
                </Typography>
              </Box>
              {[
                { title: '3 commitments at risk', sub: '570 t · Narsapur + Avanigadda', cta: 'Review' },
                { title: '7 farms changed', sub: 'Condition, harvest, or supply', cta: 'Review' },
                { title: '5 evidence blocked', sub: 'Awaiting field or satellite', cta: 'Resolve' },
              ].map((item, i) => (
                <DataStrip key={item.title} sx={{ bgcolor: PAPER, borderBottom: i === 2 ? 'none' : undefined, py: space.tight }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ color: INK }}>{item.title}</Typography>
                      <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>{item.sub}</Typography>
                    </Box>
                    <GhostBtn onClick={() => onNavigate('farms')} sx={{ height: 32, minHeight: 32, px: 2 }}>
                      {item.cta}
                    </GhostBtn>
                  </Stack>
                </DataStrip>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </MainPane>
  )
}

// ─── FARMS SCREEN ────────────────────────────────────────────────────────────

type Farm = {
  id: string
  name: string
  district: string
  supply: number
  harvest: string
  confidence: Conf
  signals: SignalType[]
  why: string
  evidenceStatus?: string
  evidenceNote?: string
  missing?: string
  verified: boolean
  mapId: string
}

const RECOMMENDED_FARMS: Farm[] = [
  {
    id: 'mach', name: 'Machilipatnam Edge', district: 'Krishna district', supply: 90,
    harvest: 'Week 3', confidence: 'HIGH', signals: ['STRONG_CANDIDATE'],
    why: 'Harvest timing aligns with Week 3 demand.',
    evidenceStatus: 'Evidence current', evidenceNote: 'Satellite and field evidence aligned.',
    verified: true, mapId: 'mach',
  },
  {
    id: 'reddy', name: 'Reddy Plot', district: 'Krishna district', supply: 70,
    harvest: 'Week 3', confidence: 'HIGH', signals: ['STRONG_CANDIDATE'],
    why: 'Harvest timing aligns with Week 3.',
    evidenceStatus: 'Evidence current', evidenceNote: 'Recent field and satellite evidence aligned.',
    verified: true, mapId: 'reddy',
  },
  {
    id: 'bhim', name: 'Bhimavaram Lot', district: 'West Godavari district', supply: 250,
    harvest: 'Week 3', confidence: 'LOW', signals: ['HIGH_SUPPLY_UNCERTAIN', 'REQUIRES_VERIFICATION'],
    why: 'Largest available block.',
    evidenceStatus: 'Evidence missing', evidenceNote: 'No current satellite or field confirmation.',
    missing: 'Current field evidence · Verification required', verified: false, mapId: 'bhim',
  },
  {
    id: 'tanuku', name: 'Tanuku Plot', district: 'West Godavari district', supply: 160,
    harvest: 'Week 3', confidence: 'MEDIUM', signals: ['HIGH_SUPPLY_UNCERTAIN', 'REQUIRES_VERIFICATION', 'CONCENTRATION_RISK'],
    why: 'Strong supply contribution within harvest window.',
    evidenceStatus: 'Evidence incomplete', evidenceNote: 'Last field confirmation was 6 weeks ago.',
    missing: 'Recent field evidence · Verification required', verified: false, mapId: 'tanuku',
  },
]

const OTHER_FARMS: Farm[] = [
  {
    id: 'kv', name: 'Krishna Valley', district: 'Krishna district', supply: 55,
    harvest: 'Week 3', confidence: 'HIGH', signals: ['STRONG_CANDIDATE'],
    why: 'Consistent supply contributor.',
    evidenceStatus: 'Evidence current', evidenceNote: 'Recent field and satellite evidence aligned.',
    verified: true, mapId: 'kv',
  },
  {
    id: 'eluru', name: 'Eluru Farm', district: 'West Godavari district', supply: 65,
    harvest: 'Week 3', confidence: 'HIGH', signals: ['STRONG_CANDIDATE'],
    why: 'Strong satellite readings and consistent past delivery make this a reliable contributor.',
    evidenceStatus: 'Evidence current', evidenceNote: 'Satellite and delivery evidence aligned.',
    verified: true, mapId: 'eluru',
  },
  {
    id: 'guntur', name: 'Guntur Strip', district: 'Guntur district', supply: 80,
    harvest: 'Wk 3–4', confidence: 'MEDIUM', signals: ['OUTSIDE_HARVEST'],
    why: 'Adequate supply and suitable harvest window.',
    evidenceStatus: 'Evidence incomplete', evidenceNote: 'Harvest timing remains variable.',
    verified: true, mapId: 'guntur',
  },
  {
    id: 'kovvur', name: 'Kovvur Fields', district: 'West Godavari district', supply: 75,
    harvest: 'Week 3', confidence: 'MEDIUM', signals: ['REQUIRES_VERIFICATION'],
    why: 'Useful supply contribution from a distributed location.',
    evidenceStatus: 'Evidence incomplete', evidenceNote: 'Recent field confirmation is needed.',
    missing: 'Recent field evidence · Verification required', verified: false, mapId: 'kovvur',
  },
  {
    id: 'raj', name: 'Rajahmundry Block', district: 'East Godavari district', supply: 110,
    harvest: 'Week 3', confidence: 'MEDIUM', signals: ['REQUIRES_VERIFICATION'],
    why: 'Useful for geographic diversification.',
    evidenceStatus: 'Evidence incomplete', evidenceNote: 'Current field confirmation is needed.',
    missing: 'Current field evidence · Verification required', verified: false, mapId: 'raj',
  },
]

function FarmCard({
  farm,
  inComparison,
  onToggle,
  onViewEvidence,
  hoverId,
  onHover,
}: {
  farm: Farm
  inComparison: boolean
  onToggle: (id: string) => void
  onViewEvidence: (id: string) => void
  hoverId: string | null
  onHover: (id: string | null) => void
}) {
  const isHovered = hoverId === farm.id
  const cardBg = inComparison
    ? CARD_SELECTION_BG
    : isHovered
      ? CARD_HOVER_BG
      : 'background.paper'
  return (
    <DashPaper
      onMouseEnter={() => onHover(farm.id)}
      onMouseLeave={() => onHover(null)}
      sx={{
        cursor: 'pointer',
        transition: 'background-color 0.15s, border-color 0.15s',
        bgcolor: cardBg,
        border: `1px solid ${PANEL_BORDER}`,
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: space.tight }}>
        <Box>
          <Typography variant="subtitle2" sx={{ color: m3.onSurface }}>{farm.name}</Typography>
          <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>{farm.district}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }} variant="h6">{farm.supply} t</Typography>
          <Typography variant="caption">{farm.harvest}</Typography>
        </Box>
      </Stack>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: space.tight, mb: space.tight }}>
        <ConfBadge level={farm.confidence} />
        {farm.signals.map(s => <SignalBadge key={s} type={s} />)}
      </Stack>
      {farm.evidenceStatus && farm.evidenceNote && (
        <Typography variant="caption" sx={{ display: 'block', mb: space.tight }}>
          <Box component="strong" sx={{ color: 'text.primary' }}>{farm.evidenceStatus}</Box> · {farm.evidenceNote}
        </Typography>
      )}
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Why recommended</Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>{farm.why}</Typography>
      {farm.missing && (
        <Typography variant="body2" color="text.primary"><Box component="strong" sx={{ fontWeight: 700, display: 'inline' }}>Missing:</Box> {farm.missing}</Typography>
      )}
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: space.related }}>
        <GhostBtn onClick={() => onViewEvidence(farm.id)}>View evidence</GhostBtn>
        <Button
          variant={inComparison ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => onToggle(farm.id)}
          startIcon={inComparison ? <CheckIcon sx={{ fontSize: 18 }} /> : undefined}
          sx={{ minHeight: 40, height: 40, py: 0, px: 6, fontSize: '0.875rem', fontWeight: 650 }}
        >
          {inComparison ? 'Added to comparison' : 'Add to comparison'}
        </Button>
      </Stack>
    </DashPaper>
  )
}

function FarmsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [comparison, setComparison] = useState<string[]>(['mach', 'reddy', 'bhim', 'tanuku'])
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>('mach')
  const [evidenceFarm, setEvidenceFarm] = useState<string | null>(null)

  const toggle = (id: string) => {
    setComparison(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const activeFarmId = hoverId ?? focusedId
  const highlightIds = activeFarmId ? [activeFarmId] : []

  return (
    <>
      <MainPane
        header={
          <Box>
            <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'text.secondary', mb: 1 }}>Week 3 Supply Gap</Typography>
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>620 t still needed</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>1,200 t required · 580 t committed</Typography>
          </Box>
        }
        footer={
          <>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', flex: 1 }}>
              {comparison.length} farms selected for comparison
            </Typography>
            <Stack direction="row" spacing={2} sx={{ flexShrink: 0 }}>
              <SecondaryBtn onClick={() => setComparison(['mach', 'reddy', 'bhim', 'tanuku'])}>Use recommended set</SecondaryBtn>
              <PrimaryBtn onClick={() => onNavigate('compare')} disabled={comparison.length < 2}>Compare selected →</PrimaryBtn>
            </Stack>
          </>
        }
        map={
          <MapPane
            variant="investigation"
            highlightIds={highlightIds}
            activeId={activeFarmId}
            onFarmHover={setHoverId}
            onFarmSelect={setFocusedId}
            onViewEvidence={setEvidenceFarm}
            footer={
              <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>
                {comparison.length} farms selected for comparison
              </Typography>
            }
          />
        }
      >
        <Box sx={{ mb: 6 }}>
          <SectionLabel>Recommended for this gap</SectionLabel>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {RECOMMENDED_FARMS.map(f => (
              <FarmCard
                key={f.id}
                farm={f}
                inComparison={comparison.includes(f.id)}
                onToggle={toggle}
                onViewEvidence={setEvidenceFarm}
                hoverId={activeFarmId}
                onHover={setHoverId}
              />
            ))}
          </Box>
        </Box>

        <Box>
          <SectionLabel>Other eligible farms · May close remaining gap or diversify supply</SectionLabel>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {OTHER_FARMS.map(f => (
              <FarmCard
                key={f.id}
                farm={f}
                inComparison={comparison.includes(f.id)}
                onToggle={toggle}
                onViewEvidence={setEvidenceFarm}
                hoverId={activeFarmId}
                onHover={setHoverId}
              />
            ))}
          </Box>
        </Box>
      </MainPane>
      {evidenceFarm && <EvidenceModal farmId={evidenceFarm} onClose={() => setEvidenceFarm(null)} />}
    </>
  )
}

// ─── COMPARE SCREEN ───────────────────────────────────────────────────────────

const COMPARE_FARMS = [
  {
    id: 'mach', name: 'Machilipatnam Edge', district: 'Krishna',
    headline: 'Best for supply certainty',
    summary: 'Highest confidence with solid satellite and field evidence.',
    gapPct: 15, gapNote: 'no additional verification',
    supply: 90, confidence: 'HIGH' as Conf, verifReq: false,
    history: '87t (Season 1)', satellite: 'Healthy — NDVI 0.74',
    field: 'Confirmed 6 weeks ago', missing: 'None — evidence gap closed.',
    risks: 'None identified', harvest: 'Week 3',
    whyConf: 'Stable historical yield, healthy satellite readings, and current field evidence align.',
  },
  {
    id: 'reddy', name: 'Reddy Plot', district: 'Krishna',
    headline: 'Best all-round contribution',
    summary: 'Reliable yield, verified evidence, Week 3 harvest window aligns cleanly.',
    gapPct: 11, gapNote: 'no additional verification',
    supply: 70, confidence: 'HIGH' as Conf, verifReq: false,
    history: '66t (Season 2)', satellite: 'Healthy — NDVI 0.71',
    field: 'Confirmed 4 weeks ago', missing: 'None — evidence gap closed.',
    risks: 'None identified', harvest: 'Week 3',
    whyConf: 'Stable historical yield, healthy satellite readings, and current field evidence align.',
  },
  {
    id: 'bhim', name: 'Bhimavaram Lot', district: 'West Godavari',
    headline: 'Highest expected supply',
    summary: 'Largest single block available. Requires field verification before committing.',
    gapPct: 40, gapNote: 'requires one field verification',
    supply: 250, confidence: 'LOW' as Conf, verifReq: true,
    history: '231t (Season 1)', satellite: 'Inconclusive — cloud cover',
    field: 'None available', missing: 'No current field evidence. Standing stock unconfirmed. Yield estimate based on prior season data only.',
    risks: 'Standing stock unverified; potential 20–30% yield variance', harvest: 'Week 3',
    whyConf: 'Estimate based on prior season only. No current satellite or field evidence available.',
  },
  {
    id: 'tanuku', name: 'Tanuku Plot', district: 'West Godavari',
    headline: 'Strong supply, evidence gap',
    summary: 'Good historical performance. Missing recent field evidence is the only barrier.',
    gapPct: 26, gapNote: 'requires one field verification',
    supply: 160, confidence: 'MEDIUM' as Conf, verifReq: true,
    history: '148t (Season 2)', satellite: 'Moderate — NDVI 0.63',
    field: 'Last confirmed 6 weeks ago', missing: 'Missing current field evidence. Last field visit was 6 weeks ago. Crop status may have changed.',
    risks: 'Crop condition change possible since last visit', harvest: 'Week 3',
    whyConf: 'Supply and timing are adequate but evidence is incomplete or variable.',
  },
]

const TABLE_ROWS = [
  { key: 'supply', label: 'Expected supply' },
  { key: 'harvest', label: 'Harvest window' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'whyConf', label: 'Why this confidence' },
  { key: 'history', label: 'Historical delivery' },
  { key: 'satellite', label: 'Satellite condition' },
  { key: 'field', label: 'Field evidence' },
  { key: 'missing', label: 'Missing / needed evidence' },
  { key: 'risks', label: 'Risks' },
  { key: 'verifReq', label: 'Field visit required' },
]

function CompareScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <MainPane
      header={
        <Box>
          <SectionLabel>Candidate Comparison</SectionLabel>
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>4 farms · Week 3</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>Scenario planning can add or substitute farms from the full eligible pool.</Typography>
        </Box>
      }
      footer={
        <>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', flex: 1 }}>
            Scenario planning can consider these candidates and other eligible farms. The manually compared farms do not limit scenario generation.
          </Typography>
          <PrimaryBtn onClick={() => onNavigate('scenarios')} sx={{ flexShrink: 0 }}>Plan a scenario →</PrimaryBtn>
        </>
      }
      map={
        <MapPane
          variant="investigation"
          farmRoles={{
            mach: 'selected',
            reddy: 'selected',
            bhim: 'needs-verification',
            tanuku: 'needs-verification',
          }}
          footer={
            <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>
              4 farms in comparison · map mirrors candidate set
            </Typography>
          }
        />
      }
    >
      <Box sx={{ mb: 8 }}>
        <SectionLabel>Interpretation</SectionLabel>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {COMPARE_FARMS.map(f => (
            <DashPaper key={f.id} sx={{ p: space.related }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'text.primary', mb: 1 }}>{f.name}</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 650, color: 'text.secondary', mb: 2 }}>{f.headline}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 4 }}>{f.summary}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', mb: 4 }}>
                Closes <Box component="strong" sx={{ fontWeight: 700, display: 'inline' }}>{f.gapPct}%</Box> of the remaining 620 t Week 3 gap
                {f.gapNote ? `, but ${f.gapNote}.` : '.'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.125rem', fontWeight: 700, color: 'text.primary' }}>{f.supply} t</Box>
                <ConfBadge level={f.confidence} />
                <Box component="span" sx={{ fontSize: 10, color: 'text.secondary' }}>
                  {f.confidence === 'HIGH' ? 'Evidence current' : f.confidence === 'MEDIUM' ? 'Evidence incomplete' : 'Evidence missing'}
                </Box>
                {f.verifReq && <Box component="span" sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 500 }}>verif. req.</Box>}
              </Box>
            </DashPaper>
          ))}
        </Box>
      </Box>

      <Box>
        <SectionLabel>Detailed Comparison</SectionLabel>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 176, position: 'sticky', left: 0, bgcolor: m3.surfaceContainerLow, zIndex: 1 }}>Attribute</TableCell>
                {COMPARE_FARMS.map(f => (
                  <TableCell key={f.id} sx={{ minWidth: 180 }}>
                    <Typography variant="subtitle2" sx={{ color: m3.onSurface }}>{f.name}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: space.xs }}>{f.district}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {TABLE_ROWS.map(({ key, label }) => (
                <TableRow key={key} hover>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 500, position: 'sticky', left: 0, bgcolor: m3.surfaceContainerLowest, verticalAlign: 'top' }}>{label}</TableCell>
                  {COMPARE_FARMS.map(f => {
                    const val = f[key as keyof typeof f]
                    if (key === 'confidence') return (
                      <TableCell key={f.id} sx={{ verticalAlign: 'top' }}>
                        <ConfBadge level={val as Conf} />
                        <Typography variant="caption" sx={{ display: 'block', mt: space.xs }}>
                          {val === 'HIGH' ? 'Evidence current' : val === 'MEDIUM' ? 'Evidence incomplete' : 'Evidence missing'}
                        </Typography>
                      </TableCell>
                    )
                    if (key === 'verifReq') return (
                      <TableCell key={f.id} sx={{ verticalAlign: 'top', fontWeight: 650, color: val ? m3.secondary : 'text.primary' }}>
                        {val ? 'Yes' : 'No'}
                      </TableCell>
                    )
                    if (key === 'supply') return (
                      <TableCell key={f.id} sx={{ fontVariantNumeric: 'tabular-nums', verticalAlign: 'top', fontWeight: 650 }}>{val} t</TableCell>
                    )
                    return (
                      <TableCell key={f.id} sx={{ verticalAlign: 'top', color: 'text.secondary' }}>{String(val)}</TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MainPane>
  )
}

// ─── SCENARIOS SCREEN ────────────────────────────────────────────────────────

type Strategy = {
  key: string
  name: string
  rationale: string
  wk3Default: number
  wk3Modified: number
  verifDefault: number
  verifModified: number
  hiconfDefault: number
  hiconfModified: number
  distDefault: number
  distModified: number
  farmsDefault: string[]
  farmsModified: string[]
  failsDefault: string[]   // which constraint keys fail by default
}

const STRATEGIES: Strategy[] = [
  {
    key: 'coverage-first',
    name: 'Coverage-First',
    rationale: 'Reaches the Week 3 target with the strongest supply contribution, but requires two field verifications.',
    wk3Default: 96, wk3Modified: 89,
    verifDefault: 2, verifModified: 1,
    hiconfDefault: 65, hiconfModified: 69,
    distDefault: 36, distModified: 23,
    farmsDefault: ['Machilipatnam Edge · 90 t', 'Reddy Plot · 70 t', 'Bhimavaram Lot · 250 t ✶', 'Tanuku Plot · 160 t ✶'],
    farmsModified: ['Machilipatnam Edge · 90 t', 'Reddy Plot · 70 t', 'Guntur Strip · 80 t', 'Bhimavaram Lot · 250 t ✶'],
    failsDefault: [],
    // When modified (maxVisits=1): WK3 89% < 95% → fails
  },
  {
    key: 'confidence-first',
    name: 'Confidence-First',
    rationale: 'Prioritizes well-evidenced farms and avoids field verification, but does not provide enough supply to meet the Week 3 coverage target.',
    wk3Default: 78, wk3Modified: 78,
    verifDefault: 0, verifModified: 0,
    hiconfDefault: 92, hiconfModified: 92,
    distDefault: 45, distModified: 45,
    farmsDefault: ['Machilipatnam Edge · 90 t', 'Reddy Plot · 70 t', 'Krishna Valley · 55 t', 'Eluru Farm · 65 t', 'Guntur Strip · 80 t'],
    farmsModified: ['Machilipatnam Edge · 90 t', 'Reddy Plot · 70 t', 'Krishna Valley · 55 t', 'Eluru Farm · 65 t', 'Guntur Strip · 80 t'],
    failsDefault: ['wk3'],
  },
  {
    key: 'dispersed',
    name: 'Dispersed Collection',
    rationale: 'Meets the Week 3 target while spreading supply across districts, but increases collection and coordination complexity.',
    wk3Default: 100, wk3Modified: 100,
    verifDefault: 2, verifModified: 2,
    hiconfDefault: 65, hiconfModified: 65,
    distDefault: 24, distModified: 24,
    farmsDefault: ['Machilipatnam Edge · 90 t', 'Reddy Plot · 70 t', 'Eluru Farm · 65 t', 'Guntur Strip · 80 t', 'Tanuku Plot · 160 t ✶', 'Kovvur Fields · 75 t ✶', 'Rajahmundry Block · 110 t ✶'],
    farmsModified: ['Machilipatnam Edge · 90 t', 'Reddy Plot · 70 t', 'Eluru Farm · 65 t', 'Guntur Strip · 80 t', 'Tanuku Plot · 160 t ✶', 'Kovvur Fields · 75 t ✶', 'Rajahmundry Block · 110 t ✶'],
    failsDefault: [],
    // When maxVisits=1: VERIF=2 > 1 → fails
  },
]

function ScenariosScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [minCoverage, setMinCoverage] = useState(95)
  const [maxVisits, setMaxVisits] = useState(10)
  const [minHighConf, setMinHighConf] = useState(60)
  const [maxDistConc, setMaxDistConc] = useState(50)
  const [selected, setSelected] = useState<string | null>(null)
  const [inspectedFarm, setInspectedFarm] = useState<string | null>(null)
  const [mapExpanded, setMapExpanded] = useState(false)
  const [mapFocusId, setMapFocusId] = useState<string | null>(null)

  const isModified = maxVisits < 2
  const showImpact = isModified

  // Compute fails for each strategy given current constraints
  function getFailCount(s: Strategy): number {
    const wk3 = isModified ? s.wk3Modified : s.wk3Default
    const verif = isModified ? s.verifModified : s.verifDefault
    const hiconf = isModified ? s.hiconfModified : s.hiconfDefault
    const dist = isModified ? s.distModified : s.distDefault
    let fails = 0
    if (wk3 < minCoverage) fails++
    if (verif > maxVisits) fails++
    if (hiconf < minHighConf) fails++
    if (dist > maxDistConc) fails++
    return fails
  }

  const selectedStrategy = selected ? STRATEGIES.find(s => s.key === selected) : null
  const selectedFails = selectedStrategy ? getFailCount(selectedStrategy) : 0
  const canProceed = selected !== null && selectedFails === 0

  const selectedWk3 = selectedStrategy
    ? (isModified ? selectedStrategy.wk3Modified : selectedStrategy.wk3Default)
    : null

  return (
    <>
    <MainPane
      header={
        <Box>
          <SectionLabel>Scenario Planning</SectionLabel>
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>Week 3 · 620 t gap</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>
            Set constraints, then select a feasible strategy for Week 3 coverage.
          </Typography>
        </Box>
      }
      footer={
        selected ? (
          canProceed ? (
            <>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 650, color: 'text.primary', flex: 1 }}>
                {selectedStrategy?.name} selected — all constraints satisfied.
              </Typography>
              <PrimaryBtn onClick={() => onNavigate('verification')} sx={{ flexShrink: 0 }}>Proceed with {selectedStrategy?.name} →</PrimaryBtn>
            </>
          ) : (
            <>
              <Box sx={{ flex: 1, textAlign: 'left' }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 650, color: m3.error }}>
                  Cannot proceed: {selectedStrategy?.name} fails {selectedFails} constraint{selectedFails > 1 ? 's' : ''}.
                </Typography>
                {selectedWk3 !== null && selectedWk3 < minCoverage && (
                  <Typography sx={{ fontSize: '0.75rem', color: m3.error, mt: 1 }}>
                    Coverage {selectedWk3}% is below the {minCoverage}% Week 3 coverage requirement.
                  </Typography>
                )}
              </Box>
              <PrimaryBtn disabled sx={{ flexShrink: 0 }}>Proceed with {selectedStrategy?.name} →</PrimaryBtn>
            </>
          )
        ) : (
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            Select a strategy to continue to verification.
          </Typography>
        )
      }
      map={
        <MapPane
          variant="scenario"
          farmRoles={isModified ? {
            mach: 'selected',
            reddy: 'selected',
            bhim: 'needs-verification',
            tanuku: 'other',
            guntur: 'selected',
          } : {}}
          addedIds={isModified ? ['guntur'] : []}
          removedIds={isModified ? ['tanuku'] : []}
          activeId={mapFocusId}
          expanded={mapExpanded}
          onExpandedChange={setMapExpanded}
          footer={selected && selectedStrategy ? (
            <Box>
              <Typography variant="caption" sx={{ color: m3.onSurfaceVariant, display: 'block', mb: space.tight, fontWeight: 650 }}>
                Week 3 summary · {selectedStrategy.name}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.tight }}>
                {[
                  { label: 'Coverage', value: `${isModified ? selectedStrategy.wk3Modified : selectedStrategy.wk3Default}%` },
                  {
                    label: 'Total Week 3 supply',
                    value: selectedStrategy.key === 'coverage-first' && !isModified
                      ? '1,150 t'
                      : `${(isModified ? selectedStrategy.wk3Modified : selectedStrategy.wk3Default) * 12} t`,
                  },
                  {
                    label: 'Supply added',
                    value: selectedStrategy.key === 'coverage-first' && !isModified
                      ? '570 t'
                      : `${(isModified ? selectedStrategy.farmsModified : selectedStrategy.farmsDefault)
                        .reduce((sum, farm) => sum + Number(farm.match(/(\d+) t/)?.[1] ?? 0), 0)} t`,
                  },
                  { label: 'Verification visits', value: String(isModified ? selectedStrategy.verifModified : selectedStrategy.verifDefault) },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>{label}</Typography>
                    <Typography variant="subtitle2" sx={{ fontVariantNumeric: 'tabular-nums' }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>
              Select a strategy to see Week 3 map summary
            </Typography>
          )}
        />
      }
    >
          {/* Constraints — threshold rails, not consumer sliders */}
          <Box sx={{ mb: space.section }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: space.tight }}>
              <SectionLabel>Business constraints</SectionLabel>
              {isModified && (
                <GhostBtn onClick={() => setMaxVisits(10)}>Reset to defaults</GhostBtn>
              )}
            </Stack>
            <Typography variant="body2" sx={{ mb: space.related, maxWidth: 520 }}>
              Thresholds define feasibility. Drag a control to recompute strategies — violations surface on each option.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: space.related }}>
              <ThresholdControl
                label="Min. Week 3 coverage"
                value={minCoverage}
                display={`${minCoverage}%`}
                min={80}
                max={100}
                onChange={setMinCoverage}
                marks={['80%', '100%']}
              />
              <ThresholdControl
                label="Max. field verification visits"
                value={maxVisits}
                display={`${maxVisits} ${maxVisits === 1 ? 'visit' : 'visits'}`}
                min={0}
                max={10}
                onChange={setMaxVisits}
                modified={isModified}
                marks={['0', '10']}
              />
              <ThresholdControl
                label="Min. high-confidence supply"
                value={minHighConf}
                display={`${minHighConf}%`}
                min={40}
                max={100}
                onChange={setMinHighConf}
                marks={['40%', '100%']}
              />
              <ThresholdControl
                label="Max. single-district concentration"
                value={maxDistConc}
                display={`${maxDistConc}%`}
                min={10}
                max={80}
                onChange={setMaxDistConc}
                marks={['10%', '80%']}
              />
            </Box>
          </Box>

          {/* Impact panel (shown when maxVisits changed) */}
          {showImpact && (
            <DashPaper sx={{ p: space.section, mb: space.section, bgcolor: m3.surfaceContainerLow, color: m3.onSurface }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4 }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: m3.onSurfaceVariant }}>Impact of This Change</Typography>
                <Typography sx={{ fontSize: 10, color: m3.onSurfaceVariant, fontWeight: 500 }}>Max. field verification visits: 10 visits → <Box component="strong" sx={{ fontWeight: 700, display: 'inline', color: m3.primaryInk }}>{maxVisits} visit{maxVisits !== 1 ? 's' : ''}</Box></Typography>
              </Box>
              {/* Metrics grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: `1px solid ${PANEL_BORDER}`, borderBottom: `1px solid ${PANEL_BORDER}`, py: 4, mb: 4 }}>
                {[
                  { label: 'Week 3 coverage', before: '96%', after: '89%', bad: true },
                  { label: 'Verification visits', before: '2', after: '1', bad: false },
                  { label: 'High-conf supply', before: '65%', after: '69%', bad: false },
                  { label: 'Max district conc.', before: '36%', after: '23%', bad: false },
                ].map(({ label, before, after, bad }) => (
                  <Box sx={{ px: 4, borderRight: `1px solid ${PANEL_BORDER}` }} key={label}>
                    <Typography sx={{ fontSize: 10, color: m3.onSurfaceVariant, mb: 2 }}>{label}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.875rem', color: m3.onSurfaceVariant, textDecoration: 'line-through' }}>{before}</Box>
                      <Box component="span" sx={{ color: m3.onSurfaceVariant }}>→</Box>
                      <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.875rem', fontWeight: 700, color: bad ? m3.error : m3.onSurface }}>{after}</Box>
                    </Box>
                    {bad && <Typography sx={{ fontSize: 10, fontWeight: 700, color: m3.error, mt: 1, textTransform: 'uppercase' }}>Below target</Typography>}
                  </Box>
                ))}
              </Box>
              {/* Farm mix */}
              <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: m3.onSurfaceVariant, mb: 2 }}>Farm Mix Changed</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <Box sx={{ pr: 4, borderRight: `1px solid ${PANEL_BORDER}` }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 650, color: m3.error, mb: 2 }}>Removed</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box component="span" sx={{ color: m3.error, fontWeight: 700, mt: 1 }}>✕</Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 650, color: m3.onSurface }}>Tanuku Plot · <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>160 t</Box></Typography>
                        <Typography sx={{ fontSize: 10, color: m3.onSurfaceVariant }}>Requires a field verification visit — exceeds new limit of {maxVisits}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ pl: 4 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 650, color: m3.success, mb: 2 }}>Added</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box component="span" sx={{ color: m3.success, fontWeight: 700, mt: 1 }}>+</Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 650, color: m3.onSurface }}>Guntur Strip · <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>80 t</Box></Typography>
                        <Typography sx={{ fontSize: 10, color: m3.onSurfaceVariant }}>No field visit required — stays within {maxVisits}-visit limit</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* Coverage target not met */}
              <DashPaper sx={{ p: space.related, mb: space.related, bgcolor: m3.errorContainer, color: m3.onErrorContainer }}>
                <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: m3.onErrorContainer, mb: 1 }}>Coverage target not met</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 650, color: m3.onErrorContainer, mb: 1 }}>Coverage-First cannot reach the 95% target with this constraint.</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: m3.onErrorContainer }}>
                  Week 3 supply drops to <Box component="strong" sx={{ fontWeight: 700, display: 'inline' }}>1,070 t (89%)</Box>. The 95% minimum requires <Box component="strong" sx={{ fontWeight: 700, display: 'inline' }}>1,140 t</Box> — 70 t short.
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: m3.onErrorContainer, mt: 1 }}>
                  The farm substitution replaces <Box component="strong" sx={{ fontWeight: 700, display: 'inline' }}>160 t</Box> with only <Box component="strong" sx={{ fontWeight: 700, display: 'inline' }}>80 t</Box> — a net supply loss of <Box component="strong" sx={{ fontWeight: 700, display: 'inline' }}>80 t</Box>.
                </Typography>
              </DashPaper>
              {/* Interpretation */}
              <Box sx={{ bgcolor: m3.surfaceContainerLowest, borderRadius: `${shape.sm}px`, p: 3, border: `1px solid ${PANEL_BORDER}` }}>
                <Typography sx={{ fontSize: '0.75rem', color: m3.onSurface, lineHeight: 1.6 }}>
                  Reducing the verification limit to {maxVisits} removes Tanuku Plot and substitutes Guntur Strip, reducing Week 3 supply by 80 t and coverage from 96% to 89%, below the 95% target.
                </Typography>
              </Box>
            </DashPaper>
          )}

          {/* Strategies */}
          <Box>
            <SectionLabel>Generated Strategies</SectionLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {STRATEGIES.map(s => {
                const failCount = getFailCount(s)
                const wk3 = isModified ? s.wk3Modified : s.wk3Default
                const verif = isModified ? s.verifModified : s.verifDefault
                const hiconf = isModified ? s.hiconfModified : s.hiconfDefault
                const dist = isModified ? s.distModified : s.distDefault
                const farms = isModified ? s.farmsModified : s.farmsDefault
                const isSelected = selected === s.key
                const wk3Fails = wk3 < minCoverage

                const rationale = isModified && s.key === 'coverage-first'
                  ? 'Reducing the verification limit removes a high-supply farm, lowering Week 3 coverage to 89%. One field verification is still required.'
                  : isModified && s.key === 'dispersed'
                  ? 'Meets the Week 3 target, but is infeasible under the current 1-visit verification constraint.'
                  : s.rationale

                return (
                  <DashPaper
                    key={s.key}
                    onClick={() => setSelected(s.key === selected ? null : s.key)}
                    sx={{
                      p: 0,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      // Same wash as Farms selected cards
                      bgcolor: isSelected ? CARD_SELECTION_BG : m3.surfaceContainerLowest,
                      border: failCount > 0 && !isSelected
                        ? `2px solid ${m3.error}`
                        : `1px solid ${PANEL_BORDER}`,
                    }}
                  >
                    {/* Header */}
                    <Box sx={{ p: space.related }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: space.tight, gap: space.related }}>
                        <Stack direction="row" spacing={space.related} sx={{ alignItems: 'flex-start', minWidth: 0, flex: 1 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              mt: 0.5,
                              borderRadius: '50%',
                              border: isSelected ? `6px solid ${m3.primary}` : `2px solid ${m3.outline}`,
                              bgcolor: isSelected ? CARD_SELECTION_BG : m3.surfaceContainerLowest,
                              flexShrink: 0,
                            }}
                          />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ color: m3.onSurface, fontWeight: 700 }}>
                              {s.name}
                            </Typography>
                            {isSelected && (
                              <Typography variant="caption" sx={{ color: m3.primaryInk, fontWeight: 700, display: 'block', mb: space.xs }}>
                                Selected strategy
                              </Typography>
                            )}
                            <Typography variant="body2" sx={{ color: m3.onSurfaceVariant, mt: space.xs }}>
                              {rationale}
                            </Typography>
                          </Box>
                        </Stack>
                        <StatusChip kind={failCount === 0 ? 'constraint-pass' : 'constraint-fail'} />
                      </Stack>
                    </Box>

                    {/* Tradeoff bars — same card surface */}
                    <Box sx={{ px: space.related, pb: space.related }}>
                      <TradeoffBars coverage={wk3} visits={verif} />
                    </Box>

                    {/* Metrics — same surface, equal 16dp padding; fail = text role only */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 0,
                        borderTop: `1px solid ${PANEL_BORDER}`,
                        borderBottom: `1px solid ${PANEL_BORDER}`,
                      }}
                    >
                      {[
                        { label: 'Week 3', value: wk3 === 100 ? `100% · +30 t` : `${wk3}%`, fail: wk3Fails },
                        { label: 'Verification', value: String(verif), fail: verif > maxVisits },
                        { label: 'High conf.', value: `${hiconf}%`, fail: hiconf < minHighConf },
                        { label: 'Max district', value: `${dist}%`, fail: dist > maxDistConc },
                      ].map(({ label, value, fail }, i) => (
                        <Box
                          key={label}
                          sx={{
                            p: space.related,
                            borderRight: i < 3 ? `1px solid ${PANEL_BORDER}` : 'none',
                            minWidth: 0,
                          }}
                        >
                          <Typography variant="caption" sx={{ display: 'block', mb: space.xs, color: m3.onSurfaceVariant }}>
                            {label}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontVariantNumeric: 'tabular-nums',
                              fontWeight: 700,
                              color: fail ? m3.error : m3.onSurface,
                              mb: fail ? space.tight : 0,
                            }}
                          >
                            {value}
                          </Typography>
                          {fail && <StatusChip kind="constraint-fail" />}
                        </Box>
                      ))}
                    </Box>

                    {/* Farm mix — same surface */}
                    <Box sx={{ px: space.related, py: space.related }}>
                      <Typography variant="caption" sx={{ display: 'block', mb: space.tight, color: m3.onSurfaceVariant, fontWeight: 650 }}>
                        Farm mix
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: space.tight }}>
                        {farms.map(f => (
                          <Chip
                            key={f}
                            size="small"
                            label={f}
                            onClick={e => {
                              e.stopPropagation()
                              setInspectedFarm(f.replace(' ✶', '').split(' · ')[0])
                            }}
                            sx={{
                              bgcolor: f.includes('✶') ? m3.tertiaryContainer : m3.surfaceContainerHigh,
                              color: f.includes('✶') ? m3.onTertiaryContainer : m3.onSurface,
                              fontWeight: 600,
                              borderRadius: `${shape.sm}px`,
                              height: 28,
                              '& .MuiChip-label': { px: 2.5 },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </DashPaper>
                )
              })}
            </Box>
          </Box>

    </MainPane>
      {inspectedFarm && (
        <FarmDecisionPanel
          farmName={inspectedFarm}
          onClose={() => setInspectedFarm(null)}
          onInspectMap={id => {
            setInspectedFarm(null)
            setMapFocusId(id)
            setMapExpanded(true)
          }}
        />
      )}
    </>
  )
}

// ─── VERIFICATION SCREEN ─────────────────────────────────────────────────────

function VerificationScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const farms = [
    {
      id: 'bhim', name: 'Bhimavaram Lot', district: 'West Godavari district',
      supply: 250, evidenceTag: 'MISSING EVIDENCE' as const,
      evidenceKind: 'missing' as const,
      reason: 'No current field evidence. Standing stock unconfirmed. Yield estimate based on prior season data only.',
      needs: ['Standing stock confirmed', 'Harvest readiness confirmed', 'Current field photos captured'],
      confidence: 'LOW' as Conf,
    },
    {
      id: 'tanuku', name: 'Tanuku Plot', district: 'West Godavari district',
      supply: 160, evidenceTag: 'INSUFFICIENT EVIDENCE' as const,
      evidenceKind: 'insufficient' as const,
      reason: 'Missing current field evidence. Last field visit was 6 weeks ago. Crop status may have changed.',
      needs: ['Current crop / harvest status confirmed', 'Current field photos captured'],
      confidence: 'MEDIUM' as Conf,
    },
  ]

  return (
    <MainPane
      header={
        <Box>
          <SectionLabel>Selective Field Verification</SectionLabel>
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>Coverage-First · Farms requiring verification</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>
            2 selected · 0 remaining · Only farms with missing, insufficient, or conflicting evidence appear here.
          </Typography>
        </Box>
      }
      footer={
        <>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', flex: 1 }}>
            2 farms will be assigned to Ravi for field verification. Only the listed evidence items are needed.
          </Typography>
          <PrimaryBtn onClick={() => onNavigate('field')} sx={{ flexShrink: 0 }}>Assign 2 farms to Ravi →</PrimaryBtn>
        </>
      }
      map={
        <MapPane
          variant="investigation"
          farmRoles={{ bhim: 'needs-verification', tanuku: 'needs-verification', mach: 'selected', reddy: 'selected' }}
          footer={
            <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>
              2 farms require field verification · assigned next
            </Typography>
          }
        />
      }
    >
      <Box sx={{ maxWidth: 672, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {farms.map(f => (
          <DashPaper key={f.id} sx={{ p: space.section, bgcolor: m3.surfaceContainerLow, color: m3.onSurface }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                <Box sx={{ width: 20, height: 20, borderRadius: `${shape.xs}px`, bgcolor: m3.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 1 }}>
                  <svg style={{ width: 12, height: 12, color: m3.onPrimary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: m3.onSurface }}>{f.name}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: m3.onSurfaceVariant }}>{f.district}</Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.25rem', fontWeight: 700, color: m3.onSurface, mb: 1 }}>{f.supply} t</Typography>
                <StatusChip kind={f.evidenceKind === 'missing' ? 'evidence-missing' : 'evidence-aging'} />
              </Box>
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: m3.onSurfaceVariant, mb: 4 }}>{f.reason}</Typography>
            <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: m3.onSurfaceVariant, mb: 2 }}>Needs</Typography>
            <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, m: 0, p: 0, listStyle: 'none' }}>
              {f.needs.map(n => (
                <Stack component="li" direction="row" sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.75rem', fontWeight: 650, color: m3.onSurface }} key={n}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: m3.primaryInk, flexShrink: 0 }} />
                  {n}
                </Stack>
              ))}
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: m3.onSurfaceVariant }}>
              Confidence before verification: <Box component="strong" sx={{ fontWeight: 700, display: 'inline', color: m3.onSurface }}>{f.confidence}</Box>
              <Box component="span"> · {f.confidence === 'LOW' ? 'Evidence missing' : 'Evidence incomplete'}</Box>
            </Typography>
          </DashPaper>
        ))}
      </Box>
    </MainPane>
  )
}
// ─── FIELD SCREEN (RAVI MOBILE) ───────────────────────────────────────────────

type FieldFarm = {
  name: string
  location: string
  supply: number
  harvest: string
  whyVisit: string
  verifyItems: string[]
}

const FIELD_FARMS: FieldFarm[] = [
  {
    name: 'Bhimavaram Lot',
    location: 'West Godavari, Andhra Pradesh',
    supply: 250,
    harvest: 'Week 3',
    whyVisit: 'No current field evidence. Standing stock unconfirmed. Yield estimate based on prior season data only.',
    verifyItems: ['Standing stock confirmed', 'Harvest readiness confirmed', 'Current field photos captured'],
  },
  {
    name: 'Tanuku Plot',
    location: 'West Godavari, Andhra Pradesh',
    supply: 160,
    harvest: 'Week 3',
    whyVisit: 'Field evidence is outdated. Last visit was 6 weeks ago. Crop status may have changed.',
    verifyItems: ['Current crop / harvest status confirmed', 'Current field photos captured'],
  },
]

function FieldScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [farmIdx, setFarmIdx] = useState(0)
  const [view, setView] = useState<'brief' | 'capture'>('brief')
  const [checks, setChecks] = useState<Record<number, boolean[]>>({
    0: [false, false, false],
    1: [false, false],
  })
  const [notes, setNotes] = useState<Record<number, string>>({ 0: '', 1: '' })
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({ 0: false, 1: false })
  const [photos, setPhotos] = useState<Record<number, boolean>>({ 0: false, 1: false })
  const [photoPreviewOpen, setPhotoPreviewOpen] = useState(false)

  const farm = FIELD_FARMS[farmIdx]
  const farmChecks = checks[farmIdx] || []
  const allChecked = farmChecks.every(Boolean)
  const photoRequired = farm.verifyItems.some(item => item.toLowerCase().includes('photos'))
  const canConfirm = allChecked && (!photoRequired || photos[farmIdx])
  const mobileTileOrigin = farmIdx === 0 ? { x: 2974, y: 1856 } : { x: 2976, y: 1853 }

  function toggleCheck(i: number) {
    setChecks(prev => {
      const arr = [...(prev[farmIdx] || [])]
      arr[i] = !arr[i]
      return { ...prev, [farmIdx]: arr }
    })
  }

  function handleSubmit() {
    setSubmitted(prev => ({ ...prev, [farmIdx]: true }))
    if (farmIdx === 0) {
      setFarmIdx(1)
      setView('brief')
    } else {
      onNavigate('findings')
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', height: '100%', bgcolor: m3.surfaceContainerHigh, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', py: 6, px: 4 }}>
      <DashPaper sx={{ width: '100%', maxWidth: 410, overflow: 'hidden', boxShadow: 1, p: 0 }}>
        <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
          {/* Dark top bar — inverse roles only (never light-theme text.* on inverse) */}
          <Box sx={{ color: m3.inverseOnSurface, px: 4, pt: 4, pb: 4, bgcolor: m3.inverseSurface, borderTop: `3px solid ${alpha(m3.primary, 0.35)}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontSize: 10, fontWeight: 650, color: m3.inverseOnSurface, opacity: 0.8, mb: 1 }}>
                {view === 'brief' ? 'Assigned Farm' : 'Capture + Submit'}
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 650, color: m3.inverseOnSurface }}>{view === 'brief' ? 'Ravi · Field officer' : farm.name}</Typography>
            </Box>
            <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.875rem', fontWeight: 500, color: m3.inverseOnSurface, opacity: 0.8 }}>{farmIdx + 1} of 2</Box>
            </Box>
            <Box sx={{ height: 4, bgcolor: alpha(m3.inverseOnSurface, 0.24), mt: 4, overflow: 'hidden' }}>
              <Box sx={{ height: '100%', bgcolor: m3.inverseOnSurface, transition: 'all 0.2s' }} style={{ width: `${((farmIdx + 1) / FIELD_FARMS.length) * 100}%` }} />
            </Box>
          </Box>

          {view === 'brief' ? (
            <Box>
              {/* Content shares one horizontal inset so buttons/map align */}
              <Box sx={{ px: space.related, pt: space.related }}>
                <Typography variant="h3" sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'text.primary', mb: 1 }}>{farm.name}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: space.related }}>{farm.location}</Typography>

                <Box sx={{ bgcolor: m3.surfaceContainerHigh, borderRadius: `${shape.md}px`, border: `1px solid ${PANEL_BORDER}`, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: space.tight, overflow: 'hidden', position: 'relative' }}>
                  <svg viewBox="0 0 200 120" style={{ width: '100%', height: '100%' }}>
                    <rect width="200" height="120" fill="#e5e7eb" />
                    <g style={{ filter: 'grayscale(0.3) saturate(0.72)' }}>
                      {[0, 1, 2].flatMap(col =>
                        [0, 1].map(row => (
                          <image
                            key={`${col}-${row}`}
                            href={`https://tile.openstreetmap.org/12/${mobileTileOrigin.x + col}/${mobileTileOrigin.y + row}.png`}
                            x={col * 100 - 50}
                            y={row * 100 - 40}
                            width="100"
                            height="100"
                          />
                        ))
                      )}
                    </g>
                    <rect width="200" height="120" fill="#f8fafc" opacity=".12" />
                    <path d="M26 101 C56 91 82 70 104 49 C122 32 143 23 169 19" fill="none" stroke={m3.primary} strokeWidth="3" strokeDasharray="5 3" />
                    <circle cx="26" cy="101" r="5" fill={m3.surfaceContainerLowest} stroke={m3.primary} strokeWidth="2" />
                    <path d="M169 9 C160 9 153 16 153 25 C153 37 169 49 169 49 C169 49 185 37 185 25 C185 16 178 9 169 9 Z" fill="#111827" />
                    <circle cx="169" cy="25" r="5" fill="#ffffff" />
                    <path d="M145 51 L190 45 L195 84 L151 91 Z" fill="#83996b" opacity=".7" stroke="#526348" strokeDasharray="3 2" />
                    <rect x="131" y="108" width="67" height="10" rx="2" fill="#ffffff" opacity=".9" />
                    <text x="135" y="115" fontSize="5.5" fill={m3.onSurfaceVariant}>© OpenStreetMap</text>
                  </svg>
                  <Box sx={{ position: 'absolute', bottom: 8, left: 8, bgcolor: 'background.paper', border: `1px solid ${PANEL_BORDER}`, borderRadius: `${shape.sm}px`, px: 2, py: 1 }}>
                    <Typography sx={{ fontSize: 9, color: 'text.secondary', fontWeight: 500 }}>Approximate destination · West Godavari</Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => window.open(farmIdx === 0 ? 'https://www.openstreetmap.org/?mlat=16.54&mlon=81.52#map=12/16.54/81.52' : 'https://www.openstreetmap.org/?mlat=16.75&mlon=81.68#map=12/16.75/81.68', '_blank', 'noopener,noreferrer')}
                  sx={{ mb: space.section }}
                >
                  Open in navigation
                </Button>
              </Box>

              {/* Edge-to-edge separators: border on full-width sections, padding only on content */}
              <Box sx={{ borderTop: `1px solid ${PANEL_BORDER}`, px: space.related, py: space.related }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.related }}>
                  <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 650, color: 'text.secondary', mb: 1 }}>Expected supply</Typography>
                    <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.25rem', fontWeight: 700, color: 'text.primary' }}>{farm.supply} t</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 650, color: 'text.secondary', mb: 1 }}>Harvest</Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 650, color: 'text.primary' }}>{farm.harvest}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ borderTop: `1px solid ${PANEL_BORDER}`, px: space.related, py: space.related }}>
                <Typography sx={{ fontSize: 10, fontWeight: 650, color: 'text.secondary', mb: 1 }}>Why this visit</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.6 }}>{farm.whyVisit}</Typography>
              </Box>

              <Box sx={{ borderTop: `1px solid ${PANEL_BORDER}`, px: space.related, py: space.related }}>
                <Typography sx={{ fontSize: 10, fontWeight: 650, color: 'text.secondary', mb: space.tight }}>Verify</Typography>
                <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: space.tight, m: 0, p: 0, listStyle: 'none' }}>
                  {farm.verifyItems.map(item => (
                    <Stack component="li" direction="row" sx={{ display: 'flex', alignItems: 'center', gap: space.tight, fontSize: '0.75rem', color: 'text.primary' }} key={item}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: m3.primaryInk, flexShrink: 0 }} />
                      {item}
                    </Stack>
                  ))}
                </Box>
              </Box>

              <Box sx={{ px: space.related, py: space.related }}>
                <PrimaryBtn fullWidth onClick={() => setView('capture')}>
                  Start verification
                </PrimaryBtn>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ px: space.related, pt: space.related, pb: space.tight }}>
                <Typography sx={{ fontSize: 10, fontWeight: 650, color: 'text.secondary' }}>Verification checklist</Typography>
              </Box>

              {/* Full-bleed rows: separator edge-to-edge, content shares button inset */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {farm.verifyItems.map((item, i) => (
                  <FormControlLabel
                    key={item}
                    sx={{
                      display: 'flex',
                      m: 0,
                      px: space.related,
                      py: space.related,
                      borderBottom: `1px solid ${PANEL_BORDER}`,
                      width: '100%',
                      alignItems: 'flex-start',
                      gap: space.tight,
                      '& .MuiCheckbox-root': { p: 0, mr: 0 },
                      '& .MuiFormControlLabel-label': { flex: 1, pt: 0.25 },
                    }}
                    control={<Checkbox checked={!!farmChecks[i]} onChange={() => toggleCheck(i)} color="primary" size="small" />}
                    label={<Typography variant="body2" sx={{ fontWeight: farmChecks[i] ? 600 : 400 }}>{item}</Typography>}
                  />
                ))}
              </Box>

              <Box sx={{ px: space.related, py: space.related }}>
                <Typography sx={{ fontSize: 10, fontWeight: 650, color: 'text.secondary', mb: space.tight }}>Notes</Typography>
                <TextField
                  value={notes[farmIdx] || ''}
                  onChange={e => setNotes(prev => ({ ...prev, [farmIdx]: e.target.value }))}
                  placeholder="Add relevant field observations"
                  multiline
                  minRows={4}
                  fullWidth
                />
              </Box>

              {photos[farmIdx] ? (
                <Box sx={{ borderTop: `1px solid ${PANEL_BORDER}`, borderBottom: `1px solid ${PANEL_BORDER}`, px: space.related, py: space.related }}>
                  <Box
                    component="button"
                    onClick={() => setPhotoPreviewOpen(true)}
                    sx={{
                      width: '100%',
                      display: 'block',
                      bgcolor: m3.surfaceContainerLow,
                      border: `1px solid ${PANEL_BORDER}`,
                      borderRadius: `${shape.md}px`,
                      p: 0,
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={farmIdx === 0 ? bhimavaramFieldPhoto : tanukuFieldPhoto}
                      alt={`Field evidence captured at ${farm.name}`}
                      style={{ width: '100%', height: 'auto', maxHeight: 256, objectFit: 'cover', display: 'block', borderRadius: shape.md }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: space.related, mt: space.related }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 650, color: 'text.primary' }}>Field photo captured</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>Today · {farm.name}</Typography>
                    </Box>
                    <Button size="small" color="error" onClick={() => setPhotos(prev => ({ ...prev, [farmIdx]: false }))}>Remove</Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ px: space.related, pb: space.related }}>
                  <Button fullWidth variant="outlined" color="primary" onClick={() => setPhotos(prev => ({ ...prev, [farmIdx]: true }))} sx={{ mb: space.tight }}>
                    Add photo
                  </Button>
                  <Typography sx={{ fontSize: 10, color: 'text.secondary', textAlign: 'center' }}>0 photos added · Required to confirm evidence</Typography>
                </Box>
              )}

              <Box sx={{ borderTop: `1px solid ${PANEL_BORDER}`, px: space.related, py: space.related }}>
                <PrimaryBtn fullWidth onClick={handleSubmit} disabled={!canConfirm} sx={{ mb: space.tight }}>
                  Evidence confirmed
                </PrimaryBtn>
                <SecondaryBtn fullWidth onClick={handleSubmit}>
                  Partial or uncertain
                </SecondaryBtn>
              </Box>
            </Box>
          )}
        </Box>

      </DashPaper>
      {photoPreviewOpen && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 1400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 6,
            bgcolor: alpha(m3.scrim, 0.72),
          }}
          onClick={() => setPhotoPreviewOpen(false)}
        >
          <Box onClick={e => e.stopPropagation()} sx={{ maxWidth: 720, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: m3.inverseOnSurface, mb: 4 }}>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 650, color: m3.inverseOnSurface }}>Field photo captured</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: m3.inverseOnSurface, opacity: 0.8 }}>Today · {farm.name}</Typography>
              </Box>
              <IconButton onClick={() => setPhotoPreviewOpen(false)} aria-label="Close photo preview" sx={{ color: m3.inverseOnSurface }}><CloseIcon /></IconButton>
            </Box>
            <img
              src={farmIdx === 0 ? bhimavaramFieldPhoto : tanukuFieldPhoto}
              alt={`Full-size field evidence captured at ${farm.name}`}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

// ─── FINDINGS SCREEN ──────────────────────────────────────────────────────────

function FindingsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const findings = [
    {
      id: 'bhim', name: 'Bhimavaram Lot', district: 'West Godavari district',
      supply: 250, before: 'LOW' as Conf, after: 'HIGH' as Conf,
      evidence: ['Standing stock confirmed', 'Harvest readiness confirmed', 'Current field photos captured'],
      impact: 'Bhimavaram Lot can now contribute 250 t to the Coverage-First procurement plan.',
    },
    {
      id: 'tanuku', name: 'Tanuku Plot', district: 'West Godavari district',
      supply: 160, before: 'MEDIUM' as Conf, after: 'HIGH' as Conf,
      evidence: ['Current crop / harvest status confirmed', 'Current field photos captured'],
      impact: 'Tanuku Plot can now contribute 160 t to the Coverage-First procurement plan.',
    },
  ]

  return (
    <MainPane
      header={
        <Box>
          <SectionLabel>Field Officer Findings</SectionLabel>
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>Review evidence</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>Ravi has submitted findings for 2 farms. Evidence has been confirmed.</Typography>
        </Box>
      }
      footer={
        <>
          <Box sx={{ flex: 1, textAlign: 'left' }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 650, color: 'text.primary' }}>
              Verification complete — Coverage-First is ready to proceed
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>
              Both farms are now HIGH · VERIFIED. Week 3 coverage confirmed at 1,150 t / 96%.
            </Typography>
          </Box>
          <PrimaryBtn onClick={() => onNavigate('plan')} sx={{ flexShrink: 0 }}>Activate procurement plan →</PrimaryBtn>
        </>
      }
      map={
        <MapPane
          variant="investigation"
          farmRoles={{ bhim: 'selected', tanuku: 'selected', mach: 'selected', reddy: 'selected' }}
          footer={
            <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>
              Field evidence confirmed · farms ready for plan activation
            </Typography>
          }
        />
      }
    >
      <Box sx={{ maxWidth: 672, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {findings.map(f => (
          <DashPaper key={f.id} sx={{ overflow: 'hidden', bgcolor: CARD_SELECTION_BG, color: m3.onSurface, p: 0 }}>
            <Box sx={{ borderBottom: `1px solid ${PANEL_BORDER}`, px: 4, py: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: m3.onSurface, mb: 1 }}>{f.name}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: m3.onSurfaceVariant }}>{f.district}</Typography>
              </Box>
              <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.125rem', fontWeight: 700, color: m3.onSurface }}>{f.supply} t</Typography>
            </Box>

            <Box sx={{ px: space.related, py: space.related }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: space.related, mb: space.section }}>
                <Box sx={{ flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 500, color: m3.onSurfaceVariant, mb: 1 }}>Previous confidence</Typography>
                  <ConfBadge level={f.before} />
                  <Typography sx={{ fontSize: 10, color: m3.onSurfaceVariant, mt: 1 }}>{f.before === 'LOW' ? 'Evidence missing' : 'Evidence incomplete'}</Typography>
                </Box>
                <Box component="span" sx={{ color: m3.onSurfaceVariant, opacity: 0.55, pt: 4 }}>→</Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 500, color: m3.onSurfaceVariant, mb: 1 }}>Evidence collected</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 650, color: m3.onSurface }}>Required evidence collected</Typography>
                </Box>
                <Box component="span" sx={{ color: m3.onSurfaceVariant, opacity: 0.55, pt: 4 }}>→</Box>
                <Box sx={{ flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 500, color: m3.onSurfaceVariant, mb: 1 }}>Updated confidence</Typography>
                  <ConfBadge level={f.after} />
                  <Typography sx={{ fontSize: 10, color: m3.onSurfaceVariant, mt: 1 }}>Evidence current · Field evidence aligned</Typography>
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 500, color: m3.onSurfaceVariant, mb: 1 }}>Verification</Typography>
                  <StatusChip kind="verified" />
                </Box>
              </Box>
            </Box>
            <Box sx={{ borderTop: `1px solid ${PANEL_BORDER}`, px: space.related, py: space.related }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 650, color: m3.onSurface, mb: space.tight }}>Evidence confirmed</Typography>
              <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: space.tight, m: 0, p: 0, listStyle: 'none', mb: space.related }}>
                {f.evidence.map(item => (
                  <Stack component="li" direction="row" sx={{ display: 'flex', alignItems: 'center', gap: space.tight, fontSize: '0.75rem', color: m3.onSurface }} key={item}>
                    <Box component="span" sx={{ color: m3.success, fontWeight: 650 }}>✓</Box>
                    {item}
                  </Stack>
                ))}
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: m3.onSurfaceVariant, lineHeight: 1.6 }}>{f.impact}</Typography>
            </Box>
          </DashPaper>
        ))}
      </Box>
    </MainPane>
  )
}

// ─── PLAN SCREEN ─────────────────────────────────────────────────────────────

function PlanScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const planFarms = [
    { name: 'Machilipatnam Edge', district: 'Krishna',       supply: 90,  conf: 'HIGH' as Conf, verified: true,  status: 'Scheduled Wk 3' },
    { name: 'Reddy Plot',         district: 'Krishna',       supply: 70,  conf: 'HIGH' as Conf, verified: true,  status: 'Scheduled Wk 3' },
    { name: 'Bhimavaram Lot',     district: 'West Godavari', supply: 250, conf: 'HIGH' as Conf, verified: true,  status: 'Verified today' },
    { name: 'Tanuku Plot',        district: 'West Godavari', supply: 160, conf: 'HIGH' as Conf, verified: true,  status: 'Verified today' },
    { name: 'Godavari Combined Block', district: 'East Godavari', supply: 200, conf: 'HIGH' as Conf, verified: true, status: 'Scheduled Wk 3' },
    { name: 'Narsapur Farms',     district: 'West Godavari', supply: 180, conf: 'MEDIUM' as Conf, verified: false, status: 'At risk' },
    { name: 'Palakol Holdings',   district: 'West Godavari', supply: 120, conf: 'HIGH' as Conf, verified: true,  status: 'Scheduled Wk 3' },
    { name: 'Avanigadda Block',   district: 'Krishna',       supply: 80,  conf: 'HIGH' as Conf, verified: true,  status: 'Scheduled Wk 3' },
  ]

  const wk3Supply = 1150
  const wk3Target = 1200
  const wk3Pct = Math.round(wk3Supply / wk3Target * 100)

  return (
    <MainPane
      header={
        <Box>
          <SectionLabel>Active Procurement Plan</SectionLabel>
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>Coverage-First · Week 3 Active</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>Monitoring active · 1 open alert</Typography>
        </Box>
      }
      footer={
        <>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', flex: 1 }}>
            Active plan monitoring · open the alert when supply is revised.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexShrink: 0 }}>
            <SecondaryBtn onClick={() => document.getElementById('active-farm-mix')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>View full plan</SecondaryBtn>
            <Button
              onClick={() => onNavigate('alert')}
              color="error"
              variant="outlined"
              sx={{
                minHeight: 40,
                height: 40,
                py: 0,
                px: 6,
                fontSize: '0.875rem',
                fontWeight: 650,
                bgcolor: m3.errorContainer,
                color: m3.onErrorContainer,
                borderColor: m3.error,
                '&:hover': { bgcolor: m3.errorContainer, borderColor: m3.error },
              }}
            >
              1 monitoring alert
            </Button>
          </Stack>
        </>
      }
      map={
        <MapPane
          variant="plan"
          farmRoles={{
            mach: 'selected', reddy: 'selected', bhim: 'selected', tanuku: 'selected',
            godavari: 'selected', narsapur: 'committed', palakol: 'selected', avanigadda: 'selected',
            kv: 'other', eluru: 'other', guntur: 'other', kovvur: 'other', raj: 'other',
          }}
          legend={[
            { role: 'selected', label: 'In plan' },
            { role: 'committed', label: 'At risk' },
            { role: 'other', label: 'Not in plan' },
          ]}
          footer={
            <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>
              Active plan geographic distribution
            </Typography>
          }
        />
      }
    >
      {/* Week 3 status card */}
      <DashPaper sx={{ p: space.section, mb: space.section }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'text.secondary', mb: 1 }}>Week 3 Position</Typography>
            <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'text.primary' }}>{wk3Supply.toLocaleString()} <Box component="span" sx={{ color: 'text.secondary', fontSize: '1.25rem' }}>/ {wk3Target.toLocaleString()} t</Box></Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: m3.success }}>{wk3Pct}%</Typography>
            <StatusChip kind="constraint-pass" />
          </Box>
        </Box>
        <Box sx={{ height: meter.height, bgcolor: meter.track, borderRadius: `${meter.radius}px`, overflow: 'hidden' }}>
          <Box sx={{ height: '100%', borderRadius: `${meter.radius}px`, bgcolor: m3.success, width: `${wk3Pct}%` }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: space.tight }}>
          <Box component="span" sx={{ fontSize: 10, color: m3.onSurfaceVariant }}>0%</Box>
          <Box component="span" sx={{ fontSize: 10, color: m3.success, fontWeight: 650 }}>95% threshold · {(0.95 * wk3Target).toLocaleString()} t</Box>
          <Box component="span" sx={{ fontSize: 10, color: m3.onSurfaceVariant }}>100%</Box>
        </Box>
      </DashPaper>

      {/* Stats row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: 1, borderBottom: 1, borderColor: 'divider', py: 4, mb: 6 }}>
        {[
          { label: 'High-confidence supply', value: '83%' },
          { label: 'Farms in plan', value: '8' },
          { label: 'Max district concentration', value: '36%' },
          { label: 'Monitoring status', value: 'Active' },
        ].map(({ label, value }) => (
          <Box sx={{ px: 4, borderRight: 1, borderColor: 'divider' }} key={label}>
            <Typography sx={{ fontSize: 10, color: 'text.secondary', mb: 1 }}>{label}</Typography>
            <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.125rem', fontWeight: 700, color: 'text.primary' }}>{value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Farm table */}
      <Box sx={{ mb: 6 }} id="active-farm-mix">
        <SectionLabel>Active farm mix · Week 3</SectionLabel>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Farm</TableCell>
                <TableCell>District</TableCell>
                <TableCell align="right">Supply</TableCell>
                <TableCell>Confidence</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {planFarms.map(f => (
                <TableRow key={f.name} hover>
                  <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>{f.name}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{f.district}</TableCell>
                  <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 650, color: 'text.primary' }}>{f.supply} t</TableCell>
                  <TableCell>
                    <ConfBadge level={f.conf} />
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mt: space.xs }}>
                      {f.conf === 'HIGH' ? 'Evidence current' : 'Evidence incomplete'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: f.status === 'At risk' ? m3.secondary : f.status.includes('Verified') ? m3.success : 'text.secondary' }}>
                    {f.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MainPane>
  )
}

// ─── ALERT SCREEN ─────────────────────────────────────────────────────────────

function AlertScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [recovering, setRecovering] = useState(false)
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [mapExpanded, setMapExpanded] = useState(false)
  const [mapFocusId, setMapFocusId] = useState<string | null>(null)
  const [inspectedFarm, setInspectedFarm] = useState<string | null>(null)
  const recoveryRoles: Record<string, FarmRole> = {
    mach: 'selected', reddy: 'selected', bhim: 'selected', tanuku: 'selected',
    avanigadda: 'selected', narsapur: 'committed', palakol: 'selected',
    godavari: 'alert',
    raj: recovering ? 'selected' : 'recommended',
    kv: 'other', eluru: 'other', guntur: 'other', kovvur: 'other',
  }
  const recoveryLegend: LegendItem[] = [
    { role: 'selected', label: recovering ? 'In recovered plan' : 'In plan' },
    { role: 'alert', label: recovering ? 'Revised supply monitored' : 'Supply revised (Godavari)' },
    ...(!recovering ? [{ role: 'recommended' as FarmRole, label: 'Recommended recovery' }] : []),
    { role: 'committed', label: 'At risk' },
    { role: 'other', label: 'Not in plan' },
  ]

  if (recovering) {
    return (
      <MainPane
        header={
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 650, color: 'success.dark', mb: 1 }}>Recovery accepted · Monitoring resumed</Typography>
            <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>Rajahmundry Block added to recovery plan</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>Week 3 coverage restored to 95%. The monitoring exception is resolved.</Typography>
          </Box>
        }
        footer={
          <>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', flex: 1 }}>
              Recovery complete · monitoring resumed at 95% coverage.
            </Typography>
            <PrimaryBtn onClick={() => onNavigate('plan')} sx={{ flexShrink: 0 }}>Return to active plan →</PrimaryBtn>
          </>
        }
        map={
          <MapPane
            variant="recovery"
            farmRoles={recoveryRoles}
            legend={recoveryLegend}
            activeId={mapFocusId}
            expanded={mapExpanded}
            onExpandedChange={setMapExpanded}
            footer={
              <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>
                Recovery geography · coverage restored
              </Typography>
            }
          />
        }
      >
        <Box sx={{ maxWidth: 768 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, mb: 2 }}>Recovery complete</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', mb: 1 }}>Rajahmundry Block added to recovery plan.</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', mb: 1 }}>Week 3 coverage restored to 95%.</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.primary' }}>Field verification for Rajahmundry Block has been assigned to Ravi.</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'success.dark' }}>1,140 t</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>95% · threshold restored</Typography>
            </Box>
          </Box>
        </Box>
      </MainPane>
    )
  }

  return (
    <>
    <MainPane
      headerSx={{
        bgcolor: m3.errorContainer,
        color: m3.onErrorContainer,
        borderBottom: `3px solid ${m3.error}`,
      }}
      header={
        <Box>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: m3.error }} />
            <Typography variant="overline" sx={{ color: m3.onErrorContainer }}>Severity · Week 3 below 95% threshold</Typography>
          </Stack>
          <Typography variant="h2" sx={{ color: m3.onErrorContainer }}>Godavari Combined Block — supply revised</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: m3.onErrorContainer, fontWeight: 600 }}>
            Cause: new satellite NDVI · Impact: −120 t · Recovery required
          </Typography>
        </Box>
      }
      footer={
        <>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', flex: 1 }}>
            Recovery required to restore Week 3 above the 95% threshold.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexShrink: 0, flexWrap: 'wrap' }}>
            <PrimaryBtn onClick={() => setRecovering(true)}>Add to recovery plan</PrimaryBtn>
            <SecondaryBtn onClick={() => onNavigate('compare')}>Compare alternatives</SecondaryBtn>
            <SecondaryBtn onClick={() => onNavigate('scenarios')}>Reopen scenario planning</SecondaryBtn>
          </Stack>
        </>
      }
      map={
        <MapPane
          variant="recovery"
          farmRoles={recoveryRoles}
          legend={recoveryLegend}
          activeId={mapFocusId}
          expanded={mapExpanded}
          onExpandedChange={setMapExpanded}
          footer={
            <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>
              Exception geography · recovery candidates
            </Typography>
          }
        />
      }
    >
        <Box sx={{ maxWidth: 768, display: 'flex', flexDirection: 'column' }}>
          {/* What changed */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="overline" sx={{ color: semantic.alert }}>1 · Cause</Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 650, color: 'text.primary' }}>What changed</Typography>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 10, color: 'text.secondary', mb: 1 }}>Before</Typography>
                  <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>200 t</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Godavari Combined Block</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem' }}>→</Box>
                <Box sx={{ flex: 1, pl: 4 }}>
                  <Typography sx={{ fontSize: 10, color: 'error.dark', mb: 1 }}>Now</Typography>
                  <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.5rem', fontWeight: 700, color: 'error.dark' }}>80 t</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'error.dark', fontWeight: 500 }}>−120 t revised by satellite</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>New satellite data indicates lower-than-expected standing stock. The revised estimate reflects current NDVI readings and cloud-corrected analysis from the past 72 hours.</Typography>
              <Button size="small" color="primary" onClick={() => setEvidenceOpen(true)} sx={{ mt: space.related, px: 0, minWidth: 0 }}>
                View satellite evidence →
              </Button>
            </Box>
          </Box>

          {/* Why it matters */}
          <Box sx={{ borderLeft: `3px solid ${semantic.alert}`, pl: space.related, py: 1 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="overline" sx={{ color: semantic.alert }}>2 · Business impact</Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 650, ...{ color: semantic.alert } }}>Why it matters</Typography>
            </Box>
            <Box>
              <Box sx={{ display: 'grid', mb: 4 }}>
                {[
                  { label: 'Week 3 Supply', before: '1,150 t', after: '1,030 t', delta: '−120 t', bad: true },
                  { label: 'Week 3 Coverage', before: '96%', after: '86%', delta: '−10%', bad: true },
                  { label: 'vs. 95% threshold', before: '+10 t buffer', after: '−110 t gap', delta: '', bad: true },
                ].map(({ label, before, after, delta, bad }) => (
                  <Box sx={{ px: 4, borderRight: `1px solid ${PANEL_BORDER}` }} key={label}>
                    <Typography sx={{ fontSize: 10, color: 'text.secondary', mb: 2 }}>{label}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.75rem', color: 'text.secondary', textDecoration: 'line-through' }}>{before}</Box>
                      <Box component="span" sx={{ color: 'text.secondary' }}>→</Box>
                      <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.875rem', fontWeight: 700, color: 'error.dark' }}>{after}</Box>
                    </Box>
                    {delta && <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: 10, fontWeight: 700, color: 'error.dark' }}>{delta}</Typography>}
                  </Box>
                ))}
              </Box>
              <Box sx={{ borderTop: 1, pt: 4 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 650, ...{ color: semantic.alert } }}>Week 3 is now 110 t below the 95% coverage target of 1,140 t.</Typography>
              </Box>
            </Box>
          </Box>

          {/* Recovery recommendation */}
          <DashPaper sx={{ overflow: 'hidden', p: 0 }}>
            <Box sx={{ px: 4, pt: 4 }}>
              <Typography variant="overline" sx={{ color: m3.primaryInk }}>3 · Recovery options</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 650, color: 'text.secondary' }}>Recommended recovery · compare before accepting</Typography>
            </Box>
            <Box sx={{ px: 4, pb: 4, pt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4 }}>
                <Box>
                  <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'text.primary', mb: 1 }}>Rajahmundry Block</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 2 }}>East Godavari district</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ConfBadge level="MEDIUM" />
                    <Box component="span" sx={{ fontSize: 10, color: 'text.secondary' }}>Evidence incomplete · Field verification required</Box>
                  </Box>
                  <Button size="small" color="primary" onClick={() => setInspectedFarm('Rajahmundry Block')} sx={{ mt: space.related, px: 0, minWidth: 0 }}>
                    Inspect farm details
                  </Button>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'success.dark' }}>+110 t</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Expected contribution</Typography>
                </Box>
              </Box>

              {/* Before / after recovery */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: 1, borderBottom: 1, borderColor: 'divider', py: 4, mb: 4 }}>
                <Box sx={{ pr: 4, borderRight: 1, borderColor: 'divider' }}>
                  <Typography sx={{ fontSize: 10, color: 'text.secondary', mb: 2 }}>Current</Typography>
                  <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.25rem', fontWeight: 700, color: 'error.dark' }}>1,030 t · 86%</Typography>
                  <Box sx={{ height: meter.height, bgcolor: meter.track, borderRadius: `${meter.radius}px`, mt: 2 }}>
                    <Box sx={{ height: '100%', borderRadius: `${meter.radius}px`, bgcolor: m3.error, width: '86%' }} />
                  </Box>
                </Box>
                <Box sx={{ pl: 4 }}>
                  <Typography sx={{ fontSize: 10, color: m3.success, mb: 2 }}>After recovery</Typography>
                  <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.25rem', fontWeight: 700, color: m3.success }}>1,140 t · 95%</Typography>
                  <Box sx={{ height: meter.height, bgcolor: meter.track, borderRadius: `${meter.radius}px`, mt: 2 }}>
                    <Box sx={{ height: '100%', borderRadius: `${meter.radius}px`, bgcolor: m3.success, width: '95%' }} />
                  </Box>
                  <Typography sx={{ fontSize: 9, fontWeight: 700, color: m3.success, mt: 1 }}>Target Met</Typography>
                </Box>
              </Box>

              {/* Tradeoffs */}
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 650, color: 'text.primary', mb: 4 }}>Business tradeoffs</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                {[
                  { icon: '↑', color: m3.primaryInk, bg: CARD_SELECTION_BG, label: 'Supply impact', detail: '+110 t · Restores Week 3 to 95% coverage target' },
                  { icon: '!', color: m3.onSecondaryContainer, bg: m3.secondaryContainer, label: 'Verification impact', detail: '+1 field verification required before committing' },
                  { icon: '⚑', color: m3.onTertiaryContainer, bg: m3.tertiaryContainer, label: 'Geographic impact', detail: 'East Godavari concentration: 8% → 17%' },
                ].map(({ icon, color, bg, label, detail }) => (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }} key={label}>
                    <Box sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700, color, bgcolor: bg, borderRadius: `${shape.xs}px` }}>{icon}</Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 650, color: m3.onSurface }}>{label}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: m3.onSurfaceVariant }}>{detail}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Interpretation */}
              <Box sx={{ borderColor: 'divider', mb: 6 }}>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', lineHeight: 1.6 }}>
                  "Rajahmundry Block restores Week 3 to the 95% coverage target, but requires one field verification and increases East Godavari concentration from 8% to 17%."
                </Typography>
              </Box>

            </Box>
          </DashPaper>

        </Box>
    </MainPane>
      {evidenceOpen && <EvidenceModal farmId="godavari" recovery onClose={() => setEvidenceOpen(false)} />}
      {inspectedFarm && (
        <FarmDecisionPanel
          farmName={inspectedFarm}
          onClose={() => setInspectedFarm(null)}
          onInspectMap={id => {
            setInspectedFarm(null)
            setMapFocusId(id)
            setMapExpanded(true)
          }}
        />
      )}
    </>
  )
}

// ─── SIDEBAR (MD3 standard Navigation Drawer, 360dp) ─────────────────────────

type NavItem = {
  screen: Screen
  label: string
  Icon: SvgIconComponent
}

const NAV_ITEMS: NavItem[] = [
  { screen: 'coverage',     label: 'Coverage',          Icon: DonutLargeOutlinedIcon },
  { screen: 'farms',        label: 'Farms',             Icon: AgricultureOutlinedIcon },
  { screen: 'compare',      label: 'Compare',           Icon: CompareArrowsOutlinedIcon },
  { screen: 'scenarios',    label: 'Scenarios',         Icon: TuneOutlinedIcon },
  { screen: 'verification', label: 'Verification',      Icon: FactCheckOutlinedIcon },
  { screen: 'field',        label: 'Field',             Icon: PersonPinCircleOutlinedIcon },
  { screen: 'findings',     label: 'Findings',          Icon: AssignmentTurnedInOutlinedIcon },
  { screen: 'plan',         label: 'Plan',              Icon: CalendarMonthOutlinedIcon },
  { screen: 'alert',        label: 'Monitoring alert',  Icon: NotificationImportantOutlinedIcon },
]

const FLOW_ORDER: Screen[] = ['coverage', 'farms', 'compare', 'scenarios', 'verification', 'field', 'findings', 'plan', 'alert']
const DRAWER_WIDTH = 240

function Sidebar({ current, onNavigate }: { current: Screen; onNavigate: (s: Screen) => void }) {
  const currentIdx = FLOW_ORDER.indexOf(current)

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          position: 'relative',
          height: '100%',
          bgcolor: m3.surfaceContainerLow,
          color: m3.onSurface,
          ...shellChrome,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* MD3 drawer header */}
      <Box sx={{ px: space.related, pt: space.section, pb: space.related }}>
        <Typography variant="h6" sx={{ color: m3.onSurface, lineHeight: 1.25 }}>
          ITC Procurement
        </Typography>
      </Box>

      <List
        disablePadding
        sx={{
          flex: 1,
          overflowY: 'auto',
          py: space.tight,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {NAV_ITEMS.map(({ screen, label, Icon }) => {
          const itemIdx = FLOW_ORDER.indexOf(screen)
          const isActive = current === screen
          const isAccessible = itemIdx <= currentIdx + 1
          const iconEl = <Icon fontSize="small" />

          return (
            <ListItemButton
              key={screen}
              selected={isActive}
              disabled={!isAccessible}
              onClick={() => isAccessible && onNavigate(screen)}
            >
              <ListItemIcon>
                {screen === 'alert' ? (
                  <Badge
                    color="error"
                    variant="dot"
                    overlap="circular"
                    sx={{ '& .MuiBadge-badge': { top: 4, right: 4 } }}
                  >
                    {iconEl}
                  </Badge>
                ) : (
                  iconEl
                )}
              </ListItemIcon>
              <ListItemText
                primary={label}
                slotProps={{
                  primary: {
                    variant: 'body1',
                    sx: {
                      fontWeight: isActive ? 700 : 500,
                      color: m3.onSurface,
                    },
                  },
                }}
              />
            </ListItemButton>
          )
        })}
      </List>

      {/* MD3 drawer footer — account row, not a floating card */}
      <Divider />
      <List disablePadding sx={{ py: space.tight }}>
        <ListItem sx={{ px: space.related, py: space.tight }}>
          <ListItemAvatar sx={{ minWidth: 56 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: m3.primary,
                color: m3.onPrimary,
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              S
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Shrikant"
            slotProps={{
              primary: { variant: 'body1', sx: { fontWeight: 650, color: m3.onSurface } },
            }}
          />
        </ListItem>
      </List>
    </Drawer>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('coverage')

  if (screen === 'field') {
    return <FieldScreen onNavigate={setScreen} />
  }

  const screens: Record<Screen, React.ReactNode> = {
    coverage:     <CoverageScreen     onNavigate={setScreen} />,
    farms:        <FarmsScreen        onNavigate={setScreen} />,
    compare:      <CompareScreen      onNavigate={setScreen} />,
    scenarios:    <ScenariosScreen    onNavigate={setScreen} />,
    verification: <VerificationScreen onNavigate={setScreen} />,
    field:        null,
    findings:     <FindingsScreen     onNavigate={setScreen} />,
    plan:         <PlanScreen         onNavigate={setScreen} />,
    alert:        <AlertScreen        onNavigate={setScreen} />,
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: m3.surface,
        p: space.tight,
        gap: space.tight,
      }}
    >
      <Sidebar current={screen} onNavigate={setScreen} />
      <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', minHeight: 0 }}>
        {screens[screen]}
      </Box>
    </Box>
  )
}
