"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ProductsHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
          ".products-hero-image",
          { scale: 1.12 },
          { scale: 1, duration: 2, ease: "power2.out" },
          0
        )
          .fromTo(
            ".products-hero-badge",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            0.2
          )
          .fromTo(
            ".products-hero-title",
            { autoAlpha: 0, y: 36 },
            { autoAlpha: 1, y: 0, duration: 0.95 },
            0.35
          )
          .fromTo(
            ".products-hero-copy",
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.8 },
            0.55
          );

        gsap.to(".products-hero-orb", {
          y: 24,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".products-hero-parallax", {
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
            ".products-hero-badge",
            ".products-hero-title",
            ".products-hero-copy",
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
      className="relative isolate flex min-h-[70svh] items-end overflow-hidden bg-forest-deep text-ivory md:min-h-[78svh]"
    >
      <div className="products-hero-parallax absolute inset-0 -z-10">
        <Image
          src="/products/hero-nuts.jpg"
          alt="Premium wholesale nut assortment"
          fill
          priority
          sizes="100vw"
          className="products-hero-image object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/80 to-forest/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/50 to-transparent" />
        <div className="noise-overlay" />
      </div>

      <div className="products-hero-orb pointer-events-none absolute right-[12%] top-[28%] h-40 w-40 rounded-full bg-gold/15 blur-3xl" />
      <div className="products-hero-orb pointer-events-none absolute left-[8%] top-[40%] h-28 w-28 rounded-full bg-white/5 blur-2xl" />

      <div className="container-page relative w-full pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="max-w-3xl">
          <div className="products-hero-badge opacity-0">
            <Badge variant="outline">Wholesale Catalog</Badge>
          </div>
          <h1 className="products-hero-title mt-5 font-display text-5xl leading-[1.05] opacity-0 md:text-6xl lg:text-7xl text-balance">
            Premium nuts for wholesale.
          </h1>
          <p className="products-hero-copy mt-6 max-w-xl text-base leading-relaxed text-ivory/75 opacity-0 md:text-lg">
            Browse grade-focused almonds, cashews, pistachios, walnuts, and more—
            built for retailers, manufacturers, and distributors buying at scale.
          </p>
        </div>
      </div>
    </section>
  );
}
