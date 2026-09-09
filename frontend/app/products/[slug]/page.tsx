import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/products/product-detail-view";
import { fetchProductBySlug, fetchProducts } from "@/lib/product-api";
import { siteConfig } from "@/lib/site-data";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const products = await fetchProducts();
    return products.map((product) => ({ slug: product.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { product } = await fetchProductBySlug(slug);
    return {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.shortDescription,
    };
  } catch {
    return { title: `Product | ${siteConfig.name}` };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const { product, related } = await fetchProductBySlug(slug);
    return <ProductDetailView product={product} related={related} />;
  } catch {
    notFound();
  }
}
