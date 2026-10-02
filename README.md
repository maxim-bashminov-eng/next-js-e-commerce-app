# First Fullstack App

A small digital-product store. Customers browse products and pay with Stripe. An admin area, protected by HTTP Basic auth, is used to add and manage products.

## Stack

- Next.js 16 (App Router) and React 19
- Tailwind CSS 4
- Prisma 7 with SQLite
- Stripe Payment Element

## Pages

| Path | What it does |
| --- | --- |
| `/` | Most popular and newest products |
| `/products` | Full product catalog |
| `/products/[id]/purchase` | Stripe checkout |
| `/stripe/purchase-success` | Page Stripe redirects to after payment |
| `/admin` | Sales dashboard |
| `/admin/products` | Create, edit, toggle, delete, and download products |

`/admin` asks for a username and password before any admin page loads.

## Setup

```bash
npm install
```

Create a `.env` file in the project root:

```bash
DATABASE_URL="file:./prisma/dev.db"
ADMIN_USERNAME="admin"
HASHED_ADMIN_PASSWORD=""
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
```

`HASHED_ADMIN_PASSWORD` is the admin password hashed with SHA-512 and encoded as base64. Generate it with:

```bash
node -e "const c=require('crypto').webcrypto;c.subtle.digest('SHA-512',new TextEncoder().encode('your-password')).then(b=>console.log(Buffer.from(b).toString('base64')))"
```

Stripe keys come from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys). Use test keys locally. `NEXT_PUBLIC_SERVER_URL` is the site origin Stripe uses for the return URL after checkout.

Apply the database migration. The Prisma config file is `prisma7.config.ts`, so pass it explicitly:

```bash
npx prisma migrate dev --config prisma7.config.ts
```

Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |

## Project layout

- `src/app/(customerFacing)` — storefront
- `src/app/admin` — admin pages and product actions
- `src/proxy.ts` — Basic auth for `/admin`
- `prisma/schema.prisma` — Product, User, Order, and DownloadVerification models
- `prisma7.config.ts` — database URL and migration settings

The SQLite database, uploaded product files, `.env`, and the generated Prisma client are gitignored. Run the migration after cloning so those are created locally.
