# LearnHub — Online Teaching Website

A free, simple online teaching website built with **Next.js**, **TypeScript** and **Tailwind CSS**. Students can browse a course catalogue and watch video lessons.

## ✨ Features

- 🏠 Home page with featured courses
- 📚 Course catalogue (`/courses`)
- 🎬 Course detail pages with full curriculum
- ▶️ Video lesson player (`/courses/[slug]/lessons/[lessonId]`)
- 👤 About page
- 🔐 Admin login & protected dashboard (`/admin`)
- 📱 Fully responsive design
- ⚡ 100% static — free to host anywhere

## 🚀 Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 🎥 Adding your own courses & videos

All content lives in one file: **`content/courses.json`**. To add a course or lesson, edit that file:

1. Upload your lesson videos to YouTube (you can make them **Unlisted** so only people with the link can watch).
2. Copy each video's **ID** from its URL: `https://www.youtube.com/watch?v=XXXXXXXXXXX`
3. Replace the `youtubeId` value in the lesson, or add a whole new course block following the same structure.

The site rebuilds automatically — just save the file and (if deployed on Vercel) push to GitHub.

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

**1. Create a GitHub repository**, then connect and push this folder:

```bash
git remote add origin https://github.com/YOUR-USERNAME/onlineteach.git
git push -u origin main
```

**2. Deploy on Vercel (free, no credit card):**

1. Go to **https://vercel.com** → sign up with your GitHub account.
2. Click **Add New Project** → select the `onlineteach` repository → **Deploy**.
3. Your site goes live at `https://onlineteach.vercel.app` in about a minute.
4. Set your real `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `AUTH_SECRET` under
   **Project → Settings → Environment Variables**, then redeploy.

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
content/courses.json               → All course data (edit this!)
components/                        → Navbar, Footer, CourseCard, VideoPlayer, LessonList
lib/                               → Types + data helpers
```

## Customize

- **Site name/logo:** edit `components/Navbar.tsx`, `components/Footer.tsx` and `app/layout.tsx` metadata.
- **Colors:** brand colors are defined in `app/globals.css`.
- **Your bio:** edit `app/about/page.tsx` and `instructor` in `content/courses.json`.
