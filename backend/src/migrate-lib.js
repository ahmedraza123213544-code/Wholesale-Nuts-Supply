import { pool } from "./db.js";

const schemaSql = `
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(140) NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(60) NOT NULL DEFAULT 'Raw',
  short_description TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '/products/hero-nuts.jpg',
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  grade VARCHAR(120) NOT NULL DEFAULT '',
  packaging JSONB NOT NULL DEFAULT '[]'::jsonb,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  moq VARCHAR(120) NOT NULL DEFAULT '',
  availability VARCHAR(60) NOT NULL DEFAULT 'In Stock',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  quality_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  wholesale_info TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(80) NOT NULL,
  business_type VARCHAR(120) NOT NULL,
  product_interest VARCHAR(160) NOT NULL,
  order_quantity VARCHAR(120) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC);
`;

export async function migrate() {
  await pool.query(schemaSql);
  await pool.query(`
    ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '';
  `);
}
