import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload as UploadIcon, FileText, ArrowRight, Loader2, Database } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { api, type PreviewResponse } from "@/lib/api";
import { useSessionState } from "@/lib/session";

export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [{ title: "Upload — TaxiML" }] }),
  component: UploadPage,
});

function UploadPage() {
  const [preview, setPreview] = useSessionState<PreviewResponse | null>("preview", null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a .csv file");
      return;
    }
    setBusy(true);
    try {
      const res = await api.uploadCsv(file);
      setPreview(res);
      toast.success(`Loaded ${res.rows.toLocaleString()} rows`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Step 01"
        title="Upload your dataset"
        description="Drop the NYC taxi CSV (or any compatible trip dataset). We'll parse the schema and show a preview."
      />

      <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        {/* Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f) void handleFile(f);
          }}
          className={`rounded-2xl border-2 border-dashed p-12 text-center transition ${
            drag ? "border-primary bg-primary/5" : "border-border bg-card/40"
          }`}
        >
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-primary shadow-glow">
            <UploadIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="mt-5 text-lg font-semibold">Drop CSV here</h3>
          <p className="mt-1 text-sm text-muted-foreground">or click to browse — up to a few hundred MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
          >
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</> : <><FileText className="h-4 w-4" /> Choose file</>}
          </button>
        </div>

        {/* Preview */}
        {preview && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Stat label="Rows" value={preview.rows.toLocaleString()} icon={Database} />
              <Stat label="Columns" value={String(preview.columns.length)} icon={FileText} />
              <Stat label="Dataset ID" value={preview.dataset_id.slice(0, 8)} mono />
              <Stat label="Status" value="Ready" success />
            </div>

            {/* Schema */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/30">
                <h3 className="text-sm font-semibold">Schema</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border">
                {preview.schema.map((s) => (
                  <div key={s.name} className="bg-card px-4 py-2.5">
                    <div className="text-xs font-mono text-foreground">{s.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-primary/80 mt-0.5">{s.type}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Preview · first {preview.preview.length} rows</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-secondary/20">
                      {preview.columns.map((c) => (
                        <th key={c} className="px-3 py-2 text-left font-mono font-medium text-muted-foreground whitespace-nowrap">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.preview.map((row, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-secondary/20">
                        {preview.columns.map((c) => (
                          <td key={c} className="px-3 py-2 font-mono whitespace-nowrap">
                            {String(row[c] ?? "—")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/preprocess"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
              >
                Continue to Preprocessing <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Stat({ label, value, icon: Icon, mono, success }: {
  label: string; value: string; icon?: React.ComponentType<{ className?: string }>; mono?: boolean; success?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
        {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
      </div>
      <div className={`mt-2 text-xl font-semibold ${mono ? "font-mono" : ""} ${success ? "text-success" : ""}`}>
        {value}
      </div>
    </div>
  );
}
