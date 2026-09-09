import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactFinalCta } from "@/components/contact/contact-final-cta";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactInfoCards } from "@/components/contact/contact-info-cards";
import { ContactInquiryForm } from "@/components/contact/contact-inquiry-form";
import { ContactMapSection } from "@/components/contact/contact-map-section";
import { ContactWhySection } from "@/components/contact/contact-why-section";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.name}`,
  description:
    "Request wholesale pricing, discuss bulk orders, or contact Wholesale Nut Supply in Bahadurabad, Karachi.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactInfoCards />
      <Suspense fallback={null}>
        <ContactInquiryForm />
      </Suspense>
      <ContactWhySection />
      <ContactMapSection />
      <ContactFinalCta />
    </>
  );
}
