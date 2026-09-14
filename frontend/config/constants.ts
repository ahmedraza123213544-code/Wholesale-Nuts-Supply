// Central site config — same pattern as POS Frontend/config/constants.ts.
// Flip API_BASE below to switch local vs production. This file is the source of truth.

// Production backend (Vercel)
// export const API_BASE = "https://wholesale-nuts-supply-7bs3.vercel.app";

// Local backend
export const API_BASE = "http://localhost:5000";

export const API_URL = API_BASE.replace(/\/$/, "");

export const SITE_URL = "https://wholesalenutsupply.com";

/** Used when a product has no Cloudinary / ProductImage yet */
export const PRODUCT_IMAGE_FALLBACK = "/products/mixed-nuts.jpg";
