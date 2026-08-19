# LearnHub — Online Teaching Website

A free, simple online teaching website built with **Next.js**, **TypeScript** and **Tailwind CSS**. Students can browse a course catalogue and watch video lessons. Content is **fully dynamic** — stored in a free **Supabase** database, so the admin can add/edit/delete courses from the dashboard and students see changes instantly.

## ✨ Features

- 🏠 Home page with featured courses
- 📚 Course catalogue (`/courses`)
- 🎬 Course detail pages with full curriculum
- ▶️ Video lesson player (`/courses/[slug]/lessons/[lessonId]`)
- 👤 About page
- 🔐 Admin login & protected dashboard (`/admin`)
- ➕ Add, edit and delete **courses & lessons** right from the dashboard
- 🎥 **Live classes** — each lesson has a Google Meet (or other) link to join
- 📎 **Share resources** — upload PDFs, images, videos & audio per lesson; students can open and **like** them
- ⚡ Dynamic content from a free Supabase database — no redeploy needed

## 🚀 Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 🛢️ Supabase setup (free, ~5 minutes)

Courses and lessons live in a Supabase Postgres database. Set it up once:

1. Go to **https://supabase.com** → **Start your project** (free, no card) → create a project.
2. Open **SQL Editor** → paste the contents of **`scripts/supabase-schema.sql`** → **Run**. (This creates the `courses` and `lessons` tables.)
3. Open **Project Settings → API**. Copy these three values into your `.env` (locally) or **Vercel → Project → Settings → Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL=      (your project URL, e.g. https://xxxx.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY= (anon/public key)
SUPABASE_SERVICE_ROLE_KEY=     (service_role key — server-side only, never expose)
```

4. *(Optional but nice)* Seed the sample courses from `content/courses.json`:
   ```bash
   npm run seed
   ```
   (or `node scripts/seed.mjs`)

## ➕ Adding courses & videos (the dynamic way)

**No more editing JSON and redeploying.** Log in at **`/admin`** and use the dashboard to:

- **Add a course** — title, category, level, instructor, thumbnail, description
- **Manage lessons** — add/rename lessons with a **Google Meet link** for live teaching
- **Share resources** — upload PDF, image, video or audio files per lesson
- **Delete** courses, lessons, or resources

Students see every change **immediately** — the pages read from the database
on every request, and they can **like** your shared resources.

## 🔐 Admin login

The admin area is protected and lives at **`/admin`** (login at `/admin/login`).

**Seeded demo credentials:** `umer@gmail.com` / `123456`

Change them before going public by setting environment variables
(`.env` locally, or Environment Variables on Vercel):

```
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=a-strong-password
AUTH_SECRET=a-long-random-string
```

Sessions are signed with HMAC-SHA256, stored in an HttpOnly cookie, and expire
after 7 days.

## 🚀 Deploying to GitHub + Vercel (free)

**1. Push this folder to GitHub:**

```bash
git remote add origin https://github.com/YOUR-USERNAME/onlineteach.git
git push -u origin main
```

**2. Deploy on Vercel (free, no credit card):**

1. Go to **https://vercel.com** → sign up with your GitHub account.
2. Click **Add New Project** → select the `onlineteach` repository → **Deploy**.
3. Set all environment variables under **Project → Settings → Environment Variables**:
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — then **Redeploy**.
4. Run `scripts/supabase-schema.sql` in the Supabase SQL editor, then (optionally) `npm run seed`.

Every future `git push` rebuilds the site automatically. The free tier includes
100 GB/month of bandwidth — plenty for a teaching site.

## 📁 Project structure

```
app/
  page.tsx                         → Home
  courses/page.tsx                 → Course catalogue
  courses/[slug]/page.tsx          → Course detail
  courses/[slug]/lessons/[lessonId]/page.tsx → Video lesson
  about/page.tsx                   → About
  admin/page.tsx                   → Admin dashboard (add/delete courses)
  admin/courses/[slug]/edit/page.tsx → Edit course + manage lessons
  admin/login/page.tsx             → Admin login
  admin/actions.ts                 → Server actions (login, course & lesson CRUD)
content/courses.json               → Seed data for the database
scripts/
  supabase-schema.sql              → Creates the DB tables
  seed.mjs                         → Loads content/courses.json into Supabase
components/                        → Navbar, Footer, CourseCard, VideoPlayer, LessonList, ConfirmButton
lib/                               → Types, data helpers, auth, Supabase clients
```

## Customize

- **Site name/logo:** edit `components/Navbar.tsx`, `components/Footer.tsx` and `app/layout.tsx` metadata.
- **Colors:** brand colors are defined in `app/globals.css`.
- **Your bio:** edit `app/about/page.tsx` and the `instructor` field when adding courses.
