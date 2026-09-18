import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/constants";
import { fetchProducts } from "@/lib/product-api";

// Required for `output: "export"` since this route fetches data.
export const dynamic = "force-static";

const staticRoutes: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/products/", changeFrequency: "weekly", priority: 0.9 },
  { path: "/contact/", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about/", changeFrequency: "monthly", priority: 0.7 },
  { path: "/quality/", changeFrequency: "monthly", priority: 0.7 },
  { path: "/why-us/", changeFrequency: "monthly", priority: 0.7 },
  { path: "/process/", changeFrequency: "monthly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    const products = await fetchProducts(undefined, { cache: "force-cache" });
    for (const product of products) {
      entries.push({
        url: `${SITE_URL}/products/${product.slug}/`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  } catch (err) {
    console.warn("[sitemap] products fetch failed, listing static routes only:", err);
  }

  return entries;
}
