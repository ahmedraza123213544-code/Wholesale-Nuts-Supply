"use client";

import {
  Boxes,
  Croissant,
  Factory,
  Layers,
  ShoppingCart,
  Store,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { processAudience } from "@/lib/process-page";

const iconMap: Record<string, LucideIcon> = {
  Store,
  ShoppingCart,
  UtensilsCrossed,
  Croissant,
  Factory,
  Boxes,
  Layers,
};

export function ProcessAudience() {
  return (
    <section className="section-pad relative overflow-hidden bg-stone/45">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="forest">Built for Wholesale Businesses</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
              A process designed around how B2B buyers actually work.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Clear quoting, quality preparation, and reliable delivery support
              the operations that depend on nuts every week.
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {processAudience.map((item) => {
            const Icon = iconMap[item.icon] ?? Store;
            return (
              <motion.article
                key={item.title}
                data-reveal-item
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="opacity-0 rounded-[1.5rem] border border-forest/10 bg-white p-6"
              >
                <Icon className="h-6 w-6 text-gold-deep" aria-hidden="true" />
                <h3 className="mt-5 font-display text-2xl text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
