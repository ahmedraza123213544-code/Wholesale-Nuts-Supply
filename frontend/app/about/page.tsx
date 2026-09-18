import { AboutChooseUs } from "@/components/about/about-choose-us";
import { AboutFinalCta } from "@/components/about/about-final-cta";
import { AboutHero } from "@/components/about/about-hero";
import { AboutMissionVision } from "@/components/about/about-mission-vision";
import { AboutQualityPromise } from "@/components/about/about-quality-promise";
import { AboutQualitySourcing } from "@/components/about/about-quality-sourcing";
import { AboutStats } from "@/components/about/about-stats";
import { AboutStory } from "@/components/about/about-story";
import { AboutWhoWeServe } from "@/components/about/about-who-we-serve";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Learn about Wholesale Nut Supply—our story, mission, quality standards, and commitment to wholesale customers in Karachi and beyond.",
  path: "/about",
  keywords: [
    "about wholesale nut supply",
    "nuts wholesaler Karachi",
    "B2B nut supplier history",
  ],
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
        ])}
      />
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
