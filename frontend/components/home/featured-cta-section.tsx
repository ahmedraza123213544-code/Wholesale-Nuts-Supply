"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function FeaturedCtaSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".cta-content > *",
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
          },
        }
      );

      gsap.to(".cta-bg", {
        scale: 1.08,
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
          src="/products/cta-nuts.jpg"
          alt="Premium almonds and pistachios ready for wholesale orders"
          fill
          sizes="100vw"
          className="cta-bg object-cover scale-105"
        />
        <div className="absolute inset-0 bg-forest-deep/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(197,160,89,0.28),transparent_45%)]" />
      </div>

      <div className="container-page relative">
        <div className="cta-content mx-auto max-w-3xl text-center text-ivory">
          <p className="font-display text-lg tracking-[0.25em] text-gold opacity-0">
            READY TO SOURCE
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl lg:text-6xl opacity-0 text-balance">
            Secure wholesale pricing for your next nut program.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ivory/75 opacity-0 md:text-lg">
            Tell us your volume, preferred grades, and delivery windows. Our
            team responds with clear pricing and availability.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 opacity-0 sm:flex-row">
            <Button asChild size="xl">
              <a href="/contact">
                Request Wholesale Pricing
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="xl" variant="outline">
              <a href="mailto:orders@wholesalenutsupply.com">Email Our Team</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
