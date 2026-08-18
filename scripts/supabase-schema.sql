-- Run this in your Supabase project: Dashboard -> SQL Editor -> New query -> Run.
-- It creates the tables the site needs. Keep the RLS policies — they let the
-- public read courses while the admin (service-role key) can write.

create extension if not exists pgcrypto;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  tagline text not null default '',
  description text not null default '',
  thumbnail text not null default '/images/course.svg',
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
  youtube_id text not null,
  duration text not null default '10:00'
);

create index if not exists lessons_course_id_idx on public.lessons (course_id);

alter table public.courses enable row level security;
alter table public.lessons enable row level security;

create policy "courses public read" on public.courses
  for select using (true);

create policy "lessons public read" on public.lessons
  for select using (true);
