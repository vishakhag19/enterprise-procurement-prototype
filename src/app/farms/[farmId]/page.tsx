import { ProcurementWorkspace } from "@/components/procurement-workspace";

export default async function FarmEvidence({
  params,
}: {
  params: Promise<{ farmId: string }>;
}) {
  const { farmId } = await params;

  return <ProcurementWorkspace view="recommendations" farmId={farmId} />;
}
