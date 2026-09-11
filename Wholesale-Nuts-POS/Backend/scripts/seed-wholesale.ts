/**
 * Seeds Wholesale Nut Supply POS:
 * - Admin + warehouse logins
 * - Warehouse branch
 * - Nut categories + products (from website catalog export)
 *
 * Run from Backend:
 *   npx ts-node scripts/seed-wholesale.ts
 */
import { PrismaClient, Role, BranchType, ImageStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const prisma = new PrismaClient();

type CatalogRow = {
  name: string;
  slug: string;
  type?: string;
  short_description?: string;
  description?: string;
  image?: string;
  gallery?: string[];
  grade?: string;
  featured?: boolean;
  category: string;
};

async function main() {
  console.log(`DB: ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":***@")}\n`);

  const catalogPath = path.join(__dirname, "website-catalog.json");
  if (!fs.existsSync(catalogPath)) {
    throw new Error("Missing scripts/website-catalog.json");
  }
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8")) as CatalogRow[];

  // Users + branch
  const adminPassword = await bcrypt.hash("Wholesale@123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@wholesalenutsupply.com" },
    update: { password: adminPassword, role: Role.SUPER_ADMIN },
    create: {
      email: "admin@wholesalenutsupply.com",
      password: adminPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  const warehouse = await prisma.branch.upsert({
    where: { code: "WH-001" },
    update: { name: "WNS Warehouse", address: "Bahadurabad, Karachi, Pakistan", is_active: true },
    create: {
      code: "WH-001",
      name: "WNS Warehouse",
      address: "Bahadurabad, Karachi, Pakistan",
      branch_type: BranchType.WAREHOUSE,
      is_active: true,
    },
  });

  const whPassword = await bcrypt.hash("Warehouse@123", 10);
  const warehouseUser = await prisma.user.upsert({
    where: { email: "warehouse@wholesalenutsupply.com" },
    update: {
      password: whPassword,
      role: Role.WAREHOUSE_MANAGER,
      branch_id: warehouse.id,
    },
    create: {
      email: "warehouse@wholesalenutsupply.com",
      password: whPassword,
      role: Role.WAREHOUSE_MANAGER,
      branch_id: warehouse.id,
    },
  });

  const cashierPassword = await bcrypt.hash("Cashier@123", 10);
  const cashier = await prisma.user.upsert({
    where: { email: "cashier@wholesalenutsupply.com" },
    update: {
      password: cashierPassword,
      role: Role.BRANCH_MANAGER,
      branch_id: warehouse.id,
    },
    create: {
      email: "cashier@wholesalenutsupply.com",
      password: cashierPassword,
      role: Role.BRANCH_MANAGER,
      branch_id: warehouse.id,
    },
  });

  // Unit
  const unit = await prisma.unit.upsert({
    where: { code: "KG" },
    update: { name: "Kilogram", is_active: true, display_on_pos: true },
    create: {
      code: "KG",
      name: "Kilogram",
      is_active: true,
      display_on_pos: true,
    },
  });

  // Categories
  const categoryNames = [...new Set(catalog.map((item) => item.category).filter(Boolean))];
  const categoryIds: Record<string, string> = {};

  for (const name of categoryNames) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const code = `CAT-${slug}`.toUpperCase().slice(0, 40);
    const sampleImage =
      catalog.find((item) => item.category === name)?.image || "";

    const existing = await prisma.category.findFirst({
      where: { OR: [{ slug }, { code }, { name }] },
    });

    const category = existing
      ? await prisma.category.update({
          where: { id: existing.id },
          data: {
            name,
            slug,
            code,
            image: sampleImage || existing.image,
            is_active: true,
            display_on_pos: true,
            branch_id: warehouse.id,
            display_on_branches: [warehouse.id],
          },
        })
      : await prisma.category.create({
          data: {
            name,
            slug,
            code,
            image: sampleImage,
            is_active: true,
            display_on_pos: true,
            branch_id: warehouse.id,
            display_on_branches: [warehouse.id],
          },
        });

    categoryIds[name] = category.id;
  }

  // Products
  let created = 0;
  for (const item of catalog) {
    if (!item.slug || !item.name || !item.category) continue;
    const categoryId = categoryIds[item.category];
    if (!categoryId) continue;

    const description =
      item.description || item.short_description || item.name;
    const product = await prisma.product.upsert({
      where: { code: item.slug },
      update: {
        name: item.name,
        description,
        sku: `WNS-${item.slug}`.toUpperCase().slice(0, 60),
        category_id: categoryId,
        unit_id: unit.id,
        pct_or_hs_code: item.grade || null,
        is_featured: Boolean(item.featured),
        is_active: true,
        display_on_pos: true,
        has_images: true,
        sales_rate_exc_dis_and_tax: 0,
        sales_rate_inc_dis_and_tax: 0,
        purchase_rate: 0,
      },
      create: {
        code: item.slug,
        name: item.name,
        description,
        sku: `WNS-${item.slug}`.toUpperCase().slice(0, 60),
        category_id: categoryId,
        unit_id: unit.id,
        pct_or_hs_code: item.grade || null,
        is_featured: Boolean(item.featured),
        is_active: true,
        display_on_pos: true,
        has_images: true,
        sales_rate_exc_dis_and_tax: 0,
        sales_rate_inc_dis_and_tax: 0,
        purchase_rate: 0,
      },
    });

    await prisma.productImage.deleteMany({ where: { product_id: product.id } });
    const gallery = Array.isArray(item.gallery) ? item.gallery : [];
    const images = [item.image, ...gallery].filter(Boolean) as string[];
    const unique = [...new Set(images)];
    for (const image of unique) {
      await prisma.productImage.create({
        data: {
          product_id: product.id,
          image,
          status: ImageStatus.COMPLETE,
          is_active: true,
        },
      });
    }

    await prisma.stock.upsert({
      where: {
        product_id_branch_id: {
          product_id: product.id,
          branch_id: warehouse.id,
        },
      },
      update: { current_quantity: 100 },
      create: {
        product_id: product.id,
        branch_id: warehouse.id,
        current_quantity: 100,
        minimum_quantity: 10,
      },
    }).catch(async () => {
      // unique constraint name may differ — fallback create if missing
      const existingStock = await prisma.stock.findFirst({
        where: { product_id: product.id, branch_id: warehouse.id },
      });
      if (existingStock) {
        await prisma.stock.update({
          where: { id: existingStock.id },
          data: { current_quantity: 100 },
        });
      } else {
        await prisma.stock.create({
          data: {
            product_id: product.id,
            branch_id: warehouse.id,
            current_quantity: 100,
            minimum_quantity: 10,
          },
        });
      }
    });

    created += 1;
  }

  console.log("\n=== Seed complete ===");
  console.log(`Admin:     ${admin.email} / Wholesale@123`);
  console.log(`Warehouse: ${warehouseUser.email} / Warehouse@123`);
  console.log(`Cashier:   ${cashier.email} / Cashier@123`);
  console.log(`Categories: ${categoryNames.length}`);
  console.log(`Products:   ${created}`);
  console.log(`Branch:     ${warehouse.name} (${warehouse.code})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
