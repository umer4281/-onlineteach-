/**
 * Seeds the database with the sample courses from content/courses.json.
 *
 * Usage:
 *   1. Copy .env.example to .env and fill in NEXT_PUBLIC_SUPABASE_URL,
 *      NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY.
 *   2. Run scripts/supabase-schema.sql in the Supabase SQL Editor first.
 *   3. Run: node scripts/seed.mjs
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// --- tiny .env loader (avoids adding a dependency) ---
function loadDotEnv() {
  try {
    const raw = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && !(m[1] in process.env)) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // no .env file — rely on real environment variables
  }
}
loadDotEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!url || !serviceKey) {
  console.error(
    "Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (via .env or the shell)."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);
const courses = JSON.parse(
  readFileSync(new URL("../content/courses.json", import.meta.url), "utf8")
);

for (const course of courses) {
  const { data: inserted, error: courseError } = await supabase
    .from("courses")
    .upsert(
      {
        slug: course.slug,
        title: course.title,
        tagline: course.tagline,
        description: course.description,
        thumbnail: course.thumbnail,
        instructor: course.instructor,
        level: course.level,
        category: course.category,
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();

  if (courseError) {
    console.error(`Failed to upsert course "${course.slug}":`, courseError.message);
    continue;
  }

  // Replace the course's lessons so the seed always matches content/courses.json
  await supabase.from("lessons").delete().eq("course_id", inserted.id);

  for (let i = 0; i < course.lessons.length; i++) {
    const lesson = course.lessons[i];
    const { error: lessonError } = await supabase.from("lessons").insert({
      course_id: inserted.id,
      sequence: i + 1,
      title: lesson.title,
      description: lesson.description,
      meet_url: lesson.meetUrl ?? "",
      duration: lesson.duration ?? "Live",
    });
    if (lessonError) {
      console.error(`Failed to insert lesson "${lesson.title}":`, lessonError.message);
    }
  }

  console.log(`✓ ${course.title} (${course.lessons.length} lessons)`);
}

console.log("Seed complete.");
