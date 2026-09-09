"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 1.35,
        });

        tl.fromTo(
          ".hero-image",
          { scale: 1.12 },
          { scale: 1, duration: 2.2, ease: "power2.out" },
          0
        )
          .fromTo(
            ".hero-brand",
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, duration: 1 },
            0.2
          )
          .fromTo(
            ".hero-headline",
            { autoAlpha: 0, y: 42 },
            { autoAlpha: 1, y: 0, duration: 1 },
            0.35
          )
          .fromTo(
            ".hero-copy",
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.9 },
            0.55
          )
          .fromTo(
            ".hero-cta",
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 },
            0.75
          );

        gsap.to(".hero-parallax", {
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
          [".hero-brand", ".hero-headline", ".hero-copy", ".hero-cta"],
          { autoAlpha: 1, y: 0 }
        );
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-forest-deep text-ivory"
    >
      <div className="hero-parallax absolute inset-0 -z-10">
        <Image
          src="/products/hero-nuts.jpg"
          alt="Assorted wholesale nuts and dried fruits in bowls"
          fill
          priority
          sizes="100vw"
          className="hero-image object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/85 to-forest/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/45 to-transparent" />
        <div className="noise-overlay" />
      </div>

      <div className="container-page relative w-full pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="max-w-3xl">
          <p className="hero-brand font-display text-4xl tracking-[0.18em] text-gold opacity-0 sm:text-5xl md:text-6xl">
            {siteConfig.name}
          </p>
          <h1 className="hero-headline mt-5 max-w-2xl font-display text-4xl leading-[1.05] text-ivory opacity-0 sm:text-5xl md:text-6xl lg:text-7xl text-balance">
            Wholesale nuts, sourced and delivered with precision.
          </h1>
          <p className="hero-copy mt-6 max-w-xl text-base leading-relaxed text-ivory/78 opacity-0 md:text-lg">
            Premium almonds, cashews, pistachios, and more—built for retailers,
            manufacturers, and foodservice partners who buy at scale.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="xl" className="hero-cta opacity-0">
              <a href="/contact">
                Request Wholesale Pricing
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="hero-cta opacity-0"
            >
              <Link href="/products">
                Explore Products
                <ArrowDownRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
