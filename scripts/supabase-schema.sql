-- Run this in your Supabase project: Dashboard -> SQL Editor -> New query -> Run.
-- Creates the tables the site needs. RLS lets the public READ courses, lessons
-- and resources, while the admin (service-role key) writes.

create extension if not exists pgcrypto;

-- ---- upgrade from an older install (safe to ignore if fresh) ----
-- If your lessons table still has youtube_id, drop it:
-- alter table public.lessons drop column if exists youtube_id;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  tagline text not null default '',
  description text not null default '',
  thumbnail text not null default '/images/smart-logo.jpg',
  instructor text not null default '',
  level text not null default 'Beginner',
  category text not null default 'General',
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  sequence int not null default 0,
  title text not null,
  description text not null default '',
  -- Google Meet / live-class link for teaching
  meet_url text not null default '',
  duration text not null default 'Live',
  created_at timestamptz not null default now()
);

-- ensure meet_url exists even on older installs
alter table public.lessons add column if not exists meet_url text not null default '';

-- Files (PDF, image, video, audio) shared per lesson
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  sequence int not null default 0,
  title text not null,
  type text not null default 'file', -- pdf | image | video | audio | file
  file_path text not null,           -- path inside the "resources" storage bucket
  likes int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists lessons_course_id_idx on public.lessons (course_id);
create index if not exists resources_lesson_id_idx on public.resources (lesson_id);

-- ---- admin user accounts (multi-user admin registration) ----
-- Each registered admin gets a row here. Passwords are stored as a salted
-- `salt:hash` string (see lib/session.ts, hashAdminPassword). The site
-- reads/writes this table from server-only actions using the service-role key,
-- which bypasses RLS. No public read policy is created on purpose.
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists admins_email_idx on public.admins (email);

-- ---- madrasah attendance: students + daily attendance ----
-- The admin (service-role key) creates students and marks daily attendance.
-- Students sign in with their roll_no + password and land on their own page.
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  roll_no text unique not null,          -- e.g. M-101, used to log in
  name text not null,
  class text not null default '',
  guardian_name text not null default '',
  guardian_phone text not null default '',
  password_hash text not null,           -- salted `salt:hash` (see lib/session.ts)
  created_at timestamptz not null default now()
);

-- One row per student per day. status: present | absent | late
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  date date not null default current_date,
  status text not null default 'present',
  created_at timestamptz not null default now(),
  unique(student_id, date)
);

create index if not exists students_roll_no_idx on public.students (roll_no);
create index if not exists attendance_student_id_idx on public.attendance (student_id);

alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.resources enable row level security;
alter table public.admins enable row level security;
alter table public.students enable row level security;
alter table public.attendance enable row level security;

-- Drop first so the script can be run again safely
drop policy if exists "courses public read" on public.courses;
drop policy if exists "lessons public read" on public.lessons;
drop policy if exists "resources public read" on public.resources;

create policy "courses public read" on public.courses for select using (true);
create policy "lessons public read" on public.lessons for select using (true);
create policy "resources public read" on public.resources for select using (true);

