import slugify from "slugify";

export function makeSlug(value) {
  return slugify(value, { lower: true, strict: true });
}

export function mapProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category_name || row.category || "Other",
    categoryId: row.category_id,
    type: row.type,
    shortDescription: row.short_description,
    description: row.description,
    image: row.image,
    gallery: row.gallery || [],
    grade: row.grade,
    packaging: row.packaging || [],
    sizes: row.sizes || [],
    moq: row.moq,
    availability: row.availability,
    featured: row.featured,
    specifications: row.specifications || [],
    qualityNotes: row.quality_notes || [],
    wholesaleInfo: row.wholesale_info,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function parseList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function requireAdmin(req, res, next) {
  const password = req.headers["x-admin-password"] || req.query.password;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized. Provide admin password." });
  }
  return next();
}
