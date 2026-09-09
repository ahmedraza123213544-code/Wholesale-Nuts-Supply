"use client";

import { motion } from "motion/react";
import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site-data";

const cards = [
  {
    title: "Phone",
    value: siteConfig.phone,
    href: siteConfig.phoneHref,
    detail: "Speak directly with our wholesale desk",
    icon: Phone,
  },
  {
    title: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    detail: "Send specs, RFQs, and documentation requests",
    icon: Mail,
  },
  {
    title: "Address",
    value: siteConfig.address,
    href: "https://www.google.com/maps/search/?api=1&query=Bahadurabad+Karachi",
    detail: "Visit or arrange pickup coordination",
    icon: MapPin,
  },
  {
    title: "Business Hours",
    value: siteConfig.hours,
    href: undefined,
    detail: "Weekend support available by appointment",
    icon: Clock3,
  },
  {
    title: "WhatsApp",
    value: "Chat with our team",
    href: siteConfig.whatsapp,
    detail: "Quick quotes and availability updates",
    icon: MessageCircle,
  },
];

export function ContactInfoCards() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-page relative">
        <Reveal>
          <div className="max-w-2xl">
            <Badge variant="forest">Contact Information</Badge>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl text-balance">
              Reach the team that handles wholesale accounts.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Prefer a call, email, or WhatsApp? Choose the channel that fits
              your procurement workflow.
            </p>
          </div>
        </Reveal>

        <StaggerReveal className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            const inner = (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-deep transition duration-500 group-hover:scale-110">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-gold-deep">
                  {card.title}
                </p>
                <p className="mt-2 font-display text-2xl text-ink">{card.value}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {card.detail}
                </p>
              </>
            );

            return (
              <motion.div
                key={card.title}
                data-reveal-item
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="opacity-0"
              >
                {card.href ? (
                  <a
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      card.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group block h-full rounded-2xl border border-black/8 bg-white/80 p-6 shadow-[0_20px_50px_-36px_rgba(0,0,0,0.35)] transition duration-500 hover:border-gold/40 hover:shadow-[0_28px_60px_-34px_rgba(212,175,55,0.45)]"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="group h-full rounded-2xl border border-black/8 bg-white/80 p-6 shadow-[0_20px_50px_-36px_rgba(0,0,0,0.35)] transition duration-500 hover:border-gold/40">
                    {inner}
                  </div>
                )}
              </motion.div>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
