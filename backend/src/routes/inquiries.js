import { Router } from "express";
import { query } from "../db.js";
import { requireAdmin } from "../utils.js";
import {
  inquirySchema,
  inquiryStatusSchema,
  parseWithZod,
} from "../validation.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const parsed = parseWithZod(inquirySchema, req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error, fieldErrors: parsed.fieldErrors });
    }

    const body = parsed.data;
    const result = await query(
      `INSERT INTO inquiries (
        full_name, company_name, email, phone, business_type,
        product_interest, order_quantity, message
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        body.fullName,
        body.companyName,
        body.email,
        body.phone,
        body.businessType,
        body.productInterest,
        body.orderQuantity,
        body.message,
      ]
    );

    const row = result.rows[0];
    res.status(201).json({
      data: {
        id: row.id,
        fullName: row.full_name,
        companyName: row.company_name,
        email: row.email,
        phone: row.phone,
        businessType: row.business_type,
        productInterest: row.product_interest,
        orderQuantity: row.order_quantity,
        message: row.message,
        status: row.status,
        createdAt: row.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save inquiry." });
  }
});

router.get("/", requireAdmin, async (_req, res) => {
  try {
    const result = await query(
      `SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 500`
    );
    res.json({
      data: result.rows.map((row) => ({
        id: row.id,
        fullName: row.full_name,
        companyName: row.company_name,
        email: row.email,
        phone: row.phone,
        businessType: row.business_type,
        productInterest: row.product_interest,
        orderQuantity: row.order_quantity,
        message: row.message,
        status: row.status,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load inquiries." });
  }
});

router.patch("/:id/status", requireAdmin, async (req, res) => {
  try {
    const parsed = parseWithZod(inquiryStatusSchema, req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error, fieldErrors: parsed.fieldErrors });
    }

    const result = await query(
      `UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING id, status`,
      [parsed.data.status, Number(req.params.id)]
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Inquiry not found." });
    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update inquiry." });
  }
});

export default router;
