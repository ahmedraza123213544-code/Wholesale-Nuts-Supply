"use client";

import {
  BadgeDollarSign,
  Boxes,
  Headset,
  Package,
  Scale,
  ShieldCheck,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { whyUsAdvantages } from "@/lib/why-us";

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  BadgeDollarSign,
  Warehouse,
  Scale,
  Package,
  Boxes,
  Truck,
  Headset,
};

export function WhyUsAdvantages() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-page relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="forest">Our Key Advantages</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
              The reasons wholesale buyers stay with us.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Every advantage below is designed around recurring procurement—
              quality, value, availability, and service that hold up over time.
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {whyUsAdvantages.map((item) => {
            const Icon = iconMap[item.icon] ?? ShieldCheck;
            return (
              <motion.article
                key={item.title}
                data-reveal-item
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group opacity-0 rounded-[1.5rem] border border-forest/10 bg-white p-6 shadow-[0_20px_50px_-40px_rgba(16,32,24,0.45)]"
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
