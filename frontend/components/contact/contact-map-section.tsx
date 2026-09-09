"use client";

import { MapPin, Navigation } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-data";

export function ContactMapSection() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Badge variant="forest">Location</Badge>
              <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
                Find us in Bahadurabad, Karachi.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                Centrally positioned for wholesale coordination, meetings, and
                logistics planning across Karachi.
              </p>
            </div>
            <Button asChild variant="darkOutline" size="lg">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Bahadurabad+Karachi"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Maps
                <Navigation className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </Reveal>

        <Reveal className="mt-10" delay={0.1}>
          <div className="overflow-hidden rounded-[1.75rem] border border-black/8 bg-white shadow-[0_30px_70px_-45px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-3 border-b border-black/8 bg-stone/40 px-5 py-4">
              <MapPin className="h-4 w-4 text-gold-deep" />
              <p className="text-sm text-ink">{siteConfig.address}</p>
            </div>
            <div className="relative aspect-[16/9] w-full bg-stone">
              <iframe
                title="Wholesale Nut Supply location map"
                src={siteConfig.mapUrl}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
