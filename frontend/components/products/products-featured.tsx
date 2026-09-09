"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { ProductCard } from "@/components/products/product-card";
import { Badge } from "@/components/ui/badge";
import { fetchProducts } from "@/lib/product-api";
import type { CatalogProduct } from "@/lib/products";

export function FeaturedProducts() {
  const [featured, setFeatured] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchProducts({ featured: true })
      .then((data) => {
        if (mounted) setFeatured(data.slice(0, 6));
      })
      .catch(() => {
        if (mounted) setFeatured([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="section-pad relative overflow-hidden bg-forest-deep text-ivory">
      <div className="noise-overlay" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(70%,40rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="container-page relative">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="outline">Featured Products</Badge>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance">
              Selected for high-volume wholesale programs.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ivory/70 md:text-lg">
              These SKUs are frequently requested by retailers, manufacturers,
              and distributors building recurring supply calendars.
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className="mt-12 flex items-center gap-3 text-sm text-ivory/70">
            <Loader2 className="h-5 w-5 animate-spin text-gold" />
            Loading featured products…
          </div>
        ) : (
          <StaggerReveal className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((product) => (
              <div key={product.slug} data-reveal-item className="opacity-0">
                <ProductCard product={product} featured />
              </div>
            ))}
          </StaggerReveal>
        )}
      </div>
    </section>
  );
}
