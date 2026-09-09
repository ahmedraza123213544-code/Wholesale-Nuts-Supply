"use client";

import Image from "next/image";
import {
  BadgeCheck,
  Boxes,
  Package,
  Shield,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { packagingPoints } from "@/lib/quality";

const iconMap: Record<string, LucideIcon> = {
  Package,
  Boxes,
  Shield,
  Truck,
  BadgeCheck,
};

export function QualityPackaging() {
  return (
    <section className="section-pad relative overflow-hidden bg-stone/40">
      <div className="container-page">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <Badge variant="forest">Packaging & Delivery</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
              Packed to protect quality through every mile.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Professional packaging and careful outbound handling help ensure
              product arrives ready for retail, manufacturing, or foodservice use.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem]">
              <Image
                src="/products/cta-nuts.jpg"
                alt="Wholesale nut packaging prepared for delivery"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/40 via-transparent to-transparent" />
            </div>
          </Reveal>
        </div>

        <StaggerReveal className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {packagingPoints.map((point) => {
            const Icon = iconMap[point.icon] ?? Package;
            return (
              <motion.article
                key={point.title}
                data-reveal-item
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="opacity-0 rounded-2xl border border-forest/10 bg-white p-6"
              >
                <Icon className="h-5 w-5 text-gold-deep" aria-hidden="true" />
                <h3 className="mt-5 font-display text-2xl text-ink">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </motion.article>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
