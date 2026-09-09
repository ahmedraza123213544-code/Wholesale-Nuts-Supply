"use client";

import Image from "next/image";
import {
  HandHeart,
  HeartHandshake,
  Leaf,
  Scale,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { qualityPromiseItems } from "@/lib/quality";

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Leaf,
  Scale,
  HeartHandshake,
  HandHeart,
  Truck,
};

export function QualityPromise() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 top-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-page relative">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src="/products/hero-nuts.jpg"
                alt="Assorted premium nuts representing our quality promise"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-3xl text-ivory md:text-4xl text-balance">
                  Built for buyers who cannot risk inconsistency.
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <Badge variant="forest">Our Quality Promise</Badge>
              <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
                Premium nuts, handled with wholesale discipline.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Quality is not a slogan for us—it is the operating standard behind
                every lot we source, inspect, package, and deliver.
              </p>
            </Reveal>

            <StaggerReveal className="mt-10 grid gap-4 sm:grid-cols-2">
              {qualityPromiseItems.map((item) => {
                const Icon = iconMap[item.icon] ?? ShieldCheck;
                return (
                  <motion.article
                    key={item.title}
                    data-reveal-item
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="opacity-0 rounded-2xl border border-forest/10 bg-white p-5 shadow-[0_18px_45px_-36px_rgba(16,32,24,0.45)]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-deep">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-display text-2xl text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </motion.article>
                );
              })}
            </StaggerReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
