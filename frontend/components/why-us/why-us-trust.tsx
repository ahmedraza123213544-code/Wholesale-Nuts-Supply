"use client";

import { Info, Quote } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import {
  whyUsTrustIndicators,
  whyUsTrustPlaceholders,
} from "@/lib/why-us";

export function WhyUsTrust() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="forest">Customer Trust</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
              Built for long-term wholesale relationships.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Trust comes from consistent product, clear communication, and
              reliable fulfillment—not invented reviews.
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="mt-10 grid gap-4 md:grid-cols-3">
          {whyUsTrustIndicators.map((item) => (
            <article
              key={item.title}
              data-reveal-item
              className="opacity-0 rounded-2xl border border-forest/10 bg-stone/40 p-6"
            >
              <h3 className="font-display text-2xl text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </StaggerReveal>

        <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-gold/25 bg-gold/10 px-4 py-3 text-left sm:px-5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
          <p className="text-sm leading-relaxed text-ink/80">
            Testimonials below are placeholders. Replace them only with verified
            customer quotes and permissions.
          </p>
        </div>

        <StaggerReveal className="mt-8 grid gap-5 lg:grid-cols-3">
          {whyUsTrustPlaceholders.map((item) => (
            <motion.blockquote
              key={item.quote}
              data-reveal-item
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="opacity-0 rounded-[1.5rem] border border-dashed border-forest/20 bg-white p-7"
            >
              <Quote className="h-5 w-5 text-gold-deep" aria-hidden="true" />
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                “{item.quote}”
              </p>
              <footer className="mt-6 border-t border-forest/10 pt-4">
                <p className="text-sm font-medium text-ink">{item.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.role} · {item.company}
                </p>
                <Badge variant="muted" className="mt-3">
                  Placeholder
                </Badge>
              </footer>
            </motion.blockquote>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
