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

export default function Home() {
  return (
    <>
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
