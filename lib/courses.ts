import type { Course, Lesson } from "./types";
import { supabasePublic, isSupabaseConfigured } from "./supabase";

interface CourseRow {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  thumbnail: string;
  instructor: string;
  level: string;
  category: string;
  lessons?: LessonRow[];
}

interface LessonRow {
  id: string;
  course_id: string;
  sequence: number;
  title: string;
  description: string;
  youtube_id: string;
  duration: string;
}

function mapLesson(row: LessonRow): Lesson {
  return {
    id: row.id,
    courseId: row.course_id,
    sequence: row.sequence,
    title: row.title,
    description: row.description,
    youtubeId: row.youtube_id,
    duration: row.duration,
  };
}

function mapCourse(row: CourseRow): Course {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    description: row.description,
    thumbnail: row.thumbnail || "/images/course.svg",
    instructor: row.instructor,
    level: row.level,
    category: row.category,
    lessons: (row.lessons ?? [])
      .slice()
      .sort((a, b) => a.sequence - b.sequence)
      .map(mapLesson),
  };
}

/** All courses with their lessons, live from the database. */
export async function getCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabasePublic!
    .from("courses")
    .select("*, lessons(*)")
    .order("created_at", { ascending: true });
  if (error) return [];
  return (data ?? []).map(mapCourse);
}

/** A single course by slug, or undefined. */
export async function getCourse(slug: string): Promise<Course | undefined> {
  if (!isSupabaseConfigured) return undefined;
  const { data, error } = await supabasePublic!
    .from("courses")
    .select("*, lessons(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return undefined;
  return mapCourse(data as CourseRow);
}

/** Course + lesson lookup used by the lesson player page. */
export async function getCourseByLesson(
  courseSlug: string,
  lessonId: string
): Promise<{ course: Course; lesson: Lesson; index: number } | undefined> {
  const course = await getCourse(courseSlug);
  if (!course) return undefined;
  const index = course.lessons.findIndex((l) => l.id === lessonId);
  if (index === -1) return undefined;
  return { course, lesson: course.lessons[index], index };
}

export function pluralize(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

