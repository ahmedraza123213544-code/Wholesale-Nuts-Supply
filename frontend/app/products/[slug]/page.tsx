import type { Metadata } from "next";
import { ProductSlugRedirect } from "./redirect-client";
import { JsonLd } from "@/components/seo/json-ld";
import { fetchProductBySlug, fetchProducts } from "@/lib/product-api";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, productJsonLd } from "@/lib/seo";
import { productImageSrc } from "@/lib/product-image";

export async function generateStaticParams() {
  try {
    const products = await fetchProducts();
    return products.map((product) => ({ slug: product.slug }));
  } catch (err) {
    console.warn("[generateStaticParams] products fetch failed:", err);
    return [{ slug: "placeholder" }];
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { product } = await fetchProductBySlug(slug, { cache: "force-cache" });
    const imageSrc = productImageSrc(product);
    return pageMetadata({
      title: product.name,
      description: product.shortDescription || product.description,
      path: `/products/${slug}`,
      keywords: [product.name, product.category, product.type, "wholesale"].filter(
        Boolean
      ) as string[],
      image: {
        url: imageSrc.startsWith("http") ? imageSrc : absoluteUrl(imageSrc),
        width: 1200,
        height: 900,
        alt: product.name,
      },
    });
  } catch {
    return pageMetadata({
      title: "Product",
      description: "Browse premium wholesale nuts from Wholesale Nut Supply.",
      path: `/products/${slug}`,
    });
  }
}

export default async function ProductSlugPage({ params }: Props) {
  const { slug } = await params;

  let jsonLd: Record<string, unknown> | null = null;
  let productName = slug;
  try {
    const { product } = await fetchProductBySlug(slug, { cache: "force-cache" });
    productName = product.name;
    jsonLd = productJsonLd({
      name: product.name,
      slug,
      description: product.shortDescription || product.description,
      image: productImageSrc(product),
      category: product.category,
      grade: product.grade,
    });
  } catch (err) {
    console.warn("[ProductSlugPage] product fetch failed:", err);
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: productName, path: `/products/${slug}` },
        ])}
      />
      {jsonLd && <JsonLd data={jsonLd} />}
      <ProductSlugRedirect slug={slug} />
    </>
  );
}
