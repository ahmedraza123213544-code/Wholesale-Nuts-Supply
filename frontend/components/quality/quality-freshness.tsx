"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { freshnessPoints } from "@/lib/quality";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function QualityFreshness() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to(".freshness-image", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".freshness-card",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".freshness-grid",
            start: "top 82%",
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="section-pad relative overflow-hidden">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <Badge variant="forest">Freshness & Storage</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
              Protected for taste, texture, and shelf life.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Wholesale buyers depend on nuts that still perform when they reach
              shelves, kitchens, and production lines. Storage and handling are
              part of that outcome.
            </p>
          </Reveal>

          <div className="freshness-grid mt-10 grid gap-3 sm:grid-cols-2">
            {freshnessPoints.map((point) => (
              <article
                key={point.title}
                className="freshness-card rounded-2xl border border-forest/10 bg-stone/40 p-5 opacity-0"
              >
                <h3 className="font-display text-xl text-ink">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image
              src="/products/mixed-nuts.jpg"
              alt="Fresh mixed nuts stored for wholesale quality"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="freshness-image object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/45 via-transparent to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
