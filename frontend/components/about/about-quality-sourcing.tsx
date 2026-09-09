"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { sourcingPillars } from "@/lib/site-data";

export function AboutQualitySourcing() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="container-page">
        <Reveal>
          <div className="max-w-3xl">
            <Badge variant="forest">Quality & Sourcing</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl lg:text-6xl text-balance">
              Standards you can see in every case we supply.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Quality is not a slogan for us. It is the operating system behind
              sourcing, inspection, and the way we prepare wholesale shipments.
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="mt-12 grid gap-5 md:grid-cols-2">
          {sourcingPillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              data-reveal-item
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className={`group opacity-0 overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-[0_24px_60px_-40px_rgba(0,0,0,0.35)] ${
                index % 2 === 1 ? "md:translate-y-8" : ""
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <p className="absolute bottom-4 left-5 font-display text-2xl text-ivory md:text-3xl">
                  {pillar.title}
                </p>
              </div>
              <div className="p-6 md:p-7">
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {pillar.description}
                </p>
              </div>
            </motion.article>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
