import { Router } from "express";
import multer from "multer";
import { uploadImageBuffer } from "../cloudinary.js";
import { requireAdmin } from "../utils.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed."));
      return;
    }
    cb(null, true);
  },
});

router.post("/", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required." });
    }

    const folder =
      req.body?.folder === "categories"
        ? "wholesale-nuts/categories"
        : "wholesale-nuts/products";

    const result = await uploadImageBuffer(req.file.buffer, folder);
    res.status(201).json({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || "Failed to upload image to Cloudinary.",
    });
  }
});

router.post("/multiple", requireAdmin, upload.array("images", 6), async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ error: "At least one image is required." });
    }

    const folder =
      req.body?.folder === "categories"
        ? "wholesale-nuts/categories"
        : "wholesale-nuts/products";

    const uploads = [];
    for (const file of files) {
      uploads.push(await uploadImageBuffer(file.buffer, folder));
    }

    res.status(201).json({ data: uploads });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || "Failed to upload images to Cloudinary.",
    });
  }
});

export default router;
