"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function QualityCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".quality-cta-content > *",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
          },
        }
      );

      gsap.to(".quality-cta-bg", {
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0">
        <Image
          src="/products/quality-nuts.jpg"
          alt="Premium nuts ready for wholesale quality programs"
          fill
          sizes="100vw"
          className="quality-cta-bg object-cover scale-105"
        />
        <div className="absolute inset-0 bg-forest-deep/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(212,175,55,0.25),transparent_45%)]" />
      </div>

      <div className="container-page relative">
        <div className="quality-cta-content mx-auto max-w-3xl text-center text-ivory">
          <p className="font-display text-lg tracking-[0.22em] text-gold opacity-0">
            QUALITY YOUR BUSINESS CAN COUNT ON
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl lg:text-6xl opacity-0 text-balance">
            Partner with a wholesale supplier built around consistency.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ivory/75 opacity-0 md:text-lg">
            Tell us what you need—products, volumes, and packaging—and we&apos;ll
            respond with clear pricing and availability.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 opacity-0 sm:flex-row">
            <Button asChild size="xl">
              <Link href="/contact">
                Request Wholesale Pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/contact">
                Contact Us
                <MessageCircle className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
