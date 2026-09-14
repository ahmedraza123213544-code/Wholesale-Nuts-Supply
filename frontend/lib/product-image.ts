import { PRODUCT_IMAGE_FALLBACK } from "@/config/constants";
import type { CatalogProduct } from "@/lib/products";

/** Safe image URL for next/image — never pass empty string */
export function productImageSrc(
  product: Pick<CatalogProduct, "image"> | string | null | undefined
) {
  const src = typeof product === "string" ? product : product?.image;
  if (src && src.trim()) return src.trim();
  return PRODUCT_IMAGE_FALLBACK;
}
