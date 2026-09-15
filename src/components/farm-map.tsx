"use client";

import { Circle, CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import { useEffect } from "react";

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

function FocusFarm({ farm }: { farm?: MapFarm }) {
  const map = useMap();

  useEffect(() => {
    if (farm) map.flyTo([farm.lat, farm.lng], 10, { duration: 0.7 });
  }, [farm, map]);

  return null;
}

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
  const selectedFarm = farms.find((farm) => farm.id === selectedFarmId);

  return (
    <div className="overflow-hidden rounded-md border bg-slate-100" style={{ height }}>
      <MapContainer
        center={[17.42, 80.34]}
        zoom={8}
        scrollWheelZoom
        className="h-full w-full"
        aria-label="Interactive farm location map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {regions.map((region) => (
          <Circle
            key={region.name}
            center={region.center}
            radius={region.radius}
            pathOptions={{ color: region.color, fillColor: region.color, fillOpacity: 0.06, weight: 1.5, dashArray: "5 5" }}
          >
            <Tooltip sticky>{region.name}</Tooltip>
          </Circle>
        ))}
        {farms.map((farm) => {
          const selected = farm.id === selectedFarmId;
          const color = farm.confidence === "High" ? "#247149" : "#d97706";
          return (
            <CircleMarker
              key={farm.id}
              center={[farm.lat, farm.lng]}
              radius={selected ? 11 : 8}
              pathOptions={{ color: selected ? "#0f172a" : "#ffffff", fillColor: color, fillOpacity: 0.95, weight: selected ? 3 : 2 }}
              eventHandlers={{ click: () => onSelectFarm?.(farm.id) }}
            >
              <Tooltip direction="top" offset={[0, -8]}>
                <strong>{farm.name}</strong><br />{farm.supply} t · {farm.confidence} confidence
              </Tooltip>
              <Popup>
                <div className="min-w-44">
                  <strong>{farm.name}</strong>
                  <p>{farm.location}</p>
                  <p>{farm.supply} t · {farm.region}</p>
                  <a href={`/farms/${farm.id}`} className="font-semibold text-emerald-800">Open farm evidence →</a>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
        <FocusFarm farm={selectedFarm} />
      </MapContainer>
    </div>
  );
}
