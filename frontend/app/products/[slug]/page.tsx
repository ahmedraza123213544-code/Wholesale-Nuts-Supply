import { ProductSlugRedirect } from "./redirect-client";
import { fetchProducts } from "@/lib/product-api";

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

export default async function ProductSlugPage({ params }: Props) {
  const { slug } = await params;
  return <ProductSlugRedirect slug={slug} />;
}
