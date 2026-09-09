"use client";

import {
  Boxes,
  Croissant,
  Factory,
  ShoppingCart,
  Store,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { industries } from "@/lib/site-data";

const iconMap: Record<string, LucideIcon> = {
  Store,
  ShoppingCart,
  UtensilsCrossed,
  Croissant,
  Factory,
  Boxes,
};

export function IndustriesSection() {
  return (
    <section id="industries" className="section-pad">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="forest">Industries We Serve</Badge>
            <h2 className="mt-4 font-display text-4xl text-forest md:text-5xl lg:text-6xl text-balance">
              Built for the businesses that move nuts at volume.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Whether you replenish shelves weekly or schedule production months
              ahead, our wholesale model adapts to your cadence.
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => {
            const Icon = iconMap[industry.icon] ?? Store;
            return (
              <motion.article
                key={industry.title}
                data-reveal-item
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="opacity-0 rounded-2xl border border-forest/10 bg-gradient-to-br from-white to-stone/40 p-7"
              >
                <Icon className="h-6 w-6 text-gold-deep" aria-hidden="true" />
                <h3 className="mt-5 font-display text-2xl text-forest">
                  {industry.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {industry.description}
                </p>
              </motion.article>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
