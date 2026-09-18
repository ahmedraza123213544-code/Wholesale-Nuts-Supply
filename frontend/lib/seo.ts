import type { Metadata } from "next";
import { SITE_URL } from "@/config/constants";
import { siteConfig } from "@/lib/site-data";

export { SITE_URL };

/** Default social-share image used whenever a page doesn't set its own. */
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/products/hero-nuts.jpg`,
  width: 2400,
  height: 1600,
  alt: `${siteConfig.name} — premium wholesale nuts`,
};

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Normalizes a route to match the site's trailingSlash:true export output. */
function canonicalPath(path: string) {
  if (path === "/" || path === "") return "/";
  return `${path.replace(/\/+$/, "")}/`;
}

function canonicalUrl(path: string) {
  return `${SITE_URL}${canonicalPath(path)}`;
}

/**
 * Builds a full Metadata object for an inner page (about, products, etc.).
 * `title` should be the short segment title (e.g. "About Us") — the root
 * layout's title.template appends " | Wholesale Nut Supply" automatically.
 */
export function pageMetadata(options: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: typeof DEFAULT_OG_IMAGE;
}): Metadata {
  const url = canonicalPath(options.path);
  const fullTitle = `${options.title} | ${siteConfig.name}`;
  const image = options.image ?? DEFAULT_OG_IMAGE;

  return {
    title: options.title,
    description: options.description,
    keywords: options.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      locale: "en_US",
      title: fullTitle,
      description: options.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: options.description,
      images: [image.url],
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

/** Sitewide Organization/LocalBusiness entity, rendered once in the root layout. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: SITE_URL,
    logo: absoluteUrl("/icon.png"),
    image: absoluteUrl("/icon.png"),
    telephone: siteConfig.phoneHref.replace("tel:", ""),
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bahadurabad",
      addressLocality: "Karachi",
      addressCountry: "PK",
    },
    hasMap: siteConfig.mapUrl,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "$$",
  };
}

/** Sitewide WebSite entity, rendered once in the root layout. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * Review schema for the real customer testimonials shown on the homepage.
 * No `reviewRating` is included — the site only displays quotes, not star
 * ratings, and fabricating a rating value would violate Google's structured
 * data policies.
 */
export function testimonialJsonLd(testimonial: {
  quote: string;
  name: string;
  role: string;
  company: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@id": `${SITE_URL}/#organization` },
    reviewBody: testimonial.quote,
    author: {
      "@type": "Person",
      name: testimonial.name,
      jobTitle: testimonial.role,
      worksFor: {
        "@type": "Organization",
        name: testimonial.company,
      },
    },
  };
}

/** Product schema for a single wholesale catalog item's detail page. */
export function productJsonLd(product: {
  name: string;
  slug: string;
  description: string;
  image: string;
  category?: string;
  grade?: string;
}) {
  // No public price list exists (wholesale pricing is quote-based via
  // WhatsApp/contact), so `offers` is intentionally omitted rather than
  // filled with a fabricated price — Google penalizes inaccurate offer data.
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`/products/${product.slug}/`),
    name: product.name,
    description: product.description,
    image: product.image.startsWith("http")
      ? product.image
      : absoluteUrl(product.image),
    category: product.category,
    sku: product.slug,
    brand: { "@type": "Brand", name: siteConfig.name },
    ...(product.grade
      ? {
          additionalProperty: [
            { "@type": "PropertyValue", name: "Grade", value: product.grade },
          ],
        }
      : {}),
  };
}
