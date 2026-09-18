import { Suspense } from "react";
import { ContactFinalCta } from "@/components/contact/contact-final-cta";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactInfoCards } from "@/components/contact/contact-info-cards";
import { ContactInquiryForm } from "@/components/contact/contact-inquiry-form";
import { ContactMapSection } from "@/components/contact/contact-map-section";
import { ContactWhySection } from "@/components/contact/contact-why-section";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Request wholesale pricing, discuss bulk orders, or contact Wholesale Nut Supply in Bahadurabad, Karachi.",
  path: "/contact",
  keywords: [
    "contact wholesale nut supplier",
    "request nut wholesale quote",
    "Bahadurabad Karachi nuts supplier",
  ],
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact Us", path: "/contact" },
        ])}
      />
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
