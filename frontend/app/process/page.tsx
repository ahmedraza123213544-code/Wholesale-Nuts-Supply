import { ProcessAudience } from "@/components/process/process-audience";
import { ProcessCta } from "@/components/process/process-cta";
import { ProcessDifferentiators } from "@/components/process/process-differentiators";
import { ProcessHero } from "@/components/process/process-hero";
import { ProcessJourney } from "@/components/process/process-journey";
import { ProcessQualityChain } from "@/components/process/process-quality-chain";
import { ProcessStats } from "@/components/process/process-stats";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Process",
  description:
    "See how Wholesale Nut Supply works—from exploring products and requesting a quote to quality preparation, delivery, and long-term partnership.",
  path: "/process",
  keywords: [
    "how to order wholesale nuts",
    "bulk nut ordering process",
    "wholesale nut quote request",
  ],
});

export default function ProcessPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Our Process", path: "/process" },
        ])}
      />
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
