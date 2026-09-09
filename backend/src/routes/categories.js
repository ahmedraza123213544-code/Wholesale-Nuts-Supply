import { Router } from "express";
import { query } from "../db.js";
import { makeSlug, requireAdmin } from "../utils.js";
import { categorySchema, parseWithZod } from "../validation.js";

const router = Router();

function mapCategory(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image: row.image || "",
    productCount: row.product_count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

router.get("/", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const paginate = page !== undefined || limit !== undefined;
    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(limit) || 10));

    if (!paginate) {
      const result = await query(
        `SELECT c.*, COUNT(p.id)::int AS product_count
         FROM categories c
         LEFT JOIN products p ON p.category_id = c.id AND p.is_active = TRUE
         GROUP BY c.id
         ORDER BY c.name ASC`
      );
      return res.json({ data: result.rows.map(mapCategory) });
    }

    const countResult = await query(`SELECT COUNT(*)::int AS total FROM categories`);
    const total = countResult.rows[0]?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(pageNum, totalPages);
    const offset = (safePage - 1) * pageSize;

    const result = await query(
      `SELECT c.*, COUNT(p.id)::int AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id AND p.is_active = TRUE
       GROUP BY c.id
       ORDER BY c.name ASC
       LIMIT $1 OFFSET $2`,
      [pageSize, offset]
    );

    res.json({
      data: result.rows.map(mapCategory),
      meta: {
        page: safePage,
        limit: pageSize,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load categories." });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const parsed = parseWithZod(categorySchema, req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error, fieldErrors: parsed.fieldErrors });
    }

    const body = parsed.data;
    const slug = body.slug ? makeSlug(body.slug) : makeSlug(body.name);

    const result = await query(
      `INSERT INTO categories (name, slug, description, image)
       VALUES ($1, $2, $3, $4)
       RETURNING *, 0 AS product_count`,
      [body.name, slug, body.description || "", body.image || ""]
    );

    res.status(201).json({ data: mapCategory(result.rows[0]) });
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      return res.status(409).json({ error: "Category already exists." });
    }
    res.status(500).json({ error: "Failed to create category." });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const parsed = parseWithZod(categorySchema, req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error, fieldErrors: parsed.fieldErrors });
    }

    const body = parsed.data;
    const slug = body.slug ? makeSlug(body.slug) : makeSlug(body.name);

    const result = await query(
      `UPDATE categories
       SET name = $1, slug = $2, description = $3, image = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING *, 0 AS product_count`,
      [body.name, slug, body.description || "", body.image || "", Number(req.params.id)]
    );

    if (!result.rows[0]) return res.status(404).json({ error: "Category not found." });
    res.json({ data: mapCategory(result.rows[0]) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update category." });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const result = await query("DELETE FROM categories WHERE id = $1 RETURNING id", [
      Number(req.params.id),
    ]);
    if (!result.rows[0]) return res.status(404).json({ error: "Category not found." });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete category." });
  }
});

export default router;
