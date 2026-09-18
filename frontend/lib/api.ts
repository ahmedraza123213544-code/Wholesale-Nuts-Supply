import { API_URL } from "@/config/constants";

export function getApiUrl(path = "") {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(getApiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    // Defaults to always-fresh client-side reads; SSG call sites (metadata,
    // sitemap) pass `cache: "force-cache"` since `output: "export"` can't
    // render a "no-store" fetch statically (Next throws NEXT_STATIC_GEN_BAILOUT).
    cache: init?.cache ?? "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }
  return payload as T;
}
