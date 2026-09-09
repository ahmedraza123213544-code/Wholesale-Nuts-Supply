"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const pillars = [
  {
    title: "Origin partnerships",
    copy: "Long-standing grower and processor relationships across California, Turkey, India, Vietnam, and beyond.",
  },
  {
    title: "Lot-level standards",
    copy: "Size, color, moisture, and sensory checks applied consistently before inventory is released for sale.",
  },
  {
    title: "Traceable handling",
    copy: "Documented lots and food-safety aligned warehouse practices that support audit-ready wholesale programs.",
  },
];

export function QualitySection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to(".quality-image", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        ".quality-pillar",
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".quality-pillars",
            start: "top 80%",
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      id="quality"
      ref={root}
      className="relative overflow-hidden bg-stone/60 section-pad"
    >
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image
              src="/products/quality-nuts.jpg"
              alt="Premium cashews and dried dates for wholesale supply"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="quality-image object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/50 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden max-w-xs rounded-2xl border border-gold/30 bg-forest-deep p-6 text-ivory shadow-2xl md:block">
            <p className="font-display text-2xl text-gold">Quality first</p>
            <p className="mt-2 text-sm leading-relaxed text-ivory/70">
              Every shipment reflects the same grading discipline our long-term
              wholesale accounts rely on.
            </p>
          </div>
        </div>

        <div>
          <Reveal>
            <Badge variant="forest">Quality & Sourcing</Badge>
            <h2 className="mt-4 font-display text-4xl text-forest md:text-5xl lg:text-6xl text-balance">
              Sourced with intention. Graded without compromise.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              We treat nuts as an ingredient program—not a commodity gamble.
              Origin selection, sensory evaluation, and warehouse discipline
              protect the flavor and appearance your customers expect.
            </p>
          </Reveal>

          <div className="quality-pillars mt-10 space-y-5">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="quality-pillar opacity-0 border-l-2 border-gold pl-5"
              >
                <h3 className="font-display text-2xl text-forest">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.copy}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <Button asChild variant="darkOutline" size="lg">
              <Link href="/quality">
                Explore quality standards
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
