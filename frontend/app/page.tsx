import type { Metadata } from "next";
import { PageLoader } from "@/components/animations/page-loader";
import { FeaturedCtaSection } from "@/components/home/featured-cta-section";
import { HeroSection } from "@/components/home/hero-section";
import { IndustriesSection } from "@/components/home/industries-section";
import { ProcessSection } from "@/components/home/process-section";
import { ProductsSection } from "@/components/home/products-section";
import { QualitySection } from "@/components/home/quality-section";
import { StatsSection } from "@/components/home/stats-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { WhyUsSection } from "@/components/home/why-us-section";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL, pageMetadata, testimonialJsonLd } from "@/lib/seo";
import { siteConfig, testimonials } from "@/lib/site-data";

// Home shares the root layout's route segment, so title.template does not
// apply here — the layout's own default title is used for <title> instead.
export const metadata: Metadata = {
  ...pageMetadata({
    title: `${siteConfig.name} | Premium Wholesale Nuts Supplier`,
    description: siteConfig.description,
    path: "/",
    keywords: [
      "wholesale nuts supplier Karachi",
      "bulk almonds cashews pistachios",
      "wholesale dry fruits Pakistan",
      "B2B nut distributor",
    ],
  }),
  title: `${siteConfig.name} | Premium Wholesale Nuts Supplier in Karachi, Pakistan`,
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${SITE_URL}/#webpage`,
          url: SITE_URL,
          name: `${siteConfig.name} | Premium Wholesale Nuts Supplier`,
          description: siteConfig.description,
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: { "@id": `${SITE_URL}/#organization` },
        }}
      />
      {testimonials.map((testimonial) => (
        <JsonLd key={testimonial.name} data={testimonialJsonLd(testimonial)} />
      ))}
      <PageLoader />
      <HeroSection />
      <StatsSection />
      <ProductsSection />
      <WhyUsSection />
      <ProcessSection />
      <QualitySection />
      <IndustriesSection />
      <FeaturedCtaSection />
      <TestimonialsSection />
    </>
  );
}
