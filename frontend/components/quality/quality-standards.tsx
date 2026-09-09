"use client";

import { FileText, Info } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { qualityStandardsPlaceholders } from "@/lib/quality";

export function QualityStandards() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="forest">Quality Standards</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
              Standards, testing, and compliance—shared transparently.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              We do not invent certifications. Below are placeholders for the
              real documents and standards you can publish once verified.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-gold/25 bg-gold/10 px-4 py-3 text-left sm:px-5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
          <p className="text-sm leading-relaxed text-ink/80">
            Placeholder section: replace each card with confirmed certifications,
            lab testing partners, audit summaries, or compliance documents.
          </p>
        </div>

        <StaggerReveal className="mt-10 grid gap-4 md:grid-cols-2">
          {qualityStandardsPlaceholders.map((item) => (
            <motion.article
              key={item.title}
              data-reveal-item
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="opacity-0 rounded-[1.5rem] border border-dashed border-forest/20 bg-white p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-forest/15 bg-stone text-forest">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <Badge variant="muted">{item.status}</Badge>
              </div>
              <h3 className="mt-6 font-display text-2xl text-ink md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.description}
              </p>
            </motion.article>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
