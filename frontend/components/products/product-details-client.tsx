"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProductDetailView } from "@/components/products/product-detail-view";
import { fetchProductBySlug } from "@/lib/product-api";
import type { CatalogProduct } from "@/lib/products";

export function ProductDetailsClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug")?.trim() || "";
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [related, setRelated] = useState<CatalogProduct[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setError("Missing product.");
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError("");

    fetchProductBySlug(slug)
      .then((data) => {
        if (!mounted) return;
        setProduct(data.product);
        setRelated(data.related || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Product not found.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-28">
        <Loader2 className="h-8 w-8 animate-spin text-gold-deep" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-page pt-28 pb-20 text-center">
        <h1 className="font-display text-3xl text-forest">Product not found</h1>
        <p className="mt-3 text-muted-foreground">{error || "Please return to the catalog."}</p>
        <a href="/products/" className="mt-6 inline-block text-gold-deep underline">
          Back to products
        </a>
      </div>
    );
  }

  return <ProductDetailView product={product} related={related} />;
}
