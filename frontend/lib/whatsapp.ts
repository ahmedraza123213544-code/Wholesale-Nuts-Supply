import { siteConfig } from "@/lib/site-data";

const WHATSAPP_NUMBER = "923362500357";

export function getWhatsAppQuoteUrl(product: {
  name: string;
  category?: string;
  grade?: string;
  slug?: string;
}) {
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const lines = [
    `Hello ${siteConfig.name},`,
    "",
    "I would like wholesale pricing for this product:",
    `• Product: ${product.name}`,
  ];

  if (product.category) lines.push(`• Category: ${product.category}`);
  if (product.grade) lines.push(`• Grade: ${product.grade}`);
  if (product.slug) {
    lines.push(`• Product link: ${siteUrl}/products/${product.slug}`);
  }

  lines.push(
    "",
    "Please share availability, packaging options, and wholesale pricing."
  );

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function getWhatsAppUrl(message?: string) {
  if (!message) return siteConfig.whatsapp;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
