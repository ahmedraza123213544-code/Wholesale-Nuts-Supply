"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CatalogProduct } from "@/lib/products";
import { getWhatsAppQuoteUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: CatalogProduct;
  featured?: boolean;
  className?: string;
};

export function ProductCard({
  product,
  featured = false,
  className,
}: ProductCardProps) {
  const quoteUrl = getWhatsAppQuoteUrl(product);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className={cn(
        "group overflow-hidden rounded-[1.5rem] border border-black/8 bg-white shadow-[0_24px_60px_-40px_rgba(0,0,0,0.4)]",
        featured && "md:col-span-2 lg:col-span-1",
        className
      )}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className={cn(
            "relative overflow-hidden",
            featured ? "aspect-[16/10]" : "aspect-[4/3]"
          )}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition duration-500 group-hover:opacity-95" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge className="bg-forest-deep/75 text-ivory border-transparent backdrop-blur-sm">
              {product.category}
            </Badge>
            <Badge
              className={cn(
                "border-transparent backdrop-blur-sm",
                product.availability === "In Stock" &&
                  "bg-emerald-500/90 text-white",
                product.availability === "Limited" &&
                  "bg-amber-500/90 text-black",
                product.availability === "Made to Order" &&
                  "bg-white/90 text-ink"
              )}
            >
              {product.availability}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gold">
              {product.grade}
            </p>
            <h3
              className={cn(
                "mt-1 font-display text-ivory",
                featured ? "text-3xl" : "text-2xl"
              )}
            >
              {product.name}
            </h3>
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5 md:p-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>
        <div className="flex flex-wrap gap-2">
          {product.packaging.slice(0, 2).map((pack) => (
            <span
              key={pack}
              className="rounded-full bg-stone px-3 py-1 text-[11px] font-medium text-ink/70"
            >
              {pack}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-black/5 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Wholesale
            </p>
            <p className="mt-1 text-sm font-medium text-ink">WhatsApp Quote</p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="darkOutline">
              <Link href={`/products/${product.slug}`}>View</Link>
            </Button>
            <Button asChild size="sm">
              <a href={quoteUrl} target="_blank" rel="noopener noreferrer">
                Quote
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
