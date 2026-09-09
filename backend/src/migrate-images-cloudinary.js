import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { pool, query } from "./db.js";
import { uploadImageBuffer } from "./cloudinary.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsDir = path.resolve(__dirname, "../../frontend/public/products");

const cache = new Map();

function isCloudinaryUrl(value = "") {
  return /^https?:\/\/res\.cloudinary\.com\//i.test(value);
}

function isLocalProductPath(value = "") {
  return value.startsWith("/products/");
}

async function uploadLocalPath(localPath) {
  if (!localPath || isCloudinaryUrl(localPath)) return localPath;
  if (!isLocalProductPath(localPath)) return localPath;
  if (cache.has(localPath)) return cache.get(localPath);

  const fileName = path.basename(localPath);
  const absolute = path.join(productsDir, fileName);
  const buffer = await fs.readFile(absolute);
  const uploaded = await uploadImageBuffer(buffer, "wholesale-nuts/products");
  cache.set(localPath, uploaded.url);
  console.log(`Uploaded ${localPath} -> ${uploaded.url}`);
  return uploaded.url;
}

async function migrate() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary env vars are missing.");
  }

  const products = await query(
    "SELECT id, name, image, gallery FROM products ORDER BY id"
  );
  const categories = await query(
    "SELECT id, name, image FROM categories ORDER BY id"
  );

  for (const product of products.rows) {
    const nextImage = await uploadLocalPath(product.image);
    const gallery = Array.isArray(product.gallery) ? product.gallery : [];
    const nextGallery = [];
    for (const item of gallery) {
      nextGallery.push(await uploadLocalPath(item));
    }

    await query(
      `UPDATE products
       SET image = $1,
           gallery = $2::jsonb,
           updated_at = NOW()
       WHERE id = $3`,
      [nextImage, JSON.stringify(nextGallery), product.id]
    );
    console.log(`Updated product #${product.id} ${product.name}`);
  }

  for (const category of categories.rows) {
    const nextImage = await uploadLocalPath(category.image || "");
    await query(
      `UPDATE categories
       SET image = $1, updated_at = NOW()
       WHERE id = $2`,
      [nextImage || "", category.id]
    );
    console.log(`Updated category #${category.id} ${category.name}`);
  }

  console.log(`Done. Uploaded ${cache.size} unique local files to Cloudinary.`);
}

migrate()
  .then(async () => {
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exit(1);
  });
