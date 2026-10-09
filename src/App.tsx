import { useEffect, useState } from 'react'
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
  DashKpiStrip,
  PercentBar,
  EvidenceProvenance,
  EvidenceCueBar,
  FieldSyncStrip,
} from './ui'
import type { EvidenceSyncState } from './ui'
import type { StatusKind, StrategyKey } from './designSystem'
import { CARD_HOVER_BG, CARD_SELECTION_BG, INK, INK_MUTED, PAPER, PANEL_BORDER, panelSurface, shellChrome, shape, STRATEGY_VISUAL } from './designSystem'

// ─── Types ──────────────────────────────────────────────────────────────────
type Screen = 'coverage' | 'farms' | 'compare' | 'scenarios' | 'verification' | 'field' | 'findings' | 'plan' | 'alert'
type Conf = 'HIGH' | 'MEDIUM' | 'LOW'
type FarmRole = 'selected' | 'committed' | 'needs-verification' | 'recommended' | 'other' | 'alert'
type MapVariant = 'coverage' | 'investigation' | 'scenario' | 'plan' | 'recovery' | 'default'
type NavigateOpts = { compareRecovery?: boolean }
type NavigateFn = (s: Screen, opts?: NavigateOpts) => void

const RECOVERY_GAP_T = 110
const RECOVERY_BASE_SUPPLY = 1030
const RECOVERY_WEEK_TARGET = 1200

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

type CanopyKind = 'healthy' | 'moderate' | 'weak' | 'inconclusive'
type EvidenceAgeKind = 'current' | 'aging' | 'missing'

type FarmMapMeta = {
  name: string
  district: string
  supply: number
  harvest: string
  confidence: Conf
  evidence: string
  ndvi: number | null
  canopy: CanopyKind
  evidenceAge: EvidenceAgeKind
  evidenceAgeLabel: string
  /** Deterministic parcel shape seed (0-1) */
  parcelSeed: number
}

const FARM_MAP_META: Record<string, FarmMapMeta> = {
  mach: { name: 'Machilipatnam Edge', district: 'Krishna', supply: 90, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Satellite and field evidence aligned', ndvi: 0.74, canopy: 'healthy', evidenceAge: 'current', evidenceAgeLabel: '6d', parcelSeed: 0.12 },
  reddy: { name: 'Reddy Plot', district: 'Krishna', supply: 70, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Recent evidence aligned', ndvi: 0.71, canopy: 'healthy', evidenceAge: 'current', evidenceAgeLabel: '4d', parcelSeed: 0.28 },
  bhim: { name: 'Bhimavaram Lot', district: 'West Godavari', supply: 250, harvest: 'Week 3', confidence: 'LOW', evidence: 'Current field evidence missing', ndvi: null, canopy: 'inconclusive', evidenceAge: 'missing', evidenceAgeLabel: 'None', parcelSeed: 0.61 },
  tanuku: { name: 'Tanuku Plot', district: 'West Godavari', supply: 160, harvest: 'Week 3', confidence: 'MEDIUM', evidence: 'Field confirmation is 6 weeks old', ndvi: 0.63, canopy: 'moderate', evidenceAge: 'aging', evidenceAgeLabel: '42d', parcelSeed: 0.44 },
  kv: { name: 'Krishna Valley', district: 'Krishna', supply: 55, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Evidence current', ndvi: 0.72, canopy: 'healthy', evidenceAge: 'current', evidenceAgeLabel: '9d', parcelSeed: 0.19 },
  eluru: { name: 'Eluru Farm', district: 'West Godavari', supply: 65, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Evidence current', ndvi: 0.70, canopy: 'healthy', evidenceAge: 'current', evidenceAgeLabel: '11d', parcelSeed: 0.33 },
  guntur: { name: 'Guntur Strip', district: 'Guntur', supply: 80, harvest: 'Wk 3-4', confidence: 'MEDIUM', evidence: 'Harvest window outside ideal range', ndvi: 0.66, canopy: 'moderate', evidenceAge: 'aging', evidenceAgeLabel: '28d', parcelSeed: 0.52 },
  kovvur: { name: 'Kovvur Fields', district: 'West Godavari', supply: 75, harvest: 'Week 3', confidence: 'MEDIUM', evidence: 'Recent field evidence needed', ndvi: 0.64, canopy: 'moderate', evidenceAge: 'aging', evidenceAgeLabel: '35d', parcelSeed: 0.71 },
  raj: { name: 'Rajahmundry Block', district: 'East Godavari', supply: 110, harvest: 'Week 3', confidence: 'MEDIUM', evidence: 'Field verification required', ndvi: 0.67, canopy: 'moderate', evidenceAge: 'aging', evidenceAgeLabel: '21d', parcelSeed: 0.38 },
  godavari: { name: 'Godavari Combined Block', district: 'East Godavari', supply: 200, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Monitored by satellite', ndvi: 0.41, canopy: 'weak', evidenceAge: 'current', evidenceAgeLabel: '2d', parcelSeed: 0.57 },
  narsapur: { name: 'Narsapur Farms', district: 'West Godavari', supply: 180, harvest: 'Week 3', confidence: 'MEDIUM', evidence: 'Logistics risk flagged', ndvi: 0.68, canopy: 'moderate', evidenceAge: 'aging', evidenceAgeLabel: '18d', parcelSeed: 0.81 },
  palakol: { name: 'Palakol Holdings', district: 'West Godavari', supply: 120, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Evidence current', ndvi: 0.73, canopy: 'healthy', evidenceAge: 'current', evidenceAgeLabel: '7d', parcelSeed: 0.25 },
  avanigadda: { name: 'Avanigadda Block', district: 'Krishna', supply: 80, harvest: 'Week 3', confidence: 'HIGH', evidence: 'Evidence current', ndvi: 0.75, canopy: 'healthy', evidenceAge: 'current', evidenceAgeLabel: '5d', parcelSeed: 0.47 },
}

const CANOPY_FILL: Record<CanopyKind, string> = {
  healthy: alpha(semantic.canopyHigh, 0.38),
  moderate: alpha(semantic.canopyMed, 0.42),
  weak: alpha(semantic.canopyLow, 0.38),
  inconclusive: alpha(semantic.inactive, 0.28),
}

const CANOPY_STROKE: Record<CanopyKind, string> = {
  healthy: semantic.canopyHigh,
  moderate: semantic.canopyMed,
  weak: semantic.canopyLow,
  inconclusive: semantic.inactive,
}

/** Irregular parcel polygon around a farm center; size scales with supply. */
function parcelPolygon(x: number, y: number, supply: number, seed: number): string {
  const s = 7 + Math.min(supply / 35, 14)
  const skew = (seed - 0.5) * 0.55
  const pts: [number, number][] = [
    [x - s * (0.95 + skew * 0.2), y - s * (0.55 - skew * 0.15)],
    [x + s * (0.65 - skew * 0.25), y - s * (0.9 + skew * 0.1)],
    [x + s * (1.15 + skew * 0.15), y + s * (0.25 + skew * 0.2)],
    [x + s * (0.35 - skew * 0.1), y + s * (1.05 - skew * 0.15)],
    [x - s * (0.8 + skew * 0.2), y + s * (0.6 + skew * 0.1)],
  ]
  return `M ${pts.map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join(' L ')} Z`
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

  function roleStroke(role: FarmRole, highlighted: boolean): { stroke: string; width: number; dash?: string } {
    if (highlighted) return { stroke: m3.onSurface, width: 2.1 }
    if (role === 'selected') return { stroke: m3.primary, width: 1.6, dash: '2.5 1.2' }
    if (role === 'committed') return { stroke: m3.primary, width: 1.5 }
    if (role === 'needs-verification') return { stroke: m3.warning, width: 1.6, dash: '2.5 1.5' }
    if (role === 'recommended') return { stroke: m3.primaryInk, width: 1.35 }
    if (role === 'alert') return { stroke: m3.error, width: 1.85 }
    return { stroke: semantic.mapOther, width: 1 }
  }

  function evidenceAgeColor(age: EvidenceAgeKind): string {
    if (age === 'current') return semantic.evidenceFresh
    if (age === 'aging') return semantic.evidenceAging
    return semantic.evidenceMissing
  }

  /** Parcel + canopy fill + harvest/evidence cues (not a pin). */
  function farmParcel(id: string, x: number, y: number, role: FarmRole, highlighted: boolean) {
    const meta = FARM_MAP_META[id]
    if (!meta) return null
    const path = parcelPolygon(x, y, meta.supply, meta.parcelSeed)
    const rim = roleStroke(role, highlighted)
    const outsideHarvest = meta.harvest.includes('4') || meta.harvest.toLowerCase().includes('wk 3-4')
    const ageColor = evidenceAgeColor(meta.evidenceAge)
    const hitR = 8 + Math.min(meta.supply / 35, 14)

    return (
      <g>
        {/* Soft selection halo */}
        {highlighted && (
          <path d={path} fill={alpha(m3.primary, 0.12)} stroke={m3.primary} strokeWidth="3.5" opacity="0.55" />
        )}
        {/* Canopy / satellite NDVI proxy fill */}
        <path
          d={path}
          fill={CANOPY_FILL[meta.canopy]}
          stroke={CANOPY_STROKE[meta.canopy]}
          strokeWidth="0.6"
          strokeOpacity="0.55"
        />
        {/* Parcel boundary — procurement role */}
        <path
          d={path}
          fill="none"
          stroke={rim.stroke}
          strokeWidth={rim.width}
          strokeDasharray={rim.dash}
          strokeLinejoin="round"
        />
        {/* Inconclusive canopy hatch (cloud / missing satellite) */}
        {meta.canopy === 'inconclusive' && (
          <g pointerEvents="none" opacity="0.55">
            <path d={path} fill="none" stroke={m3.outline} strokeWidth="0.7" strokeDasharray="1.2 1.4" />
            <line x1={x - 5} y1={y - 4} x2={x + 4} y2={y + 5} stroke={m3.outline} strokeWidth="0.85" />
            <line x1={x - 2} y1={y - 6} x2={x + 6} y2={y + 2} stroke={m3.outline} strokeWidth="0.85" />
          </g>
        )}
        {/* Harvest window cue */}
        <g pointerEvents="none">
          <rect
            x={x - 9}
            y={y - hitR * 0.55 - 8}
            width="18"
            height="7"
            rx="1.5"
            fill={outsideHarvest ? m3.warningContainer : m3.surfaceContainerLowest}
            stroke={outsideHarvest ? m3.warning : m3.outlineVariant}
            strokeWidth="0.6"
            opacity="0.95"
          />
          <text
            x={x}
            y={y - hitR * 0.55 - 2.8}
            textAnchor="middle"
            fontSize="5"
            fontWeight="700"
            fill={outsideHarvest ? m3.onWarningContainer : m3.onSurfaceVariant}
          >
            {outsideHarvest ? 'W3-4' : 'W3'}
          </text>
        </g>
        {/* Evidence age cue */}
        <g pointerEvents="none">
          <circle
            cx={x + hitR * 0.55}
            cy={y + hitR * 0.35}
            r="4.2"
            fill={m3.surfaceContainerLowest}
            stroke={ageColor}
            strokeWidth={meta.evidenceAge === 'missing' ? 1.4 : 1.1}
            strokeDasharray={meta.evidenceAge === 'missing' ? '1.5 1.2' : undefined}
          />
          <text
            x={x + hitR * 0.55}
            y={y + hitR * 0.35 + 1.6}
            textAnchor="middle"
            fontSize="4.5"
            fontWeight="700"
            fill={ageColor}
          >
            {meta.evidenceAge === 'missing' ? '—' : meta.evidenceAgeLabel.replace('d', '')}
          </text>
        </g>
        {/* Alert glyph on weak / alert parcels */}
        {(role === 'alert' || meta.canopy === 'weak') && (
          <text
            x={x}
            y={y + 2.5}
            textAnchor="middle"
            fontSize="7"
            fontWeight="800"
            fill={m3.error}
            stroke={m3.surfaceContainerLowest}
            strokeWidth="2"
            paintOrder="stroke"
            pointerEvents="none"
          >
            !
          </text>
        )}
        {/* Invisible hit target sized to parcel */}
        <circle cx={x} cy={y} r={hitR} fill="transparent" />
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
      {/* Parcels: canopy fill, role boundary, harvest + evidence cues */}
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
            {farmParcel(id, x, y, displayRole, isHighlighted)}
            {addedIds.includes(id) && (
              <g pointerEvents="none">
                <circle cx={x} cy={y} r="14" fill="none" stroke={m3.primary} strokeWidth="1.5" strokeDasharray="3 2" />
                <text x={x - 21} y={y - 14} fontSize="6.5" fontWeight="700" fill={m3.primary} stroke={m3.surfaceContainerLowest} strokeWidth="2" paintOrder="stroke">ADDED</text>
              </g>
            )}
            {removedIds.includes(id) && (
              <g pointerEvents="none">
                <path d={`M ${x - 8} ${y - 8} L ${x + 8} ${y + 8} M ${x + 8} ${y - 8} L ${x - 8} ${y + 8}`} stroke={m3.outline} strokeWidth="1.75" />
                <text x={x + 10} y={y - 9} fontSize="6.5" fontWeight="700" fill={m3.onSurfaceVariant} stroke={m3.surfaceContainerLowest} strokeWidth="2" paintOrder="stroke">REMOVED</text>
              </g>
            )}
          </g>
        )
      })}
      {variant === 'recovery' && (
        <g pointerEvents="none">
          <text x="185" y="45" fontSize="7" fontWeight="700" fill={m3.onSurface} stroke={m3.surfaceContainerLowest} strokeWidth="2" paintOrder="stroke">Rajahmundry recovery</text>
          <text x="280" y="79" fontSize="7" fontWeight="700" fill={m3.error} stroke={m3.surfaceContainerLowest} strokeWidth="2" paintOrder="stroke">Godavari canopy decline</text>
        </g>
      )}
      {tooltipMeta && tooltipPoint && !compact && (
        <g transform={`translate(${variant === 'investigation' ? Math.min(Math.max(tooltipPoint.x + 8, 130), 188) : Math.min(tooltipPoint.x + 12, 208)} ${Math.max(tooltipPoint.y - 72, variant === 'investigation' ? 22 : 8)})`}>
          <rect width="124" height="70" rx={shape.md} fill={m3.surfaceContainerLowest} stroke={PANEL_BORDER} />
          <text x="7" y="12" fontSize="7.5" fontWeight="700" fill={m3.onSurface}>{tooltipMeta.name}</text>
          <text x="7" y="22" fontSize="6.5" fill={m3.onSurfaceVariant}>{tooltipMeta.district} · {tooltipMeta.supply} t</text>
          <text x="7" y="34" fontSize="6.5" fontWeight="600" fill={m3.onSurface}>
            NDVI {tooltipMeta.ndvi == null ? 'n/a' : tooltipMeta.ndvi.toFixed(2)} · {tooltipMeta.canopy}
          </text>
          <text x="7" y="44" fontSize="6.5" fill={m3.onSurfaceVariant}>
            Harvest {tooltipMeta.harvest} · Evidence {tooltipMeta.evidenceAgeLabel}
          </text>
          <text x="7" y="54" fontSize="6.5" fontWeight="700" fill={m3.onSurfaceVariant}>{tooltipMeta.confidence} confidence</text>
          {onViewEvidence ? (
            <text
              x="117"
              y="64"
              textAnchor="end"
              fontSize="6.5"
              fontWeight="600"
              fill={m3.primaryInk}
              style={{ cursor: 'pointer' }}
              onClick={() => tooltipId && onViewEvidence(tooltipId)}
            >
              View evidence
            </text>
          ) : (
            <text x="7" y="64" fontSize="5.5" fill={m3.onSurfaceVariant}>{tooltipMeta.evidence}</text>
          )}
        </g>
      )}
    </svg>
  )
}

type LegendItem = { role: FarmRole; label: string }

const PARCEL_SWATCH: Record<FarmRole, React.CSSProperties> = {
  selected: { background: alpha(m3.primary, 0.18), border: `2px dashed ${m3.primary}` },
  committed: { background: alpha(m3.primary, 0.22), border: `2px solid ${m3.primary}` },
  'needs-verification': { background: alpha(m3.warning, 0.2), border: `2px dashed ${m3.warning}` },
  recommended: { background: alpha(m3.primaryInk, 0.12), border: `2px solid ${m3.primaryInk}` },
  other: { background: semantic.mapOtherFill, border: `1px solid ${semantic.mapOther}` },
  alert: { background: alpha(m3.error, 0.2), border: `2px solid ${m3.error}` },
}

const GEO_LAYER_LEGEND: { key: string; label: string; swatch: React.CSSProperties }[] = [
  { key: 'healthy', label: 'Canopy healthy', swatch: { background: CANOPY_FILL.healthy, border: `1px solid ${CANOPY_STROKE.healthy}` } },
  { key: 'moderate', label: 'Canopy moderate', swatch: { background: CANOPY_FILL.moderate, border: `1px solid ${CANOPY_STROKE.moderate}` } },
  { key: 'weak', label: 'Canopy weak', swatch: { background: CANOPY_FILL.weak, border: `1px solid ${CANOPY_STROKE.weak}` } },
  { key: 'inconclusive', label: 'Satellite inconclusive', swatch: { background: CANOPY_FILL.inconclusive, border: `1px dashed ${CANOPY_STROKE.inconclusive}` } },
  { key: 'evidence', label: 'Evidence age (days)', swatch: { background: m3.surfaceContainerLowest, border: `2px solid ${semantic.evidenceAging}`, borderRadius: '50%' } },
  { key: 'harvest', label: 'Harvest window (W3)', swatch: { background: m3.surfaceContainerLowest, border: `1px solid ${m3.outlineVariant}` } },
]

function MapLegend({ items }: { items: LegendItem[] }) {
  return (
    <Stack spacing={space.related}>
      <Box>
        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, color: m3.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Geospatial layers
        </Typography>
        <Stack spacing={space.tight}>
          {GEO_LAYER_LEGEND.map(({ key, label, swatch }) => (
            <Stack key={key} direction="row" spacing={space.tight} sx={{ alignItems: 'center' }}>
              <Box style={swatch} sx={{ width: 12, height: 12, flexShrink: 0, borderRadius: '2px' }} />
              <Typography variant="caption">{label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
      <Box>
        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, color: m3.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Parcel status
        </Typography>
        <Stack spacing={space.tight}>
          {items.map(({ role, label }) => (
            <Stack key={label} direction="row" spacing={space.tight} sx={{ alignItems: 'center' }}>
              <Box style={PARCEL_SWATCH[role]} sx={{ width: 12, height: 12, flexShrink: 0, borderRadius: '2px' }} />
              <Typography variant="caption">{label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Stack>
  )
}

const DEFAULT_LEGEND: LegendItem[] = [
  { role: 'selected',           label: 'Selected parcel' },
  { role: 'committed',          label: 'Committed parcel' },
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

/** Fixed right-rail width - identical on every desktop tab */
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
          <Typography variant="caption">Parcels, canopy, harvest windows, and evidence age</Typography>
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
            <Typography variant="body2">AP region · Parcels, canopy, harvest, evidence age</Typography>
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
  'Bhimavaram Lot': { verification: 'Required', risk: 'Standing stock unverified; potential 20-30% yield variance' },
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
                  ? <><Box component="strong" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, display: 'inline' }}>NDVI:</Box> · Current reading inconclusive due to cloud cover</>
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
            Week 3 still has a 620 t uncovered gap. Investigate candidates next.
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
        <DashKpiStrip
          items={[
            { label: 'Week 3 gap', value: '620 t', sub: '1,200 needed · 580 committed', danger: true },
            { label: 'Firm supply', value: '2,568 t', sub: '64% of 4,000 t target' },
            { label: 'At risk', value: '570 t', sub: 'Narsapur + Avanigadda' },
            { label: 'Open gap', value: '862 t', sub: '78% committed overall' },
          ]}
        />

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
    harvest: 'Wk 3-4', confidence: 'MEDIUM', signals: ['OUTSIDE_HARVEST'],
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
  // Selected cards always keep the accent wash. Hover wash only applies to unselected cards
  // (do not treat map focus as hover - that made Machilipatnam look unselected).
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: space.section }}>
          <DashKpiStrip
            items={[
              { label: 'Week 3 gap', value: '620 t', sub: 'Still uncovered', danger: true },
              { label: 'Selected', value: String(comparison.length), sub: 'Farms in comparison' },
              { label: 'Recommended supply', value: '570 t', sub: '4 candidate farms' },
              { label: 'Need verification', value: '2', sub: 'Bhimavaram + Tanuku' },
            ]}
          />

          <Box>
            <SectionLabel>Recommended for this gap</SectionLabel>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: space.related }}>
              {RECOMMENDED_FARMS.map(f => (
                <FarmCard
                  key={f.id}
                  farm={f}
                  inComparison={comparison.includes(f.id)}
                  onToggle={toggle}
                  onViewEvidence={setEvidenceFarm}
                  hoverId={hoverId}
                  onHover={setHoverId}
                />
              ))}
            </Box>
          </Box>

          <Box>
            <SectionLabel>Other eligible farms</SectionLabel>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: space.related }}>
              {OTHER_FARMS.map(f => (
                <FarmCard
                  key={f.id}
                  farm={f}
                  inComparison={comparison.includes(f.id)}
                  onToggle={toggle}
                  onViewEvidence={setEvidenceFarm}
                  hoverId={hoverId}
                  onHover={setHoverId}
                />
              ))}
            </Box>
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
    history: '87t (Season 1)', satellite: 'Healthy: NDVI 0.74',
    field: 'Confirmed 6 weeks ago', missing: 'None: evidence gap closed.',
    risks: 'None identified', harvest: 'Week 3',
    whyConf: 'Stable historical yield, healthy satellite readings, and current field evidence align.',
    evidenceRecencyPct: 92, evidenceRecencyLabel: '6d · current',
    harvestTimingPct: 100, harvestTimingLabel: 'In Week 3',
    evidenceKind: 'evidence-current' as StatusKind,
  },
  {
    id: 'reddy', name: 'Reddy Plot', district: 'Krishna',
    headline: 'Best all-round contribution',
    summary: 'Reliable yield, verified evidence, Week 3 harvest window aligns cleanly.',
    gapPct: 11, gapNote: 'no additional verification',
    supply: 70, confidence: 'HIGH' as Conf, verifReq: false,
    history: '66t (Season 2)', satellite: 'Healthy: NDVI 0.71',
    field: 'Confirmed 4 weeks ago', missing: 'None: evidence gap closed.',
    risks: 'None identified', harvest: 'Week 3',
    whyConf: 'Stable historical yield, healthy satellite readings, and current field evidence align.',
    evidenceRecencyPct: 88, evidenceRecencyLabel: '4d · current',
    harvestTimingPct: 100, harvestTimingLabel: 'In Week 3',
    evidenceKind: 'evidence-current' as StatusKind,
  },
  {
    id: 'bhim', name: 'Bhimavaram Lot', district: 'West Godavari',
    headline: 'Highest expected supply',
    summary: 'Largest single block available. Requires field verification before committing.',
    gapPct: 40, gapNote: 'requires one field verification',
    supply: 250, confidence: 'LOW' as Conf, verifReq: true,
    history: '231t (Season 1)', satellite: 'Inconclusive: cloud cover',
    field: 'None available', missing: 'No current field evidence. Standing stock unconfirmed. Yield estimate based on prior season data only.',
    risks: 'Standing stock unverified; potential 20-30% yield variance', harvest: 'Week 3',
    whyConf: 'Estimate based on prior season only. No current satellite or field evidence available.',
    evidenceRecencyPct: 8, evidenceRecencyLabel: 'None · missing',
    harvestTimingPct: 95, harvestTimingLabel: 'In Week 3',
    evidenceKind: 'evidence-missing' as StatusKind,
  },
  {
    id: 'tanuku', name: 'Tanuku Plot', district: 'West Godavari',
    headline: 'Strong supply, evidence gap',
    summary: 'Good historical performance. Missing recent field evidence is the only barrier.',
    gapPct: 26, gapNote: 'requires one field verification',
    supply: 160, confidence: 'MEDIUM' as Conf, verifReq: true,
    history: '148t (Season 2)', satellite: 'Moderate: NDVI 0.63',
    field: 'Last confirmed 6 weeks ago', missing: 'Missing current field evidence. Last field visit was 6 weeks ago. Crop status may have changed.',
    risks: 'Crop condition change possible since last visit', harvest: 'Week 3',
    whyConf: 'Supply and timing are adequate but evidence is incomplete or variable.',
    evidenceRecencyPct: 28, evidenceRecencyLabel: '42d · aging',
    harvestTimingPct: 90, harvestTimingLabel: 'In Week 3',
    evidenceKind: 'evidence-aging' as StatusKind,
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

/** Recovery-mode candidates vs the 110 t Week 3 threshold gap (base 1,030 t / 86%). */
const RECOVERY_COMPARE_FARMS = [
  {
    id: 'raj', name: 'Rajahmundry Block', district: 'East Godavari',
    headline: 'Closes the 110 t recovery gap in full',
    supply: 110, gapPct: 100,
    resultingSupply: 1140, resultingCoverage: 95,
    confidence: 'MEDIUM' as Conf, verifReq: true,
    evidenceKind: 'evidence-aging' as StatusKind,
    evidenceRecencyPct: 35, evidenceRecencyLabel: '21d · aging',
    harvestTimingPct: 100, harvestTimingLabel: 'In Week 3',
    harvest: 'Week 3',
    districtConc: 'East Godavari 8% → 17%',
    whyConf: 'Satellite is current; field evidence is incomplete and needs verification before commit.',
    history: '98% of prior-season delivery',
    satellite: 'Moderate: NDVI 0.67',
    field: 'Last confirmed 3 weeks ago',
    missing: 'Current field confirmation required before committing recovery tons.',
    risks: 'Adds verification work and raises East Godavari concentration to 17%.',
    recommended: true,
  },
  {
    id: 'kovvur', name: 'Kovvur Fields', district: 'West Godavari',
    headline: 'Partial recovery · still 35 t short',
    supply: 75, gapPct: 68,
    resultingSupply: 1105, resultingCoverage: 92,
    confidence: 'MEDIUM' as Conf, verifReq: true,
    evidenceKind: 'evidence-aging' as StatusKind,
    evidenceRecencyPct: 28, evidenceRecencyLabel: '35d · aging',
    harvestTimingPct: 95, harvestTimingLabel: 'In Week 3',
    harvest: 'Week 3',
    districtConc: 'West Godavari 36% → 42%',
    whyConf: 'Useful partial fill, but aging field evidence keeps confidence at MEDIUM.',
    history: '71t (Season 2)',
    satellite: 'Moderate: NDVI 0.64',
    field: 'Last confirmed 5 weeks ago',
    missing: 'Recent field evidence needed; does not fully close the 110 t gap alone.',
    risks: 'Leaves Week 3 at 92% (still below 95%). Increases West Godavari share.',
    recommended: false,
  },
  {
    id: 'guntur', name: 'Guntur Strip', district: 'Guntur',
    headline: 'Partial recovery · diversifies districts',
    supply: 80, gapPct: 73,
    resultingSupply: 1110, resultingCoverage: 93,
    confidence: 'MEDIUM' as Conf, verifReq: false,
    evidenceKind: 'evidence-aging' as StatusKind,
    evidenceRecencyPct: 40, evidenceRecencyLabel: '28d · aging',
    harvestTimingPct: 70, harvestTimingLabel: 'Wk 3-4 edge',
    harvest: 'Wk 3-4',
    districtConc: 'Guntur 0% → 7%',
    whyConf: 'No new field visit required, but harvest window edges into Week 4.',
    history: '76t (Season 1)',
    satellite: 'Moderate: NDVI 0.66',
    field: 'Confirmed 4 weeks ago',
    missing: 'Harvest timing confirmation for Week 3 logistics.',
    risks: 'Closes only 73% of the recovery gap (93% coverage). Timing risk if Week 4 slips.',
    recommended: false,
  },
  {
    id: 'eluru', name: 'Eluru Farm', district: 'West Godavari',
    headline: 'High confidence · insufficient alone',
    supply: 65, gapPct: 59,
    resultingSupply: 1095, resultingCoverage: 91,
    confidence: 'HIGH' as Conf, verifReq: false,
    evidenceKind: 'evidence-current' as StatusKind,
    evidenceRecencyPct: 88, evidenceRecencyLabel: '11d · current',
    harvestTimingPct: 100, harvestTimingLabel: 'In Week 3',
    harvest: 'Week 3',
    districtConc: 'West Godavari 36% → 41%',
    whyConf: 'Evidence is current and aligned, but 65 t cannot restore the 95% threshold alone.',
    history: '62t (Season 2)',
    satellite: 'Healthy: NDVI 0.70',
    field: 'Confirmed recently',
    missing: 'None for this block; still needs a second candidate to close 110 t.',
    risks: 'Leaves a 45 t shortfall vs threshold. Raises West Godavari concentration.',
    recommended: false,
  },
]

const RECOVERY_TABLE_ROWS = [
  { key: 'supply', label: 'Supply contribution' },
  { key: 'gapPct', label: 'Share of 110 t recovery gap' },
  { key: 'resultingCoverage', label: 'Resulting Week 3 coverage' },
  { key: 'resultingSupply', label: 'Resulting Week 3 supply' },
  { key: 'verifReq', label: 'Field visit required' },
  { key: 'confidence', label: 'Confidence / evidence' },
  { key: 'districtConc', label: 'District concentration' },
  { key: 'harvest', label: 'Harvest window' },
  { key: 'risks', label: 'Recovery tradeoffs' },
]

function CompareScreen({
  onNavigate,
  recovery = false,
}: {
  onNavigate: NavigateFn
  recovery?: boolean
}) {
  const farms = recovery ? RECOVERY_COMPARE_FARMS : COMPARE_FARMS
  const tableRows = recovery ? RECOVERY_TABLE_ROWS : TABLE_ROWS
  const closesGapCount = recovery ? RECOVERY_COMPARE_FARMS.filter(f => f.gapPct >= 100).length : 0
  const verifCount = farms.filter(f => f.verifReq).length

  return (
    <MainPane
      header={
        <Box>
          <SectionLabel>{recovery ? 'Recovery Comparison' : 'Candidate Comparison'}</SectionLabel>
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>
            {recovery ? `${farms.length} recovery candidates · 110 t gap` : '4 farms · Week 3'}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>
            {recovery
              ? 'Compare substitutes against the Week 3 threshold gap after Godavari was revised to 80 t (base 1,030 t · 86%).'
              : 'Scenario planning can add or substitute farms from the full eligible pool.'}
          </Typography>
        </Box>
      }
      footer={
        recovery ? (
          <>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', flex: 1 }}>
              Rajahmundry Block is the only single farm that restores 95% coverage. Return to the alert to accept recovery.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ flexShrink: 0 }}>
              <SecondaryBtn onClick={() => onNavigate('alert')}>Back to alert</SecondaryBtn>
              <PrimaryBtn onClick={() => onNavigate('alert')}>Use Rajahmundry →</PrimaryBtn>
            </Stack>
          </>
        ) : (
          <>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', flex: 1 }}>
              Scenario planning can consider these candidates and other eligible farms. The manually compared farms do not limit scenario generation.
            </Typography>
            <PrimaryBtn onClick={() => onNavigate('scenarios')} sx={{ flexShrink: 0 }}>Plan a scenario →</PrimaryBtn>
          </>
        )
      }
      map={
        <MapPane
          variant={recovery ? 'recovery' : 'investigation'}
          farmRoles={
            recovery
              ? {
                  mach: 'selected', reddy: 'selected', bhim: 'selected', tanuku: 'selected',
                  godavari: 'alert', narsapur: 'committed', palakol: 'selected', avanigadda: 'selected',
                  raj: 'recommended', kovvur: 'recommended', guntur: 'recommended', eluru: 'recommended',
                  kv: 'other',
                }
              : {
                  mach: 'selected',
                  reddy: 'selected',
                  bhim: 'needs-verification',
                  tanuku: 'needs-verification',
                }
          }
          legend={
            recovery
              ? [
                  { role: 'selected', label: 'In active plan' },
                  { role: 'alert', label: 'Revised (Godavari)' },
                  { role: 'recommended', label: 'Recovery candidate' },
                  { role: 'committed', label: 'At risk' },
                  { role: 'other', label: 'Not in view' },
                ]
              : undefined
          }
          footer={
            <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>
              {recovery
                ? 'Recovery geography · candidates vs 110 t gap'
                : '4 farms in comparison · map mirrors candidate set'}
            </Typography>
          }
        />
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: space.section }}>
        <DashKpiStrip
          items={
            recovery
              ? [
                  { label: 'Recovery gap', value: `${RECOVERY_GAP_T} t`, sub: 'To restore 95%', danger: true },
                  { label: 'Full-close options', value: String(closesGapCount), sub: 'Single-farm close' },
                  { label: 'Best coverage', value: '95%', sub: 'With Rajahmundry' },
                  { label: 'Verif. required', value: String(verifCount), sub: 'Of candidates shown' },
                ]
              : [
                  { label: 'Combined supply', value: '570 t', sub: '4 farms in set' },
                  { label: 'Gap coverage', value: '92%', sub: 'Of 620 t Week 3 gap' },
                  { label: 'High confidence', value: '2', sub: 'Evidence current' },
                  { label: 'Verif. required', value: '2', sub: 'Before commit' },
                ]
          }
        />

        {recovery && (
          <DashPaper sx={{ p: space.related, bgcolor: m3.errorContainer, color: m3.onErrorContainer }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={space.related} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: m3.onErrorContainer, fontWeight: 700 }}>
                  Baseline after Godavari revision
                </Typography>
                <Typography variant="caption" sx={{ color: m3.onErrorContainer }}>
                  {RECOVERY_BASE_SUPPLY.toLocaleString()} t · 86% coverage · {RECOVERY_GAP_T} t below the 1,140 t (95%) threshold
                </Typography>
              </Box>
              <StatusChip kind="primary-issue" />
            </Stack>
          </DashPaper>
        )}

        <Box>
          <SectionLabel>{recovery ? 'Recovery interpretation' : 'Interpretation'}</SectionLabel>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: space.related }}>
            {farms.map(f => {
              const recoveryFarm = recovery ? (f as typeof RECOVERY_COMPARE_FARMS[number]) : null
              return (
                <DashPaper
                  key={f.id}
                  sx={{
                    p: space.related,
                    ...(recoveryFarm?.recommended
                      ? { border: `2px solid ${m3.primary}`, bgcolor: m3.surfaceContainerLowest }
                      : {}),
                  }}
                >
                  <Stack spacing={space.related}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        {recoveryFarm?.recommended && (
                          <Typography variant="caption" sx={{ color: m3.primaryInk, fontWeight: 700, display: 'block', mb: 0.5 }}>
                            Recommended
                          </Typography>
                        )}
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'text.primary' }}>{f.name}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 650, color: 'text.secondary', mt: 1 }}>{f.headline}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.125rem', fontWeight: 700 }}>{f.supply} t</Typography>
                        {recoveryFarm && (
                          <Typography variant="caption" sx={{ display: 'block', color: recoveryFarm.resultingCoverage >= 95 ? m3.primaryInk : m3.error, fontWeight: 700 }}>
                            → {recoveryFarm.resultingCoverage}%
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                    <PercentBar
                      label={recovery ? 'Of 110 t recovery gap' : 'Gap closed'}
                      display={`${f.gapPct}%`}
                      value={f.gapPct}
                      tone={recovery ? (f.gapPct >= 100 ? 'primary' : 'caution') : f.verifReq ? 'muted' : 'primary'}
                    />
                    {recoveryFarm && (
                      <Stack direction="row" spacing={space.related} sx={{ alignItems: 'flex-start' }}>
                        <EvidenceCueBar
                          label="Resulting coverage"
                          valueLabel={`${recoveryFarm.resultingCoverage}% · ${recoveryFarm.resultingSupply.toLocaleString()} t`}
                          pct={recoveryFarm.resultingCoverage}
                          tone={recoveryFarm.resultingCoverage >= 95 ? 'primary' : 'caution'}
                        />
                        <EvidenceCueBar
                          label="District concentration"
                          valueLabel={recoveryFarm.districtConc.split(' → ').pop() ?? recoveryFarm.districtConc}
                          pct={recoveryFarm.id === 'raj' ? 34 : recoveryFarm.id === 'guntur' ? 14 : 82}
                          tone={recoveryFarm.id === 'guntur' ? 'primary' : 'caution'}
                        />
                      </Stack>
                    )}
                    {!recovery && (
                      <Stack direction="row" spacing={space.related} sx={{ alignItems: 'flex-start' }}>
                        <EvidenceCueBar
                          label="Evidence recency"
                          valueLabel={f.evidenceRecencyLabel}
                          pct={f.evidenceRecencyPct}
                          tone={f.evidenceRecencyPct >= 70 ? 'primary' : f.evidenceRecencyPct >= 30 ? 'caution' : 'danger'}
                        />
                        <EvidenceCueBar
                          label="Harvest timing"
                          valueLabel={f.harvestTimingLabel}
                          pct={f.harvestTimingPct}
                          tone={f.harvestTimingPct >= 90 ? 'primary' : 'caution'}
                        />
                      </Stack>
                    )}
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                      <ConfBadge level={f.confidence} />
                      <StatusChip kind={f.evidenceKind} />
                      {f.verifReq && <StatusChip kind="visit-required" />}
                    </Stack>
                    {recoveryFarm && (
                      <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>
                        {recoveryFarm.districtConc} · {recoveryFarm.verifReq ? 'Verification required' : 'No new field visit'}
                      </Typography>
                    )}
                  </Stack>
                </DashPaper>
              )
            })}
          </Box>
        </Box>

        <Box>
          <SectionLabel>{recovery ? 'Detailed recovery comparison' : 'Detailed Comparison'}</SectionLabel>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 176, position: 'sticky', left: 0, bgcolor: m3.surfaceContainerLow, zIndex: 1 }}>Attribute</TableCell>
                  {farms.map(f => (
                    <TableCell key={f.id} sx={{ minWidth: 180 }}>
                      <Typography variant="subtitle2" sx={{ color: m3.onSurface }}>{f.name}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: space.xs }}>{f.district}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map(({ key, label }) => (
                  <TableRow key={key} hover>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 500, position: 'sticky', left: 0, bgcolor: m3.surfaceContainerLowest, verticalAlign: 'top' }}>{label}</TableCell>
                    {farms.map(f => {
                      const val = f[key as keyof typeof f]
                      if (key === 'confidence') return (
                        <TableCell key={f.id} sx={{ verticalAlign: 'top' }}>
                          <ConfBadge level={val as Conf} />
                          <Typography variant="caption" sx={{ display: 'block', mt: space.xs }}>
                            {val === 'HIGH' ? 'Evidence current' : val === 'MEDIUM' ? 'Evidence incomplete' : 'Evidence missing'}
                          </Typography>
                          {'evidenceKind' in f && (
                            <Box sx={{ mt: space.tight }}>
                              <StatusChip kind={(f as { evidenceKind: StatusKind }).evidenceKind} />
                            </Box>
                          )}
                        </TableCell>
                      )
                      if (key === 'verifReq') return (
                        <TableCell key={f.id} sx={{ verticalAlign: 'top', fontWeight: 650, color: val ? m3.secondary : 'text.primary' }}>
                          {val ? 'Yes' : 'No'}
                        </TableCell>
                      )
                      if (key === 'supply' || key === 'resultingSupply') return (
                        <TableCell key={f.id} sx={{ fontVariantNumeric: 'tabular-nums', verticalAlign: 'top', fontWeight: 650 }}>{val} t</TableCell>
                      )
                      if (key === 'gapPct') return (
                        <TableCell key={f.id} sx={{ fontVariantNumeric: 'tabular-nums', verticalAlign: 'top', fontWeight: 650 }}>
                          {val}% of {RECOVERY_GAP_T} t
                        </TableCell>
                      )
                      if (key === 'resultingCoverage') return (
                        <TableCell
                          key={f.id}
                          sx={{
                            fontVariantNumeric: 'tabular-nums',
                            verticalAlign: 'top',
                            fontWeight: 700,
                            color: Number(val) >= 95 ? m3.primaryInk : m3.error,
                          }}
                        >
                          {val}%
                        </TableCell>
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
      </Box>
    </MainPane>
  )
}

// ─── SCENARIOS SCREEN ────────────────────────────────────────────────────────

type Strategy = {
  key: StrategyKey
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
                {selectedStrategy?.name} selected. All constraints satisfied.
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: space.section }}>
          <DashKpiStrip
            items={[
              { label: 'Min. coverage', value: `${minCoverage}%`, sub: 'Week 3 threshold' },
              { label: 'Max. visits', value: String(maxVisits), sub: isModified ? 'Modified' : 'Default limit' },
              { label: 'Min. high conf.', value: `${minHighConf}%`, sub: 'Supply quality floor' },
              { label: 'Max. district', value: `${maxDistConc}%`, sub: 'Concentration cap' },
            ]}
          />

          {/* Constraints - threshold rails, not consumer sliders */}
          <Box>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: space.tight }}>
              <SectionLabel>Business constraints</SectionLabel>
              {isModified && (
                <GhostBtn onClick={() => setMaxVisits(10)} sx={{ height: 32, minHeight: 32 }}>Reset to defaults</GhostBtn>
              )}
            </Stack>
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
            <DashPaper sx={{ p: space.section, bgcolor: m3.surfaceContainerLow, color: m3.onSurface }}>
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
                        <Typography sx={{ fontSize: 10, color: m3.onSurfaceVariant }}>Requires a field verification visit; exceeds new limit of {maxVisits}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ pl: 4 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 650, color: m3.primaryInk, mb: 2 }}>Added</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box component="span" sx={{ color: m3.primaryInk, fontWeight: 700, mt: 1 }}>+</Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 650, color: m3.onSurface }}>Guntur Strip · <Box component="span" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>80 t</Box></Typography>
                        <Typography sx={{ fontSize: 10, color: m3.onSurfaceVariant }}>No field visit required; stays within {maxVisits}-visit limit</Typography>
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
                  Week 3 supply drops to <Box component="strong" sx={{ fontWeight: 700, display: 'inline' }}>1,070 t (89%)</Box>. The 95% minimum requires <Box component="strong" sx={{ fontWeight: 700, display: 'inline' }}>1,140 t</Box> (70 t short).
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: m3.onErrorContainer, mt: 1 }}>
                  The farm substitution replaces <Box component="strong" sx={{ fontWeight: 700, display: 'inline' }}>160 t</Box> with only <Box component="strong" sx={{ fontWeight: 700, display: 'inline' }}>80 t</Box> (a net supply loss of <Box component="strong" sx={{ fontWeight: 700, display: 'inline' }}>80 t</Box>).
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

                const visual = STRATEGY_VISUAL[s.key]

                return (
                  <DashPaper
                    key={s.key}
                    onClick={() => setSelected(s.key === selected ? null : s.key)}
                    sx={{
                      p: 0,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      position: 'relative',
                      // Selected = teal actionable wash; fail outline = red constraint risk
                      bgcolor: isSelected ? CARD_SELECTION_BG : m3.surfaceContainerLowest,
                      border: failCount > 0 && !isSelected
                        ? `2px solid ${m3.error}`
                        : isSelected
                          ? `1px solid ${m3.primary}`
                          : `1px solid ${PANEL_BORDER}`,
                      transition: 'background-color 0.15s, border-color 0.15s',
                      '&:hover': {
                        bgcolor: isSelected ? m3.surfaceContainerLowest : CARD_HOVER_BG,
                      },
                    }}
                  >
                    {/* Strategy identity stripe */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        bgcolor: visual.accent,
                      }}
                      aria-hidden
                    />
                    {/* Header */}
                    <Box sx={{ p: space.related, pl: space.section }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: space.tight, gap: space.related }}>
                        <Stack direction="row" spacing={space.related} sx={{ alignItems: 'flex-start', minWidth: 0, flex: 1 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              mt: 0.5,
                              borderRadius: '50%',
                              border: isSelected ? `6px solid ${m3.primary}` : `2px solid ${m3.outline}`,
                              bgcolor: m3.surfaceContainerLowest,
                              flexShrink: 0,
                            }}
                          />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Stack direction="row" spacing={space.tight} sx={{ alignItems: 'center', flexWrap: 'wrap', mb: space.xs }}>
                              <Typography variant="subtitle1" sx={{ color: m3.onSurface, fontWeight: 700 }}>
                                {s.name}
                              </Typography>
                              <Chip
                                size="small"
                                label={visual.tagline}
                                sx={{
                                  height: 22,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: visual.ink,
                                  bgcolor: visual.accentSoft,
                                  border: `1px solid ${visual.accent}`,
                                  '& .MuiChip-label': { px: 2, py: 0, lineHeight: '20px' },
                                }}
                              />
                            </Stack>
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

                    {/* Tradeoff bars - strategy emphasis first */}
                    <Box sx={{ px: space.related, pl: space.section, pb: space.related }}>
                      <TradeoffBars
                        coverage={wk3}
                        visits={verif}
                        highConf={hiconf}
                        district={dist}
                        emphasis={visual.emphasis}
                      />
                    </Box>

                    {/* Metrics - same surface, equal 16dp padding; fail = red text/chip only */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 0,
                        borderTop: `1px solid ${PANEL_BORDER}`,
                        borderBottom: `1px solid ${PANEL_BORDER}`,
                        pl: '4px',
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

                    {/* Farm mix - same surface */}
                    <Box sx={{ px: space.related, pl: space.section, py: space.related }}>
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
                              // Keep farm-mix chips off card accent wash (selected strategy uses primaryContainer)
                              bgcolor: m3.surfaceContainerLowest,
                              color: f.includes('✶') ? m3.primaryInk : m3.onSurface,
                              border: f.includes('✶') ? `1px solid ${m3.primaryInk}` : `1px solid ${m3.outlineVariant}`,
                              fontFamily: '"Manrope", system-ui, sans-serif',
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: space.section }}>
        <DashKpiStrip
          items={[
            { label: 'Farms to verify', value: '2', sub: 'Assigned to Ravi' },
            { label: 'Supply at stake', value: '410 t', sub: '250 t + 160 t' },
            { label: 'Evidence missing', value: '1', sub: 'Bhimavaram Lot' },
            { label: 'Evidence aging', value: '1', sub: 'Tanuku Plot' },
          ]}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: space.related }}>
          {farms.map(f => (
            <DashPaper key={f.id} sx={{ p: space.related, bgcolor: m3.warningContainer, color: m3.onWarningContainer, height: '100%' }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: space.related }}>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: m3.onWarningContainer }}>{f.name}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: m3.onWarningContainer, opacity: 0.85 }}>{f.district}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.25rem', fontWeight: 700, color: m3.onWarningContainer }}>{f.supply} t</Typography>
                  <StatusChip kind={f.evidenceKind === 'missing' ? 'evidence-missing' : 'evidence-aging'} />
                </Box>
              </Stack>
              <Typography sx={{ fontSize: '0.75rem', color: m3.onWarningContainer, mb: space.related }}>{f.reason}</Typography>
              <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: m3.onWarningContainer, mb: 2 }}>Needs</Typography>
              <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 0, p: 0, listStyle: 'none', mb: space.related }}>
                {f.needs.map(n => (
                  <Stack component="li" direction="row" sx={{ alignItems: 'center', gap: 2, fontSize: '0.75rem', fontWeight: 650, color: m3.onWarningContainer }} key={n}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: m3.onWarningContainer, flexShrink: 0 }} />
                    {n}
                  </Stack>
                ))}
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: m3.onWarningContainer }}>
                Confidence before: <Box component="strong" sx={{ fontWeight: 700 }}>{f.confidence}</Box>
              </Typography>
            </DashPaper>
          ))}
        </Box>
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

const FIELD_FARMS: (FieldFarm & { gps: string; captureTime: string })[] = [
  {
    name: 'Bhimavaram Lot',
    location: 'West Godavari, Andhra Pradesh',
    supply: 250,
    harvest: 'Week 3',
    whyVisit: 'No current field evidence. Standing stock unconfirmed. Yield estimate based on prior season data only.',
    verifyItems: ['Standing stock confirmed', 'Harvest readiness confirmed', 'Current field photos captured'],
    gps: '16.5442° N, 81.5218° E',
    captureTime: 'Today · 09:42 IST',
  },
  {
    name: 'Tanuku Plot',
    location: 'West Godavari, Andhra Pradesh',
    supply: 160,
    harvest: 'Week 3',
    whyVisit: 'Field evidence is outdated. Last visit was 6 weeks ago. Crop status may have changed.',
    verifyItems: ['Current crop / harvest status confirmed', 'Current field photos captured'],
    gps: '16.7568° N, 81.6754° E',
    captureTime: 'Today · 11:18 IST',
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
  const [linkState, setLinkState] = useState<'online' | 'syncing' | 'offline'>('online')
  const [evidenceSync, setEvidenceSync] = useState<Record<number, EvidenceSyncState>>({
    0: 'synced',
    1: 'synced',
  })

  const farm = FIELD_FARMS[farmIdx]
  const farmChecks = checks[farmIdx] || []
  const allChecked = farmChecks.every(Boolean)
  const photoRequired = farm.verifyItems.some(item => item.toLowerCase().includes('photos'))
  const canConfirm = allChecked && (!photoRequired || photos[farmIdx])
  const mobileTileOrigin = farmIdx === 0 ? { x: 2974, y: 1856 } : { x: 2976, y: 1853 }

  // Second farm often goes offline in the field - queue evidence locally
  useEffect(() => {
    if (farmIdx === 1 && view === 'capture') {
      setLinkState('offline')
      return
    }
    if (linkState !== 'syncing') setLinkState('online')
  }, [farmIdx, view]) // eslint-disable-line react-hooks/exhaustive-deps

  // After photo capture while online, briefly show syncing then confirmed (teal)
  useEffect(() => {
    if (!photos[farmIdx] || linkState === 'offline') return
    if (evidenceSync[farmIdx] !== 'pending') return
    setLinkState('syncing')
    const t = window.setTimeout(() => {
      setEvidenceSync(prev => ({ ...prev, [farmIdx]: 'synced' }))
      setLinkState('online')
    }, 2200)
    return () => window.clearTimeout(t)
  }, [photos, farmIdx, evidenceSync, linkState])

  function toggleCheck(i: number) {
    setChecks(prev => {
      const arr = [...(prev[farmIdx] || [])]
      arr[i] = !arr[i]
      return { ...prev, [farmIdx]: arr }
    })
  }

  function capturePhoto() {
    setPhotos(prev => ({ ...prev, [farmIdx]: true }))
    setEvidenceSync(prev => ({
      ...prev,
      [farmIdx]: linkState === 'offline' ? 'offline' : 'pending',
    }))
  }

  function handleSubmit() {
    setSubmitted(prev => ({ ...prev, [farmIdx]: true }))
    if (linkState === 'offline') {
      setEvidenceSync(prev => ({ ...prev, [farmIdx]: 'offline' }))
    } else if (photos[farmIdx]) {
      setEvidenceSync(prev => ({ ...prev, [farmIdx]: 'pending' }))
      setLinkState('syncing')
    }
    if (farmIdx === 0) {
      setFarmIdx(1)
      setView('brief')
      setLinkState('online')
    } else {
      onNavigate('findings')
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', height: '100%', bgcolor: m3.surfaceContainerHigh, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', py: 6, px: 4 }}>
      <DashPaper sx={{ width: '100%', maxWidth: 410, overflow: 'hidden', boxShadow: 1, p: 0 }}>
        <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
          {/* Dark top bar - inverse roles only (never light-theme text.* on inverse) */}
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
              <Box sx={{ height: '100%', bgcolor: m3.primary, transition: 'all 0.2s' }} style={{ width: `${((farmIdx + 1) / FIELD_FARMS.length) * 100}%` }} />
            </Box>
          </Box>
          <FieldSyncStrip state={linkState} />

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
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: space.related, mt: space.related, mb: space.related }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 650, color: 'text.primary' }}>Field photo captured</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>{farm.name}</Typography>
                    </Box>
                    <Button size="small" color="error" onClick={() => setPhotos(prev => ({ ...prev, [farmIdx]: false }))}>Remove</Button>
                  </Box>
                  <EvidenceProvenance
                    capturedBy="Ravi · Field officer"
                    timestamp={farm.captureTime}
                    gps={farm.gps}
                    sync={evidenceSync[farmIdx] ?? 'pending'}
                    dense
                  />
                </Box>
              ) : (
                <Box sx={{ px: space.related, pb: space.related }}>
                  <Button fullWidth variant="outlined" color="primary" onClick={capturePhoto} sx={{ mb: space.tight }}>
                    Add photo
                  </Button>
                  <Typography sx={{ fontSize: 10, color: 'text.secondary', textAlign: 'center' }}>
                    0 photos added · Required to confirm evidence
                    {linkState === 'offline' ? ' · Will queue offline' : ''}
                  </Typography>
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
                <Typography sx={{ fontSize: '0.75rem', color: m3.inverseOnSurface, opacity: 0.8 }}>{farm.name}</Typography>
              </Box>
              <IconButton onClick={() => setPhotoPreviewOpen(false)} aria-label="Close photo preview" sx={{ color: m3.inverseOnSurface }}><CloseIcon /></IconButton>
            </Box>
            <img
              src={farmIdx === 0 ? bhimavaramFieldPhoto : tanukuFieldPhoto}
              alt={`Full-size field evidence captured at ${farm.name}`}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
            <Box sx={{ mt: 4 }}>
              <EvidenceProvenance
                capturedBy="Ravi · Field officer"
                timestamp={farm.captureTime}
                gps={farm.gps}
                sync={evidenceSync[farmIdx] ?? 'synced'}
              />
            </Box>
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
      capturedBy: 'Ravi · Field officer',
      timestamp: 'Today · 09:42 IST',
      gps: '16.5442° N, 81.5218° E',
    },
    {
      id: 'tanuku', name: 'Tanuku Plot', district: 'West Godavari district',
      supply: 160, before: 'MEDIUM' as Conf, after: 'HIGH' as Conf,
      evidence: ['Current crop / harvest status confirmed', 'Current field photos captured'],
      impact: 'Tanuku Plot can now contribute 160 t to the Coverage-First procurement plan.',
      capturedBy: 'Ravi · Field officer',
      timestamp: 'Today · 11:18 IST',
      gps: '16.7568° N, 81.6754° E',
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
              Verification complete. Coverage-First is ready to proceed
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: space.section }}>
        <DashKpiStrip
          items={[
            { label: 'Findings in', value: '2', sub: 'Farms verified today' },
            { label: 'Supply unlocked', value: '410 t', sub: 'Now HIGH confidence' },
            { label: 'Week 3 coverage', value: '96%', sub: '1,150 t confirmed' },
            { label: 'Plan status', value: 'Ready', sub: 'Activate next' },
          ]}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: space.related }}>
          {findings.map(f => (
            <DashPaper key={f.id} sx={{ overflow: 'hidden', bgcolor: CARD_SELECTION_BG, color: m3.onSurface, p: 0, height: '100%' }}>
              <Box sx={{ borderBottom: `1px solid ${PANEL_BORDER}`, px: space.related, py: space.related, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: m3.onSurface }}>{f.name}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: m3.onSurfaceVariant }}>{f.district}</Typography>
                </Box>
                <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.125rem', fontWeight: 700, color: m3.onSurface }}>{f.supply} t</Typography>
              </Box>
              <Box sx={{ px: space.related, py: space.related }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 20px auto auto',
                    columnGap: space.related,
                    rowGap: 0.75,
                    mb: space.related,
                    alignItems: 'center',
                    width: 'fit-content',
                    maxWidth: '100%',
                    '& .MuiChip-root': { m: 0, height: 24, boxSizing: 'border-box' },
                  }}
                >
                  <Typography sx={{ fontSize: 10, fontWeight: 650, color: m3.onSurfaceVariant, lineHeight: 1 }}>
                    Before
                  </Typography>
                  <Box aria-hidden />
                  <Typography sx={{ fontSize: 10, fontWeight: 650, color: m3.onSurfaceVariant, lineHeight: 1 }}>
                    After
                  </Typography>
                  <Typography sx={{ fontSize: 10, fontWeight: 650, color: m3.onSurfaceVariant, lineHeight: 1 }}>
                    Result
                  </Typography>

                  <Box sx={{ height: 24, display: 'flex', alignItems: 'center' }}>
                    <ConfBadge level={f.before} />
                  </Box>
                  <Box sx={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden>
                    <Typography sx={{ fontSize: 14, color: m3.onSurfaceVariant, lineHeight: 1 }}>→</Typography>
                  </Box>
                  <Box sx={{ height: 24, display: 'flex', alignItems: 'center' }}>
                    <ConfBadge level={f.after} />
                  </Box>
                  <Box sx={{ height: 24, display: 'flex', alignItems: 'center' }}>
                    <StatusChip kind="verified" />
                  </Box>
                </Box>
                <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: space.tight, m: 0, p: 0, listStyle: 'none', mb: space.related }}>
                  {f.evidence.map(item => (
                    <Stack component="li" direction="row" sx={{ alignItems: 'center', gap: space.tight, fontSize: '0.75rem', color: m3.onSurface }} key={item}>
                      <Box component="span" sx={{ color: m3.primaryInk, fontWeight: 650 }}>✓</Box>
                      {item}
                    </Stack>
                  ))}
                </Box>
                <EvidenceProvenance
                  capturedBy={f.capturedBy}
                  timestamp={f.timestamp}
                  gps={f.gps}
                  sync="synced"
                  dense
                />
                <Typography sx={{ fontSize: '0.75rem', color: m3.onSurfaceVariant, mt: space.related }}>{f.impact}</Typography>
              </Box>
            </DashPaper>
          ))}
        </Box>
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
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>Monitoring active · Godavari exception open in plan</Typography>
        </Box>
      }
      footer={
        <>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', flex: 1 }}>
            Monitoring exception is open in the plan body. Review recovery before Week 3 slips further.
          </Typography>
          <SecondaryBtn
            onClick={() => document.getElementById('active-farm-mix')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            sx={{ flexShrink: 0 }}
          >
            View full plan
          </SecondaryBtn>
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
      <DashPaper
        sx={{
          p: space.section,
          mb: space.section,
          bgcolor: m3.errorContainer,
          color: m3.onErrorContainer,
          border: `1px solid ${alpha(m3.error, 0.35)}`,
        }}
      >
        <Stack direction="row" spacing={space.related} sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: space.related, flexWrap: 'wrap', rowGap: space.tight }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1 }}>
              <StatusChip kind="primary-issue" />
              <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: m3.onErrorContainer }}>
                Monitoring exception
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: m3.onErrorContainer, mb: 1 }}>
              Godavari Combined Block: supply revised 200 t → 80 t
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: m3.onErrorContainer, fontWeight: 500 }}>
              New satellite NDVI cut Week 3 by 120 t. Coverage would fall to 86% (110 t below the 95% threshold) unless recovery is accepted.
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
            <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.25rem', fontWeight: 700, color: m3.onErrorContainer }}>−120 t</Typography>
            <Typography sx={{ fontSize: 10, color: m3.onErrorContainer }}>vs. active plan</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          <PrimaryBtn onClick={() => onNavigate('alert')}>Review exception →</PrimaryBtn>
          <Button
            variant="outlined"
            onClick={() => onNavigate('alert')}
            sx={{
              minHeight: 40,
              height: 40,
              py: 0,
              px: 6,
              fontWeight: 650,
              color: m3.onErrorContainer,
              borderColor: m3.error,
              bgcolor: alpha(m3.surfaceContainerLowest, 0.35),
              '&:hover': { borderColor: m3.error, bgcolor: alpha(m3.surfaceContainerLowest, 0.55) },
            }}
          >
            Open recovery path
          </Button>
        </Stack>
      </DashPaper>

      {/* Week 3 status card */}
      <DashPaper sx={{ p: space.section, mb: space.section }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography sx={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'text.secondary', mb: 1 }}>Week 3 Position</Typography>
            <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'text.primary' }}>{wk3Supply.toLocaleString()} <Box component="span" sx={{ color: 'text.secondary', fontSize: '1.25rem' }}>/ {wk3Target.toLocaleString()} t</Box></Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: m3.primaryInk }}>{wk3Pct}%</Typography>
            <StatusChip kind="constraint-pass" />
          </Box>
        </Box>
        <PercentBar value={wk3Pct} tone="primary" markerPct={95} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: space.tight }}>
          <Box component="span" sx={{ fontSize: 10, color: m3.onSurfaceVariant }}>0%</Box>
          <Box component="span" sx={{ fontSize: 10, color: m3.primaryInk, fontWeight: 650 }}>95% threshold · {(0.95 * wk3Target).toLocaleString()} t</Box>
          <Box component="span" sx={{ fontSize: 10, color: m3.onSurfaceVariant }}>100%</Box>
        </Box>
      </DashPaper>

      {/* Stats row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: 1, borderBottom: 1, borderColor: 'divider', py: 4, mb: 6 }}>
        {[
          { label: 'High-confidence supply', value: '83%' },
          { label: 'Farms in plan', value: '8' },
          { label: 'Max district concentration', value: '36%' },
          { label: 'Monitoring status', value: '1 exception' },
        ].map(({ label, value }) => (
          <Box sx={{ px: 4, borderRight: 1, borderColor: 'divider' }} key={label}>
            <Typography sx={{ fontSize: 10, color: 'text.secondary', mb: 1 }}>{label}</Typography>
            <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.125rem', fontWeight: 700, color: label === 'Monitoring status' ? m3.error : 'text.primary' }}>{value}</Typography>
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
                  <TableCell sx={{ fontWeight: 500, color: f.status === 'At risk' ? m3.warning : f.status.includes('Verified') ? m3.primaryInk : m3.onSurfaceVariant }}>
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

function AlertScreen({ onNavigate }: { onNavigate: NavigateFn }) {
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
          <Typography variant="h2" sx={{ color: m3.onErrorContainer }}>Godavari Combined Block: supply revised</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: m3.onErrorContainer, fontWeight: 600 }}>
            Cause: new satellite NDVI · Impact: −120 t · Recovery required
          </Typography>
        </Box>
      }
      footer={
        <>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
            <SecondaryBtn onClick={() => onNavigate('compare', { compareRecovery: true })}>Compare alternatives</SecondaryBtn>
            <SecondaryBtn onClick={() => onNavigate('scenarios')}>Reopen scenario planning</SecondaryBtn>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', display: { xs: 'none', md: 'block' } }}>
              Recovery required to restore Week 3 above the 95% threshold.
            </Typography>
          </Stack>
          <PrimaryBtn onClick={() => setRecovering(true)} sx={{ flexShrink: 0, ml: 'auto' }}>
            Add to recovery plan
          </PrimaryBtn>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: space.section, maxWidth: 800 }}>
          <DashKpiStrip
            items={[
              { label: 'Supply revised', value: '−120 t', sub: '200 t → 80 t', danger: true },
              { label: 'Week 3 coverage', value: '86%', sub: 'Was 96%', danger: true },
              { label: 'Threshold gap', value: '110 t', sub: 'Below 95% target', danger: true },
              { label: 'Recovery path', value: '+110 t', sub: 'Rajahmundry Block' },
            ]}
          />

          {/* 1 · Cause */}
          <DashPaper sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ px: space.section, py: space.related, borderBottom: `1px solid ${PANEL_BORDER}`, bgcolor: m3.surfaceContainerLow }}>
              <Typography variant="overline" sx={{ color: m3.error }}>1 · Cause</Typography>
              <Typography variant="subtitle1" sx={{ color: m3.onSurface }}>What changed</Typography>
            </Box>
            <Box sx={{ p: space.section }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr auto 1fr' },
                  gap: space.related,
                  alignItems: 'center',
                  mb: space.related,
                }}
              >
                <Box sx={{ p: space.related, bgcolor: m3.surfaceContainerLow, borderRadius: `${shape.sm}px` }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>Before</Typography>
                  <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.5rem', fontWeight: 700, color: 'text.primary' }}>200 t</Typography>
                  <Typography variant="caption">Godavari Combined Block</Typography>
                </Box>
                <Typography sx={{ textAlign: 'center', color: m3.onSurfaceVariant, fontWeight: 700 }} aria-hidden>→</Typography>
                <Box sx={{ p: space.related, bgcolor: m3.errorContainer, borderRadius: `${shape.sm}px` }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1, color: m3.onErrorContainer }}>Now</Typography>
                  <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.5rem', fontWeight: 700, color: m3.onErrorContainer }}>80 t</Typography>
                  <Typography variant="caption" sx={{ color: m3.onErrorContainer, fontWeight: 600 }}>−120 t revised by satellite</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: m3.onSurface, mb: space.related }}>
                New satellite data indicates lower-than-expected standing stock. The revised estimate reflects current NDVI readings and cloud-corrected analysis from the past 72 hours.
              </Typography>
              <Button size="small" color="primary" onClick={() => setEvidenceOpen(true)} sx={{ px: 0, minWidth: 0 }}>
                View satellite evidence →
              </Button>
            </Box>
          </DashPaper>

          {/* 2 · Business impact */}
          <DashPaper sx={{ p: 0, overflow: 'hidden', borderLeft: `3px solid ${m3.error}` }}>
            <Box sx={{ px: space.section, py: space.related, borderBottom: `1px solid ${PANEL_BORDER}`, bgcolor: m3.errorContainer }}>
              <Typography variant="overline" sx={{ color: m3.onErrorContainer }}>2 · Business impact</Typography>
              <Typography variant="subtitle1" sx={{ color: m3.onErrorContainer }}>Why it matters</Typography>
            </Box>
            <Box sx={{ p: space.section }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                  gap: space.related,
                  mb: space.related,
                }}
              >
                {[
                  { label: 'Week 3 supply', before: '1,150 t', after: '1,030 t', delta: '−120 t' },
                  { label: 'Week 3 coverage', before: '96%', after: '86%', delta: '−10%' },
                  { label: 'vs. 95% threshold', before: '+10 t buffer', after: '−110 t gap', delta: 'Below target' },
                ].map(({ label, before, after, delta }) => (
                  <Box
                    key={label}
                    sx={{
                      p: space.related,
                      border: `1px solid ${PANEL_BORDER}`,
                      borderRadius: `${shape.sm}px`,
                      bgcolor: m3.surfaceContainerLowest,
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block', mb: space.tight }}>{label}</Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                      <Typography variant="caption" sx={{ textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>{before}</Typography>
                      <Typography variant="caption" aria-hidden>→</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: m3.error, fontVariantNumeric: 'tabular-nums' }}>{after}</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: m3.error, fontVariantNumeric: 'tabular-nums' }}>{delta}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ p: space.related, bgcolor: m3.errorContainer, borderRadius: `${shape.sm}px` }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: m3.onErrorContainer }}>
                  Week 3 is now 110 t below the 95% coverage target of 1,140 t.
                </Typography>
              </Box>
            </Box>
          </DashPaper>

          {/* 3 · Recovery */}
          <DashPaper sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ px: space.section, py: space.related, borderBottom: `1px solid ${PANEL_BORDER}`, bgcolor: m3.primaryContainer }}>
              <Typography variant="overline" sx={{ color: m3.primaryInk }}>3 · Recovery options</Typography>
              <Typography variant="subtitle1" sx={{ color: m3.onSurface }}>Recommended recovery</Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>Compare before accepting</Typography>
            </Box>
            <Box sx={{ p: space.section }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={space.related} sx={{ justifyContent: 'space-between', mb: space.section }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Rajahmundry Block</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: space.tight }}>East Godavari district</Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', mb: space.tight }}>
                    <ConfBadge level="MEDIUM" />
                    <StatusChip kind="visit-required" />
                  </Stack>
                  <Button size="small" color="primary" onClick={() => setInspectedFarm('Rajahmundry Block')} sx={{ px: 0, minWidth: 0 }}>
                    Inspect farm details
                  </Button>
                </Box>
                <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, flexShrink: 0 }}>
                  <Typography variant="caption" sx={{ display: 'block' }}>Expected contribution</Typography>
                  <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.5rem', fontWeight: 700, color: m3.primaryInk }}>+110 t</Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: space.related,
                  mb: space.section,
                }}
              >
                <Box sx={{ p: space.related, border: `1px solid ${PANEL_BORDER}`, borderRadius: `${shape.sm}px` }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: space.tight }}>Current</Typography>
                  <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.25rem', fontWeight: 700, color: m3.error, mb: space.tight }}>1,030 t · 86%</Typography>
                  <PercentBar value={86} tone="danger" />
                </Box>
                <Box sx={{ p: space.related, border: `1px solid ${PANEL_BORDER}`, borderRadius: `${shape.sm}px`, bgcolor: m3.primaryContainer }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: space.tight, color: m3.primaryInk }}>After recovery</Typography>
                  <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '1.25rem', fontWeight: 700, color: m3.primaryInk, mb: space.tight }}>1,140 t · 95%</Typography>
                  <PercentBar value={95} tone="primary" markerPct={95} />
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: m3.primaryInk, mt: 1 }}>Target met</Typography>
                </Box>
              </Box>

              <SectionLabel>Business tradeoffs</SectionLabel>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: space.tight, mb: space.section }}>
                {[
                  { tone: 'positive' as const, label: 'Supply impact', detail: '+110 t · Restores Week 3 to 95% coverage target' },
                  { tone: 'caution' as const, label: 'Verification impact', detail: '+1 field verification required before committing' },
                  { tone: 'caution' as const, label: 'Geographic impact', detail: 'East Godavari concentration: 8% → 17%' },
                ].map(({ tone, label, detail }) => (
                  <Box
                    key={label}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: space.related,
                      p: space.related,
                      borderRadius: `${shape.sm}px`,
                      bgcolor: tone === 'positive' ? m3.primaryContainer : m3.warningContainer,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: tone === 'positive' ? m3.primaryInk : m3.onWarningContainer }}>{label}</Typography>
                      <Typography variant="caption" sx={{ color: tone === 'positive' ? m3.primaryInk : m3.onWarningContainer }}>{detail}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{ p: space.related, bgcolor: m3.surfaceContainerLow, borderRadius: `${shape.sm}px` }}>
                <Typography variant="body2" sx={{ color: m3.onSurface, lineHeight: 1.6 }}>
                  Rajahmundry Block restores Week 3 to the 95% coverage target, but requires one field verification and increases East Godavari concentration from 8% to 17%.
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
          const isDisabled = !isAccessible
          const iconEl = <Icon fontSize="small" />
          const labelColor = isDisabled
            ? m3.outline
            : isActive
              ? m3.onSurface
              : m3.onSurfaceVariant
          const iconColor = isDisabled
            ? m3.outlineVariant
            : isActive
              ? m3.primaryInk
              : m3.onSurfaceVariant

          return (
            <ListItemButton
              key={screen}
              selected={isActive}
              disabled={isDisabled}
              onClick={() => isAccessible && onNavigate(screen)}
              aria-disabled={isDisabled}
              sx={{
                // Explicit state surfaces so disabled never matches enabled/active
                ...(isDisabled && {
                  bgcolor: 'transparent',
                  opacity: 1,
                  cursor: 'not-allowed',
                  '&:hover': { bgcolor: 'transparent' },
                }),
                ...(!isDisabled && !isActive && {
                  '&:hover': { bgcolor: m3.surfaceContainerLowest },
                }),
              }}
            >
              <ListItemIcon sx={{ color: iconColor }}>
                {screen === 'alert' ? (
                  <Badge
                    color="error"
                    variant="dot"
                    overlap="circular"
                    sx={{
                      '& .MuiBadge-badge': {
                        top: 4,
                        right: 4,
                        ...(isDisabled && { opacity: 0.35 }),
                      },
                    }}
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
                      color: labelColor,
                    },
                  },
                }}
              />
            </ListItemButton>
          )
        })}
      </List>

      {/* MD3 drawer footer - account row, not a floating card */}
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
  const [compareRecovery, setCompareRecovery] = useState(false)

  const navigate: NavigateFn = (s, opts) => {
    if (s === 'compare') {
      setCompareRecovery(Boolean(opts?.compareRecovery))
    } else {
      setCompareRecovery(false)
    }
    setScreen(s)
  }

  if (screen === 'field') {
    return <FieldScreen onNavigate={navigate} />
  }

  const screens: Record<Screen, React.ReactNode> = {
    coverage:     <CoverageScreen     onNavigate={navigate} />,
    farms:        <FarmsScreen        onNavigate={navigate} />,
    compare:      <CompareScreen      onNavigate={navigate} recovery={compareRecovery} />,
    scenarios:    <ScenariosScreen    onNavigate={navigate} />,
    verification: <VerificationScreen onNavigate={navigate} />,
    field:        null,
    findings:     <FindingsScreen     onNavigate={navigate} />,
    plan:         <PlanScreen         onNavigate={navigate} />,
    alert:        <AlertScreen        onNavigate={navigate} />,
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
      <Sidebar current={screen} onNavigate={navigate} />
      <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', minHeight: 0 }}>
        {screens[screen]}
      </Box>
    </Box>
  )
}
