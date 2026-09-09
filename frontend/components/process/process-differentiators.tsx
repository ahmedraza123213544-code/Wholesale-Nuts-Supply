"use client";

import {
  ClipboardCheck,
  Headset,
  MessagesSquare,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { processDifferentiators } from "@/lib/process-page";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  MessagesSquare,
  Warehouse,
  ShieldCheck,
  SlidersHorizontal,
  ClipboardCheck,
  Headset,
};

export function ProcessDifferentiators() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="container-page">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="forest">Why Our Process Is Different</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
              Clarity, quality, and follow-through—built into every stage.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Wholesale buying should feel simple and professional. Our process
              is designed to reduce friction while protecting product quality.
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {processDifferentiators.map((item) => {
            const Icon = iconMap[item.icon] ?? Sparkles;
            return (
              <motion.article
                key={item.title}
                data-reveal-item
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group opacity-0 rounded-[1.5rem] border border-forest/10 bg-gradient-to-br from-white to-stone/40 p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-deep transition duration-500 group-hover:scale-110">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
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
