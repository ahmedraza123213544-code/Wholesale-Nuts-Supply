"use client";

import {
  BadgeDollarSign,
  Handshake,
  Layers3,
  Package,
  ShieldCheck,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { chooseUsPoints } from "@/lib/site-data";

const iconMap: Record<string, LucideIcon> = {
  Warehouse,
  BadgeDollarSign,
  ShieldCheck,
  Package,
  Layers3,
  Handshake,
  Truck,
};

export function AboutChooseUs() {
  return (
    <section className="section-pad relative overflow-hidden bg-stone/40">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="forest">Why Businesses Choose Us</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
              The advantages wholesale buyers feel after the first order.
            </h2>
          </div>
        </Reveal>

        <StaggerReveal className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {chooseUsPoints.map((point) => {
            const Icon = iconMap[point.icon] ?? ShieldCheck;
            return (
              <motion.article
                key={point.title}
                data-reveal-item
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="opacity-0 rounded-2xl border border-black/8 bg-white p-6 shadow-[0_20px_50px_-38px_rgba(0,0,0,0.35)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-deep">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
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
