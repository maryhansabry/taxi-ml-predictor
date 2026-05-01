import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Database, Sparkles, Brain, Target, TrendingUp, Layers, Zap, BarChart3, Cpu, GitBranch } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app/AppShell";

export const Route = createFileRoute("/")({
  component: Overview,
});

function Overview() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="NYC Taxi · Big Data Project"
        title="Predict trip duration with Spark-powered ML"
        description="A complete pipeline for the NYC taxi dataset — from raw CSV to feature-engineered, evaluated, and production-ready models."
      >
        <div className="flex flex-wrap gap-3">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95"
          >
            Start pipeline <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/models"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-card"
          >
            Open Model Hub
          </Link>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-6 py-12 space-y-14">
        {/* KPI Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Dataset rows", value: "1.4M+", sub: "NYC taxi trips", icon: Database },
            { label: "Best R²", value: "0.71", sub: "GBT Regressor", icon: TrendingUp },
            { label: "RMSE", value: "350.16", sub: "seconds", icon: Target },
            { label: "Models trained", value: "3", sub: "RF · GBT · XGB", icon: Layers },
          ].map((s) => (
            <div key={s.label} className="group rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary/40">
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.sub}</span>
              </div>
              <div className="mt-4 text-3xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Pipeline timeline */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Pipeline</h2>
              <p className="mt-1 text-xl font-semibold">Four stages, fully reproducible</p>
            </div>
            <Link to="/upload" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4">
              Start now <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* connector line */}
            <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            {[
              { to: "/upload", n: "01", title: "Upload", desc: "Drop a CSV, preview the schema and first rows instantly.", icon: Database },
              { to: "/preprocess", n: "02", title: "Preprocess & Features", desc: "Clean outliers + engineer Haversine, temporal & encoding features.", icon: Sparkles },
              { to: "/models", n: "03", title: "Model Hub", desc: "Train or load RandomForest, GBT and XGBoost on Spark.", icon: Brain },
              { to: "/predict", n: "04", title: "Predict", desc: "Score new trips and export predictions to CSV.", icon: Target },
            ].map((step) => (
              <Link
                key={step.to}
                to={step.to}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition hover:border-primary/50 hover:shadow-glow hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-primary/70">{step.n}</span>
                </div>
                <div className="mt-5 font-semibold text-base">{step.title}</div>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                <ArrowRight className="absolute right-5 bottom-5 h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>

        {/* Models comparison preview */}
        <section className="grid lg:grid-cols-3 gap-4">
          {[
            { name: "Random Forest", rmse: "362.4", r2: "0.69", color: "from-chart-1 to-chart-1/60", icon: GitBranch },
            { name: "GBT Regressor", rmse: "350.16", r2: "0.71", color: "from-primary to-primary-glow", icon: TrendingUp, best: true },
            { name: "XGBoost (Spark)", rmse: "355.8", r2: "0.70", color: "from-chart-2 to-chart-2/60", icon: Cpu },
          ].map((m) => (
            <div
              key={m.name}
              className={`relative rounded-2xl border p-6 shadow-card overflow-hidden ${m.best ? "border-primary/50 bg-gradient-to-br from-primary/10 via-card to-card" : "border-border bg-card"}`}
            >
              {m.best && (
                <span className="absolute top-4 right-4 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                  Best
                </span>
              )}
              <m.icon className="h-5 w-5 text-primary" />
              <div className="mt-4 font-semibold">{m.name}</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">RMSE</div>
                  <div className="text-xl font-bold font-mono">{m.rmse}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">R²</div>
                  <div className="text-xl font-bold font-mono">{m.r2}</div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Tech stack */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-hero p-8 grid-pattern">
          <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
                <BarChart3 className="h-3.5 w-3.5" /> Tech stack
              </div>
              <h3 className="mt-3 text-2xl font-bold">Built on the modern big-data stack</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                Distributed processing with PySpark, gradient-boosted ensembles, and a fast FastAPI bridge to a typed React UI.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["PySpark", "FastAPI", "XGBoost4j-Spark", "RandomForest", "GBTRegressor", "React 19", "TanStack Start", "Recharts"].map((t) => (
                  <span key={t} className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-mono text-foreground/90 backdrop-blur">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="hidden lg:grid h-32 w-32 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
              <Zap className="h-14 w-14 text-primary-foreground" strokeWidth={2} />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
