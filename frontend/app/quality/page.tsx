import type { Metadata } from "next";
import { QualityCta } from "@/components/quality/quality-cta";
import { QualityFreshness } from "@/components/quality/quality-freshness";
import { QualityHero } from "@/components/quality/quality-hero";
import { QualityPackaging } from "@/components/quality/quality-packaging";
import { QualityProcess } from "@/components/quality/quality-process";
import { QualityPromise } from "@/components/quality/quality-promise";
import { QualitySourcing } from "@/components/quality/quality-sourcing";
import { QualityStandards } from "@/components/quality/quality-standards";
import { QualityStats } from "@/components/quality/quality-stats";
import { QualityWhyMatters } from "@/components/quality/quality-why-matters";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `Quality | ${siteConfig.name}`,
  description:
    "Learn how Wholesale Nut Supply sources, inspects, packages, and delivers premium nuts with consistent wholesale quality standards.",
};

export default function QualityPage() {
  return (
    <>
      <QualityHero />
      <QualityPromise />
      <QualitySourcing />
      <QualityProcess />
      <QualityFreshness />
      <QualityPackaging />
      <QualityStandards />
      <QualityWhyMatters />
      <QualityStats />
      <QualityCta />
    </>
  );
}
