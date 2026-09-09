"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { processSteps } from "@/lib/site-data";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ProcessSection() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>(".process-step");
      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 65%",
          end: "bottom 45%",
          onEnter: () => setActive(index),
          onEnterBack: () => setActive(index),
        });

        gsap.fromTo(
          step,
          { autoAlpha: 0, x: index % 2 === 0 ? -36 : 36 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      gsap.to(".process-progress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".process-track",
          start: "top 70%",
          end: "bottom 30%",
          scrub: true,
        },
      });
    },
    { scope: root }
  );

  return (
    <section id="process" ref={root} className="section-pad relative overflow-hidden">
      <div className="container-page">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="forest">Wholesale Process</Badge>
            <h2 className="mt-4 font-display text-4xl text-forest md:text-5xl lg:text-6xl text-balance">
              From catalog to delivery in four clear steps.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              A straightforward path designed for procurement teams that need
              speed without sacrificing specification control.
            </p>
          </div>
        </Reveal>

        <div className="process-track relative mt-14 grid gap-8 lg:grid-cols-[180px_1fr]">
          <div className="relative hidden lg:block">
            <div className="sticky top-28">
              <div className="relative mx-auto h-[22rem] w-px bg-forest/15">
                <div className="process-progress absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-gold" />
              </div>
              <p className="mt-6 text-center font-display text-5xl text-gold">
                {String(active + 1).padStart(2, "0")}
              </p>
            </div>
          </div>

          <ol className="space-y-5">
            {processSteps.map((step, index) => (
              <li
                key={step.step}
                className={cn(
                  "process-step opacity-0 rounded-2xl border bg-white/70 p-6 transition duration-500 md:p-8",
                  active === index
                    ? "border-gold/50 shadow-[0_24px_60px_-36px_rgba(197,160,89,0.55)]"
                    : "border-forest/10"
                )}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
                  <span className="font-display text-4xl text-gold">{step.step}</span>
                  <div>
                    <h3 className="font-display text-3xl text-forest">{step.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10">
          <Button asChild variant="darkOutline" size="lg">
            <Link href="/process">
              See the full process journey
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
