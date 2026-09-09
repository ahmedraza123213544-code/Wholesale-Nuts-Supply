import type { Metadata } from "next";
import { AboutChooseUs } from "@/components/about/about-choose-us";
import { AboutFinalCta } from "@/components/about/about-final-cta";
import { AboutHero } from "@/components/about/about-hero";
import { AboutMissionVision } from "@/components/about/about-mission-vision";
import { AboutQualityPromise } from "@/components/about/about-quality-promise";
import { AboutQualitySourcing } from "@/components/about/about-quality-sourcing";
import { AboutStats } from "@/components/about/about-stats";
import { AboutStory } from "@/components/about/about-story";
import { AboutWhoWeServe } from "@/components/about/about-who-we-serve";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description:
    "Learn about Wholesale Nut Supply—our story, mission, quality standards, and commitment to wholesale customers in Karachi and beyond.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutMissionVision />
      <AboutQualitySourcing />
      <AboutChooseUs />
      <AboutStats />
      <AboutWhoWeServe />
      <AboutQualityPromise />
      <AboutFinalCta />
    </>
  );
}
