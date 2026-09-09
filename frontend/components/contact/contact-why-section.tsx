"use client";

import {
  BadgeDollarSign,
  Package,
  Settings2,
  ShieldCheck,
  Warehouse,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { contactReasons } from "@/lib/site-data";

const iconMap: Record<string, LucideIcon> = {
  BadgeDollarSign,
  Package,
  Warehouse,
  ShieldCheck,
  Settings2,
  Zap,
};

export function ContactWhySection() {
  return (
    <section className="section-pad relative overflow-hidden bg-forest-deep text-ivory">
      <div className="noise-overlay" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(70%,40rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="container-page relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline">Why Contact Us</Badge>
            <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl text-balance">
              Built for buyers who need clarity before they commit.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ivory/70 md:text-lg">
              Every conversation is handled with wholesale priorities in mind—
              pricing, volume, quality, and delivery certainty.
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {contactReasons.map((reason) => {
            const Icon = iconMap[reason.icon] ?? ShieldCheck;
            return (
              <motion.article
                key={reason.title}
                data-reveal-item
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="opacity-0 rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition duration-500 hover:border-gold/40 hover:bg-white/[0.06]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-2xl">{reason.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">
                  {reason.description}
                </p>
              </motion.article>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
