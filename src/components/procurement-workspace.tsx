"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Clock3,
  FileWarning,
  Filter,
  Home,
  Info,
  Leaf,
  MapPin,
  MapPinned,
  Menu,
  Minus,
  MoreHorizontal,
  Network,
  RefreshCw,
  Route,
  Save,
  Satellite,
  ShieldCheck,
  SlidersHorizontal,
  Sprout,
  Target,
  Truck,
  TrendingDown,
  UploadCloud,
  UserRoundCheck,
  UsersRound,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FarmMap } from "@/components/farm-map";

type View = "workspace" | "recommendations" | "comparison" | "scenarios" | "plan";

type Farm = {
  id: string;
  name: string;
  owner: string;
  location: string;
  region: string;
  supply: number;
  window: string;
  confidence: "High" | "Medium";
  score: number;
  history: string;
  maturity: string;
  evidence: string;
  updated: string;
  risks: string[];
  lat: number;
  lng: number;
};

const farms: Farm[] = [
  {
    id: "f1",
    name: "Kaveri North Block",
    owner: "S. Ramesh",
    location: "Kothagudem, Telangana",
    region: "North cluster",
    supply: 280,
    window: "18–22 Sep",
    confidence: "High",
    score: 92,
    history: "3 harvests · yield variance ±4%",
    maturity: "Healthy canopy · maturity 8.4/10",
    evidence: "Field visit 6 days ago · 12 photos",
    updated: "Satellite: yesterday",
    risks: ["Low access risk", "No unresolved evidence"],
    lat: 17.556,
    lng: 80.617,
  },
  {
    id: "f2",
    name: "Godavari Agro Plot 7",
    owner: "Lakshmi Farms",
    location: "Bhadrachalam, Telangana",
    region: "River cluster",
    supply: 230,
    window: "19–24 Sep",
    confidence: "Medium",
    score: 76,
    history: "2 harvests · stable tonnage",
    maturity: "Strong satellite maturity 8.1/10",
    evidence: "Last field visit 47 days ago",
    updated: "Satellite: 2 days ago",
    risks: ["Stale field evidence", "Access road unconfirmed"],
    lat: 17.668,
    lng: 80.893,
  },
  {
    id: "f3",
    name: "Suryapet Timber Cooperative",
    owner: "12-member collective",
    location: "Suryapet, Telangana",
    region: "West cluster",
    supply: 190,
    window: "20–25 Sep",
    confidence: "High",
    score: 87,
    history: "5 harvests · 96% commitment reliability",
    maturity: "Maturity 7.9/10 · stable trend",
    evidence: "Field visit 11 days ago · boundary verified",
    updated: "Satellite: yesterday",
    risks: ["Split collection across 3 plots"],
    lat: 17.139,
    lng: 79.623,
  },
  {
    id: "f4",
    name: "Paloncha Green Acres",
    owner: "V. Satish",
    location: "Paloncha, Telangana",
    region: "North cluster",
    supply: 160,
    window: "16–20 Sep",
    confidence: "Medium",
    score: 71,
    history: "First ITC procurement cycle",
    maturity: "Healthy canopy · maturity 8.6/10",
    evidence: "Ownership document incomplete",
    updated: "Satellite: 3 days ago",
    risks: ["Missing title evidence", "New supplier"],
    lat: 17.598,
    lng: 80.701,
  },
  {
    id: "f5",
    name: "Krishna East Woodlot",
    owner: "M. Anitha",
    location: "Nandigama, Andhra Pradesh",
    region: "South cluster",
    supply: 140,
    window: "24–28 Sep",
    confidence: "High",
    score: 88,
    history: "4 harvests · 94% commitment reliability",
    maturity: "Maturity 7.7/10 · healthy trend",
    evidence: "Field visit 9 days ago · access verified",
    updated: "Satellite: today",
    risks: ["Harvest window has two-day buffer"],
    lat: 16.771,
    lng: 80.286,
  },
  {
    id: "f6",
    name: "Khammam Reserve Block",
    owner: "Telangana Forestry Group",
    location: "Khammam, Telangana",
    region: "Central cluster",
    supply: 210,
    window: "26 Sep–1 Oct",
    confidence: "Medium",
    score: 73,
    history: "2 harvests · variable collection time",
    maturity: "Canopy decline detected in south edge",
    evidence: "Field visit due · prior visit 39 days ago",
    updated: "Satellite: yesterday",
    risks: ["Estimated volume changed −18%", "Field visit due"],
    lat: 17.247,
    lng: 80.151,
  },
  {
    id: "f7",
    name: "Wyra Community Block",
    owner: "8-member collective",
    location: "Wyra, Telangana",
    region: "Central cluster",
    supply: 130,
    window: "30 Sep–4 Oct",
    confidence: "Medium",
    score: 69,
    history: "First pooled commitment",
    maturity: "Maturity 7.2/10 · stable",
    evidence: "3 of 8 owner consents missing",
    updated: "Satellite: 4 days ago",
    risks: ["Missing owner consent", "Pooled collection"],
    lat: 17.192,
    lng: 80.374,
  },
];

const recommendedFarms = farms.slice(0, 4);

const navItems: { view: View; label: string; href: string; icon: typeof Home }[] = [
  { view: "workspace", label: "Monday workspace", href: "/", icon: Home },
  { view: "recommendations", label: "Decision", href: "/decisions/week-3-gap", icon: Target },
  { view: "comparison", label: "Compare farms", href: "/compare", icon: BarChart3 },
  { view: "scenarios", label: "Scenarios", href: "/scenarios", icon: SlidersHorizontal },
  { view: "plan", label: "Plan & monitor", href: "/plan", icon: ClipboardCheck },
];

const stepIndex: Record<View, number> = {
  workspace: 0,
  recommendations: 1,
  comparison: 2,
  scenarios: 3,
  plan: 4,
};

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid size-9 place-items-center rounded-lg bg-[#235c3a] text-white">
        <Leaf className="size-5" />
      </div>
      <div>
        <p className="text-sm font-semibold leading-none tracking-tight">ITC Procurement</p>
        <p className="mt-1 text-[11px] text-muted-foreground">Wood fibre workspace</p>
      </div>
    </div>
  );
}

function Sidebar({ view }: { view: View }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-[#fbfcfa] md:flex md:flex-col">
      <div className="px-5 py-5"><Logo /></div>
      <Separator />
      <div className="px-4 py-5">
        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Strategy flow</p>
        <nav className="space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = item.view === view;
            const complete = index < stepIndex[view];
            return (
              <Link
                key={item.view}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-[#e7f0e9] font-medium text-[#184f31]" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {complete ? <CheckCircle2 className="size-4 text-[#2e7d4e]" /> : <Icon className="size-4" />}
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="size-4" />}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <div className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-medium text-slate-700">Active target</p>
          <p className="mt-1 text-sm font-semibold">Eucalyptus · 4,000 t</p>
          <p className="mt-1 text-xs text-muted-foreground">Sep 9 – Oct 6</p>
        </div>
        <div className="mt-4 flex items-center gap-3 px-1">
          <Avatar className="size-8"><AvatarFallback className="bg-[#dce9df] text-xs text-[#235c3a]">SP</AvatarFallback></Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Shrikant Patil</p>
            <p className="truncate text-xs text-muted-foreground">Procurement manager</p>
          </div>
          <MoreHorizontal className="ml-auto size-4 text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
}

function MobileHeader({ view }: { view: View }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur md:hidden">
        <Logo />
        <button type="button" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-lg border bg-white">
          <Menu className="size-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 right-0 w-[85%] max-w-sm border-l bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between"><p className="font-semibold">Procurement flow</p><button type="button" aria-label="Close navigation" onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"><X className="size-5" /></button></div>
            <nav className="mt-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.view} href={item.href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-md p-3 text-sm", item.view === view && "bg-[#e7f0e9] font-medium text-[#184f31]")}>
                    <Icon className="size-4" />{item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}

function PageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#32704b]">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[28px]">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}

function AppShell({ view, children }: { view: View; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f7f5] text-slate-900">
      <Sidebar view={view} />
      <MobileHeader view={view} />
      <main className="md:pl-64">
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}

function MetricCard({ label, value, detail, tone = "default" }: { label: string; value: string; detail: string; tone?: "default" | "warn" | "good" }) {
  return (
    <Card className={cn("shadow-none", tone === "warn" && "border-amber-300 bg-amber-50/50", tone === "good" && "border-emerald-200 bg-emerald-50/40")}>
      <CardContent className="p-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function CoverageChart() {
  const weeks = [
    { week: "Week 1", target: 1000, covered: 1040, risk: 80 },
    { week: "Week 2", target: 1000, covered: 980, risk: 130 },
    { week: "Week 3", target: 1000, covered: 380, risk: 140 },
    { week: "Week 4", target: 1000, covered: 920, risk: 170 },
  ];
  return (
    <Card className="shadow-none">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-base">Four-week coverage</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">Committed and at-risk supply against weekly demand</p>
        </div>
        <Badge variant="outline" className="font-normal"><CircleDot className="mr-1 size-3 text-amber-600" />Live plan</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {weeks.map((item) => {
            const committed = Math.min(item.covered, item.target);
            const gap = Math.max(0, item.target - item.covered);
            return (
              <div key={item.week} className="grid gap-2 sm:grid-cols-[80px_1fr_110px] sm:items-center">
                <div>
                  <p className="text-sm font-medium">{item.week}</p>
                  <p className="text-[11px] text-muted-foreground">{item.target.toLocaleString()} t demand</p>
                </div>
                <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="bg-[#3d7e55]" style={{ width: `${(committed / item.target) * 100}%` }} />
                  {item.covered < item.target && <div className="bg-amber-300" style={{ width: `${Math.min((item.risk / item.target) * 100, 100 - (committed / item.target) * 100)}%` }} />}
                </div>
                <p className={cn("text-right text-xs font-medium", gap > 0 ? "text-amber-700" : "text-emerald-700")}>
                  {gap > 0 ? `${gap} t gap` : `${item.covered - item.target} t buffer`}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-4 border-t pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#3d7e55]" />Committed</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-amber-300" />At risk</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-slate-100 ring-1 ring-slate-200" />Uncovered</span>
        </div>
      </CardContent>
    </Card>
  );
}

function DecisionQueue() {
  const decisions = [
    { title: "Week 3 supply gap: 620 tons", detail: "Demand window begins in 9 days", count: "Priority", icon: Target, href: "/decisions/week-3-gap", tone: "border-l-amber-500" },
    { title: "4 procurement commitments at risk", detail: "1,120 tons need confirmation", count: "4", icon: AlertTriangle, href: "/decisions/commitments-at-risk", tone: "border-l-orange-400" },
    { title: "7 farms changed significantly", detail: "Satellite and field signals since Monday", count: "7", icon: RefreshCw, href: "/decisions/weekly-changes", tone: "border-l-sky-500" },
    { title: "5 decisions blocked by evidence", detail: "Verification can unlock 690 tons", count: "5", icon: FileWarning, href: "/decisions/missing-evidence", tone: "border-l-violet-500" },
  ];
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Decision queue</CardTitle>
          <Badge variant="secondary">12 open</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Decisions ordered by impact on the target</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {decisions.map((item, index) => {
          const Icon = item.icon;
          const content = (
            <div className={cn("group flex items-center gap-3 rounded-md border border-l-[3px] bg-white p-3 transition hover:border-slate-300 hover:shadow-sm", item.tone)}>
              <div className="grid size-9 shrink-0 place-items-center rounded-md bg-slate-100"><Icon className="size-4 text-slate-700" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <Badge variant={index === 0 ? "default" : "secondary"} className={cn(index === 0 && "bg-amber-600")}>{item.count}</Badge>
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
          );
          return <Link key={item.title} href={item.href}>{content}</Link>;
        })}
      </CardContent>
    </Card>
  );
}

function WorkspaceView({ initialPeriod = "current" }: { initialPeriod?: "current" | "next" }) {
  const period = initialPeriod;
  const [selectedFarm, setSelectedFarm] = useState("f1");
  const mappedFarm = farms.find((farm) => farm.id === selectedFarm) ?? farms[0];

  return (
    <AppShell view="workspace">
      <PageHeader
        eyebrow="Monday, 9 September"
        title="Good morning, Shrikant"
        description={period === "current" ? "Your Eucalyptus strategy is 83% covered. Week 3 is the only material gap and needs a sourcing decision this week." : "Forward view: two Week 4 commitments roll into the next period, leaving 540 tons to source for the week of 7 October."}
        actions={<Link href={period === "current" ? "/workspace/next-period" : "/"} className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-medium hover:bg-slate-50"><CalendarDays className="size-4" />{period === "current" ? "Sep 9 – Oct 6" : "Sep 16 – Oct 13"}<RefreshCw className="size-3.5 text-muted-foreground" /></Link>}
      />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Target" value="4,000 t" detail="Eucalyptus · four weeks" />
        <MetricCard label="Covered" value="3,320 t" detail="83% of target" tone="good" />
        <MetricCard label="At risk" value="520 t" detail="Across 4 commitments" tone="warn" />
        <MetricCard label="Uncovered gap" value="620 t" detail="Concentrated in Week 3" tone="warn" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <CoverageChart />
        <DecisionQueue />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Card className="shadow-none">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div><CardTitle className="text-base">Farm network</CardTitle><p className="mt-1 text-xs text-muted-foreground">Select a farm or cluster to inspect supply and evidence.</p></div>
            <Badge variant="secondary"><MapPinned className="mr-1 size-3" />7 farms · 5 regions</Badge>
          </CardHeader>
          <CardContent>
            <FarmMap farms={farms} selectedFarmId={selectedFarm} onSelectFarm={setSelectedFarm} height={330} />
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle className="text-base">Selected farm</CardTitle></CardHeader>
            <CardContent>
              <p className="font-semibold">{mappedFarm.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{mappedFarm.location} · {mappedFarm.region}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-slate-50 p-3"><p className="text-xs text-muted-foreground">Expected supply</p><p className="mt-1 font-semibold">{mappedFarm.supply} t</p></div>
                <div className="rounded-md bg-slate-50 p-3"><p className="text-xs text-muted-foreground">Confidence</p><p className="mt-1 font-semibold">{mappedFarm.confidence}</p></div>
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">{mappedFarm.evidence}</p>
              <Button className="mt-4 w-full" variant="outline" render={<Link href={`/farms/${mappedFarm.id}`} />}>Open farm evidence<ArrowRight className="size-4" /></Button>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="grid size-10 place-items-center rounded-md bg-sky-100"><Truck className="size-5 text-sky-700" /></div>
              <div className="flex-1"><p className="text-sm font-medium">Collection schedule</p><p className="text-xs text-muted-foreground">12 pickups derived from harvest windows</p></div>
              <Button size="sm" variant="outline" render={<Link href="/schedule" />}>Open</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ["Casuarina", "2,140 t secured", "101%"],
          ["Subabul", "1,760 t secured", "97%"],
          ["Eucalyptus", "3,320 t secured", "83%"],
        ].map(([crop, amount, pct]) => (
          <Card key={crop} className="shadow-none">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="grid size-10 place-items-center rounded-full bg-[#e7f0e9]"><Sprout className="size-5 text-[#235c3a]" /></div>
              <div className="flex-1"><p className="text-sm font-medium">{crop}</p><p className="text-xs text-muted-foreground">{amount}</p></div>
              <p className="text-sm font-semibold">{pct}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

function ConfidenceBadge({ value }: { value: "High" | "Medium" }) {
  return <Badge className={cn("border-0", value === "High" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800")}>{value} confidence</Badge>;
}

function RecommendationCard({ farm, selected, onSelect }: { farm: Farm; selected: boolean; onSelect: () => void }) {
  return (
    <Card className={cn("shadow-none transition", selected && "border-[#3d7e55] ring-1 ring-[#3d7e55]")}>
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-start">
          <Checkbox checked={selected} onCheckedChange={onSelect} aria-label={`Select ${farm.name}`} className="mt-1" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{farm.name}</h3>
              <ConfidenceBadge value={farm.confidence} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{farm.owner} · {farm.location}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xl font-semibold">{farm.supply} t</p>
            <p className="text-xs text-muted-foreground">expected supply</p>
          </div>
        </div>
        <div className="grid gap-4 p-4 text-sm md:grid-cols-3">
          <div><p className="text-xs text-muted-foreground">Harvest window</p><p className="mt-1 font-medium">{farm.window}</p></div>
          <div><p className="text-xs text-muted-foreground">Historical performance</p><p className="mt-1 font-medium">{farm.history}</p></div>
          <div><p className="text-xs text-muted-foreground">Current condition</p><p className="mt-1 font-medium">{farm.maturity}</p></div>
        </div>
        <div className={cn("mx-4 mb-4 rounded-md border p-3 text-xs leading-5", farm.confidence === "High" ? "border-emerald-200 bg-emerald-50/70" : "border-amber-200 bg-amber-50/70")}>
          <div className="flex items-start gap-2">
            {farm.confidence === "High" ? <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-700" /> : <Info className="mt-0.5 size-4 shrink-0 text-amber-700" />}
            <p>
              {farm.confidence === "High"
                ? "Harvest timing aligns with Week 3, historical yield is stable, and recent satellite maturity supports the expected volume."
                : farm.id === "f2"
                  ? "Satellite indicators are strong, but field evidence is 47 days old. One verification visit could confirm access and move confidence to high."
                  : "Current signals support the volume, but missing supplier evidence limits commitment confidence."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t bg-slate-50/70 px-4 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Satellite className="size-3.5" />{farm.updated}</span>
          <span className="flex items-center gap-1.5"><ClipboardCheck className="size-3.5" />{farm.evidence}</span>
          <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{farm.region}</span>
          <Link href={`/farms/${farm.id}`} className="ml-auto font-medium text-[#235c3a] hover:underline">View evidence →</Link>
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationsView() {
  const [selected, setSelected] = useState<string[]>(["f1", "f2", "f3"]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [confidenceFilter, setConfidenceFilter] = useState<"All" | "High" | "Medium">("All");
  const [selectedMapFarm, setSelectedMapFarm] = useState("f1");
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const visibleFarms = recommendedFarms.filter((farm) => confidenceFilter === "All" || farm.confidence === confidenceFilter);
  return (
    <AppShell view="recommendations">
      <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"><Link href="/">Monday workspace</Link><ChevronRight className="size-3" /><span>Week 3 gap</span></div>
      <PageHeader
        eyebrow="Decision · Week 3"
        title="Cover the 620-ton supply gap"
        description="Four farms can contribute up to 860 tons during the required harvest window. Recommendations combine current field evidence, satellite maturity, historical yield, and commitment reliability."
        actions={<><button type="button" onClick={() => setFilterOpen((value) => !value)} className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-medium hover:bg-slate-50"><Filter className="size-4" />{filterOpen ? "Hide filters" : "Filter farms"}</button>{selected.length >= 2 ? <Button render={<Link href="/compare" />}>Compare {selected.length} farms<ArrowRight className="size-4" /></Button> : <Badge variant="outline">Select at least 2 farms</Badge>}</>}
      />
      {filterOpen && (
        <Card className="mb-5 shadow-none">
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <p className="text-sm font-medium">Confidence</p>
            {(["All", "High", "Medium"] as const).map((value) => <Button key={value} size="sm" variant={confidenceFilter === value ? "default" : "outline"} onClick={() => setConfidenceFilter(value)}>{value}</Button>)}
            <p className="ml-auto text-xs text-muted-foreground">{visibleFarms.length} recommendations shown</p>
          </CardContent>
        </Card>
      )}
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <MetricCard label="Gap to solve" value="620 t" detail="Sep 18–24 collection" tone="warn" />
        <MetricCard label="Recommended supply" value="860 t" detail="240 t potential buffer" tone="good" />
        <MetricCard label="Needs verification" value="2 farms" detail="390 t could gain confidence" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardHeader className="pb-3"><CardTitle className="text-sm">Recommendation map</CardTitle><p className="text-xs text-muted-foreground">Select a marker to connect location with evidence.</p></CardHeader>
            <CardContent><FarmMap farms={visibleFarms} selectedFarmId={selectedMapFarm} onSelectFarm={setSelectedMapFarm} height={300} /></CardContent>
          </Card>
          {visibleFarms.map((farm) => <RecommendationCard key={farm.id} farm={farm} selected={selected.includes(farm.id)} onSelect={() => toggle(farm.id)} />)}
        </div>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <CardHeader><CardTitle className="text-sm">Why these farms</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-xs leading-5 text-muted-foreground">
              <p className="flex gap-2"><CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-700" />Harvest windows overlap Week 3 collection by at least four days.</p>
              <p className="flex gap-2"><Satellite className="mt-0.5 size-4 shrink-0 text-slate-700" />No material canopy decline detected in the last 14 days.</p>
              <p className="flex gap-2"><Network className="mt-0.5 size-4 shrink-0 text-slate-700" />The set adds two regions and reduces reliance on North cluster.</p>
            </CardContent>
          </Card>
          <Card className="border-dashed bg-transparent shadow-none">
            <CardContent className="p-4 text-xs text-muted-foreground">
              <p className="font-medium text-slate-800">Recommendation basis</p>
              <p className="mt-2 leading-5">Signals support—not replace—Shrikant’s decision. Confidence falls when critical evidence is stale or missing.</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}

function ComparisonView() {
  const [visible, setVisible] = useState(["f1", "f2", "f3"]);
  const compared = farms.filter((farm) => visible.includes(farm.id));
  return (
    <AppShell view="comparison">
      <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"><Link href="/decisions/week-3-gap">Week 3 gap</Link><ChevronRight className="size-3" /><span>Compare farms</span></div>
      <PageHeader
        eyebrow="Farm comparison"
        title={`Compare ${compared.length} shortlisted farms`}
        description="Check volume, timing, confidence, operational risk, and missing evidence before building a scenario."
        actions={<Button render={<Link href="/scenarios" />}>Build scenario<ArrowRight className="size-4" /></Button>}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {farms.map((farm) => (
          <button key={farm.id} type="button" className={cn("inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium", visible.includes(farm.id) ? "border-slate-200 bg-slate-100" : "border-slate-200 bg-white")} onClick={() => setVisible((current) => current.includes(farm.id) ? current.filter((id) => id !== farm.id) : [...current, farm.id])}>
            {visible.includes(farm.id) ? <Check className="size-3.5" /> : <Minus className="size-3.5" />}{farm.name}
          </button>
        ))}
      </div>
      {compared.length === 0 ? (
        <Card className="border-dashed shadow-none"><CardContent className="grid min-h-72 place-items-center p-8 text-center"><div><UsersRound className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 font-medium">No farms selected</p><p className="mt-1 text-sm text-muted-foreground">Select at least two farms above to compare them.</p></div></CardContent></Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full min-w-[850px] text-sm">
            <thead><tr className="border-b bg-slate-50"><th className="w-44 p-4 text-left text-xs font-medium text-muted-foreground">Decision factor</th>{compared.map((farm) => <th key={farm.id} className="min-w-56 p-4 text-left"><p className="font-semibold">{farm.name}</p><p className="mt-1 text-xs font-normal text-muted-foreground">{farm.location}</p></th>)}</tr></thead>
            <tbody>
              <CompareRow label="Expected supply">{compared.map((farm) => <p key={farm.id} className="text-lg font-semibold">{farm.supply} t</p>)}</CompareRow>
              <CompareRow label="Harvest timing">{compared.map((farm) => <div key={farm.id}><p className="font-medium">{farm.window}</p><p className="mt-1 text-xs text-emerald-700">Aligns with Week 3</p></div>)}</CompareRow>
              <CompareRow label="Confidence">{compared.map((farm) => <div key={farm.id}><ConfidenceBadge value={farm.confidence} /><p className="mt-2 text-xs text-muted-foreground">{farm.score}/100 evidence score</p></div>)}</CompareRow>
              <CompareRow label="Current evidence">{compared.map((farm) => <div key={farm.id} className="space-y-1 text-xs"><p>{farm.maturity}</p><p className="text-muted-foreground">{farm.evidence}</p></div>)}</CompareRow>
              <CompareRow label="Historical">{compared.map((farm) => <p key={farm.id} className="text-xs leading-5">{farm.history}</p>)}</CompareRow>
              <CompareRow label="Risk & missing evidence">{compared.map((farm) => <ul key={farm.id} className="space-y-1.5">{farm.risks.map((risk) => <li key={risk} className="flex gap-1.5 text-xs"><AlertTriangle className={cn("mt-0.5 size-3 shrink-0", risk.startsWith("No ") ? "text-emerald-600" : "text-amber-600")} />{risk}</li>)}</ul>)}</CompareRow>
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex justify-end"><Button render={<Link href="/scenarios" />}>Use shortlisted farms<ArrowRight className="size-4" /></Button></div>
    </AppShell>
  );
}

function CompareRow({ label, children }: { label: string; children: React.ReactNode[] }) {
  return <tr className="border-b last:border-0"><td className="p-4 align-top text-xs font-medium text-muted-foreground">{label}</td>{children.map((child, index) => <td key={index} className="p-4 align-top">{child}</td>)}</tr>;
}

type Scenario = { name: string; coverage: number; confidence: number; visits: number; concentration: number; timing: string; farms: number; tone: string };

function ScenarioMetrics({ scenario }: { scenario: Scenario }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <div><p className="text-[11px] text-muted-foreground">Coverage</p><p className="mt-1 font-semibold">{scenario.coverage.toFixed(0)}%</p></div>
      <div><p className="text-[11px] text-muted-foreground">High confidence</p><p className="mt-1 font-semibold">{scenario.confidence}%</p></div>
      <div><p className="text-[11px] text-muted-foreground">Field visits</p><p className="mt-1 font-semibold">{scenario.visits}</p></div>
      <div><p className="text-[11px] text-muted-foreground">Largest region</p><p className="mt-1 font-semibold">{scenario.concentration}%</p></div>
      <div><p className="text-[11px] text-muted-foreground">Collection timing</p><p className={cn("mt-1 font-semibold", scenario.timing === "Tight" && "text-amber-700")}>{scenario.timing}</p></div>
    </div>
  );
}

function ScenariosView({ initialScenario = null }: { initialScenario?: string | null }) {
  const [target, setTarget] = useState(95);
  const [visits, setVisits] = useState(8);
  const [highConfidence, setHighConfidence] = useState(true);
  const [diversify, setDiversify] = useState(true);
  const selectedScenario = initialScenario;
  const [assigned, setAssigned] = useState(false);

  const liveScenario = useMemo<Scenario>(() => {
    const feasible = 87 + visits * 1.15 + (highConfidence ? 0 : 2) - (diversify ? 1 : 0);
    return {
      name: "Current constraints",
      coverage: Math.min(target + 1, feasible),
      confidence: highConfidence ? 84 : 69,
      visits,
      concentration: diversify ? 37 : 61,
      timing: diversify ? "Balanced" : "Fast",
      farms: visits > 6 ? 7 : 6,
      tone: "live",
    };
  }, [target, visits, highConfidence, diversify]);

  const options: Scenario[] = [
    liveScenario,
    { name: "Coverage first", coverage: 101, confidence: 72, visits: 10, concentration: 54, timing: "Balanced", farms: 8, tone: "blue" },
    { name: "Confidence first", coverage: 96, confidence: 91, visits: 7, concentration: 58, timing: "Fast", farms: 6, tone: "green" },
    { name: "Regional resilience", coverage: 97, confidence: 79, visits: 9, concentration: 34, timing: "Tight", farms: 9, tone: "violet" },
  ];

  const constraintWarning = liveScenario.coverage < target;
  return (
    <AppShell view="scenarios">
      <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"><Link href="/compare">Compare farms</Link><ChevronRight className="size-3" /><span>Scenario planning</span></div>
      <PageHeader eyebrow="Scenario planning" title="Choose how to close the Week 3 gap" description="Adjust the operating constraints. Coverage and tradeoffs recalculate immediately across the shortlisted farm set." />
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="h-fit shadow-none">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><SlidersHorizontal className="size-4" />Constraints</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-3 flex justify-between text-sm"><span>Minimum Week 3 demand</span><span className="font-semibold">{target}%</span></div>
              <input aria-label="Minimum Week 3 demand" type="range" value={target} min={90} max={100} step={1} onChange={(event) => setTarget(Number(event.target.value))} className="h-6 w-full cursor-pointer accent-[#2f6f49]" />
              <p className="mt-2 text-xs text-muted-foreground">Target coverage after commitments</p>
            </div>
            <Separator />
            <div>
              <div className="mb-3 flex justify-between text-sm"><span>Maximum field visits</span><span className="font-semibold">{visits}</span></div>
              <input aria-label="Maximum field visits" type="range" value={visits} min={2} max={10} step={1} onChange={(event) => setVisits(Number(event.target.value))} className="h-6 w-full cursor-pointer accent-[#2f6f49]" />
              <p className="mt-2 text-xs text-muted-foreground">Ravi’s available capacity this week</p>
            </div>
            <Separator />
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox checked={highConfidence} onCheckedChange={(value) => setHighConfidence(Boolean(value))} />
              <span><span className="block text-sm font-medium">Prioritize high-confidence supply</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">Prefer farms with current field evidence and stable yield.</span></span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox checked={diversify} onCheckedChange={(value) => setDiversify(Boolean(value))} />
              <span><span className="block text-sm font-medium">Reduce regional concentration</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">Keep the largest cluster under 40% of selected supply.</span></span>
            </label>
            <div className={cn("rounded-md border p-3 text-xs leading-5", constraintWarning ? "border-amber-200 bg-amber-50 text-amber-900" : "border-emerald-200 bg-emerald-50 text-emerald-900")}>
              {constraintWarning
                ? `With ${visits} visits, the model can reach ${liveScenario.coverage.toFixed(0)}%—below your ${target}% requirement. Add field capacity or accept lower-confidence supply.`
                : `These constraints can reach ${liveScenario.coverage.toFixed(0)}% with ${visits} visits and ${liveScenario.concentration}% concentration in the largest region.`}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {options.map((scenario, index) => {
            const selected = selectedScenario === scenario.name;
            return (
              <Card key={`${scenario.name}-${index}`} className={cn("shadow-none transition", selected && "border-[#2f6f49] ring-1 ring-[#2f6f49]", index === 0 && "border-sky-300 bg-sky-50/30")}>
                <CardContent className="p-4 sm:p-5">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2"><h3 className="font-semibold">{scenario.name}</h3>{index === 0 && <Badge className="bg-sky-100 text-sky-800">Live result</Badge>}{scenario.name === "Confidence first" && <Badge className="bg-emerald-100 text-emerald-800">Recommended</Badge>}</div>
                      <p className="mt-1 text-xs text-muted-foreground">{scenario.farms} farms · {Math.round((scenario.coverage / 100) * 1000).toLocaleString()} t committed · {Math.max(0, Math.round((scenario.coverage / 100) * 1000 - 1000))} t buffer</p>
                    </div>
                    <Link
                      href={`/scenarios/${scenario.name.toLowerCase().replaceAll(" ", "-")}#scenario-verification`}
                      className={cn(
                        "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors",
                        selected
                          ? "border-[#2f6f49] bg-[#2f6f49] text-white"
                          : "border-slate-200 bg-white hover:bg-slate-100"
                      )}
                    >
                      {selected ? <><Check className="size-4" />Selected</> : "Select scenario"}
                    </Link>
                  </div>
                  <ScenarioMetrics scenario={scenario} />
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className={cn("h-full rounded-full", scenario.coverage >= 95 ? "bg-[#3d7e55]" : "bg-amber-500")} style={{ width: `${Math.min(scenario.coverage, 100)}%` }} /></div>
                </CardContent>
              </Card>
            );
          })}
          {selectedScenario && (
            <Card id="scenario-verification" className="scroll-mt-6 border-[#bcd3c2] bg-[#f7fbf8] shadow-none">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div><CardTitle className="text-base">Selective verification for “{selectedScenario}”</CardTitle><p className="mt-1 text-xs text-muted-foreground">Most farms can move forward. Only unresolved evidence is assigned to Ravi.</p></div>
                  {assigned ? <Button size="sm" variant="outline" render={<Link href="/verification" />}><Check className="size-4" />Open Ravi’s visit brief</Button> : <Button size="sm" onClick={() => setAssigned(true)}><UserRoundCheck className="size-4" />Assign 3 visits</Button>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Bhadrachalam route", "Godavari Agro Plot 7", "Confirm access road and refresh field photos", "230 t"],
                  ["Paloncha route", "Paloncha Green Acres", "Capture title evidence and boundary photo", "160 t"],
                  ["Suryapet route", "Plot 3 collection point", "Confirm truck turning radius", "90 t"],
                ].map(([route, farm, reason, tons]) => (
                  <div key={farm} className="grid gap-2 rounded-md border bg-white p-3 text-xs sm:grid-cols-[150px_1fr_80px] sm:items-center">
                    <div><p className="font-medium text-slate-800">{route}</p><p className="mt-0.5 text-muted-foreground">Grouped by location</p></div>
                    <div><p className="font-medium">{farm}</p><p className="mt-0.5 text-muted-foreground">{reason}</p></div>
                    <p className="font-semibold">{tons}</p>
                  </div>
                ))}
                {assigned && <div className="flex items-start gap-2 rounded-md bg-emerald-100 p-3 text-xs text-emerald-900"><CheckCircle2 className="size-4 shrink-0" /><p>Ravi received one grouped route with 3 stops. He can record status, notes, and photos; findings will update the recommendation evidence.</p></div>}
                <div className="flex justify-end pt-2"><Button render={<Link href="/plan" />}>Confirm procurement plan<ArrowRight className="size-4" /></Button></div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function PlanView({ initialStage = "active" }: { initialStage?: "active" | "disruption" | "recovered" }) {
  const laterState = initialStage !== "active";
  const restored = initialStage === "recovered";
  const [mappedPlanFarm, setMappedPlanFarm] = useState("f1");
  const coverage = restored ? 96 : laterState ? 86 : 96;
  return (
    <AppShell view="plan">
      <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"><Link href="/scenarios">Scenario planning</Link><ChevronRight className="size-3" /><span>Procurement plan</span></div>
      <PageHeader
        eyebrow={restored ? "Tuesday, 17 September · Plan adjusted" : laterState ? "Tuesday, 17 September · Plan change detected" : "Approved plan · Week 3"}
        title={restored ? "Week 3 coverage is back on target" : laterState ? "Week 3 coverage needs attention" : "Week 3 procurement plan is on target"}
        description={restored ? "The Regional resilience scenario replaced the affected volume across two regions. Coverage recovered from 86% to 96%." : laterState ? "Kaveri North Block’s expected supply fell by 400 tons after a field update. Coverage moved from 96% to 86%." : "The Confidence first scenario is active. Seven farms are committed; three selective verifications are linked to Ravi’s route."}
        actions={!laterState ? (
          <Link
            href="/plan/disruption"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium transition-colors hover:bg-slate-100"
          >
            <Clock3 className="size-4" />Simulate later update
          </Link>
        ) : undefined}
      />
      <Card className={cn("mb-6 shadow-none", laterState && !restored ? "border-red-200 bg-red-50/40" : "border-emerald-200 bg-emerald-50/30")}>
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className={cn("grid size-12 place-items-center rounded-full", laterState && !restored ? "bg-red-100" : "bg-emerald-100")}>
              {laterState && !restored ? <TrendingDown className="size-5 text-red-700" /> : <CheckCircle2 className="size-5 text-emerald-700" />}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-3"><p className="text-3xl font-semibold">{coverage}%</p>{laterState && !restored && <Badge className="bg-red-100 text-red-800">Down 10 points</Badge>}{restored && <Badge className="bg-emerald-100 text-emerald-800">Recovered</Badge>}</div>
              <p className="mt-1 text-sm text-muted-foreground">{Math.round(coverage * 40).toLocaleString()} of 4,000 tons covered across the four-week target</p>
              <Progress value={coverage} className="mt-3 h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm sm:text-right">
              <div><p className="text-xs text-muted-foreground">Confidence</p><p className="font-semibold">{restored ? "84%" : laterState ? "79%" : "91%"}</p></div>
              <div><p className="text-xs text-muted-foreground">Target gap</p><p className="font-semibold">{restored ? "160 t" : laterState ? "560 t" : "160 t"}</p></div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mb-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Card className="shadow-none">
          <CardHeader className="flex-row items-start justify-between space-y-0"><div><CardTitle className="text-base">Plan geography</CardTitle><p className="mt-1 text-xs text-muted-foreground">Committed, replacement, and verification farms by region.</p></div><Badge variant="secondary">5 regions</Badge></CardHeader>
          <CardContent><FarmMap farms={farms} selectedFarmId={mappedPlanFarm} onSelectFarm={setMappedPlanFarm} height={300} /></CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader><CardTitle className="text-base">Weekly delivery plan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Week 1", 100],
              ["Week 2", 98],
              ["Week 3", coverage],
              ["Week 4", 92],
            ].map(([week, value]) => <div key={week}><div className="mb-1.5 flex justify-between text-xs"><span>{week}</span><span className="font-semibold">{value}%</span></div><Progress value={Number(value)} className="h-2" /></div>)}
            <Button className="w-full" variant="outline" render={<Link href="/schedule" />}><Truck className="size-4" />Open collection schedule</Button>
            <Button className="w-full" variant="outline" render={<Link href={`/farms/${mappedPlanFarm}`} />}><MapPin className="size-4" />Open selected farm</Button>
          </CardContent>
        </Card>
      </div>

      {!laterState ? (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <Card className="shadow-none">
            <CardHeader><CardTitle className="text-base">Active commitments</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {farms.slice(0, 3).map((farm) => <div key={farm.id} className="flex items-center gap-3 rounded-md border p-3"><div className="grid size-9 place-items-center rounded-md bg-slate-100"><Sprout className="size-4 text-[#2e6a46]" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{farm.name}</p><p className="text-xs text-muted-foreground">{farm.window} · {farm.location}</p></div><p className="text-sm font-semibold">{farm.supply} t</p><Badge variant="secondary">Committed</Badge></div>)}
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardHeader><CardTitle className="text-base">Field verification</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-md bg-slate-50 p-3"><Avatar><AvatarFallback className="bg-[#dce9df] text-[#235c3a]">RK</AvatarFallback></Avatar><div className="flex-1"><p className="text-sm font-medium">Ravi Kumar</p><p className="text-xs text-muted-foreground">3 stops · Bhadrachalam route</p></div><Badge className="bg-sky-100 text-sky-800">In progress</Badge></div>
              <div className="mt-4 space-y-3 text-xs">
                <p className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" />Kaveri North Block · verified</p>
                <p className="flex items-center gap-2"><UploadCloud className="size-4 text-sky-600" />Godavari Plot 7 · photos uploading</p>
                <p className="flex items-center gap-2"><Clock3 className="size-4 text-amber-600" />Paloncha Green Acres · scheduled 16 Sep</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {!restored && (
            <Card className="border-red-200 shadow-none">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="grid size-10 shrink-0 place-items-center rounded-md bg-red-100"><AlertTriangle className="size-5 text-red-700" /></div>
                <div className="flex-1"><p className="font-medium">Kaveri North Block may deliver 120 t, not 520 t</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Ravi reported storm damage and standing-water access risk. Field findings override the prior satellite-supported estimate.</p></div>
                <Badge variant="outline" className="border-red-200 text-red-700">−400 t</Badge>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
            <Card className="shadow-none">
              <CardHeader><div className="flex items-center justify-between"><div><CardTitle className="text-base">{restored ? "Recovery actions added" : "Replacement supply"}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{restored ? "The adjusted scenario restores coverage with diversified supply." : "Current evidence supports these farms for the same harvest window."}</p></div><Badge variant="secondary">{restored ? "2 added" : "540 t available"}</Badge></div></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Suryapet South Extension", "260 t", "High confidence", "20–23 Sep", "West cluster"],
                  ["Godavari Agro Plot 9", "280 t", "Medium confidence", "19–24 Sep", "River cluster"],
                ].map(([name, tons, confidence, window, region]) => (
                  <div key={name} className={cn("rounded-md border p-3", restored && "border-emerald-200 bg-emerald-50/50")}>
                    <div className="flex flex-wrap items-center gap-2"><p className="text-sm font-medium">{name}</p><Badge className={confidence.startsWith("High") ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>{confidence}</Badge><p className="ml-auto font-semibold">{tons}</p></div>
                    <p className="mt-1 text-xs text-muted-foreground">{window} · {region}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-violet-200 bg-violet-50/40 shadow-none">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Route className="size-4 text-violet-700" />Reopen a scenario</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm font-medium">Regional resilience</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">This scenario already includes the two replacement farms. It adds one verification and a tighter collection sequence, while reducing exposure to North cluster.</p>
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-md bg-white p-3 text-center text-xs">
                  <div><p className="text-muted-foreground">Coverage</p><p className="mt-1 font-semibold">96%</p></div>
                  <div><p className="text-muted-foreground">Visits</p><p className="mt-1 font-semibold">+1</p></div>
                  <div><p className="text-muted-foreground">Largest region</p><p className="mt-1 font-semibold">34%</p></div>
                </div>
                {restored ? (
                  <Button className="mt-4 w-full" render={<Link href="/schedule" />}><Truck className="size-4" />Schedule replacement collections</Button>
                ) : (
                  <Button className="mt-4 w-full" render={<Link href="/plan/recovered" />}><RefreshCw className="size-4" />Reopen and adjust plan</Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-lg border border-dashed bg-white p-4 text-xs text-muted-foreground">
        <Target className="size-4" /><span>Target</span><ChevronRight className="size-3" /><span>Coverage & risk</span><ChevronRight className="size-3" /><span>Decision</span><ChevronRight className="size-3" /><span>Recommend & compare</span><ChevronRight className="size-3" /><span>Scenario</span><ChevronRight className="size-3" /><span>Verify</span><ChevronRight className="size-3" /><span>Plan</span><ChevronRight className="size-3" /><span>Monitor & adjust</span>
      </div>
    </AppShell>
  );
}

type DecisionType = "commitments" | "changes" | "evidence";

function CommitmentsDecisionView() {
  const commitmentFarms = [farms[0], farms[1], farms[4], farms[5]];
  const quantities = [400, 280, 240, 200];
  const [selectedFarm, setSelectedFarm] = useState("f1");
  const [requested, setRequested] = useState<string[]>([]);
  const selected = commitmentFarms.find((farm) => farm.id === selectedFarm) ?? commitmentFarms[0];

  return (
    <AppShell view="recommendations">
      <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"><Link href="/">Monday workspace</Link><ChevronRight className="size-3" /><span>Commitments at risk</span></div>
      <PageHeader eyebrow="Decision · Commitment risk" title="Resolve 1,120 tons at risk" description="Four commitments have not met their confirmation threshold. Confirm evidence, request an update, or move volume into replacement review." />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <Card className="shadow-none">
          <CardHeader><CardTitle className="text-base">At-risk commitments</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {commitmentFarms.map((farm, index) => (
              <button key={farm.id} type="button" onClick={() => setSelectedFarm(farm.id)} className={cn("w-full rounded-md border p-3 text-left transition", selectedFarm === farm.id ? "border-amber-400 bg-amber-50" : "hover:bg-slate-50")}>
                <div className="flex flex-wrap items-center gap-2"><p className="font-medium">{farm.name}</p><Badge className="bg-amber-100 text-amber-800">{index < 2 ? "Confirmation overdue" : "Evidence changed"}</Badge><p className="ml-auto font-semibold">{quantities[index]} t</p></div>
                <p className="mt-1 text-xs text-muted-foreground">{farm.location} · {farm.risks[0]}</p>
              </button>
            ))}
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader><CardTitle className="text-base">Decide for {selected.name}</CardTitle></CardHeader>
          <CardContent>
            <FarmMap farms={commitmentFarms} selectedFarmId={selectedFarm} onSelectFarm={setSelectedFarm} height={250} />
            <div className="mt-4 rounded-md bg-slate-50 p-3 text-xs leading-5"><strong>Why at risk:</strong> {selected.evidence}. {selected.risks.join("; ")}.</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {requested.includes(selected.id) ? (
                <Button variant="outline" render={<Link href="/verification" />}><Check className="size-4" />Open Ravi’s visit brief</Button>
              ) : (
                <button type="button" onClick={() => setRequested((items) => [...items, selected.id])} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#2f6f49] px-3 text-sm font-medium text-white hover:bg-[#285e3f]"><UserRoundCheck className="size-4" />Request field confirmation</button>
              )}
              <Button variant="outline" render={<Link href={`/farms/${selected.id}`} />}>Review evidence</Button>
              <Button variant="outline" render={<Link href="/decisions/week-3-gap" />}>Find replacement supply</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function WeeklyChangesDecisionView() {
  const changes = [
    ["f1", "Yield estimate +12%", "Field photos support a larger harvestable block", "Medium"],
    ["f2", "Access evidence is now stale", "No field confirmation in 47 days", "High"],
    ["f3", "Collection split across 3 plots", "Truck sequence needs adjustment", "Medium"],
    ["f4", "Ownership document expired", "Commitment cannot be approved", "High"],
    ["f5", "Harvest moved 2 days later", "Maturity curve remains healthy", "Low"],
    ["f6", "Expected volume −18%", "Canopy decline detected on south edge", "High"],
    ["f7", "3 owner consents missing", "Pooled commitment remains blocked", "High"],
  ] as const;
  const [severity, setSeverity] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const visible = changes.filter((change) => severity === "All" || change[3] === severity);

  return (
    <AppShell view="recommendations">
      <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"><Link href="/">Monday workspace</Link><ChevronRight className="size-3" /><span>Weekly changes</span></div>
      <PageHeader eyebrow="Exceptions · This week" title="7 farms changed significantly" description="Only changes that can alter supply, timing, evidence confidence, or collection operations appear here." />
      <div className="mb-4 flex flex-wrap gap-2">
        {(["All", "High", "Medium", "Low"] as const).map((item) => <Button key={item} size="sm" variant={severity === item ? "default" : "outline"} onClick={() => setSeverity(item)}>{item}</Button>)}
        <Button className="ml-auto" variant="outline" render={<Link href="/schedule" />}><Truck className="size-4" />Review collection schedule</Button>
      </div>
      <Card className="shadow-none">
        <CardContent className="divide-y p-0">
          {visible.map(([id, title, detail, level]) => {
            const farm = farms.find((item) => item.id === id)!;
            const done = acknowledged.includes(id);
            return (
              <div key={id} className={cn("grid gap-3 p-4 sm:grid-cols-[1fr_140px_210px] sm:items-center", done && "bg-slate-50 opacity-70")}>
                <div><div className="flex flex-wrap items-center gap-2"><Link href={`/farms/${id}`} className="font-medium hover:underline">{farm.name}</Link><Badge className={level === "High" ? "bg-red-100 text-red-800" : level === "Medium" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"}>{level}</Badge></div><p className="mt-1 text-sm">{title}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>
                <p className="text-xs text-muted-foreground">{farm.updated}</p>
                <div className="flex gap-2"><Button size="sm" variant="outline" render={<Link href={`/farms/${id}`} />}>Inspect</Button><Button size="sm" variant={done ? "secondary" : "default"} onClick={() => setAcknowledged((items) => done ? items.filter((item) => item !== id) : [...items, id])}>{done ? "Reopen" : "Acknowledge"}</Button></div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </AppShell>
  );
}

function MissingEvidenceDecisionView() {
  const blocked = [
    { farm: farms[1], missing: "Current access-road photos", tons: 230 },
    { farm: farms[3], missing: "Ownership document and boundary photo", tons: 160 },
    { farm: farms[5], missing: "Canopy-loss ground observation", tons: 120 },
    { farm: farms[6], missing: "Three owner consent forms", tons: 90 },
    { farm: farms[2], missing: "Collection-point turning radius", tons: 90 },
  ];
  const [assigned, setAssigned] = useState<string[]>([]);
  return (
    <AppShell view="recommendations">
      <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"><Link href="/">Monday workspace</Link><ChevronRight className="size-3" /><span>Missing evidence</span></div>
      <PageHeader eyebrow="Decision · Evidence" title="5 decisions blocked by missing evidence" description="Resolve only the evidence that changes a procurement decision. The grouped route can unlock 690 tons." actions={<Button render={<Link href="/verification" />}><Route className="size-4" />Open Ravi’s route</Button>} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card className="shadow-none">
          <CardContent className="divide-y p-0">
            {blocked.map(({ farm, missing, tons }) => {
              const done = assigned.includes(farm.id);
              return (
                <div key={farm.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_80px_160px] sm:items-center">
                  <div><Link href={`/farms/${farm.id}`} className="font-medium hover:underline">{farm.name}</Link><p className="mt-1 text-xs text-muted-foreground">{missing}</p><p className="mt-1 text-xs text-amber-700">Needed before commitment approval</p></div>
                  <p className="font-semibold">{tons} t</p>
                  {done ? <Button size="sm" variant="outline" render={<Link href="/verification" />}><Check className="size-4" />View assigned visit</Button> : <Button size="sm" onClick={() => setAssigned((items) => [...items, farm.id])}>Assign to Ravi</Button>}
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader><CardTitle className="text-base">Evidence locations</CardTitle><p className="text-xs text-muted-foreground">Five stops grouped into three location clusters.</p></CardHeader>
          <CardContent><FarmMap farms={blocked.map((item) => item.farm)} height={360} /></CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function FarmEvidenceView({ farmId }: { farmId: string }) {
  const farm = farms.find((item) => item.id === farmId) ?? farms[0];
  const [evidenceView, setEvidenceView] = useState<"Current" | "Field" | "History">("Current");
  const details = {
    Current: [farm.maturity, farm.updated, "No unresolved geometry changes"],
    Field: [farm.evidence, "Ravi Kumar · latest observer", farm.risks.join(" · ")],
    History: [farm.history, "Previous harvest window met", "Commitment variance tracked across cycles"],
  };
  return (
    <AppShell view="recommendations">
      <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"><Link href="/decisions/week-3-gap">Recommendations</Link><ChevronRight className="size-3" /><span>{farm.name}</span></div>
      <PageHeader eyebrow="Farm evidence" title={farm.name} description={`${farm.owner} · ${farm.location} · ${farm.supply} tons expected during ${farm.window}`} actions={<><Button variant="outline" render={<Link href="/verification" />}>Send for verification</Button><Button render={<Link href="/compare" />}>Add to comparison</Button></>} />
      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <Card className="shadow-none"><CardHeader><CardTitle className="text-base">Location and region</CardTitle></CardHeader><CardContent><FarmMap farms={[farm]} selectedFarmId={farm.id} height={400} /></CardContent></Card>
        <Card className="shadow-none">
          <CardHeader><CardTitle className="text-base">Evidence record</CardTitle></CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">{(["Current", "Field", "History"] as const).map((view) => <Button key={view} size="sm" variant={evidenceView === view ? "default" : "outline"} onClick={() => setEvidenceView(view)}>{view}</Button>)}</div>
            <div className="space-y-3">{details[evidenceView].map((detail, index) => <div key={detail} className="flex gap-3 rounded-md bg-slate-50 p-3 text-sm"><CheckCircle2 className={cn("mt-0.5 size-4 shrink-0", index === 2 && farm.confidence === "Medium" ? "text-amber-600" : "text-emerald-600")} /><span>{detail}</span></div>)}</div>
            <div className="mt-5 rounded-md border p-3 text-xs leading-5"><strong>Recommendation connection:</strong> This evidence contributes to the farm’s {farm.score}/100 confidence score. Field findings replace older estimates when they conflict.</div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function VerificationView() {
  const visits = [
    { id: "f2", route: "Bhadrachalam", task: "Confirm access road and refresh field photos" },
    { id: "f4", route: "Paloncha", task: "Capture ownership evidence and boundary photo" },
    { id: "f3", route: "Suryapet", task: "Confirm collection-point turning radius" },
  ];
  const [selectedId, setSelectedId] = useState("f2");
  const [status, setStatus] = useState("In progress");
  const [notes, setNotes] = useState("");
  const [observation, setObservation] = useState("Supply estimate unchanged");
  const [photos, setPhotos] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const selectedVisit = visits.find((visit) => visit.id === selectedId)!;
  const farm = farms.find((item) => item.id === selectedId)!;

  return (
    <AppShell view="scenarios">
      <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"><Link href="/scenarios/confidence-first">Selected scenario</Link><ChevronRight className="size-3" /><span>Ravi’s verification route</span></div>
      <PageHeader eyebrow="Selective verification" title="Ravi’s grouped visit route" description="Three stops need evidence before the associated recommendation can move to commitment." />
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="space-y-3">
          {visits.map((visit, index) => (
            <button key={visit.id} type="button" onClick={() => { setSelectedId(visit.id); setSaved(false); }} className={cn("w-full rounded-md border bg-white p-4 text-left", selectedId === visit.id && "border-[#34704c] ring-1 ring-[#34704c]")}>
              <div className="flex items-center gap-2"><span className="grid size-6 place-items-center rounded-full bg-slate-100 text-xs font-semibold">{index + 1}</span><p className="font-medium">{visit.route}</p><Badge variant="secondary" className="ml-auto">{index === 0 ? status : "Scheduled"}</Badge></div>
              <p className="mt-2 text-sm">{farms.find((item) => item.id === visit.id)?.name}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{visit.task}</p>
            </button>
          ))}
          <FarmMap farms={visits.map((visit) => farms.find((farmItem) => farmItem.id === visit.id)!)} selectedFarmId={selectedId} onSelectFarm={setSelectedId} height={260} />
        </div>
        <Card className="shadow-none">
          <CardHeader><CardTitle className="text-base">Record findings · {farm.name}</CardTitle><p className="text-xs text-muted-foreground">{selectedVisit.task}</p></CardHeader>
          <CardContent className="space-y-5">
            <label className="block"><span className="text-sm font-medium">Visit status</span><select value={status} onChange={(event) => { setStatus(event.target.value); setSaved(false); }} className="mt-2 h-10 w-full rounded-md border bg-white px-3 text-sm"><option>Scheduled</option><option>In progress</option><option>Completed</option><option>Could not access</option></select></label>
            <label className="block"><span className="text-sm font-medium">Supply observation</span><select value={observation} onChange={(event) => { setObservation(event.target.value); setSaved(false); }} className="mt-2 h-10 w-full rounded-md border bg-white px-3 text-sm"><option>Supply estimate unchanged</option><option>Increase expected supply</option><option>Reduce expected supply</option><option>Hold recommendation</option></select></label>
            <label className="block"><span className="text-sm font-medium">Field notes</span><textarea value={notes} onChange={(event) => { setNotes(event.target.value); setSaved(false); }} placeholder="Record access, crop condition, owner confirmation, or collection constraints…" className="mt-2 min-h-28 w-full rounded-md border p-3 text-sm" /></label>
            <label className="block cursor-pointer rounded-md border border-dashed p-4 text-center"><Camera className="mx-auto size-5 text-muted-foreground" /><span className="mt-2 block text-sm font-medium">Add field photos</span><span className="mt-1 block text-xs text-muted-foreground">{photos.length ? photos.join(", ") : "JPG or PNG · linked to this farm’s evidence"}</span><input type="file" multiple accept="image/*" className="sr-only" onChange={(event) => { setPhotos(Array.from(event.target.files ?? []).map((file) => file.name)); setSaved(false); }} /></label>
            <button type="button" className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#2f6f49] px-4 text-sm font-medium text-white hover:bg-[#285e3f]" onClick={() => { setSaved(true); setStatus("Completed"); window.setTimeout(() => document.getElementById("findings-connected")?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50); }}><Save className="size-4" />Save findings to recommendation</button>
            {saved && <div id="findings-connected" aria-live="polite" className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><p className="font-medium">Findings connected</p><p className="mt-1 text-xs leading-5">The {observation.toLowerCase()} observation, {photos.length} photo(s), and Ravi’s notes now appear in {farm.name}’s evidence record.</p><div className="mt-3 flex gap-2"><Button size="sm" variant="outline" render={<Link href={`/farms/${farm.id}`} />}>View farm evidence</Button><Button size="sm" render={<Link href="/decisions/week-3-gap" />}>Return to recommendations</Button></div></div>}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function CollectionScheduleView() {
  const pickups = [
    { id: "f1", date: "Sep 19", slot: "07:00–10:00", tons: 140, truck: "TS 08 U 4821" },
    { id: "f2", date: "Sep 20", slot: "10:00–13:00", tons: 115, truck: "TS 04 V 9138" },
    { id: "f3", date: "Sep 21", slot: "06:00–09:00", tons: 95, truck: "TS 11 T 2064" },
    { id: "f4", date: "Sep 22", slot: "13:00–16:00", tons: 80, truck: "Unassigned" },
  ];
  const [date, setDate] = useState("All");
  const [mapMode, setMapMode] = useState(false);
  const [confirmed, setConfirmed] = useState<string[]>(["f1"]);
  const visible = pickups.filter((pickup) => date === "All" || pickup.date === date);
  return (
    <AppShell view="plan">
      <div className="mb-5 flex items-center gap-2 text-xs text-muted-foreground"><Link href="/plan">Procurement plan</Link><ChevronRight className="size-3" /><span>Collection schedule</span></div>
      <PageHeader eyebrow="Collection operations" title="Schedule collections from harvest readiness" description="Pickup windows are derived from expected harvest dates, field access, and the active procurement plan." actions={<button type="button" onClick={() => setMapMode((value) => !value)} className="inline-flex h-10 items-center gap-2 rounded-lg border bg-white px-4 text-sm font-medium hover:bg-slate-50">{mapMode ? <><CalendarDays className="size-4" />List view</> : <><MapPinned className="size-4" />Map view</>}</button>} />
      <div className="mb-4 flex flex-wrap gap-2">{["All", ...Array.from(new Set(pickups.map((pickup) => pickup.date)))].map((item) => <Button key={item} size="sm" variant={date === item ? "default" : "outline"} onClick={() => setDate(item)}>{item}</Button>)}</div>
      {mapMode ? <Card className="shadow-none"><CardContent className="p-4"><FarmMap farms={visible.map((pickup) => farms.find((farm) => farm.id === pickup.id)!)} height={520} /></CardContent></Card> : (
        <Card className="shadow-none"><CardContent className="divide-y p-0">{visible.map((pickup) => {
          const farm = farms.find((item) => item.id === pickup.id)!;
          const isConfirmed = confirmed.includes(pickup.id);
          return <div key={pickup.id} className="grid gap-3 p-4 sm:grid-cols-[120px_1fr_120px_160px] sm:items-center"><div><p className="font-semibold">{pickup.date}</p><p className="text-xs text-muted-foreground">{pickup.slot}</p></div><div><Link href={`/farms/${farm.id}`} className="font-medium hover:underline">{farm.name}</Link><p className="text-xs text-muted-foreground">{farm.location} · {pickup.truck}</p></div><p className="font-semibold">{pickup.tons} t</p><Button size="sm" variant={isConfirmed ? "secondary" : "default"} onClick={() => setConfirmed((items) => isConfirmed ? items.filter((id) => id !== pickup.id) : [...items, pickup.id])}>{isConfirmed ? "Reopen slot" : "Confirm pickup"}</Button></div>;
        })}</CardContent></Card>
      )}
    </AppShell>
  );
}

export function ProcurementWorkspace({
  view,
  selectedScenario,
  planStage,
  decision,
  farmId,
  operations,
  initialPeriod,
}: {
  view: View;
  selectedScenario?: string | null;
  planStage?: "active" | "disruption" | "recovered";
  decision?: DecisionType;
  farmId?: string;
  operations?: "verification" | "schedule";
  initialPeriod?: "current" | "next";
}) {
  if (farmId) return <FarmEvidenceView farmId={farmId} />;
  if (operations === "verification") return <VerificationView />;
  if (operations === "schedule") return <CollectionScheduleView />;
  if (decision === "commitments") return <CommitmentsDecisionView />;
  if (decision === "changes") return <WeeklyChangesDecisionView />;
  if (decision === "evidence") return <MissingEvidenceDecisionView />;
  if (view === "workspace") return <WorkspaceView initialPeriod={initialPeriod} />;
  if (view === "recommendations") return <RecommendationsView />;
  if (view === "comparison") return <ComparisonView />;
  if (view === "scenarios") return <ScenariosView initialScenario={selectedScenario} />;
  return <PlanView initialStage={planStage} />;
}
