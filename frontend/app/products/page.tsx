import { FeaturedProducts } from "@/components/products/products-featured";
import { ProductsBenefits } from "@/components/products/products-benefits";
import { ProductsCatalog } from "@/components/products/products-catalog";
import { ProductsCta } from "@/components/products/products-cta";
import { ProductsHero } from "@/components/products/products-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Wholesale Nut Products",
  description:
    "Browse premium wholesale nuts including almonds, cashews, pistachios, walnuts, and custom mixes. Request bulk pricing for your business.",
  path: "/products",
  keywords: [
    "wholesale almonds",
    "wholesale cashews",
    "wholesale pistachios",
    "wholesale walnuts",
    "bulk nuts catalog",
    "wholesale nut pricing",
  ],
});

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ])}
      />
      <ProductsHero />
      <ProductsCatalog />
      <FeaturedProducts />
      <ProductsBenefits />
      <ProductsCta />
    </>
  );
}
