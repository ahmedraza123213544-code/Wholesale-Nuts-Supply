// Central site config (same idea as POS Frontend/config/constants.ts).
// For Hostinger static export, this value is baked into out/ + out.zip at build time.

// Production backend (Vercel)
export const API_BASE = "https://wholesale-nuts-supply-7bs3.vercel.app";

// Local backend (uncomment to develop against localhost:5000)
// export const API_BASE = "http://localhost:5000";

/** Optional override via .env — useful for one-off builds without editing this file */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || API_BASE
).replace(/\/$/, "");

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://wholesalenutsupply.com"
).replace(/\/$/, "");
