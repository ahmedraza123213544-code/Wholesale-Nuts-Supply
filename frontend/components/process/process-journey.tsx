"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  BadgeDollarSign,
  FileText,
  Handshake,
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
import { processJourneySteps } from "@/lib/process-page";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  ShoppingBag,
  FileText,
  BadgeDollarSign,
  BadgeCheck,
  PackageCheck,
  Truck,
  Handshake,
};

export function ProcessJourney() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>(".journey-step");

      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        });

        gsap.fromTo(
          step,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      gsap.to(".journey-progress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".journey-track",
          start: "top 70%",
          end: "bottom 30%",
          scrub: true,
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-32 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-page relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="forest">How Our Process Works</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
              A wholesale journey you can follow step by step.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Scroll through the path from product discovery to long-term
              partnership—designed for clarity at every stage.
            </p>
          </div>
        </Reveal>

        <div className="journey-track relative mt-16">
          <div className="absolute bottom-8 left-4 top-8 hidden w-px bg-forest/10 md:left-1/2 md:block md:-translate-x-1/2">
            <div className="journey-progress h-full origin-top scale-y-0 bg-gradient-to-b from-gold via-forest to-gold" />
          </div>

          <ol className="space-y-10 md:space-y-16">
            {processJourneySteps.map((step, index) => {
              const Icon = iconMap[step.icon] ?? ShoppingBag;
              const reversed = index % 2 === 1;

              return (
                <li
                  key={step.step}
                  className={cn(
                    "journey-step relative grid items-center gap-6 opacity-0 md:grid-cols-2 md:gap-12",
                    reversed && "md:[&>*:first-child]:order-2"
                  )}
                >
                  <div
                    className={cn(
                      "relative z-10 rounded-[1.75rem] border p-6 transition duration-500 md:p-8",
                      active === index
                        ? "border-gold/50 bg-white shadow-[0_24px_60px_-36px_rgba(16,32,24,0.45)]"
                        : "border-forest/10 bg-white/80"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full border transition duration-500",
                          active === index
                            ? "border-gold bg-gold text-ink scale-110"
                            : "border-gold/30 bg-gold/10 text-gold-deep"
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-gold-deep">
                          Step {step.step}
                        </p>
                        <h3 className="font-display text-3xl text-ink">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {step.description}
                    </p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-forest/60">
                      {step.detail}
                    </p>
                  </div>

                  <div className="relative aspect-[16/11] overflow-hidden rounded-[1.75rem]">
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className={cn(
                        "object-cover transition duration-700",
                        active === index ? "scale-105" : "scale-100"
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/40 via-transparent to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-xs font-medium text-forest">
                      {step.step} / 07
                    </div>
                  </div>

                  <div className="absolute left-4 top-1/2 z-20 hidden h-4 w-4 -translate-y-1/2 rounded-full border-2 border-gold bg-ivory md:left-1/2 md:block md:-translate-x-1/2" />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
