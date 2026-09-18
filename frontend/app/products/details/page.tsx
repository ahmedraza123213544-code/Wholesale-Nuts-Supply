import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ProductDetailsClient } from "@/components/products/product-details-client";
import { pageMetadata } from "@/lib/seo";

// `output: "export"` pre-renders this route once at build time, so
// per-slug metadata can't be read from the `?slug=` query string here (there
// is no request to read it from). The canonical, indexable, per-product
// metadata lives on the pretty /products/[slug]/ route instead — this page
// is a client-rendered hosting fallback only, so it gets generic metadata
// and is excluded from the sitemap.
export const metadata: Metadata = {
  ...pageMetadata({
    title: "Product",
    description: "Browse premium wholesale nuts from Wholesale Nut Supply.",
    path: "/products/details",
  }),
  // Every product's real content lives at /products/[slug]/ — keep this
  // query-string fallback shell out of the index entirely.
  robots: { index: false, follow: true },
};

export default function ProductDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center pt-28">
          <Loader2 className="h-8 w-8 animate-spin text-gold-deep" />
        </div>
      }
    >
      <ProductDetailsClient />
    </Suspense>
  );
}
