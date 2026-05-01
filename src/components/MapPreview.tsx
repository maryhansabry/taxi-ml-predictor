import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L, { LatLng, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

/* FIX ICON */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface Props {
  pickup: LatLng | null;
  dropoff: LatLng | null;
  setPickup: (p: LatLng) => void;
  setDropoff: (p: LatLng) => void;
  singleSelect?: "pickup" | "dropoff" | null;
  onRouteReady?: (data: { distance_km: number; duration_min: number }) => void;
}

/* CLICK */
function MapEvents({ pickup, dropoff, setPickup, setDropoff, singleSelect }: Props) {
  useMapEvents({
    click(e) {
      if (singleSelect === "pickup") return setPickup(e.latlng);
      if (singleSelect === "dropoff") return setDropoff(e.latlng);

      if (!pickup) setPickup(e.latlng);
      else if (!dropoff) setDropoff(e.latlng);
    },
  });
  return null;
}

/* 🔥 API KEY */
const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjI0NTgwYWI4ZTQ5MDRmODRiMGNhNmY3NTlmYThhN2Y2IiwiaCI6Im11cm11cjY0In0=";

/* ROUTE FETCH */
async function getRoute(pickup: LatLng, dropoff: LatLng) {
  try {
    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: [
            [pickup.lng, pickup.lat],
            [dropoff.lng, dropoff.lat],
          ],
        }),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();

    const coords = data.features?.[0]?.geometry?.coordinates;
    const summary = data.features?.[0]?.properties?.summary;

    if (!coords) return null;

    return {
      latlngs: coords.map(([lng, lat]: [number, number]) => [lat, lng]),
      distance_km: summary.distance / 1000,
      duration_min: summary.duration / 60,
    };
  } catch {
    return null;
  }
}

/* DRAW ROUTE */
function Routing({
  pickup,
  dropoff,
  onRouteReady,
}: {
  pickup: LatLng | null;
  dropoff: LatLng | null;
  onRouteReady?: (d: any) => void;
}) {
  const map = useMap();
  const ref = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (ref.current) {
      map.removeLayer(ref.current);
      ref.current = null;
    }

    if (!pickup || !dropoff) return;

    let cancelled = false;

    (async () => {
      const route = await getRoute(pickup, dropoff);

      if (cancelled) return;

      if (route) {
        ref.current = L.polyline(route.latlngs, {
          color: "#6366f1",
          weight: 5,
        }).addTo(map);

        onRouteReady?.({
          distance_km: route.distance_km,
          duration_min: route.duration_min,
        });
      } else {
        ref.current = L.polyline(
          [
            [pickup.lat, pickup.lng],
            [dropoff.lat, dropoff.lng],
          ],
          { dashArray: "6 10" }
        ).addTo(map);
      }
    })();

    return () => {
      cancelled = true;
      if (ref.current) map.removeLayer(ref.current);
    };
  }, [pickup, dropoff, map]);

  return null;
}

/* MAIN */
export default function MapPreview({
  pickup,
  dropoff,
  setPickup,
  setDropoff,
  singleSelect,
  onRouteReady,
}: Props) {
  const pickupRef = useRef<LeafletMarker<any>>(null);
  const dropoffRef = useRef<LeafletMarker<any>>(null);

  return (
    <MapContainer center={[30.0444, 31.2357]} zoom={13} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MapEvents
        pickup={pickup}
        dropoff={dropoff}
        setPickup={setPickup}
        setDropoff={setDropoff}
        singleSelect={singleSelect}
      />

      <Routing pickup={pickup} dropoff={dropoff} onRouteReady={onRouteReady} />

      {pickup && (
        <Marker
          position={pickup}
          ref={pickupRef}
          draggable
          eventHandlers={{
            dragend: () => {
              const pos = pickupRef.current?.getLatLng();
              if (pos) setPickup(pos);
            },
          }}
        />
      )}

      {dropoff && (
        <Marker
          position={dropoff}
          ref={dropoffRef}
          draggable
          eventHandlers={{
            dragend: () => {
              const pos = dropoffRef.current?.getLatLng();
              if (pos) setDropoff(pos);
            },
          }}
        />
      )}
    </MapContainer>
  );
}