"use client";

import { useRef } from "react";
import {
  BadgeCheck,
  FileText,
  PackageCheck,
  ShoppingBag,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { whyUsProcessSteps } from "@/lib/why-us";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  ShoppingBag,
  FileText,
  BadgeCheck,
  PackageCheck,
  Truck,
};

export function WhyUsProcess() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".why-process-step",
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".why-process-grid",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".why-process-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".why-process-grid",
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
      <div className="container-page relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline">Our Process</Badge>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance">
              Choose Products → Request Quote → Confirm Order → We Prepare →
              Delivery
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ivory/70 md:text-lg">
              A clear wholesale path from catalog to arrival—so procurement teams
              always know what happens next.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-12 hidden xl:block">
          <div className="why-process-line h-px origin-left bg-gradient-to-r from-gold/20 via-gold to-gold/20" />
        </div>

        <div className="why-process-grid mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {whyUsProcessSteps.map((step) => {
            const Icon = iconMap[step.icon] ?? ShoppingBag;
            return (
              <article
                key={step.step}
                className="why-process-step rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 opacity-0 transition duration-500 hover:border-gold/40 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="font-display text-2xl text-gold/80">
                    {step.step}
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
