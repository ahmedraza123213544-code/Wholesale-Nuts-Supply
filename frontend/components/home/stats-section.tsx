"use client";

import { AnimatedCounter } from "@/components/animations/animated-counter";
import { StaggerReveal } from "@/components/animations/reveal";
import { stats } from "@/lib/site-data";

export function StatsSection() {
  return (
    <section
      className="relative border-y border-white/10 bg-forest text-ivory"
      aria-label="Business statistics"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(197,160,89,0.18),transparent_45%)]" />
      <div className="container-page relative py-14 md:py-16">
        <StaggerReveal className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              data-reveal-item
              className="opacity-0 border-l border-gold/30 pl-5"
            >
              <p className="font-display text-5xl text-gold md:text-6xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                />
              </p>
              <p className="mt-3 max-w-[14rem] text-sm leading-relaxed text-ivory/70">
                {stat.label}
              </p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
