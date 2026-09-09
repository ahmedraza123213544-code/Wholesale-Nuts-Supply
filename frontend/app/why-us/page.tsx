import type { Metadata } from "next";
import { WhyUsAdvantages } from "@/components/why-us/why-us-advantages";
import { WhyUsAudience } from "@/components/why-us/why-us-audience";
import { WhyUsCta } from "@/components/why-us/why-us-cta";
import { WhyUsHero } from "@/components/why-us/why-us-hero";
import { WhyUsPricing } from "@/components/why-us/why-us-pricing";
import { WhyUsProcess } from "@/components/why-us/why-us-process";
import { WhyUsQuality } from "@/components/why-us/why-us-quality";
import { WhyUsStats } from "@/components/why-us/why-us-stats";
import { WhyUsSupply } from "@/components/why-us/why-us-supply";
import { WhyUsTrust } from "@/components/why-us/why-us-trust";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `Why Us | ${siteConfig.name}`,
  description:
    "Discover why wholesale buyers choose Wholesale Nut Supply for premium quality, competitive pricing, reliable supply, and professional service.",
};

export default function WhyUsPage() {
  return (
    <>
      <WhyUsHero />
      <WhyUsAdvantages />
      <WhyUsQuality />
      <WhyUsSupply />
      <WhyUsPricing />
      <WhyUsAudience />
      <WhyUsProcess />
      <WhyUsTrust />
      <WhyUsStats />
      <WhyUsCta />
    </>
  );
}
