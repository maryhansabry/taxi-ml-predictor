import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Loader2, ArrowRight, CheckCircle2, AlertCircle, Filter, Wrench, Hash, MapPin, Clock, Calendar, Route as RouteIcon } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { api, type PreviewResponse, type CleanResponse } from "@/lib/api";
import { useSessionState } from "@/lib/session";

export const Route = createFileRoute("/preprocess")({
  head: () => ({ meta: [{ title: "Preprocessing — TaxiML" }] }),
  component: PreprocessPage,
});

type Step = { name: string; detail?: string; icon: React.ComponentType<{ className?: string }> };
const CLEANING: Step[] = [
  { name: "Drop trip_duration outliers", detail: "Keep trips between 60s and 9000s", icon: Filter },
  { name: "Filter NYC bounding box", detail: "Lat 40–41, Lng -74.5…-73", icon: MapPin }, // حدثنا الأرقام هنا
  { name: "Drop duplicates", detail: "Remove repeated rows", icon: Filter },
];

const FEATURES: Step[] = [
  { name: "Time Features", detail: "Hour, Day, Month, Weekend", icon: Clock },
  { name: "Haversine Distance", detail: "Great-circle distance (km)", icon: RouteIcon },
  { name: "Manhattan Distance", detail: "Absolute coordinate difference", icon: MapPin }, // خطوة جديدة
  { name: "Direction", detail: "Bearing angle of the trip", icon: Sparkles }, // خطوة جديدة
];

const ENCODING: Step[] = [
  { name: "StringIndex store_and_fwd_flag", detail: "Categorical → numeric for Spark MLlib", icon: Hash },
];

function PreprocessPage() {
  const [preview] = useSessionState<PreviewResponse | null>("preview", null);
  const [clean, setClean] = useSessionState<CleanResponse | null>("clean", null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!preview) {
      toast.error("Upload a dataset first");
      return;
    }
    setBusy(true);
    try {
      const res = await api.preprocess(preview.dataset_id);
      setClean(res);
      toast.success("Preprocessing complete");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Preprocessing failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 02"
        title="Preprocess & engineer features"
        description="Run the Spark pipeline that cleans outliers and constructs the features used by the models."
      />

      <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        {!preview && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">No dataset loaded</div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Upload a CSV first to enable preprocessing.{" "}
                <Link to="/upload" className="text-primary underline-offset-4 hover:underline">Go to Upload →</Link>
              </p>
            </div>
          </div>
        )}

        {/* Run bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">Spark preprocessing pipeline</div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cleans the raw data and engineers all features in a single pass.
              </p>
            </div>
          </div>
          <button
            onClick={run}
            disabled={busy || !preview}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
          >
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Running…</> : <><Sparkles className="h-4 w-4" /> Run pipeline</>}
          </button>
        </div>

        {/* 3 stages side by side */}
        <div className="grid lg:grid-cols-3 gap-5">
          <StageCard
            n="A"
            title="Cleaning"
            description="Remove noise and invalid rows."
            steps={CLEANING}
            done={!!clean}
            tone="cleaning"
          />
          <StageCard
            n="B"
            title="Feature Engineering"
            description="Construct predictive signals."
            steps={FEATURES}
            done={!!clean}
            tone="features"
          />
          <StageCard
            n="C"
            title="Encoding"
            description="Make data ML-ready."
            steps={ENCODING}
            done={!!clean}
            tone="encoding"
          />
        </div>

        {/* Result */}
        {clean && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ResultStat label="Rows before" value={clean.rows_before.toLocaleString()} />
              <ResultStat label="Rows after" value={clean.rows_after.toLocaleString()} highlight />
              <ResultStat label="Rows removed" value={(clean.rows_before - clean.rows_after).toLocaleString()} />
              <ResultStat label="New features" value={String(clean.features_added.length)} />
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/30">
                <h3 className="text-sm font-semibold">Engineered features</h3>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {clean.features_added.map((f) => (
                  <span key={f} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary">{f}</span>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/models"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                Continue to Model Hub <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function StageCard({ n, title, description, steps, done, tone }: {
  n: string;
  title: string;
  description: string;
  steps: Step[];
  done: boolean;
  tone: "cleaning" | "features" | "encoding";
}) {
  const accent = {
    cleaning: "from-chart-2/20 to-transparent border-chart-2/30",
    features: "from-primary/20 to-transparent border-primary/40",
    encoding: "from-chart-4/20 to-transparent border-chart-4/30",
  }[tone];
  return (
    <div className={`rounded-2xl border bg-card shadow-card overflow-hidden ${tone === "features" ? "border-primary/40" : "border-border"}`}>
      <div className={`bg-gradient-to-br ${accent} px-5 py-4 border-b ${tone === "features" ? "border-primary/30" : "border-border"}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Stage {n}</div>
            <div className="mt-1 text-base font-semibold">{title}</div>
          </div>
          {done && <CheckCircle2 className="h-5 w-5 text-success" />}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <ul className="p-4 space-y-2">
        {steps.map((s) => (
          <li key={s.name} className="flex items-start gap-3 rounded-lg border border-border/60 bg-secondary/20 px-3 py-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-card text-primary shrink-0">
              <s.icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium">{s.name}</div>
              {s.detail && <div className="text-[11px] text-muted-foreground mt-0.5">{s.detail}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-2 text-2xl font-bold ${highlight ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}
