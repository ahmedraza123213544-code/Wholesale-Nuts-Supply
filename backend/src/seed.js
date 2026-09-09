import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { pool, query } from "./db.js";
import { migrate } from "./migrate-lib.js";
import { uploadImageBuffer } from "./cloudinary.js";
import { makeSlug } from "./utils.js";
import { seedProducts } from "./seed-data.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsDir = path.resolve(__dirname, "../../frontend/public/products");
const uploadCache = new Map();

async function toCloudinaryUrl(localOrRemote) {
  if (!localOrRemote) return "";
  if (/^https?:\/\//i.test(localOrRemote)) return localOrRemote;
  if (uploadCache.has(localOrRemote)) return uploadCache.get(localOrRemote);

  const fileName = path.basename(localOrRemote);
  const absolute = path.join(productsDir, fileName);
  const buffer = await fs.readFile(absolute);
  const uploaded = await uploadImageBuffer(buffer, "wholesale-nuts/products");
  uploadCache.set(localOrRemote, uploaded.url);
  console.log(`Cloudinary: ${localOrRemote} -> ${uploaded.url}`);
  return uploaded.url;
}

async function seed() {
  await migrate();

  const categoryNames = [
    ...new Set(seedProducts.map((product) => product.category)),
  ];

  const categoryIds = {};
  for (const name of categoryNames) {
    const slug = makeSlug(name);
    const sampleLocal =
      seedProducts.find((product) => product.category === name)?.image ||
      "/products/hero-nuts.jpg";
    const sampleImage = await toCloudinaryUrl(sampleLocal);
    const result = await query(
      `INSERT INTO categories (name, slug, description, image)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (name) DO UPDATE SET
         description = EXCLUDED.description,
         image = EXCLUDED.image
       RETURNING id, name`,
      [name, slug, `Wholesale ${name} category`, sampleImage]
    );
    categoryIds[name] = result.rows[0].id;
  }

  for (const product of seedProducts) {
    const image = await toCloudinaryUrl(product.image);
    const gallery = [];
    for (const item of product.gallery || []) {
      gallery.push(await toCloudinaryUrl(item));
    }

    await query(
      `INSERT INTO products (
        category_id, slug, name, type, short_description, description, image, gallery,
        grade, packaging, sizes, moq, availability, featured, specifications,
        quality_notes, wholesale_info, is_active
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10::jsonb,$11::jsonb,$12,$13,$14,$15::jsonb,$16::jsonb,$17,TRUE
      )
      ON CONFLICT (slug) DO UPDATE SET
        category_id = EXCLUDED.category_id,
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        image = EXCLUDED.image,
        gallery = EXCLUDED.gallery,
        grade = EXCLUDED.grade,
        packaging = EXCLUDED.packaging,
        sizes = EXCLUDED.sizes,
        moq = EXCLUDED.moq,
        availability = EXCLUDED.availability,
        featured = EXCLUDED.featured,
        specifications = EXCLUDED.specifications,
        quality_notes = EXCLUDED.quality_notes,
        wholesale_info = EXCLUDED.wholesale_info,
        updated_at = NOW()`,
      [
        categoryIds[product.category],
        product.slug,
        product.name,
        product.type,
        product.shortDescription,
        product.description,
        image,
        JSON.stringify(gallery),
        product.grade,
        JSON.stringify(product.packaging || []),
        JSON.stringify(product.sizes || []),
        product.moq,
        product.availability,
        Boolean(product.featured),
        JSON.stringify(product.specifications || []),
        JSON.stringify(product.qualityNotes || []),
        product.wholesaleInfo || "",
      ]
    );
  }

  console.log(
    `Seeded ${categoryNames.length} categories and ${seedProducts.length} products with Cloudinary images.`
  );
}

seed()
  .then(async () => {
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exit(1);
  });
