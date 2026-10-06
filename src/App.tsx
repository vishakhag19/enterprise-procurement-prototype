import { useState } from 'react'
import bhimavaramFieldPhoto from './assets/bhimavaram-field.jpg'
import tanukuFieldPhoto from './assets/tanuku-field.jpg'
import {
  AppBar,
  Avatar,
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
  Toolbar,
  Typography,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { ACCENT, SIDEBAR_BG } from './theme'

// ─── Types ──────────────────────────────────────────────────────────────────
type Screen = 'coverage' | 'farms' | 'compare' | 'scenarios' | 'verification' | 'field' | 'findings' | 'plan' | 'alert'
type Conf = 'HIGH' | 'MEDIUM' | 'LOW'
type FarmRole = 'selected' | 'committed' | 'needs-verification' | 'recommended' | 'other' | 'alert'
type MapVariant = 'coverage' | 'investigation' | 'scenario' | 'plan' | 'recovery' | 'default'

// ─── Design Tokens ───────────────────────────────────────────────────────────
// Material UI (@mui/material) — Manrope + accent #0BAFAF
// XAML kit reference: github.com/MaterialDesignInXAML/MaterialDesignInXamlToolkit

// ─── MUI layout primitives ───────────────────────────────────────────────────

function DashPaper({
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
      sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2.5, border: 'none', ...sx }}
    >
      {children}
    </Paper>
  )
}

// ─── Shared Atoms ────────────────────────────────────────────────────────────

function ConfBadge({ level }: { level: Conf }) {
  const color = level === 'HIGH' ? 'success' : level === 'MEDIUM' ? 'warning' : 'error'
  return <Chip size="small" label={level} color={color} variant="outlined" sx={{ fontSize: 10, height: 22, borderRadius: 1 }} />
}

type SignalType = 'STRONG_CANDIDATE' | 'HIGH_SUPPLY_UNCERTAIN' | 'REQUIRES_VERIFICATION' | 'CONCENTRATION_RISK' | 'OUTSIDE_HARVEST'

const SIGNAL_CFG: Record<SignalType, { label: string; color: 'primary' | 'warning' | 'info' | 'error' | 'default'; variant?: 'filled' | 'outlined' }> = {
  STRONG_CANDIDATE: { label: 'STRONG CANDIDATE', color: 'primary' },
  HIGH_SUPPLY_UNCERTAIN: { label: 'HIGH SUPPLY · UNCERTAIN', color: 'warning', variant: 'outlined' },
  REQUIRES_VERIFICATION: { label: 'REQUIRES VERIFICATION', color: 'info', variant: 'outlined' },
  CONCENTRATION_RISK: { label: 'CONCENTRATION RISK', color: 'error', variant: 'outlined' },
  OUTSIDE_HARVEST: { label: 'OUTSIDE IDEAL HARVEST WINDOW', color: 'default', variant: 'outlined' },
}

function SignalBadge({ type }: { type: SignalType }) {
  const { label, color, variant = 'filled' } = SIGNAL_CFG[type]
  return <Chip size="small" label={label} color={color} variant={variant} sx={{ fontSize: 10, height: 22, borderRadius: 1 }} />
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1, lineHeight: 1.4 }}>
      {children}
    </Typography>
  )
}

function PrimaryBtn({ children, onClick, disabled = false, className = '', fullWidth = false }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string; fullWidth?: boolean }) {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
      sx={{ flexShrink: 0, py: 1.25 }}
    >
      {children}
    </Button>
  )
}

function SecondaryBtn({ children, onClick, disabled = false, className = '', fullWidth = false }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string; fullWidth?: boolean }) {
  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      className={className}
      sx={{ flexShrink: 0, borderColor: 'rgba(11,175,175,0.45)', color: 'text.primary', py: 1.25 }}
    >
      {children}
    </Button>
  )
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
    const common = {
      strokeWidth: highlighted ? 2.5 : 1.5,
      stroke: highlighted ? '#2563eb' : role === 'alert' ? '#991b1b' : '#374151',
    }
    if (role === 'committed') return <circle cx={x} cy={y} r="4.5" fill="#6b7280" {...common} />
    if (role === 'needs-verification') return <circle cx={x} cy={y} r="5.5" fill="#ffffff" {...common} />
    if (role === 'recommended') return <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth={highlighted ? 2.5 : 1.5} />
    if (role === 'alert') return (
      <g>
        <circle cx={x} cy={y} r="7" fill="#dc2626" {...common} />
        <text x={x} y={y + 3} textAnchor="middle" fontSize="8" fontWeight="700" fill="#ffffff">!</text>
      </g>
    )
    return <circle cx={x} cy={y} r={role === 'selected' ? 5.5 : 3.5} fill={role === 'selected' ? '#111827' : '#d1d5db'} {...common} />
  }

  const viewBox = {
    coverage: '80 0 260 260',
    investigation: '125 20 175 225',
    scenario: '80 0 260 260',
    plan: '80 20 260 170',
    recovery: '150 20 190 150',
    default: '0 0 360 260',
  }[variant]
  const sizeClass = fullscreen ? 'w-full h-full max-h-none' : {
    coverage: expanded ? 'w-[calc(100%+2rem)] -mx-4 h-full min-h-72 max-h-none' : 'w-full max-h-56',
    investigation: 'w-full h-full max-h-none',
    scenario: 'w-full h-52 max-h-52',
    plan: 'w-full h-48 max-h-48',
    recovery: 'w-full h-52 max-h-52',
    default: compact ? 'w-full max-h-36' : 'w-full max-h-56',
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
    <svg viewBox={viewBox} preserveAspectRatio={variant === 'coverage' || variant === 'investigation' || fullscreen ? 'xMidYMid slice' : 'xMidYMid meet'} className={sizeClass} style={{ display: 'block' }} role="img" aria-label="Andhra Pradesh procurement geography">
      <rect width="360" height="260" fill="#f3f0e7" />
      <g opacity=".76" style={{ filter: 'grayscale(0.16) saturate(0.68) contrast(0.92)' }}>
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
      <rect width="360" height="260" fill="#fffdf8" opacity=".08" />
      {variant === 'recovery' ? (
        <g fontSize="7.5" fontWeight="700" fill="#475569" stroke="#ffffff" strokeWidth="2.5" paintOrder="stroke">
          <text x="207" y="145">WEST GODAVARI</text>
          <text x="257" y="34">EAST GODAVARI</text>
        </g>
      ) : variant === 'investigation' ? (
        <g fontSize="7.5" fontWeight="700" fill="#475569" stroke="#ffffff" strokeWidth="2.5" paintOrder="stroke">
          <text x="130" y="184">GUNTUR</text>
          <text x="166" y="174">KRISHNA</text>
          <text x="207" y="157">WEST GODAVARI</text>
          <text x="257" y="34">EAST GODAVARI</text>
        </g>
      ) : (
        <g fontSize="7.5" fontWeight="700" fill="#475569" stroke="#ffffff" strokeWidth="2.5" paintOrder="stroke">
          <text x="112" y="184">GUNTUR</text>
          <text x="166" y="174">KRISHNA</text>
          <text x="207" y="157">WEST GODAVARI</text>
          <text x="257" y="34">EAST GODAVARI</text>
        </g>
      )}
      <g>
        <rect x={attributionPosition.x} y={attributionPosition.y - 12} width="116" height="13" rx="2" fill="#ffffff" opacity=".9" />
        <text x={attributionPosition.x + 4} y={attributionPosition.y - 3} fontSize="6.5" fill="#64748b">© OpenStreetMap contributors · Approx.</text>
      </g>
      {/* Farm dots */}
      {Object.entries(FARM_COORDS).map(([id, { x, y }]) => {
        const role = roles[id] ?? 'other'
        const displayRole = variant === 'recovery' && id !== 'godavari' && id !== 'raj' ? 'other' : role
        const isHighlighted = highlightIds.includes(id) || activeId === id
        return (
          <g
            key={id}
            className={onFarmSelect ? 'cursor-pointer' : ''}
            onMouseEnter={() => onFarmHover?.(id)}
            onMouseLeave={() => onFarmHover?.(null)}
            onClick={() => onFarmSelect?.(id)}
          >
            <circle cx={x} cy={y} r="11" fill="transparent" />
            {marker(x, y, displayRole, isHighlighted)}
            {addedIds.includes(id) && (
              <g pointerEvents="none">
                <circle cx={x} cy={y} r="9" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                <text x={x - 21} y={y - 10} fontSize="6.5" fontWeight="700" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2" paintOrder="stroke">ADDED</text>
              </g>
            )}
            {removedIds.includes(id) && (
              <g pointerEvents="none">
                <path d={`M ${x - 6} ${y - 6} L ${x + 6} ${y + 6} M ${x + 6} ${y - 6} L ${x - 6} ${y + 6}`} stroke="#6b7280" strokeWidth="1.75" />
                <text x={x + 8} y={y - 7} fontSize="6.5" fontWeight="700" fill="#4b5563" stroke="#ffffff" strokeWidth="2" paintOrder="stroke">REMOVED</text>
              </g>
            )}
          </g>
        )
      })}
      {variant === 'recovery' && (
        <g pointerEvents="none">
          <text x="185" y="45" fontSize="7" fontWeight="700" fill="#374151" stroke="#ffffff" strokeWidth="2" paintOrder="stroke">Rajahmundry recovery</text>
          <text x="280" y="79" fontSize="7" fontWeight="700" fill="#991b1b" stroke="#ffffff" strokeWidth="2" paintOrder="stroke">Godavari revised</text>
        </g>
      )}
      {tooltipMeta && tooltipPoint && !compact && (
        <g transform={`translate(${variant === 'investigation' ? Math.min(Math.max(tooltipPoint.x + 8, 130), 188) : Math.min(tooltipPoint.x + 12, 224)} ${Math.max(tooltipPoint.y - 58, variant === 'investigation' ? 22 : 8)})`}>
          <rect width="108" height="55" rx="3" fill="#ffffff" stroke="#cbd5e1" />
          <text x="7" y="12" fontSize="7.5" fontWeight="700" fill="#111827">{tooltipMeta.name}</text>
          <text x="7" y="22" fontSize="6.5" fill="#64748b">{tooltipMeta.district}</text>
          <text x="7" y="34" fontSize="7" fontWeight="600" fill="#111827">{tooltipMeta.supply} t · {tooltipMeta.harvest}</text>
          <text x="7" y="45" fontSize="6.5" fontWeight="700" fill="#374151">{tooltipMeta.confidence} confidence</text>
          {onViewEvidence ? (
            <text
              x="103"
              y="51"
              textAnchor="end"
              fontSize="6.5"
              fontWeight="600"
              fill="#1d4ed8"
              className="cursor-pointer"
              onClick={() => tooltipId && onViewEvidence(tooltipId)}
            >
              View evidence
            </text>
          ) : (
            <text x="7" y="52" fontSize="6" fill="#64748b">{tooltipMeta.evidence}</text>
          )}
        </g>
      )}
    </svg>
  )
}

type LegendItem = { role: FarmRole; label: string }

const DOT_CLASS: Record<FarmRole, string> = {
  selected: 'rounded-full bg-gray-900 border border-gray-900',
  committed: 'rounded-full bg-gray-500 border border-gray-700',
  'needs-verification': 'rounded-full bg-white border-2 border-gray-700',
  recommended: 'rounded-full bg-white border-2 border-blue-600',
  other: 'rounded-full bg-gray-300 border border-gray-500',
  alert: 'rounded-full bg-red-600 border-2 border-red-800',
}

function MapLegend({ items }: { items: LegendItem[] }) {
  return (
    <Stack spacing={0.75}>
      {items.map(({ role, label }) => (
        <Stack key={label} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box className={DOT_CLASS[role]} sx={{ width: 10, height: 10, flexShrink: 0 }} />
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
    <Button onClick={onClick} size="small" color="primary" sx={{ textTransform: 'none', fontWeight: 650, minWidth: 0, px: 0.5 }}>
      Expand map
    </Button>
  )
}

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
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, py: 2 }}>
        <Box>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="caption">Same procurement geography and current marker state</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Close expanded map" size="small"><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ flex: 1, minHeight: 0, p: 2.5, display: 'flex', flexDirection: 'column' }}>
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
      <Box sx={{ px: 2.5, py: 1.5 }}>
        <MapLegend items={legend} />
      </Box>
    </Dialog>
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
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="subtitle1">{farm.name}</Typography>
          <Typography variant="caption">{farm.district} district</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Close farm details" size="small"><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Expected supply</Typography>
            <Typography className="font-data" variant="subtitle1">{farm.supply} t · {farm.harvest}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Confidence</Typography>
            <ConfBadge level={farm.confidence} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Evidence status</Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>{farm.evidence}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Verification</Typography>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>{context.verification}</Typography>
          </Box>
          <Box sx={{ gridColumn: '1 / -1', borderTop: 1, borderColor: 'divider', pt: 1.5 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Relevant risk</Typography>
            <Typography variant="body2" color="text.primary">{context.risk}</Typography>
          </Box>
        </Box>
        <Button color="primary" onClick={() => onInspectMap(farmId)} sx={{ mt: 2.5, px: 0, minWidth: 0 }}>
          Inspect location on map →
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function SatelliteThumbnail({ degraded = false }: { degraded?: boolean }) {
  return (
    <svg viewBox="0 0 180 96" className="w-full h-24 rounded border border-gray-200" role="img" aria-label={degraded ? 'Current satellite field condition' : 'Previous satellite field condition'}>
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
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="overline" color="primary">Satellite + Field Evidence</Typography>
          <Typography variant="subtitle1">{farm.name}</Typography>
          <Typography variant="caption">{farm.district} district · Approximate field location</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Close evidence" size="small"><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{recovery || farm.confidence === 'LOW' ? 'Previous observation' : 'Satellite observation'}</p>
                <p className="text-[10px] text-gray-400">{recovery ? '14 days ago' : farm.confidence === 'LOW' ? 'Current view unavailable' : 'Updated 2 days ago'}</p>
              </div>
              <SatelliteThumbnail />
              <p className="text-xs text-gray-700 mt-2">
                {farm.confidence === 'LOW' && !recovery
                  ? <><strong className="font-data">NDVI —</strong> · Current reading inconclusive due to cloud cover</>
                  : <><strong className="font-data">{recovery ? 'NDVI 0.68' : farmId === 'mach' ? 'NDVI 0.74' : 'NDVI 0.66'}</strong> · Vegetation condition: Healthy</>}
              </p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{recovery ? 'Current observation' : 'Field evidence'}</p>
                <p className="text-[10px] text-gray-400">{recovery ? 'Updated 2 days ago' : farm.confidence === 'LOW' ? 'Not available' : 'Confirmed recently'}</p>
              </div>
              {recovery ? <SatelliteThumbnail degraded /> : (
                <div className="h-24 rounded border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center px-5 text-center">
                  <p className="text-xs text-gray-500">{farm.evidence}</p>
                </div>
              )}
              <p className="text-xs text-gray-700 mt-2">
                {recovery ? <><strong className="font-data">NDVI 0.41</strong> · Canopy condition materially reduced</> : <>Evidence confidence: <strong>{farm.confidence}</strong></>}
              </p>
            </div>
          </div>
          <Paper elevation={0} sx={{ p: 1.5, bgcolor: recovery ? 'error.50' : 'primary.50', backgroundColor: recovery ? '#FEF2F2' : '#E6F8F8' }}>
            <Typography variant="overline" color={recovery ? 'error' : 'primary'} sx={{ display: 'block', mb: 0.5 }}>Procurement interpretation</Typography>
            <Typography variant="body2" color="text.primary">
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
  const [mapExpanded, setMapExpanded] = useState(false)
  const [geoPanelWidth, setGeoPanelWidth] = useState(288)
  const weeks = [
    { n: 1, committed: 918,  target: 900,  delta: +18,   issue: false },
    { n: 2, committed: 960,  target: 1000, delta: -40,   issue: false },
    { n: 3, committed: 580,  target: 1200, delta: -620,  issue: true  },
    { n: 4, committed: 680,  target: 900,  delta: -220,  issue: false },
  ]
  const maxBar = 1200

  function startGeoPanelResize(event: React.PointerEvent<HTMLDivElement>) {
    const startX = event.clientX
    const startWidth = geoPanelWidth
    const onMove = (moveEvent: PointerEvent) => {
      setGeoPanelWidth(Math.min(420, Math.max(248, startWidth + startX - moveEvent.clientX)))
    }
    const onEnd = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onEnd)
  }

  return (
    <div className="flex h-full">
      {/* Main */}
      <div className="flex-1 overflow-y-auto scroll-hide p-8">
        <div className="max-w-3xl">
          <SectionLabel>Procurement Command Centre</SectionLabel>
          <h1 className="text-[2.5rem] font-bold tracking-tight text-gray-900 leading-tight mb-1">4,000 t Eucalyptus</h1>
          <p className="text-sm text-gray-500 mb-7">4-week procurement window · AP Region</p>

          {/* Target card */}
          <DashPaper sx={{ p: 2.5, mb: 3 }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <SectionLabel>Procurement Target</SectionLabel>
                <p className="text-sm font-medium text-gray-700">78% committed</p>
              </div>
              <p className="font-data text-3xl font-bold text-gray-900">4,000 t</p>
            </div>
            {/* Stacked bar */}
            <Box sx={{ display: 'flex', height: 12, borderRadius: 1, overflow: 'hidden', bgcolor: 'action.hover', mb: 2 }}>
              <Box sx={{ width: `${2568/4000*100}%`, bgcolor: 'primary.main', transition: 'width 0.2s' }} />
              <Box sx={{ width: `${570/4000*100}%`, bgcolor: 'grey.400' }} />
            </Box>
            <div className="grid grid-cols-3 gap-6">
              {[
                { dot: 'bg-gray-900', label: 'Firm',    value: '2,568 t' },
                { dot: 'bg-gray-400', label: 'At Risk', value: '570 t'   },
                { dot: 'bg-gray-200 border border-gray-300', label: 'Gap', value: '862 t' },
              ].map(({ dot, label, value }) => (
                <div key={label}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                  </div>
                  <p className="font-data text-2xl font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </DashPaper>

          {/* Weekly position */}
          <div className="mb-6">
            <SectionLabel>Weekly Procurement Position</SectionLabel>
            <div className="space-y-2.5">
              {weeks.map(w => {
                const pct = (w.committed / maxBar) * 100
                const tPct = (w.target / maxBar) * 100
                return (
                  <DashPaper
                    key={w.n}
                    sx={{ p: 2, bgcolor: w.issue ? '#FEF2F2' : 'background.paper' }}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">Week {w.n}</span>
                        {w.issue && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-700 text-white uppercase tracking-widest rounded-sm">
                            Primary Issue
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-data text-sm font-semibold text-gray-900">{w.committed.toLocaleString()}</span>
                        <span className="font-data text-xs text-gray-400">/ {w.target.toLocaleString()} t</span>
                        <span className={`font-data text-xs font-medium ${w.delta >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                          {w.delta > 0 ? `+${w.delta}` : w.delta} t
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-gray-100 rounded-sm overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-sm ${w.issue ? 'bg-red-600' : w.delta >= 0 ? 'bg-gray-900' : 'bg-gray-500'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                      {/* Target marker */}
                      <div
                        className="absolute top-0 h-full w-0.5 bg-gray-900 opacity-60"
                        style={{ left: `${Math.min(tPct, 100)}%` }}
                      />
                    </div>
                  </DashPaper>
                )
              })}
            </div>
          </div>

          {/* Decision queue */}
          <div>
            <SectionLabel>Needs a Decision</SectionLabel>
            <div className="space-y-3">
              {/* Week 3 primary */}
              <DashPaper sx={{ p: 2, boxShadow: `inset 3px 0 0 ${ACCENT}` }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Week 3 supply gap: 620 t</p>
                    <p className="text-xs text-gray-600 mb-1">1,200 t needed. 580 t currently committed.</p>
                    <p className="text-xs text-gray-500">Week 3 is the most constrained delivery window. 620 t of demand remains uncovered.</p>
                  </div>
                  <PrimaryBtn onClick={() => onNavigate('farms')} className="flex-shrink-0">Resolve gap</PrimaryBtn>
                </div>
              </DashPaper>
              {/* Secondary items */}
              {[
                {
                  title: '3 procurement commitments at risk',
                  sub: '570 t of committed supply has delivery risk.',
                  detail: 'Narsapur Farms and Avanigadda Block have flagged logistical delays. Combined exposure: 300 t.',
                  cta: 'Review risks',
                },
                {
                  title: '7 farms changed significantly this week',
                  sub: 'Satellite condition, harvest timing, or expected supply changed.',
                  detail: 'Changes are material enough to potentially affect existing procurement decisions.',
                  cta: 'Review changes',
                },
                {
                  title: '5 decisions blocked by missing evidence',
                  sub: 'These farms cannot yet be treated as firm supply.',
                  detail: 'Field evidence or current satellite data is unavailable for 5 eligible farms.',
                  cta: 'Resolve evidence',
                },
              ].map(({ title, sub, detail, cta }) => (
                <DashPaper key={title} sx={{ p: 2 }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
                      <p className="text-xs text-gray-600 mb-1">{sub}</p>
                      <p className="text-xs text-gray-500">{detail}</p>
                    </div>
                    <SecondaryBtn onClick={() => onNavigate('farms')} className="flex-shrink-0 text-xs">{cta}</SecondaryBtn>
                  </div>
                </DashPaper>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right geo panel */}
      <div
className="relative flex flex-col flex-shrink-0 bg-white"
        style={{ width: geoPanelWidth, minWidth: 248, maxWidth: 420 }}
      >
        <div
          onPointerDown={startGeoPanelResize}
          className="absolute -left-1 top-0 bottom-0 w-2 cursor-col-resize touch-none group z-10"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize supply geography panel"
        >
          <div className="w-px h-full mx-auto bg-transparent group-hover:bg-blue-300 transition-colors" />
        </div>
        <div className="p-4 border-b border-gray-100 flex items-start justify-between gap-3">
          <div>
            <SectionLabel>Week 3 · Supply Geography</SectionLabel>
            <p className="text-xs text-gray-500">580 t committed across AP region</p>
          </div>
          <ExpandMapButton onClick={() => setMapExpanded(true)} />
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0">
            <RegionMap fullscreen variant="coverage" />
          </div>
          <div className="p-4 border-t border-gray-100">
            <MapLegend items={DEFAULT_LEGEND} />
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            Week 3 has a <strong className="text-gray-900">620 t supply gap</strong>. The system has identified candidate farms that can close it.
          </p>
          <PrimaryBtn fullWidth onClick={() => onNavigate('farms')}>
            Close the 620 t gap →
          </PrimaryBtn>
        </div>
      </div>
      {mapExpanded && (
        <ExpandedMap
          title="Week 3 supply geography"
          variant="coverage"
          legend={DEFAULT_LEGEND}
          onClose={() => setMapExpanded(false)}
        />
      )}
    </div>
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
  return (
    <DashPaper
      onMouseEnter={() => onHover(farm.id)}
      onMouseLeave={() => onHover(null)}
      sx={{
        cursor: 'pointer',
        transition: 'background-color 0.15s',
        bgcolor: isHovered || inComparison ? '#E6F8F8' : 'background.paper',
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Typography variant="subtitle2">{farm.name}</Typography>
          <Typography variant="caption">{farm.district}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography className="font-data" variant="h6">{farm.supply} t</Typography>
          <Typography variant="caption">{farm.harvest}</Typography>
        </Box>
      </Stack>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.75, mb: 1 }}>
        <ConfBadge level={farm.confidence} />
        {farm.signals.map(s => <SignalBadge key={s} type={s} />)}
      </Stack>
      {farm.evidenceStatus && farm.evidenceNote && (
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
          <Box component="strong" sx={{ color: 'text.primary' }}>{farm.evidenceStatus}</Box> · {farm.evidenceNote}
        </Typography>
      )}
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>Why recommended</Typography>
      <Typography variant="body2" sx={{ mb: 0.5 }}>{farm.why}</Typography>
      {farm.missing && (
        <Typography variant="body2" color="text.primary"><strong>Missing:</strong> {farm.missing}</Typography>
      )}
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
        <Button onClick={() => onViewEvidence(farm.id)} size="small" color="primary" sx={{ minWidth: 0, px: 0.5, fontSize: 12 }}>View evidence</Button>
        <Button
          size="small"
          variant={inComparison ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => onToggle(farm.id)}
          startIcon={inComparison ? <CheckIcon sx={{ fontSize: 14 }} /> : undefined}
          sx={{ fontSize: 12, py: 0.5, px: 1.25, minWidth: 0 }}
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
    <div className="flex h-full relative">
      {/* Map panel */}
      <div className="w-[34%] min-w-96 max-w-[440px] flex-shrink-0 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">GIS Workspace · Week 3</p>
          <p className="text-xs text-gray-500">Hover a farm card to highlight on map</p>
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0">
            <RegionMap
              variant="investigation"
              highlightIds={highlightIds}
              activeId={activeFarmId}
              onFarmHover={setHoverId}
              onFarmSelect={setFocusedId}
              onViewEvidence={setEvidenceFarm}
            />
          </div>
          <div className="p-4 border-t border-gray-100">
            <MapLegend items={DEFAULT_LEGEND} />
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-3">{comparison.length} farms selected for comparison</p>
          <PrimaryBtn
            onClick={() => onNavigate('compare')}
            disabled={comparison.length < 2}
            className="w-full justify-center"
          >
            Compare selected →
          </PrimaryBtn>
        </div>
      </div>

      {/* Farm list */}
      <div className="flex-1 overflow-y-auto scroll-hide">
        <div className="p-6">
          {/* Gap header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Week 3 Supply Gap</p>
              <h2 className="text-2xl font-bold text-gray-900">620 t still needed</h2>
              <p className="text-xs text-gray-500 mt-1">1,200 t required · 580 t committed</p>
            </div>
            <div className="flex gap-2">
              <SecondaryBtn onClick={() => setComparison(['mach', 'reddy', 'bhim', 'tanuku'])}>Use recommended set</SecondaryBtn>
              <PrimaryBtn onClick={() => onNavigate('compare')}>Compare selected →</PrimaryBtn>
            </div>
          </div>

          {/* Recommended */}
          <div className="mb-6">
            <SectionLabel>Recommended for this gap</SectionLabel>
            <div className="space-y-3">
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
            </div>
          </div>

          {/* Other eligible */}
          <div>
            <SectionLabel>Other eligible farms · May close remaining gap or diversify supply</SectionLabel>
            <div className="space-y-3">
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
            </div>
          </div>
        </div>
      </div>
      {evidenceFarm && <EvidenceModal farmId={evidenceFarm} onClose={() => setEvidenceFarm(null)} />}
    </div>
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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed header */}
      <div className="border-b border-gray-200 px-8 py-5 flex items-start justify-between flex-shrink-0">
        <div>
          <SectionLabel>Candidate Comparison</SectionLabel>
          <h2 className="text-2xl font-bold text-gray-900">4 farms · Week 3</h2>
          <p className="text-xs text-gray-500 mt-1">Scenario planning can add or substitute farms from the full eligible pool.</p>
        </div>
        <PrimaryBtn onClick={() => onNavigate('scenarios')}>Plan a scenario →</PrimaryBtn>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hide p-8">
        {/* Interpretation cards */}
        <div className="mb-8">
          <SectionLabel>Interpretation</SectionLabel>
          <div className="grid grid-cols-2 gap-4">
            {COMPARE_FARMS.map(f => (
              <DashPaper key={f.id} sx={{ p: 2 }}>
                <p className="text-sm font-bold text-gray-900 mb-0.5">{f.name}</p>
                <p className="text-xs font-semibold text-gray-500 mb-2">{f.headline}</p>
                <p className="text-xs text-gray-600 mb-3">{f.summary}</p>
                <p className="text-xs text-gray-700 mb-3">
                  Closes <strong>{f.gapPct}%</strong> of the remaining 620 t Week 3 gap
                  {f.gapNote ? `, but ${f.gapNote}.` : '.'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-data text-lg font-bold text-gray-900">{f.supply} t</span>
                  <ConfBadge level={f.confidence} />
                  <span className="text-[10px] text-gray-500">
                    {f.confidence === 'HIGH' ? 'Evidence current' : f.confidence === 'MEDIUM' ? 'Evidence incomplete' : 'Evidence missing'}
                  </span>
                  {f.verifReq && <span className="text-[10px] text-gray-500 font-medium">verif. req.</span>}
                </div>
              </DashPaper>
            ))}
          </div>
        </div>

        {/* Detailed table */}
        <div>
          <SectionLabel>Detailed Comparison</SectionLabel>
          <TableContainer component={Paper} elevation={0} sx={{ p: 0 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 650, width: 176, position: 'sticky', left: 0, bgcolor: 'grey.50', zIndex: 1 }}>Attribute</TableCell>
                  {COMPARE_FARMS.map(f => (
                    <TableCell key={f.id} sx={{ fontWeight: 650, minWidth: 180 }}>
                      <Typography variant="body2" sx={{ fontWeight: 650 }}>{f.name}</Typography>
                      <Typography variant="caption">{f.district}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {TABLE_ROWS.map(({ key, label }) => (
                  <TableRow key={key} hover>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 500, position: 'sticky', left: 0, bgcolor: 'background.paper', verticalAlign: 'top' }}>{label}</TableCell>
                    {COMPARE_FARMS.map(f => {
                      const val = f[key as keyof typeof f]
                      if (key === 'confidence') return (
                        <TableCell key={f.id} sx={{ verticalAlign: 'top' }}>
                          <ConfBadge level={val as Conf} />
                          <Typography variant="caption" sx={{ display: 'block',  mt: 0.5 }}>
                            {val === 'HIGH' ? 'Evidence current' : val === 'MEDIUM' ? 'Evidence incomplete' : 'Evidence missing'}
                          </Typography>
                        </TableCell>
                      )
                      if (key === 'verifReq') return (
                        <TableCell key={f.id} sx={{ verticalAlign: 'top', fontWeight: 650, color: val ? 'warning.dark' : 'text.primary' }}>
                          {val ? 'Yes' : 'No'}
                        </TableCell>
                      )
                      if (key === 'supply') return (
                        <TableCell key={f.id} className="font-data" sx={{ verticalAlign: 'top', fontWeight: 650 }}>{val} t</TableCell>
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
        </div>
      </div>

      <div className="border-t border-gray-200 px-8 py-4 flex-shrink-0 flex justify-end">
        <p className="text-xs text-gray-500 mr-auto pt-1">Scenario planning can consider these candidates and other eligible farms. The manually compared farms do not limit scenario generation.</p>
        <PrimaryBtn onClick={() => onNavigate('scenarios')}>Plan a scenario →</PrimaryBtn>
      </div>
    </div>
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
    <div className="flex h-full">
      {/* Main */}
      <div className="flex-1 overflow-y-auto scroll-hide">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <SectionLabel>Scenario Planning</SectionLabel>
              <h2 className="text-2xl font-bold text-gray-900">Week 3 · 620 t gap</h2>
            </div>
            {selected && (
              <PrimaryBtn onClick={() => onNavigate('verification')} disabled={!canProceed}>
                Proceed with {selectedStrategy?.name} →
              </PrimaryBtn>
            )}
          </div>

          {/* Constraints */}
          <DashPaper sx={{ p: 2.5, mb: 3 }}>
            <div className="flex items-center justify-between mb-4">
              <SectionLabel>Business Constraints</SectionLabel>
              {isModified && (
                <Button size="small" color="primary" onClick={() => setMaxVisits(10)} sx={{ minWidth: 0 }}>
                  Reset to defaults
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
              <Box>
                <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>Min. Week 3 coverage</Typography>
                  <Typography className="font-data" variant="body2" sx={{ fontWeight: 700 }}>{minCoverage}%</Typography>
                </Stack>
                <Slider min={80} max={100} value={minCoverage} onChange={(_, v) => setMinCoverage(v as number)} />
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="caption">80%</Typography><Typography variant="caption">100%</Typography></Stack>
              </Box>
              <Box>
                <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>Max. field verification visits</Typography>
                  <Typography className="font-data" variant="body2" color={isModified ? 'warning.main' : 'text.primary'} sx={{ fontWeight: 700 }}>
                    {maxVisits} {maxVisits === 1 ? 'visit' : 'visits'}
                  </Typography>
                </Stack>
                <Slider min={0} max={10} value={maxVisits} onChange={(_, v) => setMaxVisits(v as number)} />
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="caption">0 visits</Typography><Typography variant="caption">10 visits</Typography></Stack>
              </Box>
              <Box>
                <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>Min. high-confidence supply</Typography>
                  <Typography className="font-data" variant="body2" sx={{ fontWeight: 700 }}>{minHighConf}%</Typography>
                </Stack>
                <Slider min={40} max={100} value={minHighConf} onChange={(_, v) => setMinHighConf(v as number)} />
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="caption">40%</Typography><Typography variant="caption">100%</Typography></Stack>
              </Box>
              <Box>
                <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>Max. single-district concentration</Typography>
                  <Typography className="font-data" variant="body2" sx={{ fontWeight: 700 }}>{maxDistConc}%</Typography>
                </Stack>
                <Slider min={10} max={80} value={maxDistConc} onChange={(_, v) => setMaxDistConc(v as number)} />
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="caption">10%</Typography><Typography variant="caption">80%</Typography></Stack>
              </Box>
            </div>
          </DashPaper>

          {/* Impact panel (shown when maxVisits changed) */}
          {showImpact && (
            <DashPaper sx={{ p: 2.5, mb: 3, bgcolor: '#FFFBEB' }}>
              <div className="flex items-start justify-between mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Impact of This Change</p>
                <p className="text-[10px] text-amber-700 font-medium">Max. field verification visits: 10 visits → <strong>{maxVisits} visit{maxVisits !== 1 ? 's' : ''}</strong></p>
              </div>
              {/* Metrics grid */}
              <div className="grid grid-cols-4 border-y border-amber-200 py-3 mb-4">
                {[
                  { label: 'Week 3 coverage', before: '96%', after: '89%', bad: true },
                  { label: 'Verification visits', before: '2', after: '1', bad: false },
                  { label: 'High-conf supply', before: '65%', after: '69%', bad: false },
                  { label: 'Max district conc.', before: '36%', after: '23%', bad: false },
                ].map(({ label, before, after, bad }) => (
                  <div key={label} className="px-3 first:pl-0 border-r border-amber-200 last:border-r-0">
                    <p className="text-[10px] text-gray-500 mb-2">{label}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="font-data text-sm text-gray-400 line-through">{before}</span>
                      <span className="text-gray-400">→</span>
                      <span className={`font-data text-sm font-bold ${bad ? 'text-red-700' : 'text-gray-900'}`}>{after}</span>
                    </div>
                    {bad && <p className="text-[10px] font-bold text-red-700 mt-1 uppercase">Below target</p>}
                  </div>
                ))}
              </div>
              {/* Farm mix */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-800 mb-2">Farm Mix Changed</p>
                <div className="grid grid-cols-2">
                  <div className="pr-4 border-r border-amber-200">
                    <p className="text-[10px] font-semibold text-red-700 mb-2">Removed</p>
                    <div className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">✕</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">Tanuku Plot · <span className="font-data">160 t</span></p>
                        <p className="text-[10px] text-gray-500">Requires a field verification visit — exceeds new limit of {maxVisits}</p>
                      </div>
                    </div>
                  </div>
                  <div className="pl-4">
                    <p className="text-[10px] font-semibold text-emerald-700 mb-2">Added</p>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">+</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">Guntur Strip · <span className="font-data">80 t</span></p>
                        <p className="text-[10px] text-gray-500">No field visit required — stays within {maxVisits}-visit limit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Coverage target not met */}
              <DashPaper sx={{ p: 1.5, mb: 1.5, bgcolor: '#FEF2F2' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-700 mb-1">Coverage target not met</p>
                <p className="text-xs font-semibold text-red-800 mb-1">Coverage-First cannot reach the 95% target with this constraint.</p>
                <p className="text-xs text-gray-600">
                  Week 3 supply drops to <strong>1,070 t (89%)</strong>. The 95% minimum requires <strong>1,140 t</strong> — 70 t short.
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  The farm substitution replaces <strong>160 t</strong> with only <strong>80 t</strong> — a net supply loss of <strong>80 t</strong>.
                </p>
              </DashPaper>
              {/* Interpretation */}
              <div className="bg-amber-100 rounded p-3">
                <p className="text-xs text-amber-900 leading-relaxed">
                  Reducing the verification limit to {maxVisits} removes Tanuku Plot and substitutes Guntur Strip, reducing Week 3 supply by 80 t and coverage from 96% to 89%, below the 95% target.
                </p>
              </div>
            </DashPaper>
          )}

          {/* Strategies */}
          <div>
            <SectionLabel>Generated Strategies</SectionLabel>
            <div className="space-y-4">
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
                      p: 2,
                      cursor: 'pointer',
                      bgcolor: isSelected ? '#E6F8F8' : failCount > 0 ? '#FEF2F2' : 'background.paper',
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${isSelected ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-gray-300 bg-white'}`}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full m-auto mt-0.5" />}
                        </div>
                        <p className="text-sm font-bold text-gray-900">{s.name}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
                        failCount === 0
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {failCount === 0 ? 'ALL PASS' : `${failCount} FAIL`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-4 ml-7">{rationale}</p>

                    {/* Metrics */}
                    <div className="grid grid-cols-4 ml-7 mb-4 border-y border-gray-100 py-3">
                      {[
                        { label: 'Week 3', value: wk3 === 100 ? `100% · +30 t buffer` : `${wk3}%`, fail: wk3Fails },
                        { label: 'Verification', value: String(verif), fail: verif > maxVisits },
                        { label: 'High confidence', value: `${hiconf}%`, fail: hiconf < minHighConf },
                        { label: 'Max district', value: `${dist}%`, fail: dist > maxDistConc },
                      ].map(({ label, value, fail }) => (
                        <div key={label} className="px-3 first:pl-0 border-r border-gray-100 last:border-r-0">
                          <p className="text-[10px] text-gray-500 mb-1">{label}</p>
                          <p className={`font-data text-sm font-bold ${fail ? 'text-red-700' : 'text-gray-900'}`}>{value}</p>
                          {fail && <p className="text-[9px] text-red-600 mt-0.5">Fails constraint</p>}
                        </div>
                      ))}
                    </div>

                    {/* Farm mix */}
                    <div className="ml-7">
                      <p className="text-[10px] font-medium text-gray-500 mb-1.5">Farm mix</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {farms.map(f => {
                        const needsVerif = f.includes('✶')
                        return (
                          <Button key={f} size="small" color="primary" onClick={e => { e.stopPropagation(); setInspectedFarm(f.replace(' ✶', '').split(' · ')[0]) }} sx={{ display: 'block', px: 0, minWidth: 0, textAlign: 'left' }}>{f}</Button>
                        )
                      })}
                      </div>
                    </div>
                  </DashPaper>
                )
              })}
            </div>
          </div>

          {/* Footer CTA when selected */}
          {selected && (
            <DashPaper sx={{ mt: 3, p: 2, bgcolor: canProceed ? 'background.paper' : '#FEF2F2' }}>
              {canProceed ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{selectedStrategy?.name} selected — all constraints satisfied.</p>
                  <PrimaryBtn onClick={() => onNavigate('verification')}>Proceed with {selectedStrategy?.name} →</PrimaryBtn>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-red-800 mb-0.5">Cannot proceed: {selectedStrategy?.name} fails {selectedFails} constraint{selectedFails > 1 ? 's' : ''}.</p>
                    {selectedWk3 !== null && selectedWk3 < minCoverage && (
                      <p className="text-xs text-red-700">Coverage {selectedWk3}% is below the {minCoverage}% Week 3 coverage requirement.</p>
                    )}
                  </div>
                  <PrimaryBtn disabled>Proceed with {selectedStrategy?.name} →</PrimaryBtn>
                </div>
              )}
            </DashPaper>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-72 flex flex-col bg-white flex-shrink-0">
        <div className="p-4 border-b border-gray-100 flex items-start justify-between gap-3">
          <SectionLabel>Select a Strategy</SectionLabel>
          <ExpandMapButton onClick={() => {
            setMapFocusId(null)
            setMapExpanded(true)
          }} />
        </div>
        <div className="flex-1 p-4 flex flex-col">
          <div className="min-h-0">
            <RegionMap
              compact={true}
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
            />
          </div>
          <div className="mt-3 mb-4">
            <MapLegend items={DEFAULT_LEGEND} />
          </div>
          {selected && selectedStrategy && (
            <div className="border-t border-gray-200 pt-3 mt-auto">
              <p className="text-xs font-semibold text-gray-600 mb-3">Week 3 summary</p>
              <div className="grid grid-cols-2 gap-3">
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
                  { label: 'High-confidence share', value: `${isModified ? selectedStrategy.hiconfModified : selectedStrategy.hiconfDefault}%` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] text-gray-500 mb-0.5">{label}</p>
                    <p className="font-data text-base font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
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
      {mapExpanded && (
        <ExpandedMap
          title="Scenario farm distribution"
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
          legend={DEFAULT_LEGEND}
          onClose={() => setMapExpanded(false)}
        />
      )}
    </div>
  )
}

// ─── VERIFICATION SCREEN ─────────────────────────────────────────────────────

function VerificationScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const farms = [
    {
      id: 'bhim', name: 'Bhimavaram Lot', district: 'West Godavari district',
      supply: 250, evidenceTag: 'MISSING EVIDENCE',
      tagCls: 'bg-red-50 border-red-300 text-red-800',
      reason: 'No current field evidence. Standing stock unconfirmed. Yield estimate based on prior season data only.',
      needs: ['Standing stock confirmed', 'Harvest readiness confirmed', 'Current field photos captured'],
      confidence: 'LOW' as Conf,
    },
    {
      id: 'tanuku', name: 'Tanuku Plot', district: 'West Godavari district',
      supply: 160, evidenceTag: 'INSUFFICIENT EVIDENCE',
      tagCls: 'bg-amber-50 border-amber-300 text-amber-800',
      reason: 'Missing current field evidence. Last field visit was 6 weeks ago. Crop status may have changed.',
      needs: ['Current crop / harvest status confirmed', 'Current field photos captured'],
      confidence: 'MEDIUM' as Conf,
    },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="border-b border-gray-200 px-8 py-5 flex items-start justify-between flex-shrink-0">
        <div>
          <SectionLabel>Selective Field Verification</SectionLabel>
          <h2 className="text-2xl font-bold text-gray-900">Coverage-First · Farms requiring verification</h2>
          <p className="text-xs text-gray-500 mt-1">2 selected · 0 remaining</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-400 text-right max-w-[220px] leading-relaxed">Only farms with missing, insufficient, or conflicting evidence appear here.</p>
          <PrimaryBtn onClick={() => onNavigate('field')}>Assign 2 farms to Ravi →</PrimaryBtn>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hide p-8">
        <div className="max-w-2xl space-y-4">
          {farms.map(f => (
            <DashPaper key={f.id} sx={{ p: 2.5, bgcolor: '#FFFBEB' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded border border-amber-700 bg-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">{f.name}</p>
                    <p className="text-xs text-gray-500">{f.district}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-data text-xl font-bold text-gray-900 mb-1">{f.supply} t</p>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border rounded-sm ${f.tagCls}`}>
                    {f.evidenceTag}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3">{f.reason}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Needs</p>
              <ul className="space-y-1 mb-3">
                {f.needs.map(n => (
                  <li key={n} className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-700 flex-shrink-0" />
                    {n}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500">
                Confidence before verification: <strong className="text-gray-800">{f.confidence}</strong>
                <span> · {f.confidence === 'LOW' ? 'Evidence missing' : 'Evidence incomplete'}</span>
              </p>
            </DashPaper>
          ))}

          {/* Assignment summary */}
          <div className="border-t border-gray-200 pt-5">
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              2 farms will be assigned to Ravi for field verification. Ravi will visit each farm, verify the requested evidence, and submit findings. Only these specific evidence items are needed — Ravi does not need to assess the full farm.
            </p>
            <PrimaryBtn onClick={() => onNavigate('field')}>Assign to Ravi →</PrimaryBtn>
          </div>
        </div>
      </div>
    </div>
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
    <div className="flex items-start justify-center h-full bg-gray-100 overflow-y-auto scroll-hide py-6 px-4">
      <DashPaper sx={{ width: '100%', maxWidth: 410, overflow: 'hidden', boxShadow: 1, p: 0 }}>
        <div className="bg-white overflow-hidden">
          {/* Dark top bar */}
          <div className="text-white px-5 pt-4 pb-3" style={{ background: '#0B1F1F', borderTop: `3px solid ${ACCENT}` }}>
            <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 mb-0.5">
                {view === 'brief' ? 'Assigned Farm' : 'Capture + Submit'}
              </p>
              <p className="text-sm font-semibold">{view === 'brief' ? 'Ravi · Field officer' : farm.name}</p>
            </div>
            <span className="text-sm font-data font-medium text-gray-300">{farmIdx + 1} of 2</span>
            </div>
            <div className="h-1 bg-gray-700 mt-3 overflow-hidden">
              <div className="h-full bg-white transition-all" style={{ width: `${((farmIdx + 1) / FIELD_FARMS.length) * 100}%` }} />
            </div>
          </div>

          {view === 'brief' ? (
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-0.5">{farm.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{farm.location}</p>

              {/* Mini map */}
              <div className="bg-gray-100 rounded border border-gray-200 h-32 flex items-center justify-center mb-2 overflow-hidden relative">
                <svg viewBox="0 0 200 120" className="w-full h-full">
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
                  <path d="M26 101 C56 91 82 70 104 49 C122 32 143 23 169 19" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="5 3" />
                  <circle cx="26" cy="101" r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                  <path d="M169 9 C160 9 153 16 153 25 C153 37 169 49 169 49 C169 49 185 37 185 25 C185 16 178 9 169 9 Z" fill="#111827" />
                  <circle cx="169" cy="25" r="5" fill="#ffffff" />
                  <path d="M145 51 L190 45 L195 84 L151 91 Z" fill="#83996b" opacity=".7" stroke="#526348" strokeDasharray="3 2" />
                  <rect x="131" y="108" width="67" height="10" rx="2" fill="#ffffff" opacity=".9" />
                  <text x="135" y="115" fontSize="5.5" fill="#64748b">© OpenStreetMap</text>
                </svg>
                <div className="absolute bottom-2 left-2 bg-white border border-gray-200 rounded px-2 py-0.5">
                  <p className="text-[9px] text-gray-600 font-medium">Approximate destination · West Godavari</p>
                </div>
              </div>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={() => window.open(farmIdx === 0 ? 'https://www.openstreetmap.org/?mlat=16.54&mlon=81.52#map=12/16.54/81.52' : 'https://www.openstreetmap.org/?mlat=16.75&mlon=81.68#map=12/16.75/81.68', '_blank', 'noopener,noreferrer')}
                sx={{ mb: 2.5 }}
              >
                Open in navigation
              </Button>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-1">Expected supply</p>
                    <p className="font-data text-xl font-bold text-gray-900">{farm.supply} t</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-1">Harvest</p>
                    <p className="text-sm font-semibold text-gray-900">{farm.harvest}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-[10px] font-semibold text-gray-500 mb-1">Why this visit</p>
                <p className="text-xs text-gray-600 leading-relaxed">{farm.whyVisit}</p>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-5">
                <p className="text-[10px] font-semibold text-gray-500 mb-2">Verify</p>
                <ul className="space-y-1.5">
                  {farm.verifyItems.map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <PrimaryBtn fullWidth onClick={() => setView('capture')}>
                Start verification
              </PrimaryBtn>
            </div>
          ) : (
            <div className="p-5">
              <p className="text-[10px] font-semibold text-gray-500 mb-3">Verification checklist</p>

              <div className="space-y-0 mb-4">
                {farm.verifyItems.map((item, i) => (
                  <FormControlLabel
                    key={item}
                    sx={{ display: 'flex', ml: 0, mr: 0, py: 1.5, borderBottom: 1, borderColor: 'divider', width: '100%' }}
                    control={<Checkbox checked={!!farmChecks[i]} onChange={() => toggleCheck(i)} color="primary" />}
                    label={<Typography variant="body2" sx={{ fontWeight: farmChecks[i] ? 600 : 400 }}>{item}</Typography>}
                  />
                ))}
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-semibold text-gray-500 mb-2">Notes</p>
                <TextField
                  value={notes[farmIdx] || ''}
                  onChange={e => setNotes(prev => ({ ...prev, [farmIdx]: e.target.value }))}
                  placeholder="Add relevant field observations"
                  multiline
                  minRows={4}
                  fullWidth
                />
              </div>

              {photos[farmIdx] ? (
                <div className="border-y border-gray-200 py-3 mb-4">
                  <Box component="button" onClick={() => setPhotoPreviewOpen(true)} sx={{ width: '100%', display: 'block', bgcolor: 'grey.50', border: 0, p: 0, cursor: 'pointer' }}>
                    <img
                      src={farmIdx === 0 ? bhimavaramFieldPhoto : tanukuFieldPhoto}
                      alt={`Field evidence captured at ${farm.name}`}
                      className="w-full h-auto max-h-64 object-contain"
                    />
                  </Box>
                  <div className="flex items-start justify-between gap-3 mt-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Field photo captured</p>
                      <p className="text-xs text-gray-500 mt-1">Today · {farm.name}</p>
                    </div>
                    <Button size="small" color="error" onClick={() => setPhotos(prev => ({ ...prev, [farmIdx]: false }))}>Remove</Button>
                  </div>
                </div>
              ) : (
                <>
                  <Button fullWidth variant="outlined" color="primary" onClick={() => setPhotos(prev => ({ ...prev, [farmIdx]: true }))} sx={{ mb: 0.5 }}>
                    Add photo
                  </Button>
                  <p className="text-[10px] text-gray-400 text-center mb-4">0 photos added · Required to confirm evidence</p>
                </>
              )}

              <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-5 px-5 pt-4 pb-5 mt-5">
              <p className="text-[10px] font-semibold text-gray-500 mb-2">Status and submit</p>
              <PrimaryBtn fullWidth onClick={handleSubmit} disabled={!canConfirm} className="mb-2">
                Evidence confirmed · Submit findings
              </PrimaryBtn>
              <SecondaryBtn fullWidth onClick={handleSubmit}>
                Partial or uncertain · Submit findings
              </SecondaryBtn>
              </div>
            </div>
          )}
        </div>

      </DashPaper>
      {photoPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-gray-950/80 flex items-center justify-center p-6" onClick={() => setPhotoPreviewOpen(false)}>
          <div className="max-w-5xl max-h-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between text-white mb-3">
              <div>
                <p className="text-sm font-semibold">Field photo captured</p>
                <p className="text-xs text-gray-300">Today · {farm.name}</p>
              </div>
              <IconButton onClick={() => setPhotoPreviewOpen(false)} aria-label="Close photo preview" sx={{ color: '#fff' }}><CloseIcon /></IconButton>
            </div>
            <img
              src={farmIdx === 0 ? bhimavaramFieldPhoto : tanukuFieldPhoto}
              alt={`Full-size field evidence captured at ${farm.name}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="border-b border-gray-200 px-8 py-5 flex-shrink-0">
        <SectionLabel>Field Officer Findings</SectionLabel>
        <h2 className="text-2xl font-bold text-gray-900">Review evidence</h2>
        <p className="text-xs text-gray-500 mt-1">Ravi has submitted findings for 2 farms. Evidence has been confirmed.</p>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hide p-8">
        <div className="max-w-2xl space-y-5">
          {findings.map(f => (
            <DashPaper key={f.id} sx={{ overflow: 'hidden', bgcolor: '#ECFDF5', p: 0 }}>
              {/* Header */}
              <div className="border-b border-gray-100 px-5 py-4 flex items-start justify-between">
                <div>
                  <p className="text-base font-bold text-gray-900 mb-0.5">{f.name}</p>
                  <p className="text-xs text-gray-500">{f.district}</p>
                </div>
                <p className="font-data text-lg font-bold text-gray-900">{f.supply} t</p>
              </div>

              <div className="p-5">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-28 flex-shrink-0">
                    <p className="text-[10px] font-medium text-gray-500 mb-1">Previous confidence</p>
                    <ConfBadge level={f.before} />
                    <p className="text-[10px] text-gray-500 mt-1">{f.before === 'LOW' ? 'Evidence missing' : 'Evidence incomplete'}</p>
                  </div>
                  <span className="text-gray-300 pt-5">→</span>
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 mb-1">Evidence collected</p>
                    <p className="text-xs font-semibold text-gray-800">Required evidence collected</p>
                  </div>
                  <span className="text-gray-300 pt-5">→</span>
                  <div className="w-40 flex-shrink-0">
                    <p className="text-[10px] font-medium text-gray-500 mb-1">Updated confidence</p>
                    <ConfBadge level={f.after} />
                    <p className="text-[10px] text-gray-500 mt-1">Evidence current · Field evidence aligned</p>
                  </div>
                  <div className="w-24 flex-shrink-0">
                    <p className="text-[10px] font-medium text-gray-500 mb-1">Verification</p>
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm">Verified</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Evidence confirmed</p>
                  <ul className="space-y-1.5">
                    {f.evidence.map(item => (
                      <li key={item} className="flex items-center gap-2 text-xs text-gray-700">
                        <span className="text-emerald-700 font-semibold">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-l-2 border-emerald-500 pl-3">
                  <p className="text-xs text-gray-700 leading-relaxed">{f.impact}</p>
                </div>
              </div>
            </DashPaper>
          ))}

          {/* Summary */}
          <div className="border-t border-gray-200 pt-5">
            <p className="text-sm font-semibold text-gray-900 mb-2">Verification complete — Coverage-First is ready to proceed</p>
            <p className="text-xs text-gray-600 mb-4">
              Both farms are now HIGH · VERIFIED. All 4 farms in Coverage-First have sufficient evidence.
              Week 3 coverage confirmed at <strong>1,150 t / 96%</strong>.
            </p>
            <PrimaryBtn onClick={() => onNavigate('plan')}>Activate procurement plan →</PrimaryBtn>
          </div>
        </div>
      </div>
    </div>
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
  const [mapExpanded, setMapExpanded] = useState(false)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="border-b border-gray-200 px-8 py-5 flex items-start justify-between flex-shrink-0">
        <div>
          <SectionLabel>Active Procurement Plan</SectionLabel>
          <h2 className="text-2xl font-bold text-gray-900">Coverage-First · Week 3 Active</h2>
        </div>
        <div className="flex gap-2">
          <SecondaryBtn onClick={() => document.getElementById('active-farm-mix')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>View full plan</SecondaryBtn>
          <Button
            onClick={() => onNavigate('alert')}
            color="error"
            variant="outlined"
            sx={{ bgcolor: '#FEF2F2' }}
          >
            1 monitoring alert
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hide p-8">
        <div className="max-w-4xl">
          {/* Week 3 status card */}
          <DashPaper sx={{ p: 2.5, mb: 3, boxShadow: 'inset 3px 0 0 #0F9F6E' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Week 3 Position</p>
                <p className="font-data text-3xl font-bold text-gray-900">{wk3Supply.toLocaleString()} <span className="text-gray-400 text-xl">/ {wk3Target.toLocaleString()} t</span></p>
              </div>
              <div className="text-right">
                <p className="font-data text-4xl font-bold text-emerald-700">{wk3Pct}%</p>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm">
                  Target Met · 95% threshold
                </span>
              </div>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-sm overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-sm" style={{ width: `${wk3Pct}%` }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-gray-400">0%</span>
              <span className="text-[10px] text-emerald-700 font-semibold">95% threshold · {(0.95 * wk3Target).toLocaleString()} t</span>
              <span className="text-[10px] text-gray-400">100%</span>
            </div>
          </DashPaper>

          {/* Stats row */}
          <div className="grid grid-cols-4 border-y border-gray-200 py-4 mb-6">
            {[
              { label: 'High-confidence supply', value: '83%' },
              { label: 'Farms in plan', value: '8' },
              { label: 'Max district concentration', value: '36%' },
              { label: 'Monitoring status', value: 'Active' },
            ].map(({ label, value }) => (
              <div key={label} className="px-4 first:pl-0 border-r border-gray-100 last:border-r-0">
                <p className="text-[10px] text-gray-500 mb-1">{label}</p>
                <p className="font-data text-lg font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Farm table */}
          <div id="active-farm-mix" className="mb-6">
            <SectionLabel>Active farm mix · Week 3</SectionLabel>
            <DashPaper sx={{ overflow: 'hidden', p: 0 }}>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-500">Farm</th>
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-500">District</th>
                    <th className="text-right py-2.5 px-4 font-semibold text-gray-500">Supply</th>
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-500">Confidence</th>
                    <th className="text-left py-2.5 px-4 font-semibold text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {planFarms.map(f => (
                    <tr key={f.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{f.name}</td>
                      <td className="py-3 px-4 text-gray-600">{f.district}</td>
                      <td className="py-3 px-4 font-data font-semibold text-gray-900 text-right">{f.supply} t</td>
                      <td className="py-3 px-4">
                        <ConfBadge level={f.conf} />
                        <p className="text-[10px] text-gray-500 mt-1">{f.conf === 'HIGH' ? 'Evidence current' : 'Evidence incomplete'}</p>
                      </td>
                      <td className={`py-3 px-4 font-medium ${f.status === 'At risk' ? 'text-amber-700' : f.status.includes('Verified') ? 'text-emerald-700' : 'text-gray-600'}`}>
                        {f.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DashPaper>
          </div>

          {/* Map */}
          <DashPaper sx={{ p: 2, width: 'fit-content', maxWidth: '100%' }}>
            <div className="flex items-start justify-between">
              <SectionLabel>Geographic distribution · Week 3</SectionLabel>
              <ExpandMapButton onClick={() => setMapExpanded(true)} />
            </div>
            <div className="flex gap-6">
              <div className="w-80 h-48 flex-none">
                <RegionMap
                  variant="plan"
                  farmRoles={{
                    mach: 'selected', reddy: 'selected', bhim: 'selected', tanuku: 'selected',
                    godavari: 'selected', narsapur: 'committed', palakol: 'selected', avanigadda: 'selected',
                    kv: 'other', eluru: 'other', guntur: 'other', kovvur: 'other', raj: 'other',
                  }}
                />
              </div>
              <div className="flex-shrink-0">
                <MapLegend items={[
                  { role: 'selected', label: 'In plan' },
                  { role: 'committed', label: 'At risk' },
                  { role: 'other', label: 'Not in plan' },
                ]} />
              </div>
            </div>
          </DashPaper>
        </div>
      </div>
      {mapExpanded && (
        <ExpandedMap
          title="Active plan geographic distribution"
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
          onClose={() => setMapExpanded(false)}
        />
      )}
    </div>
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
      <div className="flex flex-col h-full overflow-hidden">
        <div className="border-b border-emerald-200 bg-emerald-50 px-8 py-5 flex-shrink-0">
          <p className="text-xs font-semibold text-emerald-700 mb-1">Recovery accepted · Monitoring resumed</p>
          <h2 className="text-2xl font-bold text-gray-900">Rajahmundry Block added to recovery plan</h2>
          <p className="text-xs text-emerald-800 mt-1">Week 3 coverage restored to 95%. The monitoring exception is resolved.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl space-y-5">
            <div className="border-l-4 border-emerald-500 pl-5 py-2">
              <div className="flex items-start justify-between gap-8">
                <div>
                  <p className="text-sm font-bold text-emerald-800 mb-2">Recovery complete</p>
                  <p className="text-xs text-gray-700 mb-1">Rajahmundry Block added to recovery plan.</p>
                  <p className="text-xs text-gray-700 mb-1">Week 3 coverage restored to 95%.</p>
                  <p className="text-xs text-gray-700">Field verification for Rajahmundry Block has been assigned to Ravi.</p>
                </div>
                <div className="text-right">
                  <p className="font-data text-3xl font-bold text-emerald-700">1,140 t</p>
                  <p className="text-xs text-gray-500">95% · threshold restored</p>
                </div>
              </div>
              <div className="mt-5">
                <PrimaryBtn onClick={() => onNavigate('plan')}>Return to active plan →</PrimaryBtn>
              </div>
            </div>
            <DashPaper sx={{ p: 2, width: 'fit-content', maxWidth: '100%' }}>
              <div className="flex items-start justify-between">
                <SectionLabel>Recovered plan · Geographic context</SectionLabel>
                <ExpandMapButton onClick={() => {
                  setMapFocusId(null)
                  setMapExpanded(true)
                }} />
              </div>
              <div className="flex gap-6">
                <div className="w-80 h-52 flex-none">
                  <RegionMap variant="recovery" farmRoles={recoveryRoles} />
                </div>
                <MapLegend items={recoveryLegend} />
              </div>
            </DashPaper>
          </div>
        </div>
        {mapExpanded && (
          <ExpandedMap
            title="Recovered plan geographic context"
            variant="recovery"
            farmRoles={recoveryRoles}
            activeId={mapFocusId}
            legend={recoveryLegend}
            onClose={() => setMapExpanded(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <div className="border-b border-red-200 bg-red-50 px-8 py-5 flex items-start justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <p className="text-xs font-semibold text-red-700">Supply alert · Plan recovery</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Godavari Combined Block — supply revised</h2>
          <p className="text-xs text-red-700 mt-1 font-medium">New satellite data has changed the supply estimate. Week 3 is now below the 95% threshold.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hide p-8">
        <div className="max-w-3xl space-y-5">
          {/* What changed */}
          <div className="border-b border-gray-200 pb-5">
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-800">What changed</p>
            </div>
            <div>
              <div className="flex items-start gap-6 mb-4">
                <div className="flex-1">
                  <p className="text-[10px] text-gray-500 mb-1">Before</p>
                  <p className="font-data text-2xl font-bold text-gray-900">200 t</p>
                  <p className="text-xs text-gray-500">Godavari Combined Block</p>
                </div>
                <div className="flex items-center self-center text-2xl text-red-500">→</div>
                <div className="flex-1 border-l-2 border-red-500 pl-4">
                  <p className="text-[10px] text-red-700 mb-1">Now</p>
                  <p className="font-data text-2xl font-bold text-red-800">80 t</p>
                  <p className="text-xs text-red-700 font-medium">−120 t revised by satellite</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">New satellite data indicates lower-than-expected standing stock. The revised estimate reflects current NDVI readings and cloud-corrected analysis from the past 72 hours.</p>
              <Button size="small" color="primary" onClick={() => setEvidenceOpen(true)} sx={{ mt: 1.5, px: 0, minWidth: 0 }}>
                View satellite evidence →
              </Button>
            </div>
          </div>

          {/* Why it matters */}
          <div className="border-l-4 border-red-500 pl-5 py-1">
            <div className="mb-4">
              <p className="text-sm font-semibold text-red-800">Why it matters</p>
            </div>
            <div>
              <div className="grid grid-cols-3 mb-4">
                {[
                  { label: 'Week 3 Supply', before: '1,150 t', after: '1,030 t', delta: '−120 t', bad: true },
                  { label: 'Week 3 Coverage', before: '96%', after: '86%', delta: '−10%', bad: true },
                  { label: 'vs. 95% threshold', before: '+10 t buffer', after: '−110 t gap', delta: '', bad: true },
                ].map(({ label, before, after, delta, bad }) => (
                  <div key={label} className="px-4 first:pl-0 border-r border-red-100 last:border-r-0">
                    <p className="text-[10px] text-gray-500 mb-2">{label}</p>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-data text-xs text-gray-400 line-through">{before}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-data text-sm font-bold text-red-800">{after}</span>
                    </div>
                    {delta && <p className="font-data text-[10px] font-bold text-red-700">{delta}</p>}
                  </div>
                ))}
              </div>
              <div className="border-t border-red-100 pt-3">
                <p className="text-xs text-red-800 font-semibold">Week 3 is now 110 t below the 95% coverage target of 1,140 t.</p>
              </div>
            </div>
          </div>

          {/* Recovery recommendation */}
          <DashPaper sx={{ overflow: 'hidden', p: 0 }}>
            <div className="px-5 pt-4">
              <p className="text-xs font-semibold text-gray-600">Recommended recovery</p>
            </div>
            <div className="px-5 pb-5 pt-3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-0.5">Rajahmundry Block</p>
                  <p className="text-xs text-gray-500 mb-2">East Godavari district</p>
                  <div className="flex items-center gap-2">
                    <ConfBadge level="MEDIUM" />
                    <span className="text-[10px] text-gray-500">Evidence incomplete · Field verification required</span>
                  </div>
                  <Button size="small" color="primary" onClick={() => setInspectedFarm('Rajahmundry Block')} sx={{ mt: 1.5, px: 0, minWidth: 0 }}>
                    Inspect farm details
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-data text-3xl font-bold text-emerald-700">+110 t</p>
                  <p className="text-xs text-gray-500">Expected contribution</p>
                </div>
              </div>

              {/* Before / after recovery */}
              <div className="grid grid-cols-2 border-y border-gray-100 py-3 mb-4">
                <div className="pr-4 border-r border-gray-100">
                  <p className="text-[10px] text-gray-500 mb-2">Current</p>
                  <p className="font-data text-xl font-bold text-red-700">1,030 t · 86%</p>
                  <div className="h-1.5 bg-gray-100 rounded-sm mt-2">
                    <div className="h-full bg-red-400 rounded-sm" style={{ width: '86%' }} />
                  </div>
                </div>
                <div className="pl-4">
                  <p className="text-[10px] text-emerald-700 mb-2">After recovery</p>
                  <p className="font-data text-xl font-bold text-emerald-700">1,140 t · 95%</p>
                  <div className="h-1.5 bg-gray-100 rounded-sm mt-2">
                    <div className="h-full bg-emerald-500 rounded-sm" style={{ width: '95%' }} />
                  </div>
                  <p className="text-[9px] font-bold text-emerald-700 mt-1">Target Met</p>
                </div>
              </div>

              {/* Tradeoffs */}
              <p className="text-xs font-semibold text-gray-700 mb-3">Business tradeoffs</p>
              <div className="space-y-2 mb-4">
                {[
                  { icon: '↑', cls: 'text-emerald-700 bg-emerald-50', label: 'Supply impact', detail: '+110 t · Restores Week 3 to 95% coverage target' },
                  { icon: '!', cls: 'text-amber-700 bg-amber-50', label: 'Verification impact', detail: '+1 field verification required before committing' },
                  { icon: '⚑', cls: 'text-amber-700 bg-amber-50', label: 'Geographic impact', detail: 'East Godavari concentration: 8% → 17%' },
                ].map(({ icon, cls, label, detail }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className={`w-5 flex items-center justify-center flex-shrink-0 text-xs font-bold ${cls.split(' ')[0]}`}>{icon}</div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-600">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interpretation */}
              <div className="border-l-2 border-gray-300 pl-3 mb-5">
                <p className="text-xs text-gray-700 leading-relaxed">
                  "Rajahmundry Block restores Week 3 to the 95% coverage target, but requires one field verification and increases East Godavari concentration from 8% to 17%."
                </p>
              </div>

              {/* Actions */}
              {!recovering ? (
                <div className="flex gap-3">
                  <PrimaryBtn onClick={() => setRecovering(true)} className="flex-1 text-center">
                    Add to recovery plan
                  </PrimaryBtn>
                  <SecondaryBtn onClick={() => onNavigate('compare')} className="flex-1 text-center">Compare alternatives</SecondaryBtn>
                  <SecondaryBtn onClick={() => onNavigate('scenarios')} className="flex-1 text-center">
                    Reopen scenario planning
                  </SecondaryBtn>
                </div>
              ) : (
                <DashPaper sx={{ p: 2, bgcolor: '#ECFDF5' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-emerald-800">Rajahmundry Block added to recovery plan</p>
                  </div>
                  <p className="text-xs text-emerald-700 mb-3">Week 3 coverage restored to 95%. Field verification for Rajahmundry Block has been assigned to Ravi.</p>
                  <PrimaryBtn onClick={() => onNavigate('plan')}>Return to active plan →</PrimaryBtn>
                </DashPaper>
              )}
            </div>
          </DashPaper>

          {/* Map context */}
          <DashPaper sx={{ p: 2, width: 'fit-content', maxWidth: '100%' }}>
            <div className="flex items-start justify-between">
              <SectionLabel>Recovery · Geographic context</SectionLabel>
              <ExpandMapButton onClick={() => {
                setMapFocusId(null)
                setMapExpanded(true)
              }} />
            </div>
            <div className="flex gap-6">
              <div className="w-80 h-52 flex-none">
                <RegionMap
                  variant="recovery"
                  farmRoles={recoveryRoles}
                />
              </div>
              <div className="flex-shrink-0">
                <MapLegend items={recoveryLegend} />
              </div>
            </div>
          </DashPaper>
        </div>
      </div>
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
      {mapExpanded && (
        <ExpandedMap
          title="Recovery geographic context"
          variant="recovery"
          farmRoles={recoveryRoles}
          activeId={mapFocusId}
          legend={recoveryLegend}
          onClose={() => setMapExpanded(false)}
        />
      )}
    </div>
  )
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

type NavItem = {
  screen: Screen
  num: number
  label: string
  sub: string
}

const NAV_ITEMS: NavItem[] = [
  { screen: 'coverage',     num: 1, label: 'Coverage',     sub: 'Procurement position' },
  { screen: 'farms',        num: 2, label: 'Farms',         sub: 'GIS investigation'   },
  { screen: 'compare',      num: 3, label: 'Compare',       sub: 'Candidate analysis'  },
  { screen: 'scenarios',    num: 4, label: 'Scenarios',     sub: 'Constraint planning' },
  { screen: 'verification', num: 5, label: 'Verification',  sub: 'Field dispatch'      },
  { screen: 'field',        num: 6, label: 'Field',         sub: 'Officer findings'    },
  { screen: 'findings',     num: 7, label: 'Findings',      sub: 'Review evidence'     },
  { screen: 'plan',         num: 8, label: 'Plan',          sub: 'Active procurement'  },
  { screen: 'alert',        num: 9, label: 'Monitoring alert', sub: 'Exception recovery' },
]

// Screens considered "visited" in the flow
const FLOW_ORDER: Screen[] = ['coverage', 'farms', 'compare', 'scenarios', 'verification', 'field', 'findings', 'plan', 'alert']

function Sidebar({ current, onNavigate }: { current: Screen; onNavigate: (s: Screen) => void }) {
  const currentIdx = FLOW_ORDER.indexOf(current)

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 176,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 176,
          boxSizing: 'border-box',
          bgcolor: SIDEBAR_BG,
          color: '#fff',
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ px: 2, pt: 2.5, pb: 2, borderBottom: '1px solid rgba(11,175,175,0.22)' }}>
        <Typography variant="overline" sx={{ color: ACCENT, display: 'block', mb: 0.5 }}>ITC Procurement</Typography>
        <Typography variant="subtitle2" sx={{ color: '#fff', lineHeight: 1.3 }}>Decision Support</Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.55)', display: 'block', mt: 0.5 }}>Eucalyptus · 4,000 t</Typography>
      </Box>

      <List className="scroll-hide" sx={{ flex: 1, overflowY: 'auto', py: 1.5, px: 0 }}>
        {NAV_ITEMS.map(({ screen, num, label, sub }) => {
          const itemIdx = FLOW_ORDER.indexOf(screen)
          const isActive = current === screen
          const isComplete = itemIdx < currentIdx
          const isAccessible = itemIdx <= currentIdx + 1

          return (
            <ListItemButton
              key={screen}
              selected={isActive}
              disabled={!isAccessible}
              onClick={() => isAccessible && onNavigate(screen)}
              sx={{
                alignItems: 'flex-start',
                py: 1.25,
                px: 2,
                position: 'relative',
                opacity: isAccessible ? 1 : 0.4,
                '&.Mui-selected': { bgcolor: 'rgba(11,175,175,0.16)' },
                '&.Mui-selected::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 8,
                  bottom: 8,
                  width: 3,
                  borderRadius: '0 2px 2px 0',
                  bgcolor: ACCENT,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 28, mt: 0.25 }}>
                <Avatar
                  sx={{
                    width: 20,
                    height: 20,
                    fontSize: 10,
                    fontWeight: 700,
                    bgcolor: isActive ? ACCENT : isComplete ? '#0F9F6E' : 'transparent',
                    color: isActive || isComplete ? '#fff' : 'rgba(255,255,255,0.45)',
                    border: isActive || isComplete ? 'none' : '1px solid rgba(255,255,255,0.28)',
                  }}
                >
                  {screen === 'alert' ? <WarningAmberIcon sx={{ fontSize: 12 }} /> : isComplete ? <CheckIcon sx={{ fontSize: 12 }} /> : num}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={label}
                secondary={sub}
                slotProps={{
                  primary: { variant: 'body2', sx: { fontWeight: 650, color: isActive ? '#fff' : 'rgba(255,255,255,0.75)', lineHeight: 1.2 } },
                  secondary: { variant: 'caption', sx: { color: isActive ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.35)', mt: 0.25 } },
                }}
              />
              {screen === 'alert' && (
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'error.main', mt: 1, ml: 0.5, flexShrink: 0 }} />
              )}
            </ListItemButton>
          )
        })}
      </List>

      <Box sx={{ px: 2, py: 2, borderTop: '1px solid rgba(11,175,175,0.22)' }}>
        <Typography variant="body2" sx={{ fontWeight: 650, color: 'rgba(255,255,255,0.8)' }}>Shrikant · Procurement Mgr</Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mt: 0.5 }}>AP Region · ITC Agri</Typography>
      </Box>
    </Drawer>
  )
}

// ─── TOP BAR ─────────────────────────────────────────────────────────────────

const BREADCRUMB_TITLE: Record<Screen, string> = {
  coverage:     'Procurement Coverage',
  farms:        'GIS Farm Investigation',
  compare:      'Farm Comparison',
  scenarios:    'Scenario Planning',
  verification: 'Field Verification',
  field:        'Field Officer',
  findings:     'Field Findings',
  plan:         'Active Plan',
  alert:        'Plan Alert',
}

function TopBar({ screen }: { screen: Screen }) {
  const ctxParts = screen === 'coverage' || screen === 'farms' || screen === 'compare'
    ? ['Week 3 gap: 620 t', 'Target: 4,000 t']
    : ['Target: 4,000 t']
  if (screen === 'compare' || screen === 'scenarios' || screen === 'verification' || screen === 'field' || screen === 'findings' || screen === 'plan' || screen === 'alert') {
    ctxParts.push('4 farms in comparison')
  }
  if (screen === 'scenarios' || screen === 'verification' || screen === 'field' || screen === 'findings' || screen === 'plan') {
    ctxParts.push('Strategy: Coverage-First')
  }

  return (
    <AppBar position="static" color="inherit">
      <Toolbar variant="dense" sx={{ minHeight: 44, px: 3, gap: 2 }}>
        <Typography variant="subtitle2" sx={{ mr: 1 }}>{BREADCRUMB_TITLE[screen]}</Typography>
        {ctxParts.map((p, i) => (
          <Stack key={p} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            {i > 0 && <Divider orientation="vertical" flexItem sx={{ borderColor: 'divider' }} />}
            <Typography variant="caption">{p}</Typography>
          </Stack>
        ))}
      </Toolbar>
    </AppBar>
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
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      <Sidebar current={screen} onNavigate={setScreen} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar screen={screen} />
        <Box sx={{ flex: 1, overflow: 'hidden', bgcolor: 'background.default' }}>
          {screens[screen]}
        </Box>
      </Box>
    </Box>
  )
}
