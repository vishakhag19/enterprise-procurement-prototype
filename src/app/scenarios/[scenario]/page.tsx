import { ProcurementWorkspace } from "@/components/procurement-workspace";

const scenarioNames: Record<string, string> = {
  "current-constraints": "Current constraints",
  "coverage-first": "Coverage first",
  "confidence-first": "Confidence first",
  "regional-resilience": "Regional resilience",
};

export default async function SelectedScenario({
  params,
}: {
  params: Promise<{ scenario: string }>;
}) {
  const { scenario } = await params;

  return (
    <ProcurementWorkspace
      view="scenarios"
      selectedScenario={scenarioNames[scenario] ?? "Confidence first"}
    />
  );
}
