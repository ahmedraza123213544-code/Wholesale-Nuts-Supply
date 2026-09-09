import { z } from "https://esm.sh/zod@3.23.8";

const API = "";
const SESSION_KEY = "wns_admin_password";
const MIN_LOADER_MS = 450;

const state = {
  password: localStorage.getItem(SESSION_KEY) || "",
  tab: "overview",
  categories: [],
  categoryOptions: [],
  products: [],
  inquiries: [],
  loading: false,
  productsPage: 1,
  categoriesPage: 1,
  pageSize: 10,
  productsMeta: { page: 1, limit: 10, total: 0, totalPages: 1 },
  categoriesMeta: { page: 1, limit: 10, total: 0, totalPages: 1 },
};

const loginView = document.getElementById("login-view");
const appView = document.getElementById("app-view");
const bootScreen = document.getElementById("boot-screen");
const globalError = document.getElementById("global-error");

const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters"),
  slug: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().default(""),
  image: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (value) =>
        !value ||
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("/"),
      "Provide a valid Cloudinary or site image URL"
    ),
});

const productSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters"),
  slug: z.string().trim().optional().or(z.literal("")),
  categoryId: z.coerce.number().int().positive("Select a category"),
  type: z.enum(["Raw", "Roasted", "Blanched", "In-Shell", "Mixed", "Dried"]),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters"),
  image: z
    .string()
    .trim()
    .min(1, "Upload a product image to Cloudinary")
    .refine(
      (value) =>
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("/"),
      "Provide a valid image URL"
    ),
  gallery: z.string().optional().default(""),
  grade: z.string().trim().min(1, "Grade is required"),
  packaging: z.string().optional().default(""),
  sizes: z.string().optional().default(""),
  moq: z.string().trim().min(1, "MOQ is required"),
  availability: z.enum(["In Stock", "Limited", "Made to Order"]),
  featured: z.boolean().default(false),
  qualityNotes: z.string().optional().default(""),
  wholesaleInfo: z.string().optional().default(""),
});

const loginSchema = z.object({
  password: z.string().trim().min(1, "Password is required"),
});

function setButtonLoading(button, loading) {
  if (!button) return;
  button.disabled = loading;
  button.classList.toggle("is-loading", loading);
  button.setAttribute("aria-busy", loading ? "true" : "false");
}

function setBootScreen(visible) {
  bootScreen.classList.toggle("hidden", !visible);
}

function showGlobalError(message) {
  if (!message) {
    globalError.classList.add("hidden");
    globalError.textContent = "";
    return;
  }
  globalError.textContent = message;
  globalError.classList.remove("hidden");
}

function clearFieldErrors(root = document) {
  root.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
  });
}

function showFieldErrors(fieldErrors, root = document) {
  clearFieldErrors(root);
  Object.entries(fieldErrors || {}).forEach(([key, message]) => {
    const el = root.querySelector(`[data-error-for="${key}"]`);
    if (el) el.textContent = message;
  });
}

function zodErrors(error) {
  const fieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] || "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withMinDelay(promise, ms = MIN_LOADER_MS) {
  const [result] = await Promise.all([promise, wait(ms)]);
  return result;
}

function mediaUrl(url) {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  return url.startsWith("/") ? url : `/${url}`;
}

function thumbHtml(url, name) {
  const src = mediaUrl(url);
  const initial = (name || "?").slice(0, 1);
  if (!src) {
    return `<span class="thumb-fallback">${initial}</span>`;
  }
  return `<img class="thumb" src="${src}" alt="${name || ""}" loading="lazy" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<span class=\\'thumb-fallback\\'>${initial}</span>');" />`;
}

function saveSession(password) {
  state.password = password;
  localStorage.setItem(SESSION_KEY, password);
}

function clearSession() {
  state.password = "";
  localStorage.removeItem(SESSION_KEY);
}

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isFormData && !headers["Content-Type"] && options.body) {
    headers["Content-Type"] = "application/json";
  }
  if (state.password) headers["x-admin-password"] = state.password;

  const response = await fetch(`${API}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(payload.error || "Request failed");
    err.status = response.status;
    err.fieldErrors = payload.fieldErrors || {};
    throw err;
  }
  return payload;
}

async function uploadImage(file, folder = "products") {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);
  const payload = await api("/api/uploads", { method: "POST", body: formData });
  return payload.data.url;
}

async function uploadImages(files, folder = "products") {
  const formData = new FormData();
  [...files].forEach((file) => formData.append("images", file));
  formData.append("folder", folder);
  const payload = await api("/api/uploads/multiple", {
    method: "POST",
    body: formData,
  });
  return payload.data.map((item) => item.url);
}

function setImagePreview(containerId, url, meta = {}) {
  const el = document.getElementById(containerId);
  const urlEl = meta.urlElId ? document.getElementById(meta.urlElId) : null;
  const badgeEl = meta.badgeElId ? document.getElementById(meta.badgeElId) : null;
  const src = mediaUrl(url);

  if (!src) {
    el.classList.add("hidden");
    el.innerHTML = "";
    if (urlEl) urlEl.textContent = "";
    if (badgeEl) badgeEl.textContent = meta.emptyBadge || "No image yet";
    return;
  }

  el.classList.remove("hidden");
  el.innerHTML = `<img src="${src}" alt="Uploaded preview" />`;
  if (urlEl) urlEl.textContent = src;
  if (badgeEl) {
    badgeEl.textContent = isCloudinaryUrl(src) ? "Cloudinary URL" : "Image URL";
  }
}

function isCloudinaryUrl(value = "") {
  return /^https?:\/\/res\.cloudinary\.com\//i.test(value);
}

function setGalleryPreview(urls) {
  document.getElementById("product-gallery-preview").innerHTML = (urls || [])
    .map((url) => `<img src="${mediaUrl(url)}" alt="Gallery image" />`)
    .join("");
}

function showApp() {
  loginView.classList.add("hidden");
  appView.classList.remove("hidden");
}

function showLogin() {
  appView.classList.add("hidden");
  loginView.classList.remove("hidden");
  setBootScreen(false);
  state.loading = false;
}

function setTab(tab) {
  state.tab = tab;
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
    btn.classList.remove("is-loading");
  });
  document.querySelectorAll(".panel").forEach((panel) => panel.classList.add("hidden"));
  document.getElementById(`${tab}-panel`).classList.remove("hidden");

  const titles = {
    overview: ["Overview", "Live data from Neon PostgreSQL + Cloudinary."],
    inquiries: ["Inquiries", "All wholesale quote requests from the website."],
    products: ["Products", "Create and manage catalog products shown on the website."],
    categories: ["Categories", "Organize products into wholesale categories."],
  };
  document.getElementById("page-title").textContent = titles[tab][0];
  document.getElementById("page-subtitle").textContent = titles[tab][1];
  const mobileLabel = document.getElementById("mobile-tab-label");
  if (mobileLabel) mobileLabel.textContent = titles[tab][0];
  closeMobileNav();
}

function openMobileNav() {
  document.body.classList.add("nav-open");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (backdrop) backdrop.setAttribute("aria-hidden", "false");
}

function closeMobileNav() {
  document.body.classList.remove("nav-open");
  const backdrop = document.getElementById("sidebar-backdrop");
  if (backdrop) backdrop.setAttribute("aria-hidden", "true");
}

function fillCategorySelect() {
  const select = document.getElementById("product-category");
  const options = state.categoryOptions.length
    ? state.categoryOptions
    : state.categories;
  select.innerHTML = options
    .map((c) => `<option value="${c.id}">${c.name}</option>`)
    .join("");
}

function renderPagination(containerId, meta, resource) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const total = meta.total || 0;
  const page = meta.page || 1;
  const totalPages = meta.totalPages || 1;
  const limit = meta.limit || state.pageSize;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  el.innerHTML = `
    <div class="pagination-meta">
      Showing <strong>${from}-${to}</strong> of <strong>${total}</strong>
    </div>
    <div class="pagination-actions">
      <label class="page-size">
        Per page
        <select data-page-size="${resource}">
          ${[5, 10, 20, 50]
            .map(
              (size) =>
                `<option value="${size}" ${
                  Number(limit) === size ? "selected" : ""
                }>${size}</option>`
            )
            .join("")}
        </select>
      </label>
      <button type="button" class="btn btn-ghost" data-page-prev="${resource}" ${
        page <= 1 ? "disabled" : ""
      }>
        Prev
      </button>
      <span class="pagination-meta">Page ${page} / ${totalPages}</span>
      <button type="button" class="btn btn-ghost" data-page-next="${resource}" ${
        page >= totalPages ? "disabled" : ""
      }>
        Next
      </button>
    </div>
  `;
}

function renderProducts() {
  const body = document.getElementById("products-body");
  const cards = document.getElementById("products-cards");
  if (!state.products.length) {
    body.innerHTML = `<tr><td colspan="5"><div class="panel-empty"><p>No products yet.</p></div></td></tr>`;
    cards.innerHTML = `<div class="panel-empty"><p>No products yet.</p></div>`;
    renderPagination("products-pagination", state.productsMeta, "products");
    return;
  }
  body.innerHTML = state.products
    .map(
      (item) => `
      <tr>
        <td>
          <div class="product-cell">
            ${thumbHtml(item.image, item.name)}
            <div>
              <strong>${item.name}</strong><br />
              <span class="muted">${item.slug}</span>
            </div>
          </div>
        </td>
        <td>${item.category}</td>
        <td>${item.availability}</td>
        <td>${item.featured ? "Yes" : "No"}</td>
        <td class="row">
          <button type="button" data-edit-product="${item.id}" class="btn btn-ghost">Edit</button>
          <button type="button" data-delete-product="${item.id}" class="btn btn-ghost">
            <span class="btn-label">Delete</span>
            <span class="btn-spinner" aria-hidden="true"></span>
          </button>
        </td>
      </tr>`
    )
    .join("");

  cards.innerHTML = state.products
    .map(
      (item) => `
      <article class="data-card">
        <div class="data-card-head">
          ${thumbHtml(item.image, item.name)}
          <div>
            <h4>${item.name}</h4>
            <p class="muted" style="margin:4px 0 0">${item.slug}</p>
          </div>
        </div>
        <div class="meta-grid">
          <div class="meta-row"><span>Category</span><span>${item.category}</span></div>
          <div class="meta-row"><span>Stock</span><span>${item.availability}</span></div>
          <div class="meta-row"><span>Featured</span><span>${item.featured ? "Yes" : "No"}</span></div>
        </div>
        <div class="actions">
          <button type="button" data-edit-product="${item.id}" class="btn btn-ghost">Edit</button>
          <button type="button" data-delete-product="${item.id}" class="btn btn-ghost">
            <span class="btn-label">Delete</span>
            <span class="btn-spinner" aria-hidden="true"></span>
          </button>
        </div>
      </article>`
    )
    .join("");
  renderPagination("products-pagination", state.productsMeta, "products");
}

function renderCategories() {
  const body = document.getElementById("categories-body");
  const cards = document.getElementById("categories-cards");
  if (!state.categories.length) {
    body.innerHTML = `<tr><td colspan="4"><div class="panel-empty"><p>No categories yet.</p></div></td></tr>`;
    cards.innerHTML = `<div class="panel-empty"><p>No categories yet.</p></div>`;
    renderPagination("categories-pagination", state.categoriesMeta, "categories");
    return;
  }
  body.innerHTML = state.categories
    .map(
      (item) => `
      <tr>
        <td>
          <div class="product-cell">
            ${thumbHtml(item.image, item.name)}
            <strong>${item.name}</strong>
          </div>
        </td>
        <td>${item.slug}</td>
        <td>${item.productCount ?? 0}</td>
        <td class="row">
          <button type="button" data-edit-category="${item.id}" class="btn btn-ghost">Edit</button>
          <button type="button" data-delete-category="${item.id}" class="btn btn-ghost">
            <span class="btn-label">Delete</span>
            <span class="btn-spinner" aria-hidden="true"></span>
          </button>
        </td>
      </tr>`
    )
    .join("");

  cards.innerHTML = state.categories
    .map(
      (item) => `
      <article class="data-card">
        <div class="data-card-head">
          ${thumbHtml(item.image, item.name)}
          <div>
            <h4>${item.name}</h4>
            <p class="muted" style="margin:4px 0 0">${item.slug}</p>
          </div>
        </div>
        <div class="meta-grid">
          <div class="meta-row"><span>Products</span><span>${item.productCount ?? 0}</span></div>
        </div>
        <div class="actions">
          <button type="button" data-edit-category="${item.id}" class="btn btn-ghost">Edit</button>
          <button type="button" data-delete-category="${item.id}" class="btn btn-ghost">
            <span class="btn-label">Delete</span>
            <span class="btn-spinner" aria-hidden="true"></span>
          </button>
        </div>
      </article>`
    )
    .join("");
  renderPagination("categories-pagination", state.categoriesMeta, "categories");
}

function renderStats(stats) {
  document.getElementById("stats-grid").innerHTML = `
    <article class="stat-card"><span>Products</span><strong>${stats.products}</strong></article>
    <article class="stat-card"><span>Categories</span><strong>${stats.categories}</strong></article>
    <article class="stat-card"><span>Inquiries</span><strong>${stats.inquiries}</strong></article>
    <article class="stat-card"><span>New</span><strong>${stats.newInquiries}</strong></article>
  `;
}

function renderInquiries() {
  const body = document.getElementById("inquiries-body");
  const cards = document.getElementById("inquiries-cards");
  if (!state.inquiries.length) {
    body.innerHTML = `<tr><td colspan="7"><div class="panel-empty"><p>No inquiries yet.</p></div></td></tr>`;
    cards.innerHTML = `<div class="panel-empty"><p>No inquiries yet.</p></div>`;
    return;
  }

  const statusSelect = (item) => `
    <select data-inquiry-status="${item.id}">
      ${["new", "reviewed", "quoted", "closed"]
        .map(
          (status) =>
            `<option value="${status}" ${
              item.status === status ? "selected" : ""
            }>${status}</option>`
        )
        .join("")}
    </select>`;

  body.innerHTML = state.inquiries
    .map(
      (item) => `
      <tr>
        <td>${new Date(item.createdAt).toLocaleString()}</td>
        <td>
          <strong>${item.fullName}</strong><br />
          <span class="muted">${item.email}<br />${item.phone}</span>
        </td>
        <td>${item.companyName}<br /><span class="muted">${item.businessType}</span></td>
        <td>${item.productInterest}</td>
        <td>${item.orderQuantity}</td>
        <td>${statusSelect(item)}</td>
        <td><details><summary>View</summary><p>${item.message}</p></details></td>
      </tr>`
    )
    .join("");

  cards.innerHTML = state.inquiries
    .map(
      (item) => `
      <article class="data-card">
        <div class="data-card-head">
          <div>
            <h4>${item.fullName}</h4>
            <p class="muted" style="margin:4px 0 0">${new Date(
              item.createdAt
            ).toLocaleString()}</p>
          </div>
          <span class="status-pill">${item.status}</span>
        </div>
        <div class="meta-grid">
          <div class="meta-row"><span>Email</span><span>${item.email}</span></div>
          <div class="meta-row"><span>Phone</span><span>${item.phone}</span></div>
          <div class="meta-row"><span>Company</span><span>${item.companyName}</span></div>
          <div class="meta-row"><span>Type</span><span>${item.businessType}</span></div>
          <div class="meta-row"><span>Interest</span><span>${item.productInterest}</span></div>
          <div class="meta-row"><span>Quantity</span><span>${item.orderQuantity}</span></div>
          <div class="meta-row"><span>Status</span><span>${statusSelect(item)}</span></div>
          <div class="meta-row"><span>Message</span><span>${item.message}</span></div>
        </div>
      </article>`
    )
    .join("");
}

function showTableLoaders(activeTab = state.tab) {
  if (activeTab === "overview") {
    document.getElementById("stats-grid").innerHTML = `
      <div class="panel-empty">
        <div class="page-spinner" aria-hidden="true"></div>
        <p>Loading overview…</p>
      </div>`;
  }
  if (activeTab === "inquiries") {
    document.getElementById("inquiries-body").innerHTML = `
      <tr class="loading-row"><td colspan="7"><div class="panel-empty">
        <div class="page-spinner" aria-hidden="true"></div><p>Loading inquiries…</p>
      </div></td></tr>`;
    document.getElementById("inquiries-cards").innerHTML = `
      <div class="panel-empty">
        <div class="page-spinner" aria-hidden="true"></div>
        <p>Loading inquiries…</p>
      </div>`;
  }
  if (activeTab === "products") {
    document.getElementById("products-body").innerHTML = `
      <tr class="loading-row"><td colspan="5"><div class="panel-empty">
        <div class="page-spinner" aria-hidden="true"></div><p>Loading products…</p>
      </div></td></tr>`;
    document.getElementById("products-cards").innerHTML = `
      <div class="panel-empty">
        <div class="page-spinner" aria-hidden="true"></div>
        <p>Loading products…</p>
      </div>`;
  }
  if (activeTab === "categories") {
    document.getElementById("categories-body").innerHTML = `
      <tr class="loading-row"><td colspan="4"><div class="panel-empty">
        <div class="page-spinner" aria-hidden="true"></div><p>Loading categories…</p>
      </div></td></tr>`;
    document.getElementById("categories-cards").innerHTML = `
      <div class="panel-empty">
        <div class="page-spinner" aria-hidden="true"></div>
        <p>Loading categories…</p>
      </div>`;
  }
}

async function loadProductsPage(page = state.productsPage, { showLoader = true } = {}) {
  if (showLoader) showTableLoaders("products");
  const products = await api(
    `/api/products?page=${page}&limit=${state.pageSize}`
  );
  state.products = products.data;
  state.productsMeta = products.meta || {
    page,
    limit: state.pageSize,
    total: products.data.length,
    totalPages: 1,
  };
  state.productsPage = state.productsMeta.page;
  renderProducts();
}

async function loadCategoriesPage(
  page = state.categoriesPage,
  { showLoader = true } = {}
) {
  if (showLoader) showTableLoaders("categories");
  const [categories, allCategories] = await Promise.all([
    api(`/api/categories?page=${page}&limit=${state.pageSize}`),
    api("/api/categories"),
  ]);
  state.categories = categories.data;
  state.categoriesMeta = categories.meta || {
    page,
    limit: state.pageSize,
    total: categories.data.length,
    totalPages: 1,
  };
  state.categoriesPage = state.categoriesMeta.page;
  state.categoryOptions = allCategories.data;
  fillCategorySelect();
  renderCategories();
}

async function loadAll(button) {
  setButtonLoading(button, true);
  state.loading = true;
  showTableLoaders(state.tab);
  showGlobalError("");

  try {
    const [stats, inquiries] = await withMinDelay(
      Promise.all([api("/api/admin/stats"), api("/api/inquiries")])
    );
    renderStats(stats.data);
    state.inquiries = inquiries.data;
    renderInquiries();

    await Promise.all([
      loadProductsPage(state.productsPage, { showLoader: state.tab === "products" }),
      loadCategoriesPage(state.categoriesPage, {
        showLoader: state.tab === "categories",
      }),
    ]);
  } catch (error) {
    if (error.status === 401) {
      clearSession();
      showLogin();
      throw error;
    }
    showGlobalError(error.message || "Failed to load dashboard data.");
    throw error;
  } finally {
    state.loading = false;
    setButtonLoading(button, false);
  }
}

document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const loginError = document.getElementById("login-error");
  loginError.classList.add("hidden");
  clearFieldErrors(document.getElementById("login-form"));

  const parsed = loginSchema.safeParse({
    password: document.getElementById("password").value,
  });
  if (!parsed.success) {
    showFieldErrors(zodErrors(parsed.error), document.getElementById("login-form"));
    return;
  }

  const button = document.getElementById("login-btn");
  setButtonLoading(button, true);
  try {
    await withMinDelay(
      api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      })
    );
    saveSession(parsed.data.password);
    showApp();
    setTab("overview");
    await loadAll(document.getElementById("refresh-btn"));
  } catch (error) {
    loginError.textContent = error.message;
    loginError.classList.remove("hidden");
  } finally {
    setButtonLoading(button, false);
  }
});

document.getElementById("logout-btn").addEventListener("click", async () => {
  const button = document.getElementById("logout-btn");
  setButtonLoading(button, true);
  await wait(350);
  clearSession();
  setButtonLoading(button, false);
  showLogin();
  document.getElementById("password").value = "";
});

document.getElementById("refresh-btn").addEventListener("click", (event) => {
  loadAll(event.currentTarget).catch(() => {});
});

document.getElementById("refresh-btn-mobile").addEventListener("click", () => {
  loadAll(document.getElementById("refresh-btn")).catch(() => {});
});

document.getElementById("sidebar-open").addEventListener("click", openMobileNav);
document.getElementById("sidebar-close").addEventListener("click", closeMobileNav);
document.getElementById("sidebar-backdrop").addEventListener("click", closeMobileNav);

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (state.loading) return;
    setTab(btn.dataset.tab);
  });
});

async function handlePaginationClick(event) {
  const prev = event.target.closest("[data-page-prev]")?.dataset.pagePrev;
  const next = event.target.closest("[data-page-next]")?.dataset.pageNext;
  const sizeSelect = event.target.closest("[data-page-size]");

  if (sizeSelect && event.type === "change") {
    state.pageSize = Number(sizeSelect.value) || 10;
    state.productsPage = 1;
    state.categoriesPage = 1;
    try {
      if (sizeSelect.dataset.pageSize === "products") {
        await loadProductsPage(1);
      } else {
        await loadCategoriesPage(1);
      }
    } catch (error) {
      showGlobalError(error.message);
    }
    return;
  }

  if (!prev && !next) return;
  const resource = prev || next;
  try {
    if (resource === "products") {
      const page =
        prev ? Math.max(1, state.productsPage - 1) : state.productsPage + 1;
      await loadProductsPage(page);
    } else {
      const page =
        prev ? Math.max(1, state.categoriesPage - 1) : state.categoriesPage + 1;
      await loadCategoriesPage(page);
    }
  } catch (error) {
    showGlobalError(error.message);
  }
}

document
  .getElementById("products-pagination")
  .addEventListener("click", handlePaginationClick);
document
  .getElementById("categories-pagination")
  .addEventListener("click", handlePaginationClick);
document
  .getElementById("products-pagination")
  .addEventListener("change", handlePaginationClick);
document
  .getElementById("categories-pagination")
  .addEventListener("change", handlePaginationClick);

document.getElementById("inquiries-list").addEventListener("change", async (event) => {
  const select = event.target.closest("[data-inquiry-status]");
  if (!select) return;
  select.disabled = true;
  try {
    await api(`/api/inquiries/${select.dataset.inquiryStatus}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: select.value }),
    });
    const inquiry = state.inquiries.find(
      (item) => String(item.id) === String(select.dataset.inquiryStatus)
    );
    if (inquiry) inquiry.status = select.value;
    renderInquiries();
  } finally {
    select.disabled = false;
  }
});

function resetProductForm() {
  document.getElementById("product-form").reset();
  document.getElementById("product-id").value = "";
  document.getElementById("product-image").value = "";
  document.getElementById("product-gallery").value = "";
  document.getElementById("product-message").textContent = "";
  clearFieldErrors(document.getElementById("product-form"));
  setImagePreview("product-image-preview", "", {
    urlElId: "product-image-url",
    badgeElId: "product-image-badge",
    emptyBadge: "Cloudinary required",
  });
  setGalleryPreview([]);
}

document.getElementById("product-reset").addEventListener("click", resetProductForm);

document.getElementById("product-image-file").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const button = document.getElementById("product-submit");
  setButtonLoading(button, true);
  try {
    const url = await uploadImage(file, "products");
    document.getElementById("product-image").value = url;
    setImagePreview("product-image-preview", url, {
      urlElId: "product-image-url",
      badgeElId: "product-image-badge",
    });
    document.getElementById("product-message").textContent =
      "Main image uploaded to Cloudinary.";
  } catch (error) {
    document.getElementById("product-message").textContent = error.message;
  } finally {
    setButtonLoading(button, false);
  }
});

document.getElementById("product-gallery-files").addEventListener("change", async (event) => {
  const files = event.target.files;
  if (!files?.length) return;
  const button = document.getElementById("product-submit");
  setButtonLoading(button, true);
  try {
    const urls = await uploadImages(files, "products");
    const existing = document
      .getElementById("product-gallery")
      .value.split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const merged = [...existing, ...urls];
    document.getElementById("product-gallery").value = merged.join(", ");
    setGalleryPreview(merged);
    document.getElementById("product-message").textContent =
      "Gallery images uploaded to Cloudinary.";
  } catch (error) {
    document.getElementById("product-message").textContent = error.message;
  } finally {
    setButtonLoading(button, false);
  }
});

document.getElementById("product-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFieldErrors(document.getElementById("product-form"));
  document.getElementById("product-message").textContent = "";

  const draft = {
    name: document.getElementById("product-name").value,
    slug: document.getElementById("product-slug").value,
    categoryId: document.getElementById("product-category").value,
    type: document.getElementById("product-type").value,
    shortDescription: document.getElementById("product-short").value,
    description: document.getElementById("product-description").value,
    image: document.getElementById("product-image").value,
    gallery: document.getElementById("product-gallery").value,
    grade: document.getElementById("product-grade").value,
    packaging: document.getElementById("product-packaging").value,
    sizes: document.getElementById("product-sizes").value,
    moq: document.getElementById("product-moq").value,
    availability: document.getElementById("product-availability").value,
    featured: document.getElementById("product-featured").checked,
    qualityNotes: document.getElementById("product-notes").value,
    wholesaleInfo: document.getElementById("product-wholesale").value,
  };

  const parsed = productSchema.safeParse(draft);
  if (!parsed.success) {
    showFieldErrors(zodErrors(parsed.error), document.getElementById("product-form"));
    return;
  }

  const id = document.getElementById("product-id").value;
  const button = document.getElementById("product-submit");
  setButtonLoading(button, true);
  try {
    if (id) {
      await api(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(parsed.data),
      });
      document.getElementById("product-message").textContent = "Product updated.";
    } else {
      await api("/api/products", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      document.getElementById("product-message").textContent = "Product created.";
    }
    resetProductForm();
    await loadProductsPage(state.productsPage);
    const stats = await api("/api/admin/stats");
    renderStats(stats.data);
  } catch (error) {
    showFieldErrors(error.fieldErrors, document.getElementById("product-form"));
    document.getElementById("product-message").textContent = error.message;
  } finally {
    setButtonLoading(button, false);
  }
});

document.getElementById("products-list").addEventListener("click", async (event) => {
  const editId = event.target.closest("[data-edit-product]")?.dataset.editProduct;
  const deleteId = event.target.closest("[data-delete-product]")?.dataset.deleteProduct;

  if (editId) {
    const product = state.products.find((item) => String(item.id) === String(editId));
    if (!product) return;
    clearFieldErrors(document.getElementById("product-form"));
    document.getElementById("product-id").value = product.id;
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-slug").value = product.slug;
    document.getElementById("product-category").value = String(product.categoryId || "");
    document.getElementById("product-type").value = product.type;
    document.getElementById("product-short").value = product.shortDescription;
    document.getElementById("product-description").value = product.description;
    document.getElementById("product-image").value = product.image;
    document.getElementById("product-gallery").value = (product.gallery || []).join(", ");
    setImagePreview("product-image-preview", product.image, {
      urlElId: "product-image-url",
      badgeElId: "product-image-badge",
    });
    setGalleryPreview(product.gallery || []);
    document.getElementById("product-grade").value = product.grade;
    document.getElementById("product-packaging").value = (product.packaging || []).join(", ");
    document.getElementById("product-sizes").value = (product.sizes || []).join(", ");
    document.getElementById("product-moq").value = product.moq;
    document.getElementById("product-availability").value = product.availability;
    document.getElementById("product-featured").checked = Boolean(product.featured);
    document.getElementById("product-notes").value = (product.qualityNotes || []).join(", ");
    document.getElementById("product-wholesale").value = product.wholesaleInfo || "";
    document.getElementById("product-form").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (deleteId && confirm("Delete this product?")) {
    const button = event.target.closest("button");
    setButtonLoading(button, true);
    try {
      await withMinDelay(api(`/api/products/${deleteId}`, { method: "DELETE" }));
      if (state.products.length <= 1 && state.productsPage > 1) {
        state.productsPage -= 1;
      }
      await loadProductsPage(state.productsPage);
      const stats = await api("/api/admin/stats");
      renderStats(stats.data);
    } finally {
      setButtonLoading(button, false);
    }
  }
});

function resetCategoryForm() {
  document.getElementById("category-form").reset();
  document.getElementById("category-id").value = "";
  document.getElementById("category-image").value = "";
  document.getElementById("category-message").textContent = "";
  clearFieldErrors(document.getElementById("category-form"));
  setImagePreview("category-image-preview", "", {
    urlElId: "category-image-url",
    badgeElId: "category-image-badge",
    emptyBadge: "Cloudinary",
  });
}

document.getElementById("category-reset").addEventListener("click", resetCategoryForm);

document.getElementById("category-image-file").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const button = document.getElementById("category-submit");
  setButtonLoading(button, true);
  try {
    const url = await uploadImage(file, "categories");
    document.getElementById("category-image").value = url;
    setImagePreview("category-image-preview", url, {
      urlElId: "category-image-url",
      badgeElId: "category-image-badge",
    });
    document.getElementById("category-message").textContent =
      "Category image uploaded to Cloudinary.";
  } catch (error) {
    document.getElementById("category-message").textContent = error.message;
  } finally {
    setButtonLoading(button, false);
  }
});

document.getElementById("category-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFieldErrors(document.getElementById("category-form"));
  document.getElementById("category-message").textContent = "";

  const draft = {
    name: document.getElementById("category-name").value,
    slug: document.getElementById("category-slug").value,
    description: document.getElementById("category-description").value,
    image: document.getElementById("category-image").value,
  };

  const parsed = categorySchema.safeParse(draft);
  if (!parsed.success) {
    showFieldErrors(zodErrors(parsed.error), document.getElementById("category-form"));
    return;
  }

  const id = document.getElementById("category-id").value;
  const button = document.getElementById("category-submit");
  setButtonLoading(button, true);
  try {
    if (id) {
      await api(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(parsed.data),
      });
      document.getElementById("category-message").textContent = "Category updated.";
    } else {
      await api("/api/categories", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      document.getElementById("category-message").textContent = "Category created.";
    }
    resetCategoryForm();
    await loadCategoriesPage(state.categoriesPage);
    const stats = await api("/api/admin/stats");
    renderStats(stats.data);
  } catch (error) {
    showFieldErrors(error.fieldErrors, document.getElementById("category-form"));
    document.getElementById("category-message").textContent = error.message;
  } finally {
    setButtonLoading(button, false);
  }
});

document.getElementById("categories-list").addEventListener("click", async (event) => {
  const editId = event.target.closest("[data-edit-category]")?.dataset.editCategory;
  const deleteId = event.target.closest("[data-delete-category]")?.dataset.deleteCategory;

  if (editId) {
    const category = state.categories.find((item) => String(item.id) === String(editId));
    if (!category) return;
    clearFieldErrors(document.getElementById("category-form"));
    document.getElementById("category-id").value = category.id;
    document.getElementById("category-name").value = category.name;
    document.getElementById("category-slug").value = category.slug;
    document.getElementById("category-description").value = category.description || "";
    document.getElementById("category-image").value = category.image || "";
    setImagePreview("category-image-preview", category.image || "", {
      urlElId: "category-image-url",
      badgeElId: "category-image-badge",
    });
    document.getElementById("category-form").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (deleteId && confirm("Delete this category?")) {
    const button = event.target.closest("button");
    setButtonLoading(button, true);
    try {
      await withMinDelay(api(`/api/categories/${deleteId}`, { method: "DELETE" }));
      if (state.categories.length <= 1 && state.categoriesPage > 1) {
        state.categoriesPage -= 1;
      }
      await loadCategoriesPage(state.categoriesPage);
      const stats = await api("/api/admin/stats");
      renderStats(stats.data);
    } finally {
      setButtonLoading(button, false);
    }
  }
});

async function boot() {
  if (!state.password) {
    showLogin();
    return;
  }

  setBootScreen(true);
  loginView.classList.add("hidden");

  try {
    await withMinDelay(api("/api/admin/stats"));
    showApp();
    setTab("overview");
    setBootScreen(false);
    await loadAll(document.getElementById("refresh-btn"));
  } catch (error) {
    setBootScreen(false);
    if (error.status === 401) {
      clearSession();
      showLogin();
      return;
    }
    // Keep the session on network/server errors so refresh does not fake-logout.
    showApp();
    setTab("overview");
    showGlobalError(
      error.message ||
        "Could not load dashboard data. Check that the API is running, then hit Refresh."
    );
  }
}

boot();
