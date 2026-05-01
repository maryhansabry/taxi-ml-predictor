import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Brain, Loader2, Trophy, Zap, Cpu, ArrowRight, Sparkles, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { api, type ModelsResponse, type PreviewResponse } from "@/lib/api";
import { useSessionState } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/models")({
  head: () => ({ meta: [{ title: "Model Hub — TaxiML" }] }),
  component: ModelsPage,
});

type Mode = "pretrained" | "train";

function ModelsPage() {
  const [preview] = useSessionState<PreviewResponse | null>("preview", null);
  const [mode, setMode] = useState<Mode>("pretrained");
  const [results, setResults] = useSessionState<ModelsResponse | null>("models", null);
  const [busy, setBusy] = useState(false);

  const loadPretrained = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".zip";
    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      setBusy(true);
      try {
        // Pass dataset_id only if available — backend handles both cases
        const r = await api.loadPretrained(file, preview?.dataset_id);
        setResults(r);
        toast.success(`Uploaded ${file.name} · best: ${r.best_model}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setBusy(false);
      }
    };
    fileInput.click();
  };

  const train = async () => {
    if (!preview) {
      toast.error("Upload a dataset first");
      return;
    }
    setBusy(true);
    try {
      const r = await api.trainModels(preview.dataset_id);
      setResults(r);
      toast.success(`Training complete · best: ${r.best_model}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Training failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 03 · Model Hub"
        title="Pretrained or freshly trained — your call"
        description="Load production-ready GBT, RF, and XGBoost weights, or kick off a fresh Spark training run on your dataset."
      />

      <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        {/* Mode selector */}
        <div className="grid md:grid-cols-2 gap-4">
          <ModeCard
            active={mode === "pretrained"}
            onClick={() => setMode("pretrained")}
            icon={Zap}
            title="Pretrained"
            tag="Default · Fast"
            desc="Use the GBT, RF, and XGBoost models already trained on the full NYC dataset. Instant results."
          />
          <ModeCard
            active={mode === "train"}
            onClick={() => setMode("train")}
            icon={Cpu}
            title="Train from scratch"
            tag="Spark · Heavy"
            desc="Run the Spark pipeline on your uploaded data. Splits, fits, evaluates and picks the best model."
          />
        </div>

        {/* Action card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          {mode === "pretrained" ? (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Load pretrained models</h3>
                <p className="text-sm text-muted-foreground mt-1">Upload a Spark PipelineModel ZIP file (must contain metadata/ and stages/).</p>
              </div>
              <button
                onClick={loadPretrained}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
              >
                {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</> : <><Zap className="h-4 w-4" /> Upload model ZIP</>}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2"><Brain className="h-5 w-5 text-primary" /> Train RF · GBT · XGBoost</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {preview ? <>Dataset: <span className="font-mono text-foreground">{preview.dataset_id.slice(0, 8)}</span> · {preview.rows.toLocaleString()} rows</> : "No dataset loaded — upload first."}
                </p>
              </div>
              <button
                onClick={train}
                disabled={busy || !preview}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
              >
                {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Training…</> : <><Cpu className="h-4 w-4" /> Train models</>}
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <>
            {/* Best model banner */}
            <div className="rounded-2xl border border-primary/40 bg-gradient-hero p-6 grid-pattern relative overflow-hidden shadow-glow">
              <div className="relative flex items-center gap-5">
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-primary shadow-glow">
                  <Trophy className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Best model</div>
                  <div className="text-3xl font-bold tracking-tight mt-0.5">{results.best_model}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Selected by lowest RMSE across {results.metrics.length} candidates · {results.mode === "pretrained" ? "Pretrained" : "Freshly trained"}
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/30 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Comparison</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="px-5 py-3 text-left font-medium">Model</th>
                    <th className="px-5 py-3 text-right font-medium">RMSE</th>
                    <th className="px-5 py-3 text-right font-medium">MAE</th>
                    <th className="px-5 py-3 text-right font-medium">R²</th>
                    {results.metrics.some((m) => m.train_seconds) && (
                      <th className="px-5 py-3 text-right font-medium">Train time</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {results.metrics.map((m) => {
                    const best = m.model === results.best_model;
                    return (
                      <tr key={m.model} className={cn("border-b border-border/50", best && "bg-primary/5")}>
                        <td className="px-5 py-3 font-semibold">
                          <div className="flex items-center gap-2">
                            {best && <Trophy className="h-3.5 w-3.5 text-primary" />}
                            {m.model}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right font-mono">{m.rmse.toFixed(2)}</td>
                        <td className="px-5 py-3 text-right font-mono">{m.mae.toFixed(2)}</td>
                        <td className="px-5 py-3 text-right font-mono">
                          <span className={best ? "text-primary font-semibold" : ""}>{m.r2.toFixed(3)}</span>
                        </td>
                        {results.metrics.some((x) => x.train_seconds) && (
                          <td className="px-5 py-3 text-right font-mono text-muted-foreground">
                            {m.train_seconds ? `${m.train_seconds.toFixed(1)}s` : "—"}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-4">
              <ChartCard title="RMSE & MAE (lower is better)">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={results.metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.022 250)" />
                    <XAxis dataKey="model" stroke="oklch(0.70 0.02 250)" fontSize={12} />
                    <YAxis stroke="oklch(0.70 0.02 250)" fontSize={12} />
                    <Tooltip contentStyle={{ background: "oklch(0.21 0.022 250)", border: "1px solid oklch(0.30 0.022 250)", borderRadius: 8 }} />
                    <Bar dataKey="rmse" fill="oklch(0.86 0.17 92)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="mae" fill="oklch(0.65 0.18 250)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="R² Score (higher is better)">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={results.metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.022 250)" />
                    <XAxis dataKey="model" stroke="oklch(0.70 0.02 250)" fontSize={12} />
                    <YAxis stroke="oklch(0.70 0.02 250)" fontSize={12} domain={[0, 1]} />
                    <Tooltip contentStyle={{ background: "oklch(0.21 0.022 250)", border: "1px solid oklch(0.30 0.022 250)", borderRadius: 8 }} />
                    <Bar dataKey="r2" radius={[6, 6, 0, 0]}>
                      {results.metrics.map((m) => (
                        <Cell key={m.model} fill={m.model === results.best_model ? "oklch(0.72 0.18 155)" : "oklch(0.65 0.18 250)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div className="flex justify-end">
              <Link
                to="/predict"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                Use {results.best_model} to predict <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function ModeCard({ active, onClick, icon: Icon, title, tag, desc }: {
  active: boolean; onClick: () => void; icon: React.ComponentType<{ className?: string }>;
  title: string; tag: string; desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left rounded-2xl border p-6 transition relative overflow-hidden",
        active
          ? "border-primary/60 bg-primary/5 shadow-glow"
          : "border-border bg-card hover:border-primary/30",
      )}
    >
      {active && <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary shadow-glow" />}
      <div className={cn("grid h-10 w-10 place-items-center rounded-lg", active ? "bg-gradient-primary" : "bg-secondary")}>
        <Icon className={cn("h-5 w-5", active ? "text-primary-foreground" : "text-foreground")} />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border rounded-full px-2 py-0.5">{tag}</span>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
    </button>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
