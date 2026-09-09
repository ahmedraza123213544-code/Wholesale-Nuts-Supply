"use client";

import { useRef } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { qualityPromise } from "@/lib/site-data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function AboutQualityPromise() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to(".promise-image", {
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
        ".promise-point",
        { autoAlpha: 0, x: -20 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".promise-points",
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
      className="relative overflow-hidden bg-forest-deep text-ivory section-pad"
    >
      <div className="noise-overlay" />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image
              src="/products/hero-nuts.jpg"
              alt="Assorted premium nuts representing our quality promise"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="promise-image object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <Badge variant="outline">Quality Promise</Badge>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance">
              {qualityPromise.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ivory/70 md:text-lg">
              {qualityPromise.description}
            </p>
          </Reveal>

          <ul className="promise-points mt-8 space-y-4">
            {qualityPromise.points.map((point) => (
              <li
                key={point}
                className="promise-point flex items-start gap-3 opacity-0"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span className="text-sm leading-relaxed text-ivory/85 md:text-base">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
