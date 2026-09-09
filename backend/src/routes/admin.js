import { Router } from "express";
import { query } from "../db.js";
import { requireAdmin } from "../utils.js";
import { loginSchema, parseWithZod } from "../validation.js";

const router = Router();

router.post("/login", (req, res) => {
  const parsed = parseWithZod(loginSchema, req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error, fieldErrors: parsed.fieldErrors });
  }

  if (parsed.data.password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid admin password." });
  }
  res.json({ success: true });
});

router.get("/stats", requireAdmin, async (_req, res) => {
  try {
    const [products, categories, inquiries, newInquiries] = await Promise.all([
      query("SELECT COUNT(*)::int AS count FROM products"),
      query("SELECT COUNT(*)::int AS count FROM categories"),
      query("SELECT COUNT(*)::int AS count FROM inquiries"),
      query("SELECT COUNT(*)::int AS count FROM inquiries WHERE status = 'new'"),
    ]);

    res.json({
      data: {
        products: products.rows[0].count,
        categories: categories.rows[0].count,
        inquiries: inquiries.rows[0].count,
        newInquiries: newInquiries.rows[0].count,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load dashboard stats." });
  }
});

export default router;
