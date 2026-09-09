"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Package } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { ProductCard } from "@/components/products/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CatalogProduct } from "@/lib/products";
import { getWhatsAppQuoteUrl } from "@/lib/whatsapp";

type ProductDetailViewProps = {
  product: CatalogProduct;
  related: CatalogProduct[];
};

export function ProductDetailView({ product, related }: ProductDetailViewProps) {
  const quoteUrl = getWhatsAppQuoteUrl(product);

  return (
    <>
      <section className="relative overflow-hidden bg-forest-deep pb-16 pt-28 text-ivory md:pb-20 md:pt-32">
        <div className="noise-overlay" />
        <div className="container-page relative">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-ivory/70 transition hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {product.gallery.slice(0, 3).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} gallery ${index + 1}`}
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            >
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="outline">{product.type}</Badge>
                <Badge variant="outline">{product.availability}</Badge>
              </div>
              <h1 className="mt-5 font-display text-4xl md:text-5xl text-balance">
                {product.name}
              </h1>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-gold">
                {product.grade}
              </p>
              <p className="mt-5 text-base leading-relaxed text-ivory/75 md:text-lg">
                {product.description}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <InfoBlock label="MOQ" value={product.moq} />
                <InfoBlock label="Availability" value={product.availability} />
              </div>

              <div className="mt-8 space-y-3">
                <h2 className="font-display text-2xl">Available sizes</h2>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-ivory/85"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h2 className="font-display text-2xl">Packaging options</h2>
                <div className="flex flex-wrap gap-2">
                  {product.packaging.map((pack) => (
                    <span
                      key={pack}
                      className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs text-gold"
                    >
                      <Package className="h-3.5 w-3.5" />
                      {pack}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl">
                  <a href={quoteUrl} target="_blank" rel="noopener noreferrer">
                    Request Wholesale Quote
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="xl" variant="outline">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Product specifications
            </h2>
            <dl className="mt-6 divide-y divide-black/10 rounded-2xl border border-black/8 bg-white">
              {product.specifications.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                  <dd className="text-sm font-medium text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Quality & wholesale information
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {product.wholesaleInfo}
            </p>
            <ul className="mt-6 space-y-3">
              {product.qualityNotes.map((note) => (
                <li key={note} className="flex items-start gap-3 text-sm text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="section-pad bg-stone/40">
          <div className="container-page">
            <Reveal>
              <h2 className="font-display text-3xl text-ink md:text-4xl">
                Related products
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Explore similar wholesale options that fit the same buying
                program.
              </p>
            </Reveal>
            <StaggerReveal className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <div key={item.slug} data-reveal-item className="opacity-0">
                  <ProductCard product={item} />
                </div>
              ))}
            </StaggerReveal>
          </div>
        </section>
      ) : null}
    </>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-ivory/50">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-ivory">{value}</p>
    </div>
  );
}
