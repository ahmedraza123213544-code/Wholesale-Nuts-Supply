import { z } from "zod";

const stringList = z
  .union([z.array(z.string()), z.string()])
  .transform((value) => {
    if (Array.isArray(value)) {
      return value.map((item) => item.trim()).filter(Boolean);
    }
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  });

const imageUrl = z
  .string()
  .trim()
  .min(1, "Image is required")
  .refine(
    (value) => value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/"),
    "Provide a valid image URL (Cloudinary or site path)"
  );

export const loginSchema = z.object({
  password: z.string().trim().min(1, "Password is required"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters").max(120),
  slug: z.string().trim().max(140).optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional().default(""),
  image: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (value) =>
        !value ||
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("/"),
      "Provide a valid image URL"
    ),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters").max(200),
  slug: z.string().trim().max(180).optional().or(z.literal("")),
  categoryId: z.coerce.number().int().positive("Select a category"),
  type: z.enum(["Raw", "Roasted", "Blanched", "In-Shell", "Mixed", "Dried"]),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters")
    .max(400),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(5000),
  image: imageUrl,
  gallery: stringList.default([]),
  grade: z.string().trim().min(1, "Grade is required").max(120),
  packaging: stringList.default([]),
  sizes: stringList.default([]),
  moq: z.string().trim().min(1, "MOQ is required").max(120),
  availability: z.enum(["In Stock", "Limited", "Made to Order"]),
  featured: z.coerce.boolean().default(false),
  specifications: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional()
    .default([]),
  qualityNotes: stringList.default([]),
  wholesaleInfo: z.string().trim().max(2000).optional().default(""),
  isActive: z.coerce.boolean().optional().default(true),
});

export const inquirySchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(160),
  companyName: z.string().trim().min(2, "Company name is required").max(200),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z.string().trim().min(7, "Phone number is required").max(80),
  businessType: z.string().trim().min(2, "Business type is required").max(120),
  productInterest: z.string().trim().min(2, "Product interest is required").max(160),
  orderQuantity: z.string().trim().min(1, "Order quantity is required").max(120),
  message: z.string().trim().min(12, "Message must be at least 12 characters").max(5000),
});

export const inquiryStatusSchema = z.object({
  status: z.enum(["new", "reviewed", "quoted", "closed"]),
});

export function parseWithZod(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const issues = result.error.issues || [];
  const fieldErrors = {};
  for (const issue of issues) {
    const key = issue.path?.[0] ? String(issue.path[0]) : "form";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }

  return {
    success: false,
    error: issues[0]?.message || "Validation failed",
    fieldErrors,
  };
}
