import { useState } from 'react'
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  FONT_FAMILY,
  PANEL_BORDER,
  STATUS_META,
  STRATEGY_VISUAL,
  CARD_SELECTION_BG,
  m3,
  meter,
  panelSurface,
  semantic,
  shape,
  space,
  typographyScale,
  type StatusKind,
} from './designSystem'
import {
  DashPaper,
  EvidenceCueBar,
  EvidenceProvenance,
  FieldSyncStrip,
  GhostBtn,
  OPEN_GAP_SWATCH,
  PercentBar,
  PrimaryBtn,
  SecondaryBtn,
  SectionLabel,
  StatusChip,
  SupplyBar,
  ThresholdControl,
  TradeoffBars,
  WeekRail,
} from './ui'

function DocSection({
  id,
  title,
  blurb,
  children,
}: {
  id: string
  title: string
  blurb: string
  children: React.ReactNode
}) {
  return (
    <Box
      id={id}
      component="section"
      sx={{
        ...panelSurface,
        p: space.section,
        display: 'flex',
        flexDirection: 'column',
        gap: space.related,
      }}
    >
      <Box>
        <SectionLabel>{title}</SectionLabel>
        <Typography variant="body2" sx={{ color: m3.onSurfaceVariant, maxWidth: 640 }}>
          {blurb}
        </Typography>
      </Box>
      {children}
    </Box>
  )
}

function Swatch({
  color,
  label,
  value,
  hatch,
}: {
  color?: string
  label: string
  value: string
  hatch?: boolean
}) {
  return (
    <Stack direction="row" spacing={space.tight} sx={{ alignItems: 'center', minWidth: 0 }}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: `${shape.sm}px`,
          flexShrink: 0,
          border: `1px solid ${PANEL_BORDER}`,
          bgcolor: color,
          ...(hatch ? OPEN_GAP_SWATCH : null),
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: m3.onSurface }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ fontVariantNumeric: 'tabular-nums', color: m3.onSurfaceVariant }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  )
}

function ParcelDemo({
  label,
  fill,
  stroke,
  dash,
  badge,
  badgeColor,
}: {
  label: string
  fill: string
  stroke: string
  dash?: string
  badge?: string
  badgeColor?: string
}) {
  return (
    <Stack spacing={space.tight} sx={{ alignItems: 'center' }}>
      <svg width="72" height="72" viewBox="0 0 72 72" style={{ fontFamily: FONT_FAMILY }}>
        <rect width="72" height="72" fill={m3.surfaceContainerHigh} rx="8" />
        <path
          d="M18 22 L48 16 L56 40 L38 54 L14 44 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="2"
          strokeDasharray={dash}
        />
        {badge && (
          <>
            <circle cx="52" cy="52" r="8" fill={m3.surfaceContainerLowest} stroke={badgeColor} strokeWidth="1.5" />
            <circle cx="52" cy="52" r="3.5" fill={badgeColor} />
          </>
        )}
      </svg>
      <Typography variant="caption" sx={{ textAlign: 'center', fontWeight: 650 }}>
        {label}
      </Typography>
    </Stack>
  )
}

const NAV = [
  { id: 'type', label: 'Typography' },
  { id: 'space', label: 'Spacing' },
  { id: 'color', label: 'Semantic color' },
  { id: 'confidence', label: 'Confidence' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'cta', label: 'CTAs' },
  { id: 'forms', label: 'Forms' },
  { id: 'constraints', label: 'Constraints' },
  { id: 'map', label: 'Map / parcels' },
  { id: 'viz', label: 'Data viz' },
] as const

export function DesignSystemDoc() {
  const [threshold, setThreshold] = useState(95)
  const [visits, setVisits] = useState(2)
  const [checked, setChecked] = useState(true)
  const [note, setNote] = useState('Standing stock confirmed at edge rows.')

  const confidenceKinds: StatusKind[] = ['confidence-high', 'confidence-medium', 'confidence-low']
  const evidenceKinds: StatusKind[] = ['evidence-current', 'evidence-aging', 'evidence-missing', 'verified', 'visit-required']
  const constraintKinds: StatusKind[] = ['constraint-pass', 'constraint-fail', 'primary-issue', 'concentration-risk']

  return (
    <Box
      sx={{
        minHeight: '100%',
        bgcolor: m3.surface,
        color: m3.onSurface,
        fontFamily: FONT_FAMILY,
      }}
    >
      <Box
        sx={{
          borderBottom: `1px solid ${PANEL_BORDER}`,
          bgcolor: m3.surfaceContainerLowest,
          px: space.section,
          py: space.related,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={space.related}
          sx={{ justifyContent: 'space-between', alignItems: { md: 'center' }, maxWidth: 1100, mx: 'auto' }}
        >
          <Box>
            <Typography variant="overline" sx={{ display: 'block', mb: space.xs }}>
              Case-study artifact
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.35rem', md: '1.75rem' }, fontWeight: 700 }}>
              ITC Procurement · Design System
            </Typography>
            <Typography variant="body2" sx={{ mt: space.xs, color: m3.onSurfaceVariant }}>
              Tokens and components from the live prototype. Product screens are unchanged.
            </Typography>
          </Box>
          <Stack direction="row" spacing={space.tight} sx={{ flexWrap: 'wrap' }}>
            <Box
              component="a"
              href="./"
              sx={{ textDecoration: 'none' }}
            >
              <SecondaryBtn>Open prototype</SecondaryBtn>
            </Box>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          maxWidth: 1100,
          mx: 'auto',
          px: space.section,
          py: space.section,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '200px 1fr' },
          gap: space.section,
          alignItems: 'start',
        }}
      >
        <Box
          component="nav"
          sx={{
            position: { md: 'sticky' },
            top: 96,
            display: 'flex',
            flexDirection: 'column',
            gap: space.xs,
          }}
        >
          <Typography variant="overline" sx={{ mb: space.tight }}>
            Contents
          </Typography>
          {NAV.map(item => (
            <Typography
              key={item.id}
              component="a"
              href={`#${item.id}`}
              variant="body2"
              sx={{
                color: m3.primaryInk,
                textDecoration: 'none',
                fontWeight: 650,
                py: space.xs,
                '&:hover': { color: m3.primary },
              }}
            >
              {item.label}
            </Typography>
          ))}
        </Box>

        <Stack spacing={space.section}>
          <DocSection
            id="type"
            title="Typography"
            blurb="Manrope is the only typeface. Scale roles below are the ones used across tabs for titles, body, meta, and tabular data."
          >
            <Stack spacing={space.related}>
              {(Object.entries(typographyScale) as [keyof typeof typographyScale, (typeof typographyScale)[keyof typeof typographyScale]][]).map(
                ([name, t]) => (
                  <Box
                    key={name}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '120px 1fr' },
                      gap: space.related,
                      alignItems: 'baseline',
                      borderBottom: `1px solid ${PANEL_BORDER}`,
                      pb: space.related,
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700, color: m3.onSurfaceVariant }}>
                      {name}
                      <Box component="span" sx={{ display: 'block', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                        {t.size} / {t.weight}
                      </Box>
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: t.size,
                        fontWeight: t.weight,
                        letterSpacing: t.tracking,
                        lineHeight: t.line,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      {name === 'overline' ? 'WEEK 3 SUPPLY' : 'Eucalyptus procurement'}
                    </Typography>
                  </Box>
                ),
              )}
            </Stack>
          </DocSection>

          <DocSection
            id="space"
            title="Spacing"
            blurb="4dp baseline. Product screens use these tokens for pane padding, section stacks, card chrome, and tight rows."
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
                gap: space.related,
              }}
            >
              {[
                { token: 'xs', units: space.xs, use: 'Caption under titles' },
                { token: 'tight', units: space.tight, use: 'Chip rows, list gaps' },
                { token: 'compact', units: space.compact, use: 'Dense control stacks' },
                { token: 'related', units: space.related, use: 'Card / KPI padding' },
                { token: 'section', units: space.section, use: 'MainPane body + section gap' },
                { token: 'gutter', units: space.gutter, use: 'Major layout gutters' },
              ].map(s => (
                <DashPaper key={s.token} sx={{ p: space.related }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    space.{s.token}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: m3.onSurfaceVariant, mb: space.tight }}>
                    {s.units * 4}dp · {s.use}
                  </Typography>
                  <Box sx={{ height: s.units * 4, bgcolor: m3.primaryContainer, borderRadius: `${shape.xs}px` }} />
                </DashPaper>
              ))}
            </Box>
          </DocSection>

          <DocSection
            id="color"
            title="Semantic color"
            blurb="Teal = confirmed / selected / actionable. Amber = uncertainty / verification / caution. Red = constraint failure / material risk. Neutral = supporting / inactive."
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: space.related,
              }}
            >
              <Swatch color={m3.primary} label="Teal · actionable" value={m3.primary} />
              <Swatch color={m3.primaryInk} label="Teal ink · text / outline" value={m3.primaryInk} />
              <Swatch color={m3.warning} label="Amber · caution" value={m3.warning} />
              <Swatch color={m3.warningInk} label="Amber ink · text" value={m3.warningInk} />
              <Swatch color={m3.error} label="Red · risk / fail" value={m3.error} />
              <Swatch color={m3.onSurfaceVariant} label="Neutral · supporting" value={m3.onSurfaceVariant} />
              <Swatch color={CARD_SELECTION_BG} label="Selection wash" value="rgba(11,175,175,0.1)" />
              <Swatch label="Open gap hatch" value="track + hatch" hatch />
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: space.related,
              }}
            >
              {(Object.entries(STRATEGY_VISUAL) as [string, (typeof STRATEGY_VISUAL)[keyof typeof STRATEGY_VISUAL]][]).map(
                ([key, visual]) => (
                  <DashPaper
                    key={key}
                    sx={{
                      p: space.related,
                      pl: space.section,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: visual.accent }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {key}
                    </Typography>
                    <Typography variant="caption" sx={{ color: visual.ink, fontWeight: 700 }}>
                      {visual.tagline}
                    </Typography>
                  </DashPaper>
                ),
              )}
            </Box>
          </DocSection>

          <DocSection
            id="confidence"
            title="Confidence states"
            blurb="Shared StatusChip kinds for HIGH / MEDIUM / LOW. Positive = teal outline, caution = amber, negative = red."
          >
            <Stack direction="row" spacing={space.tight} sx={{ flexWrap: 'wrap' }}>
              {confidenceKinds.map(kind => (
                <Stack key={kind} spacing={space.xs} sx={{ alignItems: 'flex-start' }}>
                  <StatusChip kind={kind} />
                  <Typography variant="caption" sx={{ color: m3.onSurfaceVariant }}>
                    {kind}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </DocSection>

          <DocSection
            id="evidence"
            title="Evidence states"
            blurb="Evidence age chips, verified / visit-required, provenance strip, and field sync states from the mobile flow."
          >
            <Stack direction="row" spacing={space.tight} sx={{ flexWrap: 'wrap', mb: space.related }}>
              {evidenceKinds.map(kind => (
                <StatusChip key={kind} kind={kind} />
              ))}
            </Stack>
            <EvidenceProvenance
              capturedBy="Ravi · Field officer"
              timestamp="Today · 09:42 IST"
              gps="16.5442° N, 81.5218° E"
              sync="synced"
            />
            <Box sx={{ ...panelSurface, overflow: 'hidden' }}>
              <FieldSyncStrip state="online" />
              <FieldSyncStrip state="syncing" />
              <FieldSyncStrip state="offline" />
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={space.related}>
              <EvidenceCueBar label="Evidence recency" valueLabel="6 days" pct={82} tone="primary" />
              <EvidenceCueBar label="Harvest timing" valueLabel="Week 3" pct={70} tone="caution" />
            </Stack>
          </DocSection>

          <DocSection
            id="cta"
            title="Buttons / CTA hierarchy"
            blurb="Primary (filled teal), Secondary (outlined), Ghost (text). Same 40dp height including border."
          >
            <Stack direction="row" spacing={space.tight} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
              <PrimaryBtn>Investigate farms →</PrimaryBtn>
              <SecondaryBtn>Compare alternatives</SecondaryBtn>
              <GhostBtn>Reset to defaults</GhostBtn>
              <PrimaryBtn disabled>Proceed →</PrimaryBtn>
            </Stack>
          </DocSection>

          <DocSection
            id="forms"
            title="Form controls"
            blurb="Checkbox, text field, and threshold rails used in Field capture and Scenario constraints."
          >
            <FormControlLabel
              control={<Checkbox checked={checked} onChange={(_, v) => setChecked(v)} color="primary" />}
              label={<Typography variant="body2">Standing stock confirmed</Typography>}
            />
            <TextField
              label="Field notes"
              value={note}
              onChange={e => setNote(e.target.value)}
              multiline
              minRows={2}
              fullWidth
            />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: space.related,
              }}
            >
              <ThresholdControl
                label="Min. Week 3 coverage"
                value={threshold}
                display={`${threshold}%`}
                min={80}
                max={100}
                onChange={setThreshold}
                marks={['80%', '100%']}
              />
              <ThresholdControl
                label="Max. field verification visits"
                value={visits}
                display={`${visits} visits`}
                min={0}
                max={10}
                onChange={setVisits}
                modified={visits < 2}
                marks={['0', '10']}
              />
            </Box>
          </DocSection>

          <DocSection
            id="constraints"
            title="Constraint states"
            blurb="Pass / fail chips and critical primary-issue treatment used in Scenario Planning and alerts."
          >
            <Stack direction="row" spacing={space.tight} sx={{ flexWrap: 'wrap' }}>
              {constraintKinds.map(kind => (
                <StatusChip key={kind} kind={kind} />
              ))}
            </Stack>
            <DashPaper
              sx={{
                p: space.related,
                bgcolor: m3.errorContainer,
                color: m3.onErrorContainer,
                border: `1px solid ${m3.error}`,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Coverage target not met
              </Typography>
              <Typography variant="body2" sx={{ mt: space.xs, color: m3.onErrorContainer }}>
                Strategy fails the 95% Week 3 coverage constraint under the current visit limit.
              </Typography>
            </DashPaper>
          </DocSection>

          <DocSection
            id="map"
            title="Map markers / parcel states"
            blurb="Parcels use canopy fill plus role stroke. Evidence age is a badge, not a pin. Colors follow the teal / amber / red / neutral model."
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
                gap: space.related,
              }}
            >
              <ParcelDemo
                label="Selected"
                fill={alpha(semantic.canopyHigh, 0.38)}
                stroke={m3.primary}
                dash="2.5 1.2"
                badge="6d"
                badgeColor={semantic.evidenceFresh}
              />
              <ParcelDemo
                label="Needs verification"
                fill={alpha(semantic.canopyMed, 0.42)}
                stroke={m3.warning}
                dash="2.5 1.5"
                badge="42d"
                badgeColor={semantic.evidenceAging}
              />
              <ParcelDemo
                label="Committed"
                fill={alpha(semantic.canopyHigh, 0.38)}
                stroke={m3.primary}
                badge="4d"
                badgeColor={semantic.evidenceFresh}
              />
              <ParcelDemo
                label="Alert / weak"
                fill={alpha(semantic.canopyLow, 0.38)}
                stroke={m3.error}
                badge="!"
                badgeColor={m3.error}
              />
              <ParcelDemo
                label="Other / inactive"
                fill={alpha(semantic.inactive, 0.28)}
                stroke={semantic.mapOther}
              />
              <ParcelDemo
                label="Evidence missing"
                fill={alpha(semantic.inactive, 0.28)}
                stroke={m3.warning}
                dash="2.5 1.5"
                badge="—"
                badgeColor={semantic.evidenceMissing}
              />
            </Box>
          </DocSection>

          <DocSection
            id="viz"
            title="Data visualization"
            blurb="Shared meters: SupplyBar (firm / at risk / open gap), PercentBar, WeekRail, and scenario TradeoffBars."
          >
            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: space.tight, fontWeight: 650 }}>
                SupplyBar
              </Typography>
              <SupplyBar firm={2568} atRisk={570} total={4000} />
              <Stack direction="row" spacing={space.related} sx={{ mt: space.tight, flexWrap: 'wrap' }}>
                <Swatch color={semantic.firm} label="Firm" value="2,568 t" />
                <Swatch color={semantic.atRisk} label="At risk" value="570 t" />
                <Swatch label="Open gap" value="862 t" hatch />
              </Stack>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: space.tight, fontWeight: 650 }}>
                PercentBar · meter height {meter.height}dp
              </Typography>
              <Stack spacing={space.related}>
                <PercentBar label="Week 3 coverage" display="96%" value={96} tone="primary" markerPct={95} />
                <PercentBar label="Verification load" display="2 visits" value={20} tone="caution" />
                <PercentBar label="Below target" display="78%" value={78} tone="danger" markerPct={95} />
              </Stack>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: space.tight, fontWeight: 650 }}>
                WeekRail
              </Typography>
              <Box sx={{ ...panelSurface, overflow: 'hidden' }}>
                <WeekRail
                  weeks={[
                    { n: 1, committed: 980, target: 1000, delta: -20, issue: false },
                    { n: 2, committed: 1010, target: 1000, delta: 10, issue: false },
                    { n: 3, committed: 580, target: 1200, delta: -620, issue: true },
                    { n: 4, committed: 900, target: 800, delta: 100, issue: false },
                  ]}
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: space.tight, fontWeight: 650 }}>
                TradeoffBars · Coverage-First emphasis
              </Typography>
              <TradeoffBars coverage={96} visits={2} highConf={65} district={36} emphasis="coverage" />
            </Box>
          </DocSection>

          <Typography variant="caption" sx={{ color: m3.onSurfaceVariant, pb: space.section }}>
            Source tokens: <Box component="code">src/designSystem.ts</Box> · Components:{' '}
            <Box component="code">src/ui.tsx</Box> · Font: Manrope only
          </Typography>
        </Stack>
      </Box>
    </Box>
  )
}
