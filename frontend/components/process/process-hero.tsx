"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ProcessHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
          ".process-page-hero-image",
          { scale: 1.12 },
          { scale: 1, duration: 2.1, ease: "power2.out" },
          0
        )
          .fromTo(
            ".process-page-hero-badge",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            0.2
          )
          .fromTo(
            ".process-page-hero-title",
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 1 },
            0.35
          )
          .fromTo(
            ".process-page-hero-copy",
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.85 },
            0.55
          )
          .fromTo(
            ".process-page-hero-cta",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.1 },
            0.7
          );

        gsap.to(".process-page-hero-parallax", {
          yPercent: 12,
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
            ".process-page-hero-badge",
            ".process-page-hero-title",
            ".process-page-hero-copy",
            ".process-page-hero-cta",
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
      className="relative isolate flex min-h-[80svh] items-end overflow-hidden bg-forest-deep text-ivory md:min-h-[88svh]"
    >
      <div className="process-page-hero-parallax absolute inset-0 -z-10">
        <Image
          src="/products/cta-nuts.jpg"
          alt="Wholesale nuts prepared for the supply journey from source to delivery"
          fill
          priority
          sizes="100vw"
          className="process-page-hero-image object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/85 to-forest/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/45 to-transparent" />
        <div className="noise-overlay" />
      </div>

      <div className="container-page relative w-full pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="max-w-3xl">
          <div className="process-page-hero-badge opacity-0">
            <Badge variant="outline">Our Process</Badge>
          </div>
          <h1 className="process-page-hero-title mt-5 font-display text-5xl leading-[1.05] opacity-0 md:text-6xl lg:text-7xl text-balance">
            Simple. Reliable. From source to your business.
          </h1>
          <p className="process-page-hero-copy mt-6 max-w-xl text-base leading-relaxed text-ivory/75 opacity-0 md:text-lg">
            A clear wholesale journey—from exploring products and requesting a
            quote to quality preparation, delivery, and long-term partnership.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="xl"
              className="process-page-hero-cta opacity-0"
            >
              <Link href="/contact">
                Request Wholesale Pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="process-page-hero-cta opacity-0"
            >
              <Link href="/products">
                Explore Our Products
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
