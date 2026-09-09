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
import { qualityWhyMatters } from "@/lib/quality";

const iconMap: Record<string, LucideIcon> = {
  Store,
  ShoppingCart,
  UtensilsCrossed,
  Croissant,
  Factory,
  Boxes,
};

export function QualityWhyMatters() {
  return (
    <section className="section-pad relative overflow-hidden bg-forest-deep text-ivory">
      <div className="noise-overlay" />
      <div className="container-page relative">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="outline">Why Quality Matters</Badge>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance">
              Consistent quality protects every buyer&apos;s reputation.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ivory/70 md:text-lg">
              When nuts underperform, shelves look weaker, recipes fail, and
              production yields slip. Quality is a business risk—and a business
              advantage.
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {qualityWhyMatters.map((item) => {
            const Icon = iconMap[item.icon] ?? Store;
            return (
              <motion.article
                key={item.title}
                data-reveal-item
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="opacity-0 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-7 transition duration-500 hover:border-gold/40 hover:bg-white/[0.07]"
              >
                <Icon className="h-6 w-6 text-gold" aria-hidden="true" />
                <h3 className="mt-5 font-display text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">
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
