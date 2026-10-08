# Sargodha Sweets & Bakers

A Next.js website and admin CMS for Sargodha Sweets & Bakers. Manage products, categories, gallery images, team members, business settings, and customer inquiries from the protected admin panel.

## Tech Stack

- Next.js 16, React 19, TypeScript
- PostgreSQL with Drizzle ORM
- PGlite for persistent local development when `DATABASE_URL` is not set

## Run Locally

1. Install Node.js 20 or newer.
2. Install dependencies with `npm install`.
3. Start the site with `npm run dev`.
4. Open [http://localhost:3000](http://localhost:3000).

Without `DATABASE_URL`, local development uses an embedded PostgreSQL-compatible database stored under `.local-db/`. The app applies its checked-in schema migration and inserts starter content on first run. The admin login is at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

In local development without production environment variables, the starter admin credentials are `admin@sargodhasweets.com` / `admin123`. Do not use these credentials on a public deployment.

## Use Supabase PostgreSQL

MongoDB Atlas is not compatible with this project: its data layer uses PostgreSQL and Drizzle ORM. Supabase PostgreSQL is a suitable hosted database.

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. In the project dashboard, select **Connect** and copy a PostgreSQL connection URI. This project uses the Supabase Session Pooler at `aws-0-ap-northeast-1.pooler.supabase.com:5432`.
3. Copy `.env.example` to `.env.local`, then set `DATABASE_URL` to the copied URI. Replace the password placeholder; URL-encode special characters in the password. Keep `.env.local` private and out of Git.
4. Create/update the hosted database tables from the project root:

   ```bash
   npx drizzle-kit push
   ```

5. Set a unique `JWT_SECRET` in `.env.local`. For example, generate one with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local` before the first app request. The first request seeds that admin and the starter website content into the hosted database.
7. Run `npm run dev`.

## Persistent Admin Media

Admin uploads use a public Supabase Storage bucket named `site-media` by default configuration. Create that bucket in the same Supabase project and make it public for website reads. Restrict its allowed MIME types to JPEG, PNG, WebP, AVIF, GIF, MP4, and WebM, and set the bucket file-size limit to 50 MB. Uploads go directly from the browser to a short-lived signed URL; the service-role key stays on the server.

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET` in `.env.local` and in Vercel. The anon key and URL are public configuration; the service-role key must remain server-side and must never use a `NEXT_PUBLIC_` prefix. Media URLs are saved in the existing `site_settings`, `products`, `categories`, `gallery`, and `team_members` fields. New unique object paths avoid CDN staleness when replacing media.

## Deploy With GitHub and Vercel

1. Push this project to the GitHub repository.
2. In [Vercel](https://vercel.com), choose **Add New Project** and import the repository.
3. Add the database, admin, JWT, and Supabase Storage variables listed above under **Settings → Environment Variables**. Select Production, Preview, and Development as needed. Use the full Supabase Session Pooler URI, a unique random JWT secret (generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`), your admin email, and a strong unique admin password. Do not wrap values in quotes or commit them. Production requires `JWT_SECRET` and does not use a default signing key.
4. Ensure the Supabase schema is current by running `npx drizzle-kit push` locally with the production database URL in `.env.local`.
5. Deploy or redeploy the Vercel project. The public site is `/`; the admin login is `/admin/login` on the assigned Vercel domain.

## Notes

- Do not use the starter admin password on a public deployment.