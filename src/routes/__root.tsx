import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TaxiML — NYC Trip Duration Predictor" },
      { name: "description", content: "Big-data ML pipeline for predicting NYC taxi trip duration with Spark, GBT, RandomForest & XGBoost." },
      { property: "og:title", content: "TaxiML — NYC Trip Duration Predictor" },
      { name: "twitter:title", content: "TaxiML — NYC Trip Duration Predictor" },
      { property: "og:description", content: "Big-data ML pipeline for predicting NYC taxi trip duration with Spark, GBT, RandomForest & XGBoost." },
      { name: "twitter:description", content: "Big-data ML pipeline for predicting NYC taxi trip duration with Spark, GBT, RandomForest & XGBoost." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/96b7fa05-bb38-4189-a688-a262340c3b26/id-preview-a569e886--01b00732-af28-4ad7-aa3d-5f806a0fdbb8.lovable.app-1777280536291.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/96b7fa05-bb38-4189-a688-a262340c3b26/id-preview-a569e886--01b00732-af28-4ad7-aa3d-5f806a0fdbb8.lovable.app-1777280536291.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster theme="dark" position="top-right" richColors />
    </>
  );
}
