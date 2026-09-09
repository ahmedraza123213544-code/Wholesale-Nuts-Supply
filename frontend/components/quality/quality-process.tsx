"use client";

import { useRef } from "react";
import {
  FlaskConical,
  MapPin,
  PackageCheck,
  SearchCheck,
  Settings2,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { qualityProcessSteps } from "@/lib/quality";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  MapPin,
  SearchCheck,
  Settings2,
  FlaskConical,
  PackageCheck,
  Truck,
};

export function QualityProcess() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".qc-step",
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".qc-grid",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".qc-progress",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.35,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".qc-grid",
            start: "top 80%",
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="section-pad relative overflow-hidden bg-forest-deep text-ivory"
    >
      <div className="noise-overlay" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(70%,40rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="container-page relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline">Quality Control Process</Badge>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance">
              Source → Inspect → Process → Test → Package → Deliver
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ivory/70 md:text-lg">
              A clear pathway from intake to outbound so every wholesale order
              follows the same quality rhythm.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-12 hidden lg:block">
          <div className="qc-progress h-px origin-left bg-gradient-to-r from-gold/20 via-gold to-gold/20" />
        </div>

        <div className="qc-grid mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {qualityProcessSteps.map((step, index) => {
            const Icon = iconMap[step.icon] ?? SearchCheck;
            return (
              <article
                key={step.title}
                className="qc-step group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 opacity-0 transition duration-500 hover:border-gold/40 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="font-display text-2xl text-gold/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
