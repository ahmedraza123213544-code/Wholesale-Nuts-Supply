"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { whyUsPricingPoints } from "@/lib/why-us";

export function WhyUsPricing() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <Reveal>
            <Badge variant="forest">Competitive Wholesale Pricing</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
              Value designed for volume buyers.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              We focus on competitive wholesale pricing and clear communication—
              not unsupported claims. Share your requirements and we&apos;ll
              respond with a quote tailored to your program.
            </p>
          </Reveal>

          <StaggerReveal className="mt-10 space-y-4">
            {whyUsPricingPoints.map((point, index) => (
              <article
                key={point.title}
                data-reveal-item
                className="opacity-0 flex gap-4 rounded-2xl border border-forest/10 bg-white p-5"
              >
                <span className="font-display text-2xl text-gold-deep">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl text-ink">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </article>
            ))}
          </StaggerReveal>

          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/contact">
                Request Wholesale Pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            <Image
              src="/products/mixed-nuts.jpg"
              alt="Wholesale nut assortment representing competitive bulk value"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-display text-3xl text-ivory text-balance">
                Clear quotes. Flexible requirements. Better wholesale value.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
