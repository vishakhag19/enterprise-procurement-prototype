"use client";

import { useEffect, useRef, useState } from "react";

export type MapFarm = {
  id: string;
  name: string;
  location: string;
  region: string;
  supply: number;
  confidence: "High" | "Medium";
  lat: number;
  lng: number;
};

const regions = [
  { name: "North cluster", center: [17.55, 80.63] as [number, number], radius: 26000, color: "#2563eb" },
  { name: "River cluster", center: [17.67, 80.89] as [number, number], radius: 19000, color: "#7c3aed" },
  { name: "West cluster", center: [17.14, 79.62] as [number, number], radius: 21000, color: "#d97706" },
  { name: "Central cluster", center: [17.22, 80.27] as [number, number], radius: 23000, color: "#0891b2" },
  { name: "South cluster", center: [16.77, 80.29] as [number, number], radius: 18000, color: "#be123c" },
];

export function FarmMap({
  farms,
  selectedFarmId,
  onSelectFarm,
  height = 340,
}: {
  farms: MapFarm[];
  selectedFarmId?: string;
  onSelectFarm?: (farmId: string) => void;
  height?: number;
}) {
  const mapNode = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const farmsKey = farms.map((farm) => `${farm.id}:${farm.lat}:${farm.lng}`).join("|");
  const farmsRef = useRef(farms);
  const selectRef = useRef(onSelectFarm);
  farmsRef.current = farms;
  selectRef.current = onSelectFarm;

  useEffect(() => {
    let disposed = false;
    let removeMap: (() => void) | undefined;
    const farmData = farmsRef.current;

    import("leaflet")
      .then((L) => {
        if (disposed || !mapNode.current) return;
        const selected = farmData.find((farm) => farm.id === selectedFarmId);
        const map = L.map(mapNode.current, {
          center: selected ? [selected.lat, selected.lng] : [17.42, 80.34],
          zoom: selected ? 10 : 8,
          scrollWheelZoom: true,
          zoomControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        regions.forEach((region) => {
          L.circle(region.center, {
            radius: region.radius,
            color: region.color,
            fillColor: region.color,
            fillOpacity: 0.06,
            weight: 1.5,
            dashArray: "5 5",
          }).bindTooltip(region.name, { sticky: true }).addTo(map);
        });

        farmData.forEach((farm) => {
          const isSelected = farm.id === selectedFarmId;
          const color = farm.confidence === "High" ? "#247149" : "#d97706";
          const marker = L.circleMarker([farm.lat, farm.lng], {
            radius: isSelected ? 11 : 8,
            color: isSelected ? "#0f172a" : "#ffffff",
            fillColor: color,
            fillOpacity: 0.95,
            weight: isSelected ? 3 : 2,
          })
            .bindTooltip(`<strong>${farm.name}</strong><br>${farm.supply} t · ${farm.confidence} confidence`, { direction: "top" })
            .bindPopup(`<div class="min-w-44"><strong>${farm.name}</strong><p>${farm.location}</p><p>${farm.supply} t · ${farm.region}</p><a href="/farms/${farm.id}" class="font-semibold text-emerald-800">Open farm evidence →</a></div>`)
            .on("click", () => selectRef.current?.(farm.id))
            .addTo(map);
          if (isSelected) marker.openTooltip();
        });

        window.setTimeout(() => map.invalidateSize(), 0);
        removeMap = () => map.remove();
        setStatus("ready");
      })
      .catch(() => {
        if (!disposed) setStatus("error");
      });

    return () => {
      disposed = true;
      removeMap?.();
    };
  }, [farmsKey, selectedFarmId]);

  return (
    <div className="relative overflow-hidden rounded-md border bg-slate-100" style={{ height }}>
      <div ref={mapNode} className="h-full w-full" aria-label="Interactive farm location map" />
      {status === "loading" && <div className="pointer-events-none absolute inset-0 grid place-items-center bg-slate-100 text-sm text-muted-foreground">Loading farm map…</div>}
      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-slate-50 p-6 text-center">
          <div><p className="font-medium">Map tiles are unavailable</p><p className="mt-1 text-xs text-muted-foreground">Use the farm location list while the map reconnects.</p></div>
        </div>
      )}
    </div>
  );
}
