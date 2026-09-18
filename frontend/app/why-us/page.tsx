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
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Why Choose Us",
  description:
    "Discover why wholesale buyers choose Wholesale Nut Supply for premium quality, competitive pricing, reliable supply, and professional service.",
  path: "/why-us",
  keywords: [
    "why choose wholesale nut supplier",
    "reliable bulk nut supply",
    "competitive wholesale nut pricing",
  ],
});

export default function WhyUsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Why Us", path: "/why-us" },
        ])}
      />
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
