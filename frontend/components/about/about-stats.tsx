"use client";

import { AnimatedCounter } from "@/components/animations/animated-counter";
import { StaggerReveal } from "@/components/animations/reveal";
import { aboutStats } from "@/lib/site-data";

export function AboutStats() {
  return (
    <section
      className="relative overflow-hidden border-y border-white/10 bg-forest text-ivory"
      aria-label="Business statistics"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(212,175,55,0.16),transparent_45%)]" />
      <div className="container-page relative py-14 md:py-16">
        <StaggerReveal className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {aboutStats.map((stat) => (
            <div
              key={stat.label}
              data-reveal-item
              className="opacity-0 border-l border-gold/30 pl-5"
            >
              <p className="font-display text-4xl text-gold md:text-5xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={0}
                />
              </p>
              <p className="mt-3 max-w-[12rem] text-sm leading-relaxed text-ivory/70">
                {stat.label}
              </p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
