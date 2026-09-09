# Wholesale Nuts Backend

Node.js + Express API connected to Neon PostgreSQL + Cloudinary images.

## Setup

```bash
cd backend
yarn install
yarn db:migrate
yarn db:seed
yarn dev
```

- API: `http://localhost:4000`
- Dashboard: `http://localhost:4000/dashboard`
- Default admin password: value of `ADMIN_PASSWORD` in `.env` (default `admin123`)

## Deploy on Vercel

This backend is Express. Vercel needs the `backend` folder as the project root.

1. Import the GitHub repo in Vercel
2. Set **Root Directory** to `backend` (important — not the repo root)
3. Framework Preset: Other
4. Add environment variables from `.env.example`:
   - `DATABASE_URL`
   - `ADMIN_PASSWORD`
   - `CORS_ORIGIN` (your live frontend URL, e.g. `https://your-frontend.vercel.app`)
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. Deploy

After deploy:
- API health: `https://your-backend.vercel.app/api/health`
- Dashboard: `https://your-backend.vercel.app/dashboard`

Local still works with `yarn dev` on port 4000.


Product and category images are uploaded to Cloudinary from the dashboard.
Existing local seed images can be migrated with:

```bash
yarn db:migrate-images
```

`yarn db:seed` also uploads images to Cloudinary and stores Cloudinary URLs in Postgres.

Required `.env` values:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Main endpoints

- `POST /api/inquiries` — website contact form
- `GET /api/products` — website product catalog
- `GET /api/products/:slug` — product detail
- `POST /api/uploads` — upload one image (admin)
- `POST /api/uploads/multiple` — upload gallery images (admin)
- Admin header: `x-admin-password: <password>`
