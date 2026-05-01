import { U as jsxRuntimeExports } from "./worker-entry-BBLD3qyQ.js";
import { L as Link } from "./router-Cg_aAj9c.js";
import { c as createLucideIcon, A as AppShell, P as PageHeader, T as Target, S as Sparkles, B as Brain, Z as Zap } from "./AppShell-DYzb_3YL.js";
import { A as ArrowRight } from "./arrow-right-DlcMmi2Z.js";
import { D as Database } from "./database-BU0PD75J.js";
import { C as Cpu, a as ChartColumn } from "./cpu-BgJolFih.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$2 = [
  ["path", { d: "M15 6a9 9 0 0 0-9 9V3", key: "1cii5b" }],
  ["circle", { cx: "18", cy: "6", r: "3", key: "1h7g24" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }]
];
const GitBranch = createLucideIcon("git-branch", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$1);
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
function Overview() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "NYC Taxi · Big Data Project", title: "Predict trip duration with Spark-powered ML", description: "A complete pipeline for the NYC taxi dataset — from raw CSV to feature-engineered, evaluated, and production-ready models.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/upload", className: "inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95", children: [
        "Start pipeline ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/models", className: "inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-card", children: "Open Model Hub" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-6 py-12 space-y-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [{
        label: "Dataset rows",
        value: "1.4M+",
        sub: "NYC taxi trips",
        icon: Database
      }, {
        label: "Best R²",
        value: "0.71",
        sub: "GBT Regressor",
        icon: TrendingUp
      }, {
        label: "RMSE",
        value: "350.16",
        sub: "seconds",
        icon: Target
      }, {
        label: "Models trained",
        value: "3",
        sub: "RF · GBT · XGB",
        icon: Layers
      }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: s.sub })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-3xl font-bold tracking-tight", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: s.label })
      ] }, s.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-semibold uppercase tracking-widest text-primary", children: "Pipeline" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xl font-semibold", children: "Four stages, fully reproducible" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/upload", className: "hidden sm:inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4", children: [
            "Start now ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" }),
          [{
            to: "/upload",
            n: "01",
            title: "Upload",
            desc: "Drop a CSV, preview the schema and first rows instantly.",
            icon: Database
          }, {
            to: "/preprocess",
            n: "02",
            title: "Preprocess & Features",
            desc: "Clean outliers + engineer Haversine, temporal & encoding features.",
            icon: Sparkles
          }, {
            to: "/models",
            n: "03",
            title: "Model Hub",
            desc: "Train or load RandomForest, GBT and XGBoost on Spark.",
            icon: Brain
          }, {
            to: "/predict",
            n: "04",
            title: "Predict",
            desc: "Score new trips and export predictions to CSV.",
            icon: Target
          }].map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: step.to, className: "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary/50 hover:shadow-glow hover:-translate-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(step.icon, { className: "h-5 w-5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-primary/70", children: step.n })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 font-semibold text-base", children: step.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground leading-relaxed", children: step.desc }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "absolute right-5 bottom-5 h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" })
          ] }, step.to))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid lg:grid-cols-3 gap-4", children: [{
        name: "Random Forest",
        rmse: "362.4",
        r2: "0.69",
        color: "from-chart-1 to-chart-1/60",
        icon: GitBranch
      }, {
        name: "GBT Regressor",
        rmse: "350.16",
        r2: "0.71",
        color: "from-primary to-primary-glow",
        icon: TrendingUp,
        best: true
      }, {
        name: "XGBoost (Spark)",
        rmse: "355.8",
        r2: "0.70",
        color: "from-chart-2 to-chart-2/60",
        icon: Cpu
      }].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative rounded-2xl border p-6 shadow-card overflow-hidden ${m.best ? "border-primary/50 bg-gradient-to-br from-primary/10 via-card to-card" : "border-border bg-card"}`, children: [
        m.best && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-4 right-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground", children: "Best" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(m.icon, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 font-semibold", children: m.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "RMSE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold font-mono", children: m.rmse })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "R²" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold font-mono", children: m.r2 })
          ] })
        ] })
      ] }, m.name)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative overflow-hidden rounded-2xl border border-border bg-gradient-hero p-8 grid-pattern", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid lg:grid-cols-[1fr_auto] gap-6 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-3.5 w-3.5" }),
            " Tech stack"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-2xl font-bold", children: "Built on the modern big-data stack" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xl", children: "Distributed processing with PySpark, gradient-boosted ensembles, and a fast FastAPI bridge to a typed React UI." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: ["PySpark", "FastAPI", "XGBoost4j-Spark", "RandomForest", "GBTRegressor", "React 19", "TanStack Start", "Recharts"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-mono text-foreground/90 backdrop-blur", children: t }, t)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:grid h-32 w-32 place-items-center rounded-2xl bg-gradient-primary shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-14 w-14 text-primary-foreground", strokeWidth: 2 }) })
      ] }) })
    ] })
  ] });
}
export {
  Overview as component
};
