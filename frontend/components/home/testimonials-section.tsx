"use client";

import { Quote } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { testimonials } from "@/lib/site-data";

export function TestimonialsSection() {
  return (
    <section className="section-pad relative overflow-hidden bg-forest text-ivory">
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-page relative">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="outline">Customer Trust</Badge>
            <h2 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl text-balance">
              Trusted by buyers who measure quality in every case.
            </h2>
          </div>
        </Reveal>

        <StaggerReveal className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => (
            <motion.blockquote
              key={item.name}
              data-reveal-item
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="opacity-0 rounded-2xl border border-white/10 bg-white/[0.04] p-7"
            >
              <Quote className="h-6 w-6 text-gold" aria-hidden="true" />
              <p className="mt-5 text-sm leading-relaxed text-ivory/80 md:text-base">
                “{item.quote}”
              </p>
              <footer className="mt-8 border-t border-white/10 pt-5">
                <cite className="not-italic">
                  <span className="block font-display text-xl text-gold">
                    {item.name}
                  </span>
                  <span className="mt-1 block text-sm text-ivory/60">
                    {item.role}, {item.company}
                  </span>
                </cite>
              </footer>
            </motion.blockquote>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
