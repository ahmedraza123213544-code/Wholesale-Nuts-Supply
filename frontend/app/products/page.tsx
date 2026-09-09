import type { Metadata } from "next";
import { FeaturedProducts } from "@/components/products/products-featured";
import { ProductsBenefits } from "@/components/products/products-benefits";
import { ProductsCatalog } from "@/components/products/products-catalog";
import { ProductsCta } from "@/components/products/products-cta";
import { ProductsHero } from "@/components/products/products-hero";
import { siteConfig } from "@/lib/site-data";

export const metadata: Metadata = {
  title: `Products | ${siteConfig.name}`,
  description:
    "Browse premium wholesale nuts including almonds, cashews, pistachios, walnuts, and custom mixes. Request bulk pricing for your business.",
};

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      <ProductsCatalog />
      <FeaturedProducts />
      <ProductsBenefits />
      <ProductsCta />
    </>
  );
}
