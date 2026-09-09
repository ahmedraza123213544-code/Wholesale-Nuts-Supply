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

export function AboutFinalCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".about-final-cta > *",
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

      gsap.to(".about-cta-bg", {
        scale: 1.07,
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
          alt="Premium nuts ready for wholesale partnership"
          fill
          sizes="100vw"
          className="about-cta-bg object-cover scale-105"
        />
        <div className="absolute inset-0 bg-forest-deep/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(212,175,55,0.25),transparent_45%)]" />
      </div>

      <div className="container-page relative">
        <div className="about-final-cta mx-auto max-w-3xl text-center text-ivory">
          <p className="font-display text-lg tracking-[0.22em] text-gold opacity-0">
            PARTNER WITH US
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl lg:text-6xl opacity-0 text-balance">
            Let&apos;s build a stronger supply partnership.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ivory/75 opacity-0 md:text-lg">
            Share your volume goals and product needs. We&apos;ll help you set up
            a wholesale program that stays consistent season after season.
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
