"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { aboutStory } from "@/lib/site-data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function AboutStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".story-image-main",
        { autoAlpha: 0, y: 40, scale: 1.04 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        ".story-image-accent",
        { autoAlpha: 0, x: 30, y: 30 },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 1,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
          },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <div className="story-image-main relative aspect-[4/5] overflow-hidden rounded-[2rem] opacity-0">
            <Image
              src="/products/walnuts.jpg"
              alt="Carefully graded walnuts representing our wholesale craft"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          </div>
          <div className="story-image-accent absolute -bottom-8 -right-4 hidden w-[55%] overflow-hidden rounded-[1.5rem] border border-white/40 shadow-2xl opacity-0 md:block">
            <div className="relative aspect-[4/3]">
              <Image
                src="/products/mixed-nuts.jpg"
                alt="Assorted wholesale nut varieties"
                fill
                sizes="280px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <Reveal>
          <Badge variant="forest">{aboutStory.eyebrow}</Badge>
          <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
            {aboutStory.title}
          </h2>
          <div className="mt-6 space-y-5">
            {aboutStory.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-black/10 pt-8">
            <div>
              <p className="font-display text-3xl text-gold-deep">Karachi</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Based in Bahadurabad
              </p>
            </div>
            <div>
              <p className="font-display text-3xl text-gold-deep">B2B First</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Built for wholesale buyers
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
