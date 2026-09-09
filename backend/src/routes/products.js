import { Router } from "express";
import { query } from "../db.js";
import { makeSlug, mapProduct, requireAdmin } from "../utils.js";
import { parseWithZod, productSchema } from "../validation.js";

const router = Router();

const productSelect = `
  SELECT p.*, c.name AS category_name
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
`;

router.get("/", async (req, res) => {
  try {
    const { category, featured, q, page, limit } = req.query;
    const params = [];
    const where = ["p.is_active = TRUE"];

    if (category && category !== "All") {
      params.push(category);
      where.push(`c.name = $${params.length}`);
    }
    if (featured === "true") {
      where.push("p.featured = TRUE");
    }
    if (q) {
      params.push(`%${String(q).toLowerCase()}%`);
      where.push(
        `(LOWER(p.name) LIKE $${params.length} OR LOWER(p.short_description) LIKE $${params.length} OR LOWER(c.name) LIKE $${params.length})`
      );
    }

    const whereSql = where.join(" AND ");
    const paginate = page !== undefined || limit !== undefined;
    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(limit) || 10));

    if (!paginate) {
      const result = await query(
        `${productSelect}
         WHERE ${whereSql}
         ORDER BY p.featured DESC, p.name ASC`,
        params
      );
      return res.json({ data: result.rows.map(mapProduct) });
    }

    const countResult = await query(
      `SELECT COUNT(*)::int AS total
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       WHERE ${whereSql}`,
      params
    );
    const total = countResult.rows[0]?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(pageNum, totalPages);
    const offset = (safePage - 1) * pageSize;

    const result = await query(
      `${productSelect}
       WHERE ${whereSql}
       ORDER BY p.featured DESC, p.name ASC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pageSize, offset]
    );

    res.json({
      data: result.rows.map(mapProduct),
      meta: {
        page: safePage,
        limit: pageSize,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load products." });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const result = await query(
      `${productSelect} WHERE p.slug = $1 AND p.is_active = TRUE LIMIT 1`,
      [req.params.slug]
    );
    const product = mapProduct(result.rows[0]);
    if (!product) return res.status(404).json({ error: "Product not found." });

    const related = await query(
      `${productSelect}
       WHERE p.is_active = TRUE
         AND p.slug <> $1
         AND (c.name = $2 OR p.featured = TRUE)
       ORDER BY p.featured DESC, p.name ASC
       LIMIT 3`,
      [product.slug, product.category]
    );

    res.json({ data: product, related: related.rows.map(mapProduct) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load product." });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const parsed = parseWithZod(productSchema, req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error, fieldErrors: parsed.fieldErrors });
    }

    const body = parsed.data;
    const slug = body.slug ? makeSlug(body.slug) : makeSlug(body.name);

    const result = await query(
      `INSERT INTO products (
        category_id, slug, name, type, short_description, description, image, gallery,
        grade, packaging, sizes, moq, availability, featured, specifications,
        quality_notes, wholesale_info, is_active
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10::jsonb,$11::jsonb,$12,$13,$14,$15::jsonb,$16::jsonb,$17,$18
      )
      RETURNING id`,
      [
        body.categoryId,
        slug,
        body.name,
        body.type,
        body.shortDescription,
        body.description,
        body.image,
        JSON.stringify(body.gallery),
        body.grade,
        JSON.stringify(body.packaging),
        JSON.stringify(body.sizes),
        body.moq,
        body.availability,
        body.featured,
        JSON.stringify(body.specifications),
        JSON.stringify(body.qualityNotes),
        body.wholesaleInfo,
        body.isActive,
      ]
    );

    const created = await query(`${productSelect} WHERE p.id = $1`, [result.rows[0].id]);
    res.status(201).json({ data: mapProduct(created.rows[0]) });
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      return res.status(409).json({ error: "Product slug already exists." });
    }
    res.status(500).json({ error: "Failed to create product." });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const parsed = parseWithZod(productSchema, req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error, fieldErrors: parsed.fieldErrors });
    }

    const body = parsed.data;
    const id = Number(req.params.id);
    const slug = body.slug ? makeSlug(body.slug) : makeSlug(body.name);

    await query(
      `UPDATE products SET
        category_id = $1,
        slug = $2,
        name = $3,
        type = $4,
        short_description = $5,
        description = $6,
        image = $7,
        gallery = $8::jsonb,
        grade = $9,
        packaging = $10::jsonb,
        sizes = $11::jsonb,
        moq = $12,
        availability = $13,
        featured = $14,
        specifications = $15::jsonb,
        quality_notes = $16::jsonb,
        wholesale_info = $17,
        is_active = $18,
        updated_at = NOW()
      WHERE id = $19`,
      [
        body.categoryId,
        slug,
        body.name,
        body.type,
        body.shortDescription,
        body.description,
        body.image,
        JSON.stringify(body.gallery),
        body.grade,
        JSON.stringify(body.packaging),
        JSON.stringify(body.sizes),
        body.moq,
        body.availability,
        body.featured,
        JSON.stringify(body.specifications),
        JSON.stringify(body.qualityNotes),
        body.wholesaleInfo,
        body.isActive,
        id,
      ]
    );

    const updated = await query(`${productSelect} WHERE p.id = $1`, [id]);
    if (!updated.rows[0]) return res.status(404).json({ error: "Product not found." });
    res.json({ data: mapProduct(updated.rows[0]) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update product." });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const result = await query("DELETE FROM products WHERE id = $1 RETURNING id", [
      Number(req.params.id),
    ]);
    if (!result.rows[0]) return res.status(404).json({ error: "Product not found." });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete product." });
  }
});

export default router;
