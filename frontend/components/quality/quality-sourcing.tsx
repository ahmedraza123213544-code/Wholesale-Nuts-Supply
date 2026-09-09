"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { sourcingSteps } from "@/lib/quality";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function QualitySourcing() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".sourcing-step",
        { autoAlpha: 0, x: -28 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".sourcing-track",
            start: "top 78%",
          },
        }
      );

      gsap.fromTo(
        ".sourcing-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".sourcing-track",
            start: "top 78%",
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="section-pad relative overflow-hidden bg-stone/50"
    >
      <div className="container-page">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="forest">Sourcing & Selection</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
              How we choose what enters the catalog.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Strong wholesale programs start before packaging—with disciplined
              supplier selection and clear product standards.
            </p>
          </div>
        </Reveal>

        <div className="sourcing-track relative mt-14">
          <div className="sourcing-line absolute bottom-4 left-[1.15rem] top-4 origin-top w-px bg-gradient-to-b from-gold via-forest/30 to-forest/10 md:left-[1.4rem]" />
          <ol className="space-y-6">
            {sourcingSteps.map((step) => (
              <li
                key={step.step}
                className="sourcing-step relative flex gap-5 opacity-0 md:gap-8"
              >
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ivory font-display text-sm text-forest md:h-12 md:w-12 md:text-base">
                  {step.step}
                </div>
                <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-[0_16px_40px_-34px_rgba(16,32,24,0.4)] md:p-7">
                  <h3 className="font-display text-2xl text-ink md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
