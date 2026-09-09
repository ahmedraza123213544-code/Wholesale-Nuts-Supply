"use client";

import { Eye, Target, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { missionVision } from "@/lib/site-data";

const iconMap: Record<string, LucideIcon> = {
  Target,
  Eye,
};

export function AboutMissionVision() {
  return (
    <section className="section-pad relative overflow-hidden bg-forest-deep text-ivory">
      <div className="noise-overlay" />
      <div className="container-page relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline">Mission & Vision</Badge>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance">
              Purpose that guides every wholesale partnership.
            </h2>
          </div>
        </Reveal>

        <StaggerReveal className="mt-12 grid gap-5 md:grid-cols-2">
          {missionVision.map((item) => {
            const Icon = iconMap[item.icon] ?? Target;
            return (
              <motion.article
                key={item.title}
                data-reveal-item
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group opacity-0 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-8 md:p-10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold transition duration-500 group-hover:scale-110">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-6 font-display text-3xl md:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-ivory/70 md:text-lg">
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
