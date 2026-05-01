import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BBLD3qyQ.js";
import { L as Link, t as toast } from "./router-Cg_aAj9c.js";
import { c as createLucideIcon, A as AppShell, P as PageHeader, U as Upload, a as api } from "./AppShell-DYzb_3YL.js";
import { u as useSessionState, L as LoaderCircle } from "./session-BRW8cHcN.js";
import { D as Database } from "./database-BU0PD75J.js";
import { A as ArrowRight } from "./arrow-right-DlcMmi2Z.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode);
function UploadPage() {
  const [preview, setPreview] = useSessionState("preview", null);
  const [busy, setBusy] = reactExports.useState(false);
  const [drag, setDrag] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const handleFile = async (file) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a .csv file");
      return;
    }
    setBusy(true);
    try {
      const res = await api.uploadCsv(file);
      setPreview(res);
      toast.success(`Loaded ${res.rows.toLocaleString()} rows`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Step 01", title: "Upload your dataset", description: "Drop the NYC taxi CSV (or any compatible trip dataset). We'll parse the schema and show a preview." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-6 py-10 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onDragOver: (e) => {
        e.preventDefault();
        setDrag(true);
      }, onDragLeave: () => setDrag(false), onDrop: (e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) void handleFile(f);
      }, className: `rounded-2xl border-2 border-dashed p-12 text-center transition ${drag ? "border-primary bg-primary/5" : "border-border bg-card/40"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-primary shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-6 w-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 text-lg font-semibold", children: "Drop CSV here" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "or click to browse — up to a few hundred MB" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: inputRef, type: "file", accept: ".csv", className: "hidden", onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => inputRef.current?.click(), disabled: busy, className: "mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50", children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          " Uploading…"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
          " Choose file"
        ] }) })
      ] }),
      preview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Rows", value: preview.rows.toLocaleString(), icon: Database }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Columns", value: String(preview.columns.length), icon: FileText }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Dataset ID", value: preview.dataset_id.slice(0, 8), mono: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Status", value: "Ready", success: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border bg-secondary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Schema" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-px bg-border", children: preview.schema.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card px-4 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono text-foreground", children: s.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-primary/80 mt-0.5", children: s.type })
          ] }, s.name)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border bg-secondary/30 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold", children: [
            "Preview · first ",
            preview.preview.length,
            " rows"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-secondary/20", children: preview.columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-mono font-medium text-muted-foreground whitespace-nowrap", children: c }, c)) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: preview.preview.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/50 hover:bg-secondary/20", children: preview.columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono whitespace-nowrap", children: String(row[c] ?? "—") }, c)) }, i)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/preprocess", className: "inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow", children: [
          "Continue to Preprocessing ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) })
      ] })
    ] })
  ] });
}
function Stat({
  label,
  value,
  icon: Icon,
  mono,
  success
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: label }),
      Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 text-primary" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-2 text-xl font-semibold ${mono ? "font-mono" : ""} ${success ? "text-success" : ""}`, children: value })
  ] });
}
export {
  UploadPage as component
};
