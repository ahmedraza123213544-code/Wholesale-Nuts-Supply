"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { whyUsQualityPoints } from "@/lib/why-us";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function WhyUsQuality() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to(".why-quality-image", {
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
        ".why-quality-point",
        { autoAlpha: 0, x: -18 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".why-quality-points",
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
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image
              src="/products/quality-nuts.jpg"
              alt="Premium nuts representing quality you can trust"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="why-quality-image object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/55 via-transparent to-transparent" />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <Badge variant="outline">Quality You Can Trust</Badge>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance">
              Quality is the foundation of every wholesale relationship.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ivory/70 md:text-lg">
              From sourcing to handling, our quality approach is built for
              businesses that cannot risk inconsistency. Explore the full
              framework on our Quality page.
            </p>
          </Reveal>

          <ul className="why-quality-points mt-8 space-y-4">
            {whyUsQualityPoints.map((point) => (
              <li
                key={point.title}
                className="why-quality-point flex items-start gap-3 opacity-0"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="font-medium text-ivory">{point.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ivory/65">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button asChild size="lg" variant="outline">
              <Link href="/quality">
                Explore Quality Standards
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
