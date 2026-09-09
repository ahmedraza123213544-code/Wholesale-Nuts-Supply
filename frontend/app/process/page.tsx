import type { Metadata } from "next";
import { ProcessAudience } from "@/components/process/process-audience";
import { ProcessCta } from "@/components/process/process-cta";
import { ProcessDifferentiators } from "@/components/process/process-differentiators";
import { ProcessHero } from "@/components/process/process-hero";
import { ProcessJourney } from "@/components/process/process-journey";
import { ProcessQualityChain } from "@/components/process/process-quality-chain";
import { ProcessStats } from "@/components/process/process-stats";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `Our Process | ${siteConfig.name}`,
  description:
    "See how Wholesale Nut Supply works—from exploring products and requesting a quote to quality preparation, delivery, and long-term partnership.",
};

export default function ProcessPage() {
  return (
    <>
      <ProcessHero />
      <ProcessJourney />
      <ProcessQualityChain />
      <ProcessAudience />
      <ProcessDifferentiators />
      <ProcessStats />
      <ProcessCta />
    </>
  );
}
