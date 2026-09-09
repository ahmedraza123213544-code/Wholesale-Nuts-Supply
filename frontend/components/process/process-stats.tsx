"use client";

import { AnimatedCounter } from "@/components/animations/animated-counter";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { processStats } from "@/lib/process-page";

export function ProcessStats() {
  return (
    <section
      className="relative overflow-hidden border-y border-white/10 bg-forest text-ivory"
      aria-label="Process page statistics"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(212,175,55,0.16),transparent_45%)]" />
      <div className="container-page relative py-14 md:py-16">
        <Reveal>
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="outline">By the Numbers</Badge>
              <h2 className="mt-4 font-display text-3xl md:text-4xl text-balance">
                Scale indicators behind the process.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ivory/65">
              Values marked illustrative are placeholders until verified operating
              metrics are published.
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {processStats.map((stat) => (
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
              <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-ivory/45">
                {stat.note}
              </p>
            </div>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
