import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, Upload, Sparkles, Brain, Target, Server, Zap, ShieldCheck, ShieldAlert } from "lucide-react";
import { getBaseUrl, setBaseUrl, isBaseUrlOverridable, hasApiKey, api } from "@/lib/api";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview", icon: Activity },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/preprocess", label: "Preprocessing", icon: Sparkles },
  { to: "/models", label: "Model Hub", icon: Brain },
  { to: "/predict", label: "Prediction", icon: Target },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { location } = useRouterState();
  const [base, setBase] = useState("");
  const [status, setStatus] = useState<"idle" | "online" | "offline">("idle");
  const canEditBase = isBaseUrlOverridable();
  const keyConfigured = hasApiKey();

  useEffect(() => {
    setBase(getBaseUrl());
  }, []);

  useEffect(() => {
    let alive = true;
    api.health()
      .then(() => alive && setStatus("online"))
      .catch(() => alive && setStatus("offline"));
    return () => { alive = false; };
  }, [base]);

  const saveBase = (v: string) => {
    setBase(v);
    setBaseUrl(v);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col border-r border-border bg-sidebar">
          <div className="p-6">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-glow">
                <Zap className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-bold text-lg leading-tight tracking-tight">TaxiML</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Spark Pipeline</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 space-y-0.5">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-sidebar-accent text-primary shadow-card"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}
                >
                  <Icon className={cn("h-4 w-4", active && "text-primary")} />
                  {label}
                  {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border space-y-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Server className="h-3 w-3" /> Backend
            </div>
            {canEditBase ? (
              <input
                value={base}
                onChange={(e) => saveBase(e.target.value)}
                placeholder="http://localhost:8000"
                className="w-full rounded-md border border-input bg-input/50 px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ) : (
              <div
                title={base}
                className="w-full truncate rounded-md border border-input bg-input/30 px-2.5 py-1.5 text-xs font-mono text-muted-foreground"
              >
                {base || "—"}
              </div>
            )}
            <div
              className={cn(
                "flex items-center gap-1.5 text-[11px]",
                keyConfigured ? "text-success" : "text-destructive",
              )}
            >
              {keyConfigured ? (
                <>
                  <ShieldCheck className="h-3 w-3" /> API key configured
                </>
              ) : (
                <>
                  <ShieldAlert className="h-3 w-3" /> API key missing
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className={cn(
                "h-2 w-2 rounded-full",
                status === "online" && "bg-success shadow-[0_0_8px] shadow-success",
                status === "offline" && "bg-destructive",
                status === "idle" && "bg-muted-foreground animate-pulse",
              )} />
              <span className="text-muted-foreground">
                {status === "online" ? "Connected" : status === "offline" ? "Offline" : "Checking…"}
              </span>
            </div>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="lg:hidden border-b border-border bg-sidebar px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary">
              <Zap className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-bold">TaxiML</span>
          </div>
          <div className={cn(
            "h-2 w-2 rounded-full",
            status === "online" && "bg-success",
            status === "offline" && "bg-destructive",
            status === "idle" && "bg-muted-foreground",
          )} />
        </div>

        <main className="min-h-screen overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, children }: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border bg-gradient-hero">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-4 text-3xl lg:text-5xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base lg:text-lg text-muted-foreground">{description}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
