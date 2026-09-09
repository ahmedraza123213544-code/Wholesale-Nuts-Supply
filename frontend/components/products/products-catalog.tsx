"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCategories, fetchProducts } from "@/lib/product-api";
import {
  availabilityOptions,
  productTypes,
  sortOptions,
  type CatalogProduct,
  type ProductAvailability,
  type ProductType,
  type SortOption,
} from "@/lib/products";

export function ProductsCatalog() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [categories, setCategories] = useState<Array<"All" | string>>(["All"]);
  const [category, setCategory] = useState<"All" | string>("All");
  const [type, setType] = useState<"All" | ProductType>("All");
  const [availability, setAvailability] = useState<"All" | ProductAvailability>(
    "All"
  );
  const [sort, setSort] = useState<SortOption>("featured");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [productData, categoryData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        if (!mounted) return;
        setProducts(productData);
        setCategories(["All", ...categoryData.map((item) => item.name)]);
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load products. Please try again."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let next = products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesType = type === "All" || product.type === type;
      const matchesAvailability =
        availability === "All" || product.availability === availability;
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.shortDescription.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.grade.toLowerCase().includes(q);

      return (
        matchesCategory && matchesType && matchesAvailability && matchesQuery
      );
    });

    next = [...next].sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      if (sort === "availability")
        return String(a.availability).localeCompare(String(b.availability));
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });

    return next;
  }, [availability, category, products, query, sort, type]);

  return (
    <section id="catalog" className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-page relative space-y-8">
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <SlidersHorizontal className="h-4 w-4 text-gold-deep" />
            Browse by category
          </div>
          <Tabs
            value={category}
            onValueChange={(value) => setCategory(value)}
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              {categories.map((item) => (
                <TabsTrigger key={item} value={item}>
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-3 rounded-[1.5rem] border border-black/8 bg-white/80 p-4 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.35)] md:grid-cols-[1.4fr_1fr_1fr_1fr] md:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, grades, categories..."
              className="pl-10"
              aria-label="Search products"
            />
          </div>

          <Select
            value={type}
            onValueChange={(value) => setType(value as "All" | ProductType)}
          >
            <SelectTrigger aria-label="Filter by product type">
              <SelectValue placeholder="Product type" />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((item) => (
                <SelectItem key={item} value={item}>
                  {item === "All" ? "All types" : item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={availability}
            onValueChange={(value) =>
              setAvailability(value as "All" | ProductAvailability)
            }
          >
            <SelectTrigger aria-label="Filter by availability">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              {availabilityOptions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item === "All" ? "All availability" : item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => setSort(value as SortOption)}
          >
            <SelectTrigger aria-label="Sort products">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-ink">{filtered.length}</span>{" "}
            wholesale products
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center rounded-[1.5rem] border border-forest/10 bg-white">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-gold-deep" />
              Loading products from catalog…
            </div>
          </div>
        ) : error ? (
          <div className="rounded-[1.5rem] border border-dashed border-red-300 bg-red-50 px-6 py-16 text-center">
            <h3 className="font-display text-3xl text-ink">Unable to load</h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              {error}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.5rem] border border-dashed border-black/15 bg-stone/40 px-6 py-16 text-center"
          >
            <h3 className="font-display text-3xl text-ink">No products found</h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Try a different search term or reset your filters to browse the
              full wholesale catalog.
            </p>
          </motion.div>
        ) : (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
