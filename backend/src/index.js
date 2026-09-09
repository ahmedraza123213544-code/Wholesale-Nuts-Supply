import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { migrate } from "./migrate-lib.js";
import adminRoutes from "./routes/admin.js";
import categoryRoutes from "./routes/categories.js";
import inquiryRoutes from "./routes/inquiries.js";
import productRoutes from "./routes/products.js";
import uploadRoutes from "./routes/uploads.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 4000);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",").map((v) => v.trim()) || true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use("/dashboard", express.static(path.join(__dirname, "../public/dashboard")));
// Seeded catalog images live in the Next.js public folder — serve them for the dashboard/API too.
app.use(
  "/products",
  express.static(path.join(__dirname, "../../frontend/public/products"))
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "wholesale-nuts-backend" });
});

app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/uploads", uploadRoutes);

app.get("/", (_req, res) => {
  res.redirect("/dashboard");
});

async function start() {
  await migrate();
  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
    console.log(`Dashboard: http://localhost:${port}/dashboard`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
