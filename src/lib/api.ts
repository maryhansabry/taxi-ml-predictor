const ENV_BASE = (import.meta.env.VITE_TAXIML_API_URL as string | undefined)?.trim();
const ENV_KEY = (import.meta.env.VITE_TAXIML_API_KEY as string | undefined)?.trim();
const DEV_BASE_STORAGE = "taximl.devApiUrl";
const DEFAULT_BASE = "http://localhost:8000";

export function getBaseUrl(): string {
  if (ENV_BASE) return ENV_BASE;
  if (typeof window === "undefined") return DEFAULT_BASE;
  if (import.meta.env.DEV) {
    return window.sessionStorage.getItem(DEV_BASE_STORAGE) || DEFAULT_BASE;
  }
  return DEFAULT_BASE;
}

export function setBaseUrl(url: string) {
  if (typeof window === "undefined" || !import.meta.env.DEV) return;
  if (url) window.sessionStorage.setItem(DEV_BASE_STORAGE, url);
  else window.sessionStorage.removeItem(DEV_BASE_STORAGE);
}

export function isBaseUrlOverridable(): boolean {
  return import.meta.env.DEV && !ENV_BASE;
}

export function hasApiKey(): boolean {
  return Boolean(ENV_KEY);
}

function friendlyError(status: number, detail?: string): string {
  if (detail) return detail;
  switch (status) {
    case 400:
      return "Invalid request. Please check your input and try again.";
    case 401:
    case 403:
      return "Authentication failed. Set a valid API key in the sidebar.";
    case 404:
      return "The requested resource was not found.";
    case 413:
      return "File too large. Please upload a smaller CSV.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 0:
      return "Could not reach the backend. Is it running?";
    default:
      if (status >= 500) return "The server ran into a problem. Please try again later.";
      return "Something went wrong. Please try again.";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${getBaseUrl()}${path}`, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        ...(ENV_KEY ? { "X-API-Key": ENV_KEY } : {}),
      },
    });
  } catch {
    throw new Error(friendlyError(0));
  }
  if (!res.ok) {
    let detail: string | undefined;
    try {
      const body = await res.json();
      detail = body?.detail;
    } catch {
      await res.text().catch(() => "");
    }
    if (typeof console !== "undefined") {
      console.warn(`[api] ${path} failed with status ${res.status}:`, detail);
    }
    throw new Error(friendlyError(res.status, detail));
  }
  return (await res.json()) as T;
}

export interface PreviewResponse {
  dataset_id: string;
  rows: number;
  columns: string[];
  preview: Record<string, unknown>[];
  schema: { name: string; type: string }[];
}

export interface CleanResponse {
  dataset_id: string;
  rows_before: number;
  rows_after: number;
  features_added: string[];
  preview: Record<string, unknown>[];
}
export interface PredictManualRequest {
  vendor_id: number;
  passenger_count: number;
  pickup_datetime: string;
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_latitude: number;
  dropoff_longitude: number;
  store_and_fwd_flag: "N" | "Y";
  model: string;
}

export interface ModelMetric {
  model: string;
  rmse: number;
  mae: number;
  r2: number;
  train_seconds?: number;
}

export interface ModelsResponse {
  best_model: string;
  metrics: ModelMetric[];
  mode: "pretrained" | "train";
}

export interface PredictResponse {
  predictions: { id?: string | number; prediction: number }[];
  download_url?: string;
}

export const api = {
  health: () => request<{ status: string }>("/health"),

  uploadCsv: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return request<PreviewResponse>("/upload", { method: "POST", body: fd });
  },

  preprocess: (datasetId: string) =>
    request<CleanResponse>(`/preprocess?dataset_id=${encodeURIComponent(datasetId)}`, {
      method: "POST",
    }),

  loadPretrained: (file: File, datasetId?: string) => {
    const fd = new FormData();
    fd.append("file", file);
    if (datasetId) fd.append("dataset_id", datasetId);
    return request<ModelsResponse>("/models/pretrained", { method: "POST", body: fd });
  },

  trainModels: (datasetId: string) =>
    request<ModelsResponse>(`/models/train?dataset_id=${encodeURIComponent(datasetId)}`, {
      method: "POST",
    }),

predictSingle: (data: PredictManualRequest) =>
  request<PredictResponse>("/predict/manual", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }),
  getRoute: (pickupLat: number, pickupLng: number, dropoffLat: number, dropoffLng: number) =>
  request<{ latlngs: [number, number][] }>(
    `/route?pickup_lat=${pickupLat}&pickup_lng=${pickupLng}&dropoff_lat=${dropoffLat}&dropoff_lng=${dropoffLng}`
  ),
};