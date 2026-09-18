import { apiFetch } from "@/lib/api";
import type { CatalogProduct } from "@/lib/products";

type ProductsResponse = { data: CatalogProduct[] };
type ProductResponse = { data: CatalogProduct; related?: CatalogProduct[] };
type CategoriesResponse = {
  data: Array<{
    id: number | string;
    name: string;
    slug: string;
    productCount?: number;
  }>;
};

export async function fetchProducts(
  params?: {
    category?: string;
    featured?: boolean;
    q?: string;
  },
  init?: RequestInit
) {
  const search = new URLSearchParams();
  if (params?.category && params.category !== "All") {
    search.set("category", params.category);
  }
  if (params?.featured) search.set("featured", "true");
  if (params?.q) search.set("q", params.q);
  const query = search.toString();
  const payload = await apiFetch<ProductsResponse>(
    `/api/products${query ? `?${query}` : ""}`,
    init
  );
  return payload.data;
}

export async function fetchProductBySlug(slug: string, init?: RequestInit) {
  const payload = await apiFetch<ProductResponse>(`/api/products/${slug}`, init);
  return {
    product: payload.data,
    related: payload.related || [],
  };
}

export async function fetchCategories() {
  const payload = await apiFetch<CategoriesResponse>("/api/categories");
  return payload.data;
}

export async function submitInquiry(body: Record<string, string>) {
  return apiFetch<{ data: { id: number } }>("/api/inquiries", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
