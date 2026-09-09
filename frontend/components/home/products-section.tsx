"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/lib/product-api";
import type { CatalogProduct } from "@/lib/products";

export function ProductsSection() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetchProducts()
      .then((data) => {
        if (!mounted) return;
        setProducts(data.slice(0, 8));
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unable to load products.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="products" className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-page relative">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Badge variant="forest">Our Products</Badge>
              <h2 className="mt-4 font-display text-4xl text-forest md:text-5xl lg:text-6xl text-balance">
                A wholesale catalog built for serious buyers.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Live catalog from our wholesale inventory—selected for grade
                consistency, flavor, and volume readiness.
              </p>
            </div>
            <Button asChild variant="darkOutline" size="lg">
              <Link href="/products">
                Browse full catalog
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>

        {loading ? (
          <div className="mt-12 flex min-h-48 items-center justify-center rounded-2xl border border-forest/10 bg-white">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-gold-deep" />
              Loading products…
            </div>
          </div>
        ) : error ? (
          <div className="mt-12 rounded-2xl border border-dashed border-red-300 bg-red-50 px-6 py-12 text-center text-sm text-muted-foreground">
            {error}
          </div>
        ) : (
          <StaggerReveal className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <motion.article
                key={product.slug}
                data-reveal-item
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="group opacity-0 overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-[0_24px_60px_-36px_rgba(11,48,34,0.45)]"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                      <h3 className="font-display text-2xl text-ivory">
                        {product.name}
                      </h3>
                      <span className="rounded-full bg-gold/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-black">
                        {product.grade || product.category}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 p-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {product.shortDescription}
                    </p>
                    <p className="text-xs font-medium tracking-wide text-forest">
                      {product.moq}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </StaggerReveal>
        )}
      </div>
    </section>
  );
}
