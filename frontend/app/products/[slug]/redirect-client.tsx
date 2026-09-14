"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/** Hostinger-safe: pretty URL → client details page with live API fetch */
export function ProductSlugRedirect({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug || slug === "placeholder") return;
    window.location.replace(
      `/products/details/?slug=${encodeURIComponent(slug)}`
    );
  }, [slug]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center pt-28">
      <Loader2 className="h-8 w-8 animate-spin text-gold-deep" />
    </div>
  );
}
