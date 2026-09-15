import { ProcurementWorkspace } from "@/components/procurement-workspace";

export default async function PlanStage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage } = await params;
  const planStage = stage === "recovered" ? "recovered" : "disruption";

  return <ProcurementWorkspace view="plan" planStage={planStage} />;
}
