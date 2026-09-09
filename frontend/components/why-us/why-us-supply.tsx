"use client";

import {
  CalendarCheck,
  ClipboardCheck,
  Handshake,
  Layers,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { whyUsSupplyPoints } from "@/lib/why-us";

const iconMap: Record<string, LucideIcon> = {
  CalendarCheck,
  Layers,
  ClipboardCheck,
  MessagesSquare,
  Handshake,
};

export function WhyUsSupply() {
  return (
    <section className="section-pad relative overflow-hidden bg-stone/45">
      <div className="container-page">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="forest">Reliable Wholesale Supply</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
              Supply you can plan production and shelves around.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Ongoing wholesale programs need more than a single shipment—they
              need availability, fulfillment discipline, and long-term partnership.
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {whyUsSupplyPoints.map((item) => {
            const Icon = iconMap[item.icon] ?? ClipboardCheck;
            return (
              <motion.article
                key={item.title}
                data-reveal-item
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="opacity-0 rounded-[1.5rem] border border-forest/10 bg-white p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-deep">
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
