import { Request, Response, Router } from "express";
import { prisma } from "../prisma/client";
import asyncHandler from "../middleware/asyncHandler";

type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryId: string | null;
  type: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  grade: string;
  packaging: string[];
  sizes: string[];
  moq: string;
  availability: string;
  featured: boolean;
  specifications: { label: string; value: string }[];
  qualityNotes: string[];
  wholesaleInfo: string;
};

function mapProduct(product: any): CatalogProduct {
  const images = (product.ProductImage || [])
    .filter((img: any) => img.is_active && img.image)
    .map((img: any) => img.image as string);
  const description = product.description || "";
  return {
    id: product.id,
    slug: product.code,
    name: product.name,
    category: product.category?.name || "Other",
    categoryId: product.category_id || null,
    type: product.subcategory?.name || "Raw",
    shortDescription:
      description.length > 160 ? `${description.slice(0, 157)}...` : description || product.name,
    description: description || product.name,
    image: images[0] || product.category?.image || "",
    gallery: images,
    grade: product.pct_or_hs_code || "Wholesale Grade",
    packaging: ["Bulk / wholesale packs"],
    sizes: product.size?.name ? [product.size.name] : ["Standard"],
    moq: product.min_qty ? `From ${product.min_qty}` : "Contact for MOQ",
    availability: product.is_active ? "In Stock" : "Limited",
    featured: Boolean(product.is_featured),
    specifications: [
      { label: "SKU", value: product.sku },
      { label: "Code", value: product.code },
      { label: "Category", value: product.category?.name || "Other" },
    ],
    qualityNotes: ["POS catalog product", "Available for wholesale programs"],
    wholesaleInfo:
      "Request wholesale pricing based on volume, packaging, and delivery destination.",
  };
}

const productInclude = {
  category: true,
  subcategory: true,
  size: true,
  ProductImage: {
    where: { is_active: true },
    orderBy: { created_at: "asc" as const },
  },
};

export const listWebsiteProducts = asyncHandler(async (req: Request, res: Response) => {
  const { category, featured, q } = req.query;
  const where: any = {
    is_active: true,
    display_on_pos: true,
  };

  if (category && category !== "All") {
    where.category = { name: String(category) };
  }
  if (featured === "true") {
    where.is_featured = true;
  }
  if (q) {
    const term = String(q);
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { code: { contains: term, mode: "insensitive" } },
      { sku: { contains: term, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: productInclude,
    orderBy: [{ is_featured: "desc" }, { name: "asc" }],
  });

  res.json({ data: products.map(mapProduct) });
});

export const getWebsiteProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.findFirst({
    where: {
      code: req.params.slug,
      is_active: true,
    },
    include: productInclude,
  });

  if (!product) {
    res.status(404).json({ error: "Product not found." });
    return;
  }

  const related = await prisma.product.findMany({
    where: {
      is_active: true,
      id: { not: product.id },
      OR: [
        { category_id: product.category_id || undefined },
        { is_featured: true },
      ],
    },
    include: productInclude,
    take: 3,
    orderBy: [{ is_featured: "desc" }, { name: "asc" }],
  });

  res.json({
    data: mapProduct(product),
    related: related.map(mapProduct),
  });
});

export const listWebsiteCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    where: { is_active: true, display_on_pos: true },
    include: {
      _count: {
        select: { products: { where: { is_active: true } } },
      },
    },
    orderBy: { name: "asc" },
  });

  res.json({
    data: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image || "",
      productCount: category._count.products,
    })),
  });
});

export const createWebsiteInquiry = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body || {};
  const required = [
    "fullName",
    "companyName",
    "email",
    "phone",
    "businessType",
    "productInterest",
    "orderQuantity",
    "message",
  ];

  for (const key of required) {
    if (!String(body[key] || "").trim()) {
      res.status(400).json({ error: `${key} is required.` });
      return;
    }
  }

  const inquiry = await prisma.websiteInquiry.create({
    data: {
      full_name: String(body.fullName).trim(),
      company_name: String(body.companyName).trim(),
      email: String(body.email).trim(),
      phone: String(body.phone).trim(),
      business_type: String(body.businessType).trim(),
      product_interest: String(body.productInterest).trim(),
      order_quantity: String(body.orderQuantity).trim(),
      message: String(body.message).trim(),
      status: "new",
    },
  });

  res.status(201).json({ data: { id: inquiry.id } });
});

const router = Router();
router.get("/products", listWebsiteProducts);
router.get("/products/:slug", getWebsiteProductBySlug);
router.get("/categories", listWebsiteCategories);
router.post("/inquiries", createWebsiteInquiry);
router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "wholesale-nuts-pos-website-api" });
});

export default router;
