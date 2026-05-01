import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { api, type ModelsResponse, type PredictResponse } from "@/lib/api";
import { useSessionState } from "@/lib/session";
import type { LatLng } from "leaflet";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MapPreview = lazy(() => import("@/components/MapPreview"));

export const Route = createFileRoute("/predict")({
  component: PredictPage,
});

function PredictPage() {
  const [models] = useSessionState<ModelsResponse | null>("models", null);
  const [chosen, setChosen] = useState("GBT");

  const [pickup,  setPickup]  = useState<LatLng | null>(null);
  const [dropoff, setDropoff] = useState<LatLng | null>(null);

  const [showMap, setShowMap] = useState<"pickup" | "dropoff" | null>(null);

  const [passengers,  setPassengers]  = useState(1);
  const [pickupTime,  setPickupTime]  = useState<Date>(new Date());

  const [busy,   setBusy]   = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
  distance_km: number;
  duration_min: number;
} | null>(null);
  useEffect(() => {
    if (models?.best_model) setChosen(models.best_model);
  }, [models]);

  const runPrediction = async () => {
    if (!pickup || !dropoff) {
      toast.error("Choose pickup & dropoff first");
      return;
    }
    setBusy(true);
    try {
      const res = await api.predictSingle({
        vendor_id:          1,
        passenger_count:    passengers,
        pickup_datetime:    pickupTime.toISOString(),
        pickup_latitude:    pickup.lat,
        pickup_longitude:   pickup.lng,
        dropoff_latitude:   dropoff.lat,
        dropoff_longitude:  dropoff.lng,
        store_and_fwd_flag: "N",
        model:              chosen,
      });
      setResult(res);
      toast.success("Prediction done 🚖");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Prediction error");
    } finally {
      setBusy(false);
    }
  };

  const availableModels = models?.metrics.map((m) => m.model) ?? ["GBT", "RandomForest", "XGBoost"];

  return (
    <AppShell>
      <PageHeader title="Predict Trip" />

      {/* FORM */}
      <div className="max-w-md mx-auto mt-6 space-y-4">

        {/* MODEL */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Model</label>
          <div className="flex flex-wrap gap-2">
            {availableModels.map((m) => (
              <button
                key={m}
                onClick={() => setChosen(m)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  chosen === m
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/30 hover:border-primary/40"
                }`}
              >
                {m}
                {models?.best_model === m && (
                  <span className="ml-1 text-[9px] uppercase tracking-widest text-primary">best</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* DATE PICKER */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pickup Time</label>
          <DatePicker
            selected={pickupTime}
            onChange={(date: Date | null) => { if (date) setPickupTime(date); }}
            showTimeSelect
            timeIntervals={5}
            dateFormat="yyyy-MM-dd HH:mm"
            className="w-full border rounded-xl px-3 py-2"
          />
        </div>

        {/* PASSENGERS */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Passengers</label>
          <select
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="w-full border p-3 rounded-xl"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} passengers</option>
            ))}
          </select>
        </div>

        {/* PICKUP */}
        <button
          onClick={() => setShowMap("pickup")}
          className="w-full border p-3 rounded-xl text-left"
        >
          {pickup
            ? `📍 Pickup: ${pickup.lat.toFixed(5)}, ${pickup.lng.toFixed(5)} ✔️`
            : "📍 Select Pickup on map"}
        </button>
        {routeInfo && (
  <div className="text-center text-sm text-gray-600">
    🚗 {routeInfo.distance_km.toFixed(2)} km · ⏱ {routeInfo.duration_min.toFixed(1)} min
  </div>
)}

        {/* DROPOFF */}
        <button
          onClick={() => setShowMap("dropoff")}
          className="w-full border p-3 rounded-xl text-left"
        >
          {dropoff
            ? `🏁 Dropoff: ${dropoff.lat.toFixed(5)}, ${dropoff.lng.toFixed(5)} ✔️`
            : "🏁 Select Dropoff on map"}
        </button>

        {/* PREDICT */}
        <button
          onClick={runPrediction}
          disabled={busy || !pickup || !dropoff}
          className="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
        >
          {busy ? <Loader2 className="animate-spin mx-auto" /> : "Predict"}
        </button>

        {/* RESULT */}
        {result && (
          <div className="text-center rounded-2xl border border-primary/40 bg-primary/5 p-6 space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Predicted duration</div>
            <div className="text-5xl font-bold">
              {(result.predictions[0].prediction / 60).toFixed(1)}
              <span className="text-xl font-normal text-muted-foreground ml-1">min</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {result.predictions[0].prediction.toFixed(0)} sec · {chosen}
            </div>
          </div>
        )}
      </div>

      {/* MAP MODAL */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] h-[80%] rounded-xl overflow-hidden relative">

            {/* Close */}
            <button
              onClick={() => setShowMap(null)}
              className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow z-[9999]"
            >
              ✕
            </button>

            {/* Hint */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs rounded-full px-4 py-1.5 z-[9999] pointer-events-none">
              {showMap === "pickup" ? "Click to set 📍 Pickup" : "Click to set 🏁 Dropoff"}
            </div>

            <Suspense fallback={<div className="h-full bg-gray-200" />}>
              <MapPreview
                pickup={pickup}
                dropoff={dropoff}
                setPickup={setPickup}
                setDropoff={setDropoff}
                singleSelect={showMap}
                onRouteReady={setRouteInfo}
              />
            </Suspense>

            {/* OK */}
            <button
              onClick={() => setShowMap(null)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-xl z-[9999]"
            >
              OK ✔️
            </button>
            
          </div>
        </div>
        
      )}
    </AppShell>
  );
}
