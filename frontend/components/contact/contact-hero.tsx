"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ContactHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
          ".contact-hero-image",
          { scale: 1.1 },
          { scale: 1, duration: 2, ease: "power2.out" },
          0
        )
          .fromTo(
            ".contact-hero-badge",
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            0.2
          )
          .fromTo(
            ".contact-hero-title",
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, duration: 0.95 },
            0.35
          )
          .fromTo(
            ".contact-hero-copy",
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.8 },
            0.55
          )
          .fromTo(
            ".contact-hero-cta",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            0.7
          );

        gsap.to(".contact-hero-parallax", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            ".contact-hero-badge",
            ".contact-hero-title",
            ".contact-hero-copy",
            ".contact-hero-cta",
          ],
          { autoAlpha: 1, y: 0 }
        );
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-forest-deep text-ivory md:min-h-[78svh]"
    >
      <div className="contact-hero-parallax absolute inset-0 -z-10">
        <Image
          src="/products/hero-nuts.jpg"
          alt="Wholesale nuts and dried fruits ready for business orders"
          fill
          priority
          sizes="100vw"
          className="contact-hero-image object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/80 to-forest/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/50 to-transparent" />
        <div className="noise-overlay" />
      </div>

      <div className="container-page relative w-full pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="max-w-3xl">
          <div className="contact-hero-badge opacity-0">
            <Badge variant="outline">Contact Wholesale Team</Badge>
          </div>
          <h1 className="contact-hero-title mt-5 font-display text-5xl leading-[1.05] text-ivory opacity-0 md:text-6xl lg:text-7xl text-balance">
            Let&apos;s talk wholesale.
          </h1>
          <p className="contact-hero-copy mt-6 max-w-xl text-base leading-relaxed text-ivory/75 opacity-0 md:text-lg">
            Tell us what your business needs—volume, grades, packaging, and
            delivery windows. Our team responds with clear pricing and
            availability.
          </p>
          <div className="contact-hero-cta mt-9 opacity-0">
            <Button asChild size="xl" variant="outline">
              <a href="#inquiry-form">
                Start Your Inquiry
                <ArrowDownRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
