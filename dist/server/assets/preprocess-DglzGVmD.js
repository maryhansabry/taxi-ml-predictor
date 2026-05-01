import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-BBLD3qyQ.js";
import { L as Link, t as toast } from "./router-Cg_aAj9c.js";
import { c as createLucideIcon, A as AppShell, P as PageHeader, S as Sparkles, a as api } from "./AppShell-DYzb_3YL.js";
import { u as useSessionState, L as LoaderCircle } from "./session-BRW8cHcN.js";
import { A as ArrowRight } from "./arrow-right-DlcMmi2Z.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$7 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$7);
const __iconNode$6 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$6);
const __iconNode$5 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
];
const Clock = createLucideIcon("clock", __iconNode$5);
const __iconNode$4 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$4);
const __iconNode$3 = [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }]
];
const Hash = createLucideIcon("hash", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$2);
const __iconNode$1 = [
  ["circle", { cx: "6", cy: "19", r: "3", key: "1kj8tv" }],
  ["path", { d: "M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15", key: "1d8sl" }],
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }]
];
const Route = createLucideIcon("route", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
      key: "1ngwbx"
    }
  ]
];
const Wrench = createLucideIcon("wrench", __iconNode);
const CLEANING = [
  {
    name: "Drop trip_duration outliers",
    detail: "Keep trips between 60s and 9000s",
    icon: Funnel
  },
  {
    name: "Filter NYC bounding box",
    detail: "Lat 40–41, Lng -74.5…-73",
    icon: MapPin
  },
  // حدثنا الأرقام هنا
  {
    name: "Drop duplicates",
    detail: "Remove repeated rows",
    icon: Funnel
  }
];
const FEATURES = [
  {
    name: "Time Features",
    detail: "Hour, Day, Month, Weekend",
    icon: Clock
  },
  {
    name: "Haversine Distance",
    detail: "Great-circle distance (km)",
    icon: Route
  },
  {
    name: "Manhattan Distance",
    detail: "Absolute coordinate difference",
    icon: MapPin
  },
  // خطوة جديدة
  {
    name: "Direction",
    detail: "Bearing angle of the trip",
    icon: Sparkles
  }
  // خطوة جديدة
];
const ENCODING = [{
  name: "StringIndex store_and_fwd_flag",
  detail: "Categorical → numeric for Spark MLlib",
  icon: Hash
}];
function PreprocessPage() {
  const [preview] = useSessionState("preview", null);
  const [clean, setClean] = useSessionState("clean", null);
  const [busy, setBusy] = reactExports.useState(false);
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
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Preprocessing failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Step 02", title: "Preprocess & engineer features", description: "Run the Spark pipeline that cleans outliers and constructs the features used by the models." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-6 py-10 space-y-8", children: [
      !preview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-destructive shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "No dataset loaded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
            "Upload a CSV first to enable preprocessing.",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/upload", className: "text-primary underline-offset-4 hover:underline", children: "Go to Upload →" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3 rounded-2xl border border-border bg-card p-5 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Spark preprocessing pipeline" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Cleans the raw data and engineers all features in a single pass." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: run, disabled: busy || !preview, className: "inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50", children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          " Running…"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
          " Run pipeline"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StageCard, { n: "A", title: "Cleaning", description: "Remove noise and invalid rows.", steps: CLEANING, done: !!clean, tone: "cleaning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StageCard, { n: "B", title: "Feature Engineering", description: "Construct predictive signals.", steps: FEATURES, done: !!clean, tone: "features" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StageCard, { n: "C", title: "Encoding", description: "Make data ML-ready.", steps: ENCODING, done: !!clean, tone: "encoding" })
      ] }),
      clean && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultStat, { label: "Rows before", value: clean.rows_before.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultStat, { label: "Rows after", value: clean.rows_after.toLocaleString(), highlight: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultStat, { label: "Rows removed", value: (clean.rows_before - clean.rows_after).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResultStat, { label: "New features", value: String(clean.features_added.length) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border bg-secondary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Engineered features" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 flex flex-wrap gap-2", children: clean.features_added.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary", children: f }, f)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/models", className: "inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow", children: [
          "Continue to Model Hub ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) })
      ] })
    ] })
  ] });
}
function StageCard({
  n,
  title,
  description,
  steps,
  done,
  tone
}) {
  const accent = {
    cleaning: "from-chart-2/20 to-transparent border-chart-2/30",
    features: "from-primary/20 to-transparent border-primary/40",
    encoding: "from-chart-4/20 to-transparent border-chart-4/30"
  }[tone];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl border bg-card shadow-card overflow-hidden ${tone === "features" ? "border-primary/40" : "border-border"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-gradient-to-br ${accent} px-5 py-4 border-b ${tone === "features" ? "border-primary/30" : "border-border"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[10px] uppercase tracking-widest text-muted-foreground", children: [
            "Stage ",
            n
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-base font-semibold", children: title })
        ] }),
        done && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-success" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-xs text-muted-foreground", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "p-4 space-y-2", children: steps.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 rounded-lg border border-border/60 bg-secondary/20 px-3 py-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-7 w-7 place-items-center rounded-md bg-card text-primary shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: s.name }),
        s.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground mt-0.5", children: s.detail })
      ] })
    ] }, s.name)) })
  ] });
}
function ResultStat({
  label,
  value,
  highlight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border p-4 ${highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-2 text-2xl font-bold ${highlight ? "text-primary" : ""}`, children: value })
  ] });
}
export {
  PreprocessPage as component
};
